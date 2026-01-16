import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import {
  HomePage,
  LoginPage,
  RegisterPage,
  MenuPage,
  CartPage,
  BookingPage,
  CheckoutPage,
  OrderConfirmationPage,
  AccountPage,
} from './pages';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <MainLayout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/menu" element={<MenuPage />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/cart" element={<CartPage />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                <Route path="/account" element={<AccountPage />} />
              </Route>
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
