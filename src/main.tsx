import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

// Import scrollparent shim before any other components that might use react-joyride
import './utils/scrollparent-shim'

// Import ArcGIS CSS
import '@arcgis/core/assets/esri/themes/light/main.css'

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
  </StrictMode>,
)
