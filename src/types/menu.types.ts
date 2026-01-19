/**
 * Menu Type Definitions
 * Defines interfaces for menu items and categories with ingredient support
 */

/**
 * Represents a menu category (e.g., Burgers, Sides, Drinks)
 */
export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  displayOrder: number;
  isActive: boolean;
}

/**
 * Represents a menu item with ingredient information
 * The ingredients array is optional to support backward compatibility
 */
export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  ingredients?: string[];
  updatedAt: Date;
}

/**
 * Menu API response structure
 */
export interface MenuAPIResponse {
  success: boolean;
  data: {
    items: MenuItem[];
    categories: Category[];
  };
  meta: {
    total: number;
    cached: boolean;
  };
}

/**
 * Props for ingredient list component
 */
export interface IngredientListProps {
  ingredients: string[];
  maxDisplay?: number;
}

/**
 * Props for menu item card component
 */
export interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

/**
 * Props for menu list component
 */
export interface MenuListProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  isLoading?: boolean;
}

/**
 * Menu filter options
 */
export interface MenuFilterOptions {
  categoryId?: string;
  searchQuery?: string;
  availableOnly?: boolean;
  priceRange?: {
    min: number;
    max: number;
  };
}
