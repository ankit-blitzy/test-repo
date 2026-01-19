/**
 * Menu API Client - Menu-specific API calls for fetching menu data
 * 
 * Provides typed API functions for retrieving menu items with ingredients,
 * categories, and individual item details from the backend.
 */

import { get } from '@/utils/api';
import type { 
  MenuApiResponse, 
  CategoryApiResponse, 
  MenuItemApiResponse,
  MenuItem,
  Category 
} from '@/types';

/**
 * Default mock menu data for development and testing.
 * This data is used when the API is unavailable or for local development.
 */
const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    _id: 'item_001',
    category_id: 'cat_burgers',
    name: 'Classic Burger',
    description: 'Our signature burger made with premium ingredients and served with our special sauce.',
    price: 12.99,
    image_url: '/images/classic-burger.jpg',
    is_available: true,
    ingredients: [
      'Quality beef patty',
      'Fresh lettuce',
      'Tomato slices',
      'Cheddar cheese',
      'Soft burger bun'
    ],
    updated_at: '2026-01-15T12:00:00Z'
  },
  {
    _id: 'item_002',
    category_id: 'cat_burgers',
    name: 'Double Bacon Deluxe',
    description: 'Two juicy patties topped with crispy bacon and melted American cheese.',
    price: 16.99,
    image_url: '/images/bacon-burger.jpg',
    is_available: true,
    ingredients: [
      'Two quality beef patties',
      'Crispy bacon strips',
      'American cheese',
      'Caramelized onions',
      'Pickles',
      'Brioche bun'
    ],
    updated_at: '2026-01-15T12:00:00Z'
  },
  {
    _id: 'item_003',
    category_id: 'cat_burgers',
    name: 'Veggie Supreme',
    description: 'A delicious plant-based patty with fresh vegetables and house-made aioli.',
    price: 14.99,
    image_url: '/images/veggie-burger.jpg',
    is_available: true,
    ingredients: [
      'Plant-based patty',
      'Fresh lettuce',
      'Tomato slices',
      'Red onion rings',
      'Avocado',
      'House-made aioli',
      'Whole wheat bun'
    ],
    updated_at: '2026-01-15T12:00:00Z'
  },
  {
    _id: 'item_004',
    category_id: 'cat_burgers',
    name: 'Spicy Jalapeño Burger',
    description: 'For those who like it hot! Topped with pepper jack cheese and fresh jalapeños.',
    price: 14.49,
    image_url: '/images/spicy-burger.jpg',
    is_available: true,
    ingredients: [
      'Seasoned beef patty',
      'Pepper jack cheese',
      'Fresh jalapeños',
      'Chipotle mayo',
      'Crispy onion rings',
      'Sesame seed bun'
    ],
    updated_at: '2026-01-15T12:00:00Z'
  },
  {
    _id: 'item_005',
    category_id: 'cat_sides',
    name: 'Classic Fries',
    description: 'Golden crispy fries seasoned to perfection.',
    price: 4.99,
    image_url: '/images/fries.jpg',
    is_available: true,
    ingredients: [
      'Idaho potatoes',
      'Sea salt',
      'Vegetable oil'
    ],
    updated_at: '2026-01-15T12:00:00Z'
  },
  {
    _id: 'item_006',
    category_id: 'cat_sides',
    name: 'Onion Rings',
    description: 'Thick-cut onion rings in crispy golden batter.',
    price: 5.99,
    image_url: '/images/onion-rings.jpg',
    is_available: true,
    ingredients: [
      'Sweet onions',
      'Seasoned batter',
      'Breadcrumbs'
    ],
    updated_at: '2026-01-15T12:00:00Z'
  },
  {
    _id: 'item_007',
    category_id: 'cat_beverages',
    name: 'Fresh Lemonade',
    description: 'House-made lemonade with fresh lemons and mint.',
    price: 3.99,
    image_url: '/images/lemonade.jpg',
    is_available: true,
    ingredients: [
      'Fresh lemon juice',
      'Filtered water',
      'Cane sugar',
      'Fresh mint leaves'
    ],
    updated_at: '2026-01-15T12:00:00Z'
  }
];

/**
 * Default mock categories for development and testing.
 */
const MOCK_CATEGORIES: Category[] = [
  {
    _id: 'cat_burgers',
    name: 'Burgers',
    description: 'Our delicious handcrafted burgers',
    sort_order: 1,
    is_active: true
  },
  {
    _id: 'cat_sides',
    name: 'Sides',
    description: 'Perfect accompaniments for your burger',
    sort_order: 2,
    is_active: true
  },
  {
    _id: 'cat_beverages',
    name: 'Beverages',
    description: 'Refreshing drinks to complete your meal',
    sort_order: 3,
    is_active: true
  }
];

/**
 * Configuration flag to use mock data instead of real API.
 * Can be overridden via environment variable.
 */
const USE_MOCK_DATA = import.meta.env['VITE_USE_MOCK_DATA'] !== 'false';

/**
 * Fetches all menu items with their ingredients from the API.
 * 
 * @returns Promise resolving to MenuApiResponse containing all menu items
 * 
 * @example
 * const response = await fetchMenuItems();
 * if (response.success) {
 *   console.log(response.data); // Array of MenuItem objects
 * }
 */
export async function fetchMenuItems(): Promise<MenuApiResponse> {
  // Use mock data in development or when API is unavailable
  if (USE_MOCK_DATA) {
    // Simulate network delay for realistic behavior
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      success: true,
      data: MOCK_MENU_ITEMS
    };
  }

  try {
    return await get<MenuApiResponse>('/menu');
  } catch (error) {
    console.error('Failed to fetch menu items:', error);
    // Return mock data as fallback on error
    return {
      success: true,
      data: MOCK_MENU_ITEMS
    };
  }
}

/**
 * Fetches a single menu item by ID.
 * 
 * @param id - The unique identifier of the menu item
 * @returns Promise resolving to MenuItemApiResponse containing the item
 * 
 * @example
 * const response = await fetchMenuItemById('item_001');
 * if (response.success && response.data) {
 *   console.log(response.data.ingredients);
 * }
 */
export async function fetchMenuItemById(id: string): Promise<MenuItemApiResponse> {
  // Use mock data in development or when API is unavailable
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    const item = MOCK_MENU_ITEMS.find(menuItem => menuItem._id === id);
    return {
      success: item !== undefined,
      data: item || null,
      error: item ? undefined : 'Menu item not found'
    };
  }

  try {
    return await get<MenuItemApiResponse>(`/menu/${id}`);
  } catch (error) {
    console.error(`Failed to fetch menu item ${id}:`, error);
    // Return mock data as fallback
    const item = MOCK_MENU_ITEMS.find(menuItem => menuItem._id === id);
    return {
      success: item !== undefined,
      data: item || null,
      error: item ? undefined : 'Menu item not found'
    };
  }
}

/**
 * Fetches all menu categories.
 * 
 * @returns Promise resolving to CategoryApiResponse containing all categories
 * 
 * @example
 * const response = await fetchCategories();
 * if (response.success) {
 *   console.log(response.data); // Array of Category objects
 * }
 */
export async function fetchCategories(): Promise<CategoryApiResponse> {
  // Use mock data in development or when API is unavailable
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      success: true,
      data: MOCK_CATEGORIES
    };
  }

  try {
    return await get<CategoryApiResponse>('/menu/categories');
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    // Return mock data as fallback
    return {
      success: true,
      data: MOCK_CATEGORIES
    };
  }
}

/**
 * Fetches menu items filtered by category.
 * 
 * @param categoryId - The unique identifier of the category
 * @returns Promise resolving to MenuApiResponse containing filtered items
 * 
 * @example
 * const response = await fetchMenuItemsByCategory('cat_burgers');
 * if (response.success) {
 *   console.log(response.data); // Only burger items
 * }
 */
export async function fetchMenuItemsByCategory(categoryId: string): Promise<MenuApiResponse> {
  // Use mock data in development or when API is unavailable
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 250));
    const filteredItems = MOCK_MENU_ITEMS.filter(item => item.category_id === categoryId);
    return {
      success: true,
      data: filteredItems
    };
  }

  try {
    return await get<MenuApiResponse>(`/menu?category=${categoryId}`);
  } catch (error) {
    console.error(`Failed to fetch menu items for category ${categoryId}:`, error);
    // Return mock data as fallback
    const filteredItems = MOCK_MENU_ITEMS.filter(item => item.category_id === categoryId);
    return {
      success: true,
      data: filteredItems
    };
  }
}

/**
 * Exports the mock data for testing purposes.
 */
export const mockData = {
  menuItems: MOCK_MENU_ITEMS,
  categories: MOCK_CATEGORIES
};
