/**
 * example of using MvtMapType
 */

import { MvtMapType } from './lib/MvtMapType'
import { GeoJsonFeature } from './@types'

declare global {
  interface Window {
    initMap: () => void
  }
}

const LAYER_URL = import.meta.env.VITE_LAYER_URL
const getColor = (val: number) => {
  let color = '#FFFFFF'

  if (val > 80) {
    color = '#0047ff'
  } else if (val > 50) {
    color = '#2b65fa'
  } else if (val > 30) {
    color = '#4a7bfa'
  } else if (val > 20) {
    color = '#6992fb'
  } else if (val > 10) {
    color = '#8eadfb'
  } else if (val > 5) {
    color = '#b8caf8'
  } else if (val > 1) {
    color = '#d7e0f8'
  } else if (val > 0) {
    color = '#FFFFFF'
  }

  return color
}
const style = (feature: google.maps.Data.Feature) => {
  const val = feature.getProperty('val') as number
  const color = getColor(val)

  return {
    fillColor: color,
    fillOpacity: 0.6,
    strokeWeight: 0
  }
}
const filterFeature = (feature: GeoJsonFeature) => {
  return feature.properties?.val > 0
}

window.initMap = () => {
  const element = document.getElementById('map') as HTMLElement
  const map = new google.maps.Map(element, {
    center: { lat: 35.692823106341834, lng: 139.71100348420828 },
    zoom: 9
  })
  const options = {
    style,
    filterFeature
  }

  const mapType = new MvtMapType(map, LAYER_URL, options)
  map.overlayMapTypes.insertAt(0, mapType)
}

window.addEventListener('DOMContentLoaded', () => {
  const script = document.createElement('script')
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`
  script.async = true
  document.head.appendChild(script)
})
