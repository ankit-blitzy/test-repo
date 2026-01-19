/// <reference types="vite/client" />

/**
 * Vite Environment Variables Type Definitions
 * 
 * Defines the custom environment variables used in this project.
 */

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_USE_MOCK_DATA: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * Global JSX namespace for React 19 compatibility
 */
declare global {
  namespace JSX {
    interface Element extends React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>> {}
    interface ElementClass extends React.Component<unknown> {
      render(): React.ReactNode;
    }
    interface IntrinsicElements extends React.JSX.IntrinsicElements {}
  }
}

export {};
