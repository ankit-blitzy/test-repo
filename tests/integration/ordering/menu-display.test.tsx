/**
 * Menu Display Integration Tests
 * 
 * Integration tests for the complete menu display flow including
 * data fetching, rendering items with ingredients, and modal interactions.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import MenuPage from '@/pages/MenuPage';
import { useMenuStore } from '@/features/ordering/store/menuStore';

// Mock the API module to control data flow
vi.mock('@/features/ordering/api/menuApi', () => ({
  fetchMenuItems: vi.fn(),
  fetchCategories: vi.fn(),
  mockData: {
    menuItems: [
      {
        _id: 'item_001',
        category_id: 'cat_burgers',
        name: 'Classic Burger',
        description: 'Our signature burger',
        price: 12.99,
        is_available: true,
        ingredients: ['Quality beef patty', 'Fresh lettuce', 'Tomato slices', 'Cheddar cheese', 'Soft burger bun'],
        updated_at: '2026-01-15T12:00:00Z',
      },
      {
        _id: 'item_002',
        category_id: 'cat_burgers',
        name: 'Bacon Deluxe',
        description: 'With crispy bacon',
        price: 14.99,
        is_available: true,
        ingredients: ['Beef patty', 'Bacon', 'American cheese', 'Onions'],
        updated_at: '2026-01-15T12:00:00Z',
      },
      {
        _id: 'item_003',
        category_id: 'cat_sides',
        name: 'Classic Fries',
        description: 'Golden crispy fries',
        price: 4.99,
        is_available: true,
        ingredients: ['Idaho potatoes', 'Sea salt'],
        updated_at: '2026-01-15T12:00:00Z',
      },
    ],
    categories: [
      { _id: 'cat_burgers', name: 'Burgers', sort_order: 1, is_active: true },
      { _id: 'cat_sides', name: 'Sides', sort_order: 2, is_active: true },
    ],
  },
}));

import { fetchMenuItems, fetchCategories, mockData } from '@/features/ordering/api/menuApi';

// Wrapper component for routing
function TestWrapper({ children }: { children: React.ReactNode }): JSX.Element {
  return <BrowserRouter>{children}</BrowserRouter>;
}

describe('Menu Display Integration', () => {
  beforeEach(() => {
    // Reset store state
    useMenuStore.setState({
      items: [],
      categories: [],
      isLoading: false,
      isCategoriesLoading: false,
      error: null,
      lastFetched: null,
      categoriesLastFetched: null,
      selectedCategoryId: null,
    });

    // Setup default mock responses
    vi.mocked(fetchMenuItems).mockResolvedValue({
      success: true,
      data: mockData.menuItems,
    });

    vi.mocked(fetchCategories).mockResolvedValue({
      success: true,
      data: mockData.categories,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Load', () => {
    it('displays loading state initially', () => {
      vi.mocked(fetchMenuItems).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(
        <TestWrapper>
          <MenuPage />
        </TestWrapper>
      );

      // Should show loading skeletons
      expect(screen.getByLabelText('Loading menu items')).toBeInTheDocument();
    });

    it('fetches and displays menu items', async () => {
      render(
        <TestWrapper>
          <MenuPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Classic Burger')).toBeInTheDocument();
      });

      expect(screen.getByText('Bacon Deluxe')).toBeInTheDocument();
      expect(screen.getByText('Classic Fries')).toBeInTheDocument();
    });

    it('displays menu items with prices', async () => {
      render(
        <TestWrapper>
          <MenuPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('$12.99')).toBeInTheDocument();
      });

      expect(screen.getByText('$14.99')).toBeInTheDocument();
      expect(screen.getByText('$4.99')).toBeInTheDocument();
    });

    it('displays category filter tabs', async () => {
      render(
        <TestWrapper>
          <MenuPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: 'All Items' })).toBeInTheDocument();
      });

      expect(screen.getByRole('tab', { name: 'Burgers' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Sides' })).toBeInTheDocument();
    });
  });

  describe('Ingredient Display', () => {
    it('shows ingredient preview on menu cards', async () => {
      render(
        <TestWrapper>
          <MenuPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Classic Burger')).toBeInTheDocument();
      });

      // Should show ingredient preview with emoji
      const ingredientPreviews = screen.getAllByText('🥬');
      expect(ingredientPreviews.length).toBeGreaterThan(0);
    });

    it('shows ingredients in card preview format', async () => {
      render(
        <TestWrapper>
          <MenuPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Quality beef patty/)).toBeInTheDocument();
      });
    });
  });

  describe('Category Filtering', () => {
    it('filters items by category when tab is clicked', async () => {
      render(
        <TestWrapper>
          <MenuPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Classic Burger')).toBeInTheDocument();
      });

      // Click on Sides category
      const sidesTab = screen.getByRole('tab', { name: 'Sides' });
      fireEvent.click(sidesTab);

      // Should only show sides
      await waitFor(() => {
        expect(screen.getByText('Classic Fries')).toBeInTheDocument();
      });

      // Burgers should not be visible
      expect(screen.queryByText('Classic Burger')).not.toBeInTheDocument();
      expect(screen.queryByText('Bacon Deluxe')).not.toBeInTheDocument();
    });

    it('shows all items when All Items tab is clicked', async () => {
      render(
        <TestWrapper>
          <MenuPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Classic Burger')).toBeInTheDocument();
      });

      // Filter to sides
      fireEvent.click(screen.getByRole('tab', { name: 'Sides' }));
      
      await waitFor(() => {
        expect(screen.queryByText('Classic Burger')).not.toBeInTheDocument();
      });

      // Click All Items
      fireEvent.click(screen.getByRole('tab', { name: 'All Items' }));

      // All items should be visible
      await waitFor(() => {
        expect(screen.getByText('Classic Burger')).toBeInTheDocument();
      });
      expect(screen.getByText('Classic Fries')).toBeInTheDocument();
    });

    it('highlights selected category tab', async () => {
      render(
        <TestWrapper>
          <MenuPage />
        </TestWrapper>
      );

      await waitFor(() => {
        const allItemsTab = screen.getByRole('tab', { name: 'All Items' });
        expect(allItemsTab).toHaveAttribute('aria-selected', 'true');
      });

      // Click Burgers
      const burgersTab = screen.getByRole('tab', { name: 'Burgers' });
      fireEvent.click(burgersTab);

      expect(burgersTab).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tab', { name: 'All Items' })).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('Item Details Modal', () => {
    it('opens modal when menu item is clicked', async () => {
      render(
        <TestWrapper>
          <MenuPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Classic Burger')).toBeInTheDocument();
      });

      // Find and click the menu item card
      const menuCard = screen.getByLabelText(/Classic Burger.*\$12\.99/);
      fireEvent.click(menuCard);

      // Modal should open
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('displays full ingredient list in modal', async () => {
      render(
        <TestWrapper>
          <MenuPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Classic Burger')).toBeInTheDocument();
      });

      // Open modal
      const menuCard = screen.getByLabelText(/Classic Burger.*\$12\.99/);
      fireEvent.click(menuCard);

      // Wait for modal
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Should show all ingredients as tags in the modal
      const modal = screen.getByRole('dialog');
      expect(within(modal).getByText('Quality beef patty')).toBeInTheDocument();
      expect(within(modal).getByText('Fresh lettuce')).toBeInTheDocument();
      expect(within(modal).getByText('Tomato slices')).toBeInTheDocument();
      expect(within(modal).getByText('Cheddar cheese')).toBeInTheDocument();
      expect(within(modal).getByText('Soft burger bun')).toBeInTheDocument();
    });

    it('closes modal when close button is clicked', async () => {
      render(
        <TestWrapper>
          <MenuPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Classic Burger')).toBeInTheDocument();
      });

      // Open modal
      const menuCard = screen.getByLabelText(/Classic Burger.*\$12\.99/);
      fireEvent.click(menuCard);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Close modal
      const closeButton = screen.getByLabelText('Close modal');
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('closes modal when Escape key is pressed', async () => {
      render(
        <TestWrapper>
          <MenuPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Classic Burger')).toBeInTheDocument();
      });

      // Open modal
      fireEvent.click(screen.getByLabelText(/Classic Burger.*\$12\.99/));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Press Escape
      fireEvent.keyDown(document, { key: 'Escape' });

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('shows quantity selector in modal', async () => {
      render(
        <TestWrapper>
          <MenuPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Classic Burger')).toBeInTheDocument();
      });

      // Open modal
      fireEvent.click(screen.getByLabelText(/Classic Burger.*\$12\.99/));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Should have quantity controls
      expect(screen.getByLabelText('Decrease quantity')).toBeInTheDocument();
      expect(screen.getByLabelText('Increase quantity')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument(); // Default quantity
    });

    it('updates total price when quantity changes', async () => {
      render(
        <TestWrapper>
          <MenuPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Classic Burger')).toBeInTheDocument();
      });

      // Open modal
      fireEvent.click(screen.getByLabelText(/Classic Burger.*\$12\.99/));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Increase quantity
      const increaseButton = screen.getByLabelText('Increase quantity');
      fireEvent.click(increaseButton);

      // Total should update (12.99 * 2 = 25.98)
      await waitFor(() => {
        expect(screen.getByText(/\$25\.98/)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('displays error message when fetch fails', async () => {
      vi.mocked(fetchMenuItems).mockResolvedValue({
        success: false,
        data: [],
        error: 'Failed to load menu',
      });

      render(
        <TestWrapper>
          <MenuPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      expect(screen.getByText('Failed to load menu')).toBeInTheDocument();
    });

    it('can dismiss error message', async () => {
      vi.mocked(fetchMenuItems).mockResolvedValue({
        success: false,
        data: [],
        error: 'Failed to load menu',
      });

      render(
        <TestWrapper>
          <MenuPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      // Dismiss error
      fireEvent.click(screen.getByText('Dismiss'));

      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      });
    });
  });

  describe('Add to Cart', () => {
    it('shows Add to Cart button on menu cards', async () => {
      render(
        <TestWrapper>
          <MenuPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Classic Burger')).toBeInTheDocument();
      });

      // Button has aria-label="Add {item.name} to cart"
      const addButtons = screen.getAllByRole('button', { name: /Add.*to cart/i });
      expect(addButtons.length).toBe(3); // 3 items
    });

    it('prevents event bubbling when Add to Cart is clicked', async () => {
      render(
        <TestWrapper>
          <MenuPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Classic Burger')).toBeInTheDocument();
      });

      // Mock alert
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      // Find the Add to Cart button for Classic Burger - look for specific aria-label
      const addButtons = screen.getAllByRole('button', { name: /Add.*to cart/i });
      const classicBurgerAddButton = addButtons.find(btn => 
        btn.getAttribute('aria-label')?.includes('Classic Burger')
      );
      expect(classicBurgerAddButton).toBeDefined();
      
      fireEvent.click(classicBurgerAddButton!);

      // Alert should be called (from placeholder implementation)
      expect(alertSpy).toHaveBeenCalled();

      // Modal should NOT open (event shouldn't bubble)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      alertSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('has proper page structure with header and main content', async () => {
      render(
        <TestWrapper>
          <MenuPage />
        </TestWrapper>
      );

      expect(screen.getByRole('banner')).toBeInTheDocument(); // header
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument(); // category tabs
    });

    it('menu grid has proper list role', async () => {
      render(
        <TestWrapper>
          <MenuPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Classic Burger')).toBeInTheDocument();
      });

      expect(screen.getByRole('list', { name: 'Menu items' })).toBeInTheDocument();
    });

    it('category tabs have proper tablist role', async () => {
      render(
        <TestWrapper>
          <MenuPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByRole('tablist')).toBeInTheDocument();
      });
    });
  });
});
