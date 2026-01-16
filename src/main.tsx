/**
 * @fileoverview React Application Entry Point for Burger House Restaurant Web Application
 * 
 * This is the bootstrap file that serves as the entry point for the entire React application.
 * It connects the index.html file to the React component tree by:
 * 
 * 1. **DOM Root Mounting**: Locates the root DOM element in index.html and creates a React root
 * 2. **Concurrent Rendering**: Uses React 19's createRoot API for concurrent rendering capabilities
 * 3. **StrictMode Wrapping**: Wraps the application in StrictMode for development safety checks
 * 4. **Style Initialization**: Imports global Tailwind CSS styles for the entire application
 * 
 * ## React 19 Concurrent Features
 * 
 * The createRoot API (introduced in React 18, enhanced in React 19) enables:
 * - **Automatic Batching**: Multiple state updates are batched together for better performance
 * - **Concurrent Features**: Support for startTransition, useDeferredValue, and Suspense
 * - **Interruptible Rendering**: React can pause and resume rendering to keep the UI responsive
 * - **Priority-based Updates**: Urgent updates (like typing) can interrupt less urgent updates
 * 
 * ## StrictMode Benefits
 * 
 * StrictMode is a development-only tool that helps identify potential problems:
 * - Detects unsafe lifecycle methods and legacy API usage
 * - Warns about deprecated findDOMNode usage
 * - Detects unexpected side effects by double-invoking certain functions
 * - Ensures reusable state by simulating unmount/remount cycles
 * - Validates that effects have proper cleanup functions
 * 
 * Note: StrictMode does not affect production builds - it only runs in development mode.
 * 
 * ## Application Bootstrap Flow
 * 
 * 1. Browser loads index.html with `<div id="root"></div>`
 * 2. Vite bundles and executes this main.tsx file
 * 3. Global CSS styles (index.css with Tailwind) are loaded
 * 4. DOM element with id="root" is located
 * 5. React root is created using createRoot (React 19 concurrent mode)
 * 6. App component is rendered inside StrictMode wrapper
 * 7. React takes over DOM management within the root element
 * 
 * @module main
 * @version 1.0.0
 * @requires react - React 19.2.x for StrictMode component
 * @requires react-dom/client - React DOM client for createRoot API
 * @requires ./App - Main application component with routing and providers
 * @requires ./index.css - Global Tailwind CSS styles and custom variables
 * 
 * @example
 * // This file is automatically executed by Vite when the application loads.
 * // No manual invocation is required - it serves as the entry point.
 * 
 * // The index.html file references this as the entry:
 * // <script type="module" src="/src/main.tsx"></script>
 * 
 * @see {@link module:App} for the main application component structure
 * @see {@link https://react.dev/reference/react/StrictMode} for StrictMode documentation
 * @see {@link https://react.dev/reference/react-dom/client/createRoot} for createRoot API
 */

// =============================================================================
// REACT CORE IMPORTS
// =============================================================================

/**
 * StrictMode - React's development-only safety checker
 * 
 * A tool for highlighting potential problems in an application.
 * It activates additional checks and warnings for its descendants:
 * 
 * - Warns about components using unsafe lifecycle methods
 * - Warns about legacy string ref API usage
 * - Warns about deprecated findDOMNode usage
 * - Detects unexpected side effects
 * - Detects legacy context API
 * - Ensures reusable state
 * 
 * StrictMode does not render any visible UI and does not affect production builds.
 * In React 19, StrictMode has enhanced checks for:
 * - Effect cleanup validation (components are mounted, unmounted, then mounted again)
 * - Ref callback cleanup validation
 * - Deprecated feature warnings
 */
import { StrictMode } from 'react';

/**
 * createRoot - React 19's concurrent mode root creation API
 * 
 * Creates a root for displaying React components inside a browser DOM node.
 * This replaces the legacy ReactDOM.render() method and enables:
 * 
 * - Concurrent rendering with interruptible updates
 * - Automatic batching of state updates
 * - Support for useTransition and useDeferredValue
 * - Improved Suspense behavior for data fetching
 * - Better server-side rendering hydration
 * 
 * The root.render() method schedules an update to render the React element
 * into the root's DOM node. React will manage the DOM inside the root
 * and automatically update it when the React tree changes.
 * 
 * @see https://react.dev/reference/react-dom/client/createRoot
 */
import { createRoot } from 'react-dom/client';

// =============================================================================
// APPLICATION IMPORTS
// =============================================================================

/**
 * App - Main Application Component
 * 
 * The root React component that contains:
 * - Context providers (AuthProvider, CartProvider)
 * - BrowserRouter for client-side routing
 * - MainLayout for consistent page structure
 * - All route definitions (public and protected)
 * 
 * Provider hierarchy (outermost to innermost):
 * AuthProvider → CartProvider → BrowserRouter → MainLayout → Routes
 * 
 * @see module:App for detailed component documentation
 */
import App from './App';

/**
 * Global Styles - Tailwind CSS and Custom Theme
 * 
 * Imports the main stylesheet which includes:
 * - Tailwind CSS v4 base, components, and utilities via @import "tailwindcss"
 * - Custom CSS variables for the Burger House theme (amber/orange colors)
 * - Global element resets and base typography
 * - Custom animation keyframes for UI interactions
 * - Responsive design utilities
 * 
 * This import statement triggers Tailwind CSS processing via the
 * @tailwindcss/vite plugin configured in vite.config.ts
 * 
 * @see module:index.css for detailed style documentation
 */
import './index.css';

// =============================================================================
// APPLICATION INITIALIZATION
// =============================================================================

/**
 * Root DOM Element Selector
 * 
 * The ID of the DOM element where React will mount the application.
 * This element must exist in index.html: `<div id="root"></div>`
 * 
 * The element serves as the boundary for React's control:
 * - React manages all DOM inside this element
 * - Content outside remains static (managed by browser)
 * - All React components render within this container
 */
const ROOT_ELEMENT_ID = 'root';

/**
 * Locates and validates the root DOM element for React mounting.
 * 
 * Uses a non-null assertion (!) because the root element is guaranteed
 * to exist in index.html. If the element is missing, React would fail
 * to initialize anyway, so the assertion is safe here.
 * 
 * @throws {Error} Implicitly throws if root element is not found
 *                 (React's createRoot would throw the actual error)
 * 
 * @example
 * // index.html must contain:
 * <body>
 *   <div id="root"></div>
 *   <script type="module" src="/src/main.tsx"></script>
 * </body>
 */
const rootElement = document.getElementById(ROOT_ELEMENT_ID);

// =============================================================================
// ERROR HANDLING FOR ROOT ELEMENT
// =============================================================================

/**
 * Validates that the root DOM element exists before attempting to mount React.
 * 
 * This check provides a clear error message if the root element is missing,
 * which can happen if:
 * - index.html is malformed or missing the root div
 * - The script loads before the DOM is ready (unlikely with type="module")
 * - The element ID was changed but this file wasn't updated
 * 
 * Throwing an explicit error here provides better debugging information
 * than letting createRoot fail with a less descriptive error.
 */
if (!rootElement) {
  throw new Error(
    `[Burger House] Critical Initialization Error: ` +
    `Unable to find root DOM element with id="${ROOT_ELEMENT_ID}". ` +
    `Ensure index.html contains: <div id="${ROOT_ELEMENT_ID}"></div>`
  );
}

// =============================================================================
// REACT ROOT CREATION
// =============================================================================

/**
 * Creates the React root using the concurrent mode API.
 * 
 * The createRoot function takes a DOM element and returns a root object
 * with a render method. This is the new pattern for React 18+ applications,
 * replacing the legacy ReactDOM.render() API.
 * 
 * Benefits of createRoot over legacy render:
 * - Enables concurrent features automatically
 * - Better batching of state updates
 * - Improved Suspense support
 * - More predictable behavior
 * 
 * The root object is kept as a const because we only create one root
 * for the entire application lifecycle. The root persists until the
 * page is unloaded.
 * 
 * @type {Root} The React root object with render() and unmount() methods
 */
const root = createRoot(rootElement);

// =============================================================================
// APPLICATION RENDERING
// =============================================================================

/**
 * Renders the application component tree into the React root.
 * 
 * This is the main render call that bootstraps the entire application.
 * The render method:
 * 
 * 1. Schedules the React element to be rendered
 * 2. Performs initial render synchronously (first paint)
 * 3. Sets up event delegation on the root container
 * 4. Establishes the component tree for future updates
 * 
 * ## Component Structure
 * 
 * ```
 * <StrictMode>           ← Development checks wrapper
 *   <App>                ← Main application with all features
 *     <AuthProvider>     ← Authentication state
 *       <CartProvider>   ← Shopping cart state
 *         <BrowserRouter>← Client-side routing
 *           <MainLayout> ← Page layout (Header + Footer)
 *             <Routes>   ← Route definitions
 *               ...      ← Page components
 *             </Routes>
 *           </MainLayout>
 *         </BrowserRouter>
 *       </CartProvider>
 *     </AuthProvider>
 *   </App>
 * </StrictMode>
 * ```
 * 
 * ## Why StrictMode Wraps Everything
 * 
 * StrictMode is placed at the outermost level to ensure all components
 * benefit from its development-time checks. This catches issues early
 * and ensures the entire application follows React best practices.
 * 
 * In production, StrictMode is completely removed by the build process,
 * so there's no performance penalty for including it.
 * 
 * @returns {void} The render call does not return a value
 */
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// =============================================================================
// HOT MODULE REPLACEMENT (HMR) SUPPORT
// =============================================================================

/**
 * Vite Hot Module Replacement Configuration
 * 
 * This block enables HMR during development, allowing React components
 * to update without a full page reload. The Vite React plugin handles
 * most HMR automatically, but this ensures the root module also
 * participates in HMR when its dependencies change.
 * 
 * HMR improves developer experience by:
 * - Preserving application state during code changes
 * - Providing instant feedback on CSS and component changes
 * - Reducing development cycle time
 * 
 * In production builds, this code block is removed entirely by Vite
 * since import.meta.hot is only available in development mode.
 * 
 * @see https://vite.dev/guide/features.html#hot-module-replacement
 */
if (import.meta.hot) {
  import.meta.hot.accept();
}
