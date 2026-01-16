/// <reference types="vite/client" />

/**
 * Vite Environment Type Declarations
 *
 * This file extends TypeScript's type system to recognize Vite-specific features,
 * including environment variables accessed via import.meta.env and Hot Module
 * Replacement (HMR) capabilities.
 *
 * Vite 7.3.x compatible type definitions for the Burger House application.
 *
 * @see https://vite.dev/guide/env-and-mode.html
 */

/**
 * Environment variables interface for the Burger House application.
 *
 * All environment variables must be prefixed with VITE_ to be exposed to the client.
 * These variables are statically replaced at build time and are accessible via
 * import.meta.env.VARIABLE_NAME throughout the application.
 *
 * Usage example:
 * ```typescript
 * const apiUrl = import.meta.env.VITE_API_URL;
 * const appTitle = import.meta.env.VITE_APP_TITLE ?? 'Burger House';
 * ```
 *
 * Environment files (in order of priority):
 * - .env                # loaded in all cases
 * - .env.local          # loaded in all cases, ignored by git
 * - .env.[mode]         # only loaded in specified mode (development, production, test)
 * - .env.[mode].local   # only loaded in specified mode, ignored by git
 */
interface ImportMetaEnv {
  /**
   * Base URL for API requests.
   * Used by service modules to construct API endpoints.
   * Falls back to '/api' if not specified.
   *
   * @example 'https://api.burgerhouse.com/v1'
   */
  readonly VITE_API_URL?: string;

  /**
   * Application title displayed in browser tab and headers.
   * Defaults to 'Burger House' if not specified.
   *
   * @example 'Burger House - Gourmet Burgers'
   */
  readonly VITE_APP_TITLE?: string;

  /**
   * Current environment mode.
   * Automatically set by Vite based on the build mode.
   * Values: 'development' | 'production' | 'test'
   */
  readonly MODE: string;

  /**
   * Base URL of the application.
   * Configured via the `base` config option in vite.config.ts.
   * Used for asset URL generation.
   */
  readonly BASE_URL: string;

  /**
   * Whether the app is running in production mode.
   * True when running `vite build` or serving with NODE_ENV='production'.
   */
  readonly PROD: boolean;

  /**
   * Whether the app is running in development mode.
   * True when running `vite` dev server with NODE_ENV='development'.
   */
  readonly DEV: boolean;

  /**
   * Whether the app is running in server-side rendering mode.
   * True when code is being executed on the server.
   */
  readonly SSR: boolean;

  /**
   * Restaurant contact phone number for display in UI.
   * Used in Header, Footer, and contact sections.
   *
   * @example '+1 (555) 123-4567'
   */
  readonly VITE_RESTAURANT_PHONE?: string;

  /**
   * Restaurant email address for customer inquiries.
   *
   * @example 'contact@burgerhouse.com'
   */
  readonly VITE_RESTAURANT_EMAIL?: string;

  /**
   * Restaurant physical address for location display and maps.
   *
   * @example '123 Burger Lane, Food City, FC 12345'
   */
  readonly VITE_RESTAURANT_ADDRESS?: string;

  /**
   * Google Maps API key for location services (if integrated).
   * Used for embedded maps showing restaurant location.
   */
  readonly VITE_GOOGLE_MAPS_API_KEY?: string;

  /**
   * Feature flag to enable/disable table booking functionality.
   * Set to 'true' to enable, 'false' or omit to disable.
   */
  readonly VITE_ENABLE_BOOKING?: string;

  /**
   * Feature flag to enable/disable online ordering functionality.
   * Set to 'true' to enable, 'false' or omit to disable.
   */
  readonly VITE_ENABLE_ORDERING?: string;

  /**
   * Maximum number of items allowed in the shopping cart.
   * Prevents excessive cart sizes. Defaults to 50 if not specified.
   *
   * @example '100'
   */
  readonly VITE_MAX_CART_ITEMS?: string;

  /**
   * Estimated delivery time in minutes for display purposes.
   *
   * @example '30-45'
   */
  readonly VITE_ESTIMATED_DELIVERY_TIME?: string;

  /**
   * Minimum order amount required for checkout (in cents).
   * Used to validate orders before checkout.
   *
   * @example '1500' (represents $15.00)
   */
  readonly VITE_MINIMUM_ORDER_AMOUNT?: string;

  /**
   * Tax rate as a decimal string for order calculations.
   *
   * @example '0.08' (represents 8% tax)
   */
  readonly VITE_TAX_RATE?: string;
}

/**
 * Extends the ImportMeta interface to include Vite-specific properties.
 *
 * This provides type safety when accessing:
 * - import.meta.env - Environment variables
 * - import.meta.hot - Hot Module Replacement API
 * - import.meta.glob - Glob import function
 *
 * @see https://vite.dev/guide/api-hmr.html
 */
interface ImportMeta {
  /**
   * Environment variables exposed to the client.
   * Only variables prefixed with VITE_ are available at runtime.
   */
  readonly env: ImportMetaEnv;

  /**
   * Hot Module Replacement API.
   * Available only during development.
   * Undefined in production builds.
   *
   * @example
   * ```typescript
   * if (import.meta.hot) {
   *   import.meta.hot.accept((newModule) => {
   *     // Handle module update
   *   });
   * }
   * ```
   */
  readonly hot?: import('vite/types/hot').ViteHotContext;

  /**
   * Glob import function for dynamic imports.
   * Returns a record of module paths to module exports.
   *
   * @example
   * ```typescript
   * const modules = import.meta.glob('./dir/*.ts');
   * for (const path in modules) {
   *   const module = await modules[path]();
   * }
   * ```
   */
  readonly glob: <Module = { [key: string]: unknown }>(
    globPath: string | string[],
    options?: import('vite/types/importGlob').ImportGlobOptions<false>
  ) => Record<string, () => Promise<Module>>;
}

/**
 * Vite static asset handling type declarations.
 *
 * These module declarations allow TypeScript to understand imports of
 * static assets like images, fonts, and other files.
 */

// Image file imports
declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

// Font file imports
declare module '*.woff' {
  const src: string;
  export default src;
}

declare module '*.woff2' {
  const src: string;
  export default src;
}

declare module '*.ttf' {
  const src: string;
  export default src;
}

declare module '*.eot' {
  const src: string;
  export default src;
}

// Other asset imports
declare module '*.ico' {
  const src: string;
  export default src;
}

declare module '*.json' {
  const value: Record<string, unknown>;
  export default value;
}

// CSS module support
declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}

// Video file imports
declare module '*.mp4' {
  const src: string;
  export default src;
}

declare module '*.webm' {
  const src: string;
  export default src;
}

// Audio file imports
declare module '*.mp3' {
  const src: string;
  export default src;
}

declare module '*.wav' {
  const src: string;
  export default src;
}
