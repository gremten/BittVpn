import React from 'react';
import ReactDOM from 'react-dom/client';
import './fonts/golos-ui.css';
import App from './App';
import './styles/globals.css';
import { initTelegramWebApp } from './telegram';
import { startBackgroundAssetWarmup } from './utils/preloadAssets';

function safeInitTelegram() {
  try {
    initTelegramWebApp();
  } catch (error) {
    // Telegram integration is progressive enhancement. A bridge/client quirk
    // must not prevent the React app from mounting.
    console.warn('Telegram bootstrap warning:', error);
  }
}

function safeStartWarmup() {
  try {
    startBackgroundAssetWarmup();
  } catch (error) {
    // Preloading is never allowed to own application readiness.
    console.warn('Background warmup warning:', error);
  }
}

safeInitTelegram();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('BittVPN root element not found');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Start all optional asset work only after React has been given a chance to
// mount. This prevents a synchronous client-specific preload failure from
// producing an empty/black Mini App.
window.setTimeout(safeStartWarmup, 0);
