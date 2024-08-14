import GmapMvtTile from './GmapMvtTile'
import { GeoJsonFeature } from '../@types'

const TILE_SIZE = 256

interface TileHTMLElement extends HTMLDivElement {
  dataLayer: google.maps.Data
}

interface MvtMapTypeOptions {
  tileSize?: google.maps.Size
  alt?: string
  name?: string
  maxZoom?: number
  minZoom?: number
  projection?: google.maps.Projection
  radius?: number
  style?: google.maps.Data.StylingFunction | google.maps.Data.StyleOptions
  filterFeature?: (feature: GeoJsonFeature) => boolean
}

/**
 * MvtMapType
 *
 * constructor options:
 * - map: google.maps.Map
 * - urlbase: MVT source URL
 * - options: MvtMapTypeOptions
 *
 * MvtMapTypeOptions:
 * - style: google.maps.Data.StylingFunction | google.maps.Data.StyleOptions
 * - filterFeature: (feature: GeoJsonFeature) => boolean
 */
export class MvtMapType implements google.maps.MapType {
  tileSize: google.maps.Size
  alt: string | null = null
  name: string | null = null
  maxZoom: number = 9
  minZoom: number = 9
  projection: google.maps.Projection | null = null
  radius: number = 6378137
  map: google.maps.Map
  urlbase: string
  style: google.maps.Data.StylingFunction | google.maps.Data.StyleOptions = {}
  filterFeature: (feature: GeoJsonFeature) => boolean = () => true

  constructor(
    map: google.maps.Map,
    urlbase: string,
    options?: MvtMapTypeOptions
  ) {
    this.tileSize = new google.maps.Size(TILE_SIZE, TILE_SIZE)
    this.map = map
    this.urlbase = urlbase

    if (options) {
      this.initOptions(options)
    }
  }

  initOptions(options: MvtMapTypeOptions) {
    if (options.tileSize) {
      this.tileSize = options.tileSize
    }
    if (options.alt) {
      this.alt = options.alt
    }
    if (options.name) {
      this.name = options.name
    }
    if (options.maxZoom) {
      this.maxZoom = options.maxZoom
    }
    if (options.minZoom) {
      this.minZoom = options.minZoom
    }
    if (options.projection) {
      this.projection = options.projection
    }
    if (options.radius) {
      this.radius = options.radius
    }
    if (options.style) {
      this.style = options.style
    }
    if (options.filterFeature) {
      this.filterFeature = options.filterFeature
    }
  }

  /**
   * GmapMvtTile class is instantiated
   * and draw method loads MVT tile data and add features to the map
   * Called every time the map is moved, taking the coor and zoom of the displayed area as arguments
   */
  getTile(coord: google.maps.Point, zoom: number, ownerDocument: Document): HTMLElement {
    const options = {
      coord: coord,
      zoom: zoom,
      ownerDocument: ownerDocument,
      urlbase: this.urlbase,
      tilesize: this.tileSize,
      map: this.map,
      style: this.style,
      filterFeature: this.filterFeature
    }
    const tile = new GmapMvtTile(options)
    tile.draw()

    return tile.div
  }

  releaseTile(tile: TileHTMLElement): void {
    if (tile.dataLayer) {
      tile.dataLayer.setMap(null)
    }
  }
}
