/**
 * Application Entry Point
 * 
 * Main entry file for the Burger Restaurant Website.
 * Sets up React with routing and renders the application.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import '@/styles/global.css';

// Pages
import MenuPage from '@/pages/MenuPage';

/**
 * HomePage Component - Placeholder for the landing page
 * Will be replaced with full implementation
 */
function HomePage(): JSX.Element {
  return (
    <div className="min-h-screen bg-amber-50">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-amber-600 to-amber-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            🍔 Burger Restaurant
          </h1>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Handcrafted burgers made with the finest ingredients. 
            Quality you can taste in every bite.
          </p>
          <a
            href="/menu"
            className="inline-flex items-center px-8 py-4 bg-white text-amber-600 font-bold text-lg rounded-full hover:bg-amber-50 transition-colors duration-200 shadow-lg"
          >
            View Our Menu
          </a>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fresh Ingredients */}
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="text-5xl mb-4">🥬</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Fresh Ingredients
              </h3>
              <p className="text-gray-600">
                We source only the freshest ingredients daily for our burgers.
              </p>
            </div>

            {/* Handcrafted */}
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="text-5xl mb-4">👨‍🍳</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Handcrafted Quality
              </h3>
              <p className="text-gray-600">
                Every burger is made to order with care and attention to detail.
              </p>
            </div>

            {/* Fast Service */}
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Fast Service
              </h3>
              <p className="text-gray-600">
                Order online and skip the wait with our convenient pickup service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-amber-100 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to Order?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Browse our menu and discover your new favorite burger today.
          </p>
          <a
            href="/menu"
            className="inline-flex items-center px-8 py-4 bg-amber-500 text-white font-bold text-lg rounded-full hover:bg-amber-600 transition-colors duration-200 shadow-lg"
          >
            Order Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2026 Burger Restaurant. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

/**
 * App Component - Root application component with routing
 */
function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Mount the application
const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
