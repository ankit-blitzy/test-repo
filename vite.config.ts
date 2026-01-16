/**
 * Vite Configuration for Burger House Restaurant Web Application
 * 
 * This configuration file sets up:
 * - React plugin for Fast Refresh and JSX transformation
 * - Tailwind CSS v4 integration via @tailwindcss/vite plugin
 * - Path aliases for clean imports (@ -> src directory)
 * - Development server on port 3000
 * - Production build output to dist directory
 * 
 * @see https://vite.dev/config/
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  /**
   * Vite plugins array
   * - react(): Enables React Fast Refresh for HMR and JSX transformation
   * - tailwindcss(): Processes Tailwind CSS v4 utilities without PostCSS config
   */
  plugins: [
    react(),
    tailwindcss()
  ],

  /**
   * Module resolution configuration
   * Defines path aliases for cleaner imports throughout the application
   */
  resolve: {
    alias: {
      // Map '@' to the src directory for clean absolute imports
      // Example: import { Button } from '@/components/common/Button'
      '@': path.resolve(__dirname, './src')
    }
  },

  /**
   * Development server configuration
   * Runs on port 3000 for local development
   */
  server: {
    port: 3000
  },

  /**
   * Production build configuration
   * Outputs optimized assets to the dist directory
   */
  build: {
    outDir: 'dist'
  }
})
