/**
 * Root Application Component
 * Configures routing and provides global layout
 */

import { BrowserRouter, Routes, Route } from 'react-router';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer/Footer';
import { CartDrawer } from './features/ordering';
import { useCartStore } from './features/ordering/store/cartStore';

// Page imports
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';

/**
 * Layout component with header and footer
 */
function Layout({ children }: { children: React.ReactNode }): React.ReactElement {
  const { isOpen, closeCart } = useCartStore();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer isOpen={isOpen} onClose={closeCart} />
    </div>
  );
}

/**
 * Placeholder page for routes not yet implemented
 */
function PlaceholderPage({ title }: { title: string }): React.ReactElement {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-neutral-900 mb-4">{title}</h1>
        <p className="text-neutral-600">This page is coming soon.</p>
      </div>
    </div>
  );
}

/**
 * Root App component
 */
export function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/reserve" element={<PlaceholderPage title="Reservations" />} />
          <Route path="/login" element={<PlaceholderPage title="Login" />} />
          <Route path="/register" element={<PlaceholderPage title="Register" />} />
          <Route path="/cart" element={<PlaceholderPage title="Cart" />} />
          <Route path="/checkout" element={<PlaceholderPage title="Checkout" />} />

          {/* Dashboard routes */}
          <Route path="/dashboard" element={<PlaceholderPage title="Dashboard" />} />
          <Route path="/dashboard/orders" element={<PlaceholderPage title="Order History" />} />
          <Route path="/dashboard/reservations" element={<PlaceholderPage title="My Reservations" />} />
          <Route path="/dashboard/profile" element={<PlaceholderPage title="Profile" />} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-neutral-300 mb-4">404</h1>
                  <p className="text-xl text-neutral-600">Page not found</p>
                </div>
              </div>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
