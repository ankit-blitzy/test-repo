/**
 * Unit tests for the CartDrawer component.
 * Verifies empty state, populated state, and user interactions.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { CartDrawer } from '../../../../src/features/cart/components/CartDrawer';
import { CartContext } from '../../../../src/features/cart/context/CartContext';
import type { CartContextType, CartItem } from '../../../../src/features/cart/types/cart.types';

/** Creates a mock cart item */
function createCartItem(overrides: Partial<CartItem> = {}): CartItem {
  return {
    id: 'cart-1',
    menuItemId: 'menu-1',
    name: 'Classic Burger',
    price: 12.99,
    quantity: 1,
    imageUrl: '/images/classic-burger.jpg',
    ...overrides,
  };
}

/** Creates a mock CartContext value */
function createMockCartContext(overrides: Partial<CartContextType> = {}): CartContextType {
  return {
    items: [],
    isOpen: true,
    addItem: vi.fn(),
    removeItem: vi.fn(),
    updateQuantity: vi.fn(),
    clearCart: vi.fn(),
    toggleCart: vi.fn(),
    openCart: vi.fn(),
    closeCart: vi.fn(),
    itemCount: 0,
    subtotal: 0,
    tax: 0,
    total: 0,
    ...overrides,
  };
}

/** Wrapper providing CartContext and MemoryRouter */
function renderCartDrawer(contextOverrides: Partial<CartContextType> = {}) {
  const mockCart = createMockCartContext(contextOverrides);

  function Wrapper({ children }: { children: ReactNode }) {
    return createElement(
      CartContext.Provider,
      { value: mockCart },
      createElement(MemoryRouter, null, children)
    );
  }

  const utils = render(createElement(Wrapper, null, createElement(CartDrawer)));
  return { ...utils, mockCart };
}

describe('CartDrawer', () => {
  it('renders the cart heading with item count', () => {
    renderCartDrawer({ itemCount: 3 });
    expect(screen.getByText('Your Cart (3)')).toBeInTheDocument();
  });

  it('displays empty cart message when no items', () => {
    renderCartDrawer();
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('shows Browse Menu button when cart is empty', () => {
    renderCartDrawer();
    expect(screen.getByRole('button', { name: /browse menu/i })).toBeInTheDocument();
  });

  it('renders cart items when items are present', () => {
    const items = [createCartItem()];
    renderCartDrawer({ items, itemCount: 1 });
    expect(screen.getByText('Classic Burger')).toBeInTheDocument();
  });

  it('shows checkout and clear cart buttons when items are present', () => {
    const items = [createCartItem()];
    renderCartDrawer({ items, itemCount: 1 });
    expect(screen.getByRole('button', { name: /proceed to checkout/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear cart/i })).toBeInTheDocument();
  });

  it('calls closeCart when close button is clicked', () => {
    const { mockCart } = renderCartDrawer();
    fireEvent.click(screen.getByLabelText('Close cart'));
    expect(mockCart.closeCart).toHaveBeenCalledTimes(1);
  });

  it('calls closeCart when backdrop is clicked', () => {
    const { container, mockCart } = renderCartDrawer();
    /* The backdrop is the first fixed element with bg-black/50 */
    const backdrop = container.querySelector('.fixed.inset-0');
    if (backdrop) {
      fireEvent.click(backdrop);
    }
    expect(mockCart.closeCart).toHaveBeenCalledTimes(1);
  });

  it('calls clearCart when clear cart button is clicked', () => {
    const items = [createCartItem()];
    const { mockCart } = renderCartDrawer({ items, itemCount: 1 });
    fireEvent.click(screen.getByRole('button', { name: /clear cart/i }));
    expect(mockCart.clearCart).toHaveBeenCalledTimes(1);
  });

  it('has role dialog and aria-label', () => {
    renderCartDrawer();
    expect(screen.getByRole('dialog', { name: /shopping cart/i })).toBeInTheDocument();
  });

  it('applies translate-x-0 when open', () => {
    renderCartDrawer({ isOpen: true });
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('translate-x-0');
  });

  it('applies translate-x-full when closed', () => {
    renderCartDrawer({ isOpen: false });
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('translate-x-full');
  });

  it('does not show backdrop when drawer is closed', () => {
    const { container } = renderCartDrawer({ isOpen: false });
    const backdrop = container.querySelector('.fixed.inset-0');
    expect(backdrop).not.toBeInTheDocument();
  });
});
