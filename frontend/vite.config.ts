/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Vite configuration for CALC Scientific Calculator frontend
// Provides build tool settings including React plugin, dev server proxy,
// path alias resolution, build output configuration, and vitest test setup.
export default defineConfig({
  // Plugins configuration
  // React plugin enables Fast Refresh (HMR) and JSX/TSX transformation
  plugins: [react()],

  // Module resolution configuration
  // Maps '@/' alias to './src/' directory for clean import paths
  // e.g., import { Component } from '@/components/Calculator/Calculator'
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Development server configuration
  server: {
    // Frontend dev server port matching Docker Compose frontend service mapping
    port: 3000,

    // Proxy API requests to Flask backend during local development
    // All requests to /api/* are forwarded to the backend at localhost:5000
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },

  // Production build configuration
  build: {
    // Output directory for production build artifacts
    outDir: 'dist',

    // Disable source maps in production for security
    sourcemap: false,

    // Target modern browsers for optimal bundle size
    target: 'es2022',
  },

  // Vitest test runner configuration
  // Integrated into Vite config for unified tooling and shared path aliases
  test: {
    // Enable global test APIs (describe, it, expect) without explicit imports
    globals: true,

    // Use jsdom environment for DOM testing of React components
    environment: 'jsdom',

    // Include test files matching standard patterns
    include: ['src/**/*.{test,spec}.{ts,tsx}'],

    // Ensure CSS modules and imports are handled during tests
    css: true,
  },
})
