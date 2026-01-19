/**
 * Menu Types - TypeScript interfaces for menu items with ingredients
 * 
 * Defines the data structures used throughout the burger restaurant website
 * for menu display, ingredient information, and category organization.
 */

/**
 * Represents a single menu item with all its properties including ingredients.
 * This is the core type used throughout the ordering feature.
 */
export interface MenuItem {
  /** Unique identifier for the menu item */
  _id: string;
  
  /** Reference to the category this item belongs to */
  category_id: string;
  
  /** Display name of the menu item */
  name: string;
  
  /** Detailed description of the menu item */
  description: string;
  
  /** Price in decimal format (e.g., 12.99) */
  price: number;
  
  /** Optional URL to the item's image */
  image_url?: string;
  
  /** Whether the item is currently available for ordering */
  is_available: boolean;
  
  /** Array of ingredient names included in this menu item */
  ingredients: string[];
  
  /** ISO 8601 timestamp of last update */
  updated_at: string;
}

/**
 * Represents a menu category for organizing menu items.
 */
export interface Category {
  /** Unique identifier for the category */
  _id: string;
  
  /** Display name of the category */
  name: string;
  
  /** Optional description of the category */
  description?: string;
  
  /** Sort order for display purposes */
  sort_order: number;
  
  /** Whether the category is active and should be displayed */
  is_active: boolean;
}

/**
 * API response wrapper for menu data requests.
 */
export interface MenuApiResponse {
  /** Indicates if the request was successful */
  success: boolean;
  
  /** Array of menu items returned from the API */
  data: MenuItem[];
  
  /** Optional error message if the request failed */
  error?: string;
}

/**
 * API response wrapper for category data requests.
 */
export interface CategoryApiResponse {
  /** Indicates if the request was successful */
  success: boolean;
  
  /** Array of categories returned from the API */
  data: Category[];
  
  /** Optional error message if the request failed */
  error?: string;
}

/**
 * API response wrapper for a single menu item request.
 */
export interface MenuItemApiResponse {
  /** Indicates if the request was successful */
  success: boolean;
  
  /** Single menu item returned from the API */
  data: MenuItem | null;
  
  /** Optional error message if the request failed */
  error?: string;
}

/**
 * Props interface for the IngredientList component.
 */
export interface IngredientListProps {
  /** Array of ingredient names to display */
  ingredients: string[];
  
  /** When true, shows only first 3 ingredients with ellipsis */
  preview?: boolean;
  
  /** Additional Tailwind CSS classes */
  className?: string;
}

/**
 * Props interface for the MenuItemCard component.
 */
export interface MenuItemCardProps {
  /** The menu item to display */
  item: MenuItem;
  
  /** Callback when the item is clicked for details */
  onItemClick?: (item: MenuItem) => void;
  
  /** Callback when add to cart is clicked */
  onAddToCart?: (item: MenuItem, quantity: number) => void;
  
  /** Additional Tailwind CSS classes */
  className?: string;
}

/**
 * Props interface for the ItemDetailsModal component.
 */
export interface ItemDetailsModalProps {
  /** The menu item to display in the modal */
  item: MenuItem | null;
  
  /** Whether the modal is currently open */
  isOpen: boolean;
  
  /** Callback to close the modal */
  onClose: () => void;
  
  /** Callback when add to cart is clicked */
  onAddToCart?: (item: MenuItem, quantity: number) => void;
}

/**
 * Props interface for the MenuList component.
 */
export interface MenuListProps {
  /** Array of menu items to display */
  items: MenuItem[];
  
  /** Whether data is currently loading */
  isLoading?: boolean;
  
  /** Callback when an item is clicked for details */
  onItemClick?: (item: MenuItem) => void;
  
  /** Callback when add to cart is clicked */
  onAddToCart?: (item: MenuItem, quantity: number) => void;
  
  /** Additional Tailwind CSS classes */
  className?: string;
}
