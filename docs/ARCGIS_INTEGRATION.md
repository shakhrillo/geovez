# ArcGIS Integration Guide

This project uses `@arcgis/core` for modern ArcGIS API for JavaScript integration in React.

## Setup

### Dependencies
- `@arcgis/core`: Modern npm package for ArcGIS API for JavaScript
- `@esri/calcite-components`: Optional UI components from Esri
- `@esri/calcite-components-react`: React wrappers for Calcite components

### Configuration

The ArcGIS configuration is managed in `src/config/arcgis.ts`:

```typescript
import { defaultMapConfig } from './config/arcgis';
```

### Key Features

1. **Direct ES Module Imports**: No need for global window.esri
2. **TypeScript Support**: Full type safety with imported modules
3. **Tree Shaking**: Only import what you use
4. **Modern Build Process**: Works seamlessly with Vite

## Usage

### Basic Map Component

```tsx
import MapContainer from './components/Map/MapContainer';

function App() {
  return (
    <MapContainer 
      webMapId="86c29194cdfb46838887838065d3c357"
      center={[144.9631, -37.8136]}
      zoom={10}
    />
  );
}
```

### Custom Hook

The `useMap` hook provides reusable map functionality:

```tsx
import { useMap } from './hooks/useMap';

const { view, isLoading, error, retry } = useMap({
  webMapId: 'your-map-id',
  center: [lng, lat],
  zoom: 10,
  container: mapRef.current
});
```

## File Structure

```
src/
├── components/Map/
│   └── MapContainer.tsx        # Main map component
├── hooks/
│   └── useMap.ts              # Custom map hook
├── config/
│   └── arcgis.ts              # ArcGIS configuration
└── main.tsx                   # CSS imports
```

## Key Imports

### CSS (in main.tsx)
```tsx
import '@arcgis/core/assets/esri/themes/light/main.css'
```

### Map Components
```tsx
import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';
import LayerList from '@arcgis/core/widgets/LayerList';
import Legend from '@arcgis/core/widgets/Legend';
import Expand from '@arcgis/core/widgets/Expand';
```

## Vite Configuration

The `vite.config.ts` is configured to work with `@arcgis/core`:

- No need to exclude from optimization
- No need to mark as external
- CSS assets are automatically handled

## Benefits Over CDN Approach

1. **Better TypeScript Support**: Full IntelliSense and type checking
2. **Bundle Optimization**: Tree shaking reduces bundle size
3. **Version Control**: Lock specific versions in package.json
4. **Development Experience**: Better debugging and error messages
5. **Modern Build Process**: Works with any modern bundler

## Troubleshooting

### Common Issues

1. **CSS Not Loading**: Ensure you import the CSS in your main entry file
2. **Build Errors**: Check that Vite config doesn't exclude @arcgis/core
3. **Memory Leaks**: Always destroy map views in useEffect cleanup

### Error Handling

The components include comprehensive error handling with:
- Loading states
- Error boundaries
- Retry functionality
- Fallback UI

## Performance Tips

1. Use `view.when()` to ensure map is ready before adding widgets
2. Always clean up map views in component unmount
3. Consider lazy loading for large map applications
4. Use web maps instead of creating maps programmatically when possible
