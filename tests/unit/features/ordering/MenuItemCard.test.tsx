/**
 * MenuItemCard Component Unit Tests
 * 
 * Tests for the MenuItemCard component that displays individual menu items
 * with image, price, description, and ingredient preview.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MenuItemCard } from '@/features/ordering/components/MenuItemCard';
import type { MenuItem } from '@/types';

describe('MenuItemCard', () => {
  const mockItem: MenuItem = {
    _id: 'item_001',
    category_id: 'cat_burgers',
    name: 'Classic Burger',
    description: 'Our signature burger made with premium ingredients.',
    price: 12.99,
    image_url: '/images/classic-burger.jpg',
    is_available: true,
    ingredients: [
      'Quality beef patty',
      'Fresh lettuce',
      'Tomato slices',
      'Cheddar cheese',
      'Soft burger bun',
    ],
    updated_at: '2026-01-15T12:00:00Z',
  };

  const mockOnItemClick = vi.fn();
  const mockOnAddToCart = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the item name', () => {
      render(<MenuItemCard item={mockItem} />);
      
      expect(screen.getByText('Classic Burger')).toBeInTheDocument();
    });

    it('renders the item description', () => {
      render(<MenuItemCard item={mockItem} />);
      
      expect(screen.getByText(/Our signature burger/)).toBeInTheDocument();
    });

    it('renders the formatted price', () => {
      render(<MenuItemCard item={mockItem} />);
      
      expect(screen.getByText('$12.99')).toBeInTheDocument();
    });

    it('renders the item image', () => {
      render(<MenuItemCard item={mockItem} />);
      
      const image = screen.getByAltText('Classic Burger');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/images/classic-burger.jpg');
    });

    it('renders ingredient preview', () => {
      render(<MenuItemCard item={mockItem} />);
      
      // Should show some ingredients
      expect(screen.getByText(/Quality beef patty/)).toBeInTheDocument();
    });

    it('renders Add to Cart button when item is available', () => {
      render(<MenuItemCard item={mockItem} />);
      
      // Button has aria-label="Add {item.name} to cart"
      expect(screen.getByRole('button', { name: /Add.*to cart/i })).toBeInTheDocument();
    });
  });

  describe('Unavailable Items', () => {
    const unavailableItem: MenuItem = {
      ...mockItem,
      is_available: false,
    };

    it('shows "Unavailable" badge for unavailable items', () => {
      render(<MenuItemCard item={unavailableItem} />);
      
      expect(screen.getByText('Unavailable')).toBeInTheDocument();
    });

    it('does not render Add to Cart button for unavailable items', () => {
      render(<MenuItemCard item={unavailableItem} />);
      
      expect(screen.queryByRole('button', { name: /Add to Cart/i })).not.toBeInTheDocument();
    });

    it('applies reduced opacity for unavailable items', () => {
      const { container } = render(<MenuItemCard item={unavailableItem} />);
      
      expect(container.firstChild).toHaveClass('opacity-60');
    });

    it('is not clickable when unavailable', () => {
      render(
        <MenuItemCard 
          item={unavailableItem} 
          onItemClick={mockOnItemClick} 
        />
      );
      
      // Even though it has role="button", the click handler should not be called
      const card = screen.getByRole('button');
      fireEvent.click(card);
      
      expect(mockOnItemClick).not.toHaveBeenCalled();
    });
  });

  describe('Interactions', () => {
    it('calls onItemClick when card is clicked', () => {
      render(
        <MenuItemCard 
          item={mockItem} 
          onItemClick={mockOnItemClick} 
        />
      );
      
      // Get the card element (first button - the article with role="button")
      const cards = screen.getAllByRole('button');
      expect(cards.length).toBeGreaterThan(0);
      const card = cards[0]!;
      fireEvent.click(card);
      
      expect(mockOnItemClick).toHaveBeenCalledWith(mockItem);
    });

    it('calls onAddToCart when Add to Cart button is clicked', () => {
      render(
        <MenuItemCard 
          item={mockItem} 
          onAddToCart={mockOnAddToCart} 
        />
      );
      
      const addButton = screen.getByRole('button', { name: /Add.*to cart/i });
      fireEvent.click(addButton);
      
      expect(mockOnAddToCart).toHaveBeenCalledWith(mockItem, 1);
    });

    it('does not call onItemClick when Add to Cart is clicked', () => {
      render(
        <MenuItemCard 
          item={mockItem} 
          onItemClick={mockOnItemClick}
          onAddToCart={mockOnAddToCart} 
        />
      );
      
      const addButton = screen.getByRole('button', { name: /Add.*to cart/i });
      fireEvent.click(addButton);
      
      expect(mockOnAddToCart).toHaveBeenCalled();
      expect(mockOnItemClick).not.toHaveBeenCalled();
    });

    it('responds to keyboard navigation (Enter key)', () => {
      render(
        <MenuItemCard 
          item={mockItem} 
          onItemClick={mockOnItemClick} 
        />
      );
      
      // Get the card element (first button - the article with role="button")
      const cards = screen.getAllByRole('button');
      expect(cards.length).toBeGreaterThan(0);
      const card = cards[0]!;
      fireEvent.keyDown(card, { key: 'Enter' });
      
      expect(mockOnItemClick).toHaveBeenCalledWith(mockItem);
    });

    it('responds to keyboard navigation (Space key)', () => {
      render(
        <MenuItemCard 
          item={mockItem} 
          onItemClick={mockOnItemClick} 
        />
      );
      
      // Get the card element (first button - the article with role="button")
      const cards = screen.getAllByRole('button');
      expect(cards.length).toBeGreaterThan(0);
      const card = cards[0]!;
      fireEvent.keyDown(card, { key: ' ' });
      
      expect(mockOnItemClick).toHaveBeenCalledWith(mockItem);
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label including name and price', () => {
      render(<MenuItemCard item={mockItem} />);
      
      expect(screen.getByLabelText(/Classic Burger.*\$12\.99/)).toBeInTheDocument();
    });

    it('has tabindex=0 for available items', () => {
      render(<MenuItemCard item={mockItem} />);
      
      // Get the card which has both role="button" (since it's clickable) and the article element
      const cards = screen.getAllByRole('button');
      expect(cards.length).toBeGreaterThan(0);
      // The first button is the card itself, the second is the "Add to Cart" button
      const card = cards[0]!;
      expect(card).toHaveAttribute('tabindex', '0');
    });

    it('has tabindex=-1 for unavailable items', () => {
      const unavailableItem = { ...mockItem, is_available: false };
      render(<MenuItemCard item={unavailableItem} />);
      
      // Even unavailable cards have role="button" but with tabindex=-1
      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('tabindex', '-1');
    });

    it('indicates unavailability in aria-label', () => {
      const unavailableItem = { ...mockItem, is_available: false };
      render(<MenuItemCard item={unavailableItem} />);
      
      expect(screen.getByLabelText(/unavailable/i)).toBeInTheDocument();
    });
  });

  describe('Image Handling', () => {
    it('uses placeholder image when no image_url is provided', () => {
      const itemWithoutImage = { ...mockItem, image_url: undefined };
      render(<MenuItemCard item={itemWithoutImage} />);
      
      const image = screen.getByAltText('Classic Burger');
      expect(image.getAttribute('src')).toContain('data:image/svg');
    });

    it('loads image with lazy loading', () => {
      render(<MenuItemCard item={mockItem} />);
      
      const image = screen.getByAltText('Classic Burger');
      expect(image).toHaveAttribute('loading', 'lazy');
    });
  });

  describe('Styling', () => {
    it('applies custom className', () => {
      const { container } = render(
        <MenuItemCard item={mockItem} className="custom-class" />
      );
      
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('has card styling classes', () => {
      const { container } = render(<MenuItemCard item={mockItem} />);
      
      expect(container.firstChild).toHaveClass('rounded-xl');
      expect(container.firstChild).toHaveClass('shadow-md');
    });
  });

  describe('Empty Ingredients', () => {
    it('handles items with no ingredients gracefully', () => {
      const itemNoIngredients = { ...mockItem, ingredients: [] };
      render(<MenuItemCard item={itemNoIngredients} />);
      
      // Should still render without errors
      expect(screen.getByText('Classic Burger')).toBeInTheDocument();
      // Should not render ingredient section
      expect(screen.queryByText('🥬')).not.toBeInTheDocument();
    });
  });
});
