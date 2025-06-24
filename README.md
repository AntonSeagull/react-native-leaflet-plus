# react-native-leaflet-plus

A powerful and flexible mapping library that brings full Leaflet support to React Native apps. It includes out-of-the-box support for vector maps (like Protomaps), interactive editing of map features, and a rich set of customization options. Whether you're building navigation, geospatial data visualization, or interactive mapping tools — this library gives you everything you need in one package.

## Features

- 🗺️ Full Leaflet.js support in React Native
- 🧩 Vector map support (e.g., Protomaps)
- ✏️ Interactive editing of map features (markers, polygons, polylines, rectangles)
- 🎨 Highly customizable map styles and controls
- ⚡ Fast, lightweight, and easy to integrate
- 📱 Works on both iOS and Android

## Installation

```sh
npm install react-native-leaflet-plus
```

or

```sh
yarn add react-native-leaflet-plus
```

## Quick Start

```jsx
import React from 'react';
import {
  LeafletMap,
  Marker,
  Polygon,
  Polyline,
  Rectangle,
} from 'react-native-leaflet-plus';

export default function App() {
  return (
    <LeafletMap
      center={[51.505, -0.09]}
      zoom={13}
      style={{ height: 400, width: '100%' }}
    >
      <Marker position={[51.505, -0.09]} />
      <Polygon
        positions={[
          [51.51, -0.1],
          [51.51, -0.12],
          [51.53, -0.12],
        ]}
      />
      <Polyline
        positions={[
          [51.505, -0.09],
          [51.51, -0.1],
        ]}
      />
      <Rectangle
        bounds={[
          [51.49, -0.08],
          [51.5, -0.06],
        ]}
      />
    </LeafletMap>
  );
}
```

## API Reference

### `<LeafletMap />`

| Prop     | Type               | Default  | Description                          |
| -------- | ------------------ | -------- | ------------------------------------ |
| center   | `[number, number]` | `[0, 0]` | Initial center of the map            |
| zoom     | `number`           | `13`     | Initial zoom level                   |
| style    | `object`           | `{}`     | Style for the map container          |
| children | `ReactNode`        | —        | Map features (Marker, Polygon, etc.) |

### `<Marker />`

| Prop     | Type               | Description                                |
| -------- | ------------------ | ------------------------------------------ |
| position | `[number, number]` | Marker position (latitude, longitude)      |
| icon     | `string`           | (Optional) Custom marker icon URL          |
| onPress  | `function`         | (Optional) Callback when marker is pressed |

### `<Polygon />`

| Prop      | Type                      | Description                                 |
| --------- | ------------------------- | ------------------------------------------- |
| positions | `Array<[number, number]>` | Array of coordinates for polygon vertices   |
| color     | `string`                  | (Optional) Polygon color (e.g., "#3388ff")  |
| onPress   | `function`                | (Optional) Callback when polygon is pressed |

### `<Polyline />`

| Prop      | Type                      | Description                                  |
| --------- | ------------------------- | -------------------------------------------- |
| positions | `Array<[number, number]>` | Array of coordinates for polyline points     |
| color     | `string`                  | (Optional) Polyline color                    |
| onPress   | `function`                | (Optional) Callback when polyline is pressed |

### `<Rectangle />`

| Prop    | Type                                   | Description                                   |
| ------- | -------------------------------------- | --------------------------------------------- |
| bounds  | `[[number, number], [number, number]]` | Southwest and northeast corners               |
| color   | `string`                               | (Optional) Rectangle color                    |
| onPress | `function`                             | (Optional) Callback when rectangle is pressed |

## Customization

- **Map Tiles:** You can use custom tile providers by passing a `tileLayer` prop to `<LeafletMap />` (see advanced usage below).
- **Events:** All features support `onPress` for interaction.
- **Styling:** Use the `style` prop to control the map container's size and appearance.

## Advanced Usage

```jsx
<LeafletMap
  center={[40.7128, -74.006]}
  zoom={12}
  tileLayer="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  style={{ height: 500, width: '100%' }}
>
  <Marker
    position={[40.7128, -74.006]}
    icon="https://leafletjs.com/examples/custom-icons/leaf-green.png"
  />
</LeafletMap>
```

## FAQ

**Q: Does this work on both iOS and Android?**  
A: Yes, the library supports both platforms.

**Q: Can I use custom map tiles?**  
A: Yes, use the `tileLayer` prop on `<LeafletMap />`.

**Q: How do I handle map events?**  
A: Use the `onPress` prop on map features (Marker, Polygon, etc.).

## Contributing

Contributions are welcome! Please see the [contributing guide](CONTRIBUTING.md) for more information.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
