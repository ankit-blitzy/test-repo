/**
 * MenuItemCard Component Tests
 * Tests for the menu item card display component with ingredients
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MenuItemCard } from '@/features/ordering/components/MenuItemCard/MenuItemCard';
import type { MenuItem } from '@/types/menu.types';

// Sample menu item with ingredients
const mockMenuItem: MenuItem = {
  id: 'burger-001',
  categoryId: 'cat-burgers',
  name: 'Normal Burger',
  description: 'Our classic burger with fresh ingredients',
  price: 8.99,
  imageUrl: '/images/burger.jpg',
  isAvailable: true,
  ingredients: [
    'Quality beef patty',
    'Fresh lettuce',
    'Tomato slices',
    'Cheddar cheese',
    'Soft burger bun',
  ],
  updatedAt: new Date('2026-01-15T12:00:00Z'),
};

// Menu item without ingredients
const mockMenuItemNoIngredients: MenuItem = {
  id: 'drink-001',
  categoryId: 'cat-drinks',
  name: 'Cola',
  description: 'Refreshing cola drink',
  price: 2.49,
  isAvailable: true,
  updatedAt: new Date('2026-01-15T12:00:00Z'),
};

// Unavailable menu item
const mockUnavailableItem: MenuItem = {
  ...mockMenuItem,
  id: 'burger-unavailable',
  name: 'Special Burger',
  isAvailable: false,
};

describe('MenuItemCard', () => {
  it('renders menu item with name and price', () => {
    const onAddToCart = vi.fn();
    render(<MenuItemCard item={mockMenuItem} onAddToCart={onAddToCart} />);

    expect(screen.getByText('Normal Burger')).toBeInTheDocument();
    expect(screen.getByText('$8.99')).toBeInTheDocument();
  });

  it('renders menu item description', () => {
    const onAddToCart = vi.fn();
    render(<MenuItemCard item={mockMenuItem} onAddToCart={onAddToCart} />);

    expect(
      screen.getByText('Our classic burger with fresh ingredients')
    ).toBeInTheDocument();
  });

  it('renders ingredients when available', () => {
    const onAddToCart = vi.fn();
    render(<MenuItemCard item={mockMenuItem} onAddToCart={onAddToCart} />);

    expect(screen.getByText('Quality beef patty')).toBeInTheDocument();
    expect(screen.getByText('Fresh lettuce')).toBeInTheDocument();
    expect(screen.getByText('Tomato slices')).toBeInTheDocument();
    expect(screen.getByText('Cheddar cheese')).toBeInTheDocument();
    expect(screen.getByText('Soft burger bun')).toBeInTheDocument();
  });

  it('does not render ingredients section when item has no ingredients', () => {
    const onAddToCart = vi.fn();
    render(
      <MenuItemCard item={mockMenuItemNoIngredients} onAddToCart={onAddToCart} />
    );

    expect(screen.queryByText('Ingredients:')).not.toBeInTheDocument();
  });

  it('calls onAddToCart when add to cart button is clicked', () => {
    const onAddToCart = vi.fn();
    render(<MenuItemCard item={mockMenuItem} onAddToCart={onAddToCart} />);

    const button = screen.getByRole('button', { name: /add normal burger to cart/i });
    fireEvent.click(button);

    expect(onAddToCart).toHaveBeenCalledTimes(1);
    expect(onAddToCart).toHaveBeenCalledWith(mockMenuItem);
  });

  it('shows unavailable state for out-of-stock items', () => {
    const onAddToCart = vi.fn();
    render(<MenuItemCard item={mockUnavailableItem} onAddToCart={onAddToCart} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Unavailable');
  });

  it('does not call onAddToCart when item is unavailable', () => {
    const onAddToCart = vi.fn();
    render(<MenuItemCard item={mockUnavailableItem} onAddToCart={onAddToCart} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(onAddToCart).not.toHaveBeenCalled();
  });

  it('renders image when imageUrl is provided', () => {
    const onAddToCart = vi.fn();
    render(<MenuItemCard item={mockMenuItem} onAddToCart={onAddToCart} />);

    const image = screen.getByRole('img', { name: 'Normal Burger' });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/burger.jpg');
  });

  it('applies reduced opacity for unavailable items', () => {
    const onAddToCart = vi.fn();
    render(<MenuItemCard item={mockUnavailableItem} onAddToCart={onAddToCart} />);

    const article = screen.getByRole('article');
    expect(article).toHaveClass('opacity-60');
  });

  it('has proper accessibility attributes on add to cart button', () => {
    const onAddToCart = vi.fn();
    render(<MenuItemCard item={mockMenuItem} onAddToCart={onAddToCart} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute(
      'aria-label',
      'Add Normal Burger to cart'
    );
  });

  it('renders item without image when imageUrl is not provided', () => {
    const itemNoImage = { ...mockMenuItem, imageUrl: undefined };
    const onAddToCart = vi.fn();
    render(<MenuItemCard item={itemNoImage} onAddToCart={onAddToCart} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('Normal Burger')).toBeInTheDocument();
  });
});
