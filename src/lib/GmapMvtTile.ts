import { VectorTile, VectorTileLayer } from '@mapbox/vector-tile'
import Protobuf from 'pbf'
import { GeoJsonFeature } from '../@types'

interface TileHTMLElement extends HTMLDivElement {
  dataLayer: google.maps.Data
}

interface GmapMvtTileOptions {
  coord: google.maps.Point
  zoom: number
  ownerDocument: Document
  urlbase: string
  tilesize: google.maps.Size
  map: google.maps.Map
  style: google.maps.Data.StylingFunction | google.maps.Data.StyleOptions
  filterFeature: (feature: GeoJsonFeature) => boolean
}

/**
 * Class representing tile data
 */
export default class GmapMvtTile {
  public div: TileHTMLElement

  constructor(private options: GmapMvtTileOptions) {
    this.div = options.ownerDocument.createElement('div') as TileHTMLElement
    this.initDiv()
  }

  public async draw() {
    const tile = await this.fetchTile()

    Object.values(tile.layers).forEach((layer) => {
      this.drawLayer(layer)
    })
  }

  private initDiv() {
    this.div.style.width = `${this.options.tilesize.width}px`
    this.div.style.height = `${this.options.tilesize.height}px`
    this.div.dataLayer = new google.maps.Data()
    this.div.dataLayer.setMap(this.options.map)
    this.div.dataLayer.setStyle(this.options.style)
  }

  /**
   * Fetch data as protocol buffer from the URL.
   * And return VectorTile object
   */
  private async fetchTile(): Promise<VectorTile> {
    const tileUrl = this.getTileUrl()

    return fetch(tileUrl).then(async (data) => {
      const buffer = await data.arrayBuffer()
      const protobuf = new Protobuf(new Uint8Array(buffer))
      return new VectorTile(protobuf)
    })
  }

  /**
   * Generate a tile URL by replacing placeholders in urlbase
   */
  private getTileUrl(): string {
    const zoom = this.options.zoom
    const coord = this.options.coord

    return this.options.urlbase
      .replace('{z}', zoom.toString())
      .replace('{x}', coord.x.toString())
      .replace('{y}', coord.y.toString())
  }

  /**
   * Draw features on the map
   *
   * `this.options.filterFeature` is a function that filters features
   * if this function is undefined, all features are drawn
   */
  private drawLayer(layer: VectorTileLayer) {
    for (let i = 0; i < layer.length; i++) {
      const feature = layer.feature(i)
      const json = feature.toGeoJSON(this.options.coord.x, this.options.coord.y, this.options.zoom)

      if (this.options.filterFeature(json)) {
        this.div.dataLayer.addGeoJson(json)
      }
    }
  }
}
