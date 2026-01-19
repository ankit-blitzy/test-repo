/**
 * Application Entry Point
 * Initializes React 19 application with StrictMode
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';

/**
 * Get the root element from DOM
 */
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'Failed to find the root element. Make sure there is a <div id="root"></div> in your HTML.'
  );
}

/**
 * Create React root and render application
 */
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
