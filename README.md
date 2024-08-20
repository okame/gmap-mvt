# gmap-mvt
Library for displaying MVT source on googlemap

[![NPM version](https://img.shields.io/npm/v/@okame/gmap-mvt.svg)](https://www.npmjs.com/package/@okame/gmap-mvt)
[![Downloads](https://img.shields.io/npm/dt/@okame/gmap-mvt)](https://npmcharts.com/compare/@okame/gmap-mvt?minimal=true)
[![Github Open Issiues](https://img.shields.io/github/issues/okame/gmap-mvt)]()
[![Github Closed Issiues](https://img.shields.io/github/issues-closed-raw/okame/gmap-mvt)]()
[![GitHub forks](https://img.shields.io/github/forks/okame/gmap-mvt)]()
[![GitHub Stars](https://img.shields.io/github/stars/okame/gmap-mvt)]()

## This library is beta version!
This software has not been fully tested.
If you find bugs, please create an issue.

## Installation
```
# npm
npm install @okame/gmap-mvt

# yarn
yarn add @okame/gmap-mvt
```

## Usage
```typescript
# create google map object
const map = new google.maps.Map(element, {
      center: { lat: 35.692823106341834, lng: 139.71100348420828 },
      zoom: 9
})

# MVT source
const url = 'https://example.com/rain_layer'

# Options
const options = {}

# Create layer instance
const mapType = new MvtMapType(map, url, options)

# Add layer to GoogleMap
map.overlayMapTypes.insertAt(0, mapType)
```

Options for MvtMapType

| name || type | description |
| ---------- | - | -- | --- |
| map || google.maps.Map | GoogleMap |
| url || string | MVT source url |
| options || object ||
|| tileSize | google.maps.Size ||
|| alt | string ||
|| name | string ||
|| maxZoom | number ||
|| minZoom | number ||
|| projection | google.maps.Projection ||
|| radius | number ||
|| style | google.maps.Data.StylingFunction \| google.maps.Data.StyleOptions | styling |
|| filterFeature | (feature: GeoJsonFeature) => boolean | filter features |

### Styling
By setting a callback function as shown below, you can dynamically style observed values to `options.style`.

```typescript
const style = (feature: google.maps.Data.Feature) => {
  const val = feature.getProperty('val') as number
  const fillColor = val > 50 ? 'red' : 'blue'

  return {
    fillColor,
    fillOpacity: 0.6,
    strokeWeight: 0
  }
}

const options = { style }
const mapType = new MvtMapType(map, url, options)
```

### Filtering
By setting a callback function as shown below, you can filter features to `options.filterFeature`.

```typescript
const filterFeature = (feature: GeoJsonFeature) => {
  return feature.properties?.val > 0
}
const options = { filterFeature }
const mapType = new MvtMapType(map, url, options)
```
