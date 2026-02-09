/**
 * App component integration test.
 * Verifies the root App component renders correctly with providers and router.
 */

import { describe, it, expect } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import { AuthProvider } from '../../../src/features/auth/context/AuthContext';
import { CartProvider } from '../../../src/features/cart/context/CartContext';
import App from '../../../src/App';

/**
 * Helper to render App with required providers.
 */
function renderApp() {
  return render(
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>,
  );
}

describe('App', () => {
  it('renders the header with restaurant name', async () => {
    renderApp();
    await waitFor(() => {
      const header = document.querySelector('header');
      expect(header).toBeInTheDocument();
      expect(within(header!).getByText(/Burger Restaurant/i)).toBeInTheDocument();
    });
  });

  it('renders the home page hero heading', async () => {
    renderApp();
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });

  it('renders navigation links in the header', async () => {
    renderApp();
    await waitFor(() => {
      const header = document.querySelector('header');
      expect(header).toBeInTheDocument();
      const nav = within(header!);
      expect(nav.getByText('Home')).toBeInTheDocument();
      expect(nav.getByText('Menu')).toBeInTheDocument();
    });
  });

  it('has correct layout structure with header, main, and footer', async () => {
    renderApp();
    await waitFor(() => {
      expect(document.querySelector('header')).toBeInTheDocument();
      expect(document.querySelector('main')).toBeInTheDocument();
      expect(document.querySelector('footer')).toBeInTheDocument();
    });
  });
});
