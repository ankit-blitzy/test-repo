/**
 * Menu API service module.
 * Provides methods for fetching menu categories and items.
 * Uses mock data for frontend development until backend is available.
 */

import type { MenuCategoryResponse, MenuItemResponse, ApiResponse } from '@/types/api.types';
import { delay } from '@/utils/helpers';

/** Mock menu categories */
const mockCategories: MenuCategoryResponse[] = [
  {
    id: 'cat-1',
    name: 'Classic Burgers',
    description: 'Our signature burgers made with 100% Angus beef',
    slug: 'classic-burgers',
    imageUrl: '/images/categories/classic.jpg',
    itemCount: 4,
    sortOrder: 1,
  },
  {
    id: 'cat-2',
    name: 'Specialty Burgers',
    description: 'Unique flavor combinations for the adventurous',
    slug: 'specialty-burgers',
    imageUrl: '/images/categories/specialty.jpg',
    itemCount: 3,
    sortOrder: 2,
  },
  {
    id: 'cat-3',
    name: 'Sides',
    description: 'Perfect companions for your burger',
    slug: 'sides',
    imageUrl: '/images/categories/sides.jpg',
    itemCount: 4,
    sortOrder: 3,
  },
  {
    id: 'cat-4',
    name: 'Drinks',
    description: 'Refreshing beverages to complete your meal',
    slug: 'drinks',
    imageUrl: '/images/categories/drinks.jpg',
    itemCount: 4,
    sortOrder: 4,
  },
];

/** Mock menu items */
const mockMenuItems: MenuItemResponse[] = [
  {
    id: 'item-1',
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with melted American cheese, lettuce, tomato, onion, and our secret sauce',
    price: 9.99,
    categoryId: 'cat-1',
    imageUrl: '/images/menu/classic-cheeseburger.jpg',
    isAvailable: true,
    isPopular: true,
    allergens: ['dairy', 'gluten'],
    nutritionInfo: { calories: 550, protein: 30, carbs: 40, fat: 28 },
  },
  {
    id: 'item-2',
    name: 'Double Smash Burger',
    description: 'Two thin-smashed patties with double cheese, pickles, and smash sauce',
    price: 12.99,
    categoryId: 'cat-1',
    imageUrl: '/images/menu/double-smash.jpg',
    isAvailable: true,
    isPopular: true,
    allergens: ['dairy', 'gluten'],
    nutritionInfo: { calories: 780, protein: 45, carbs: 42, fat: 44 },
  },
  {
    id: 'item-3',
    name: 'Bacon BBQ Burger',
    description: 'Beef patty topped with crispy bacon, cheddar, onion rings, and smoky BBQ sauce',
    price: 13.99,
    categoryId: 'cat-1',
    imageUrl: '/images/menu/bacon-bbq.jpg',
    isAvailable: true,
    isPopular: false,
    allergens: ['dairy', 'gluten'],
    nutritionInfo: { calories: 820, protein: 42, carbs: 50, fat: 46 },
  },
  {
    id: 'item-4',
    name: 'Mushroom Swiss Burger',
    description: 'Beef patty with sautéed mushrooms, melted Swiss cheese, and garlic aioli',
    price: 12.49,
    categoryId: 'cat-1',
    imageUrl: '/images/menu/mushroom-swiss.jpg',
    isAvailable: true,
    isPopular: false,
    allergens: ['dairy', 'gluten'],
    nutritionInfo: { calories: 650, protein: 35, carbs: 38, fat: 34 },
  },
  {
    id: 'item-5',
    name: 'Truffle Burger',
    description: 'Premium beef with truffle aioli, arugula, parmesan, and caramelized onions',
    price: 16.99,
    categoryId: 'cat-2',
    imageUrl: '/images/menu/truffle-burger.jpg',
    isAvailable: true,
    isPopular: true,
    allergens: ['dairy', 'gluten'],
    nutritionInfo: { calories: 720, protein: 38, carbs: 44, fat: 40 },
  },
  {
    id: 'item-6',
    name: 'Spicy Jalapeño Burger',
    description: 'Beef patty with pepper jack cheese, jalapeños, chipotle mayo, and pickled onions',
    price: 13.49,
    categoryId: 'cat-2',
    imageUrl: '/images/menu/spicy-jalapeno.jpg',
    isAvailable: true,
    isPopular: false,
    allergens: ['dairy', 'gluten'],
    nutritionInfo: { calories: 680, protein: 34, carbs: 42, fat: 36 },
  },
  {
    id: 'item-7',
    name: 'Hawaiian Teriyaki Burger',
    description: 'Beef patty with grilled pineapple, teriyaki glaze, Swiss cheese, and lettuce',
    price: 14.49,
    categoryId: 'cat-2',
    imageUrl: '/images/menu/hawaiian-teriyaki.jpg',
    isAvailable: true,
    isPopular: false,
    allergens: ['dairy', 'gluten', 'soy'],
    nutritionInfo: { calories: 700, protein: 36, carbs: 52, fat: 30 },
  },
  {
    id: 'item-8',
    name: 'Crispy Fries',
    description: 'Golden crispy french fries seasoned with sea salt',
    price: 4.49,
    categoryId: 'cat-3',
    imageUrl: '/images/menu/fries.jpg',
    isAvailable: true,
    isPopular: true,
    allergens: ['gluten'],
    nutritionInfo: { calories: 380, protein: 5, carbs: 50, fat: 18 },
  },
  {
    id: 'item-9',
    name: 'Onion Rings',
    description: 'Beer-battered thick-cut onion rings with ranch dipping sauce',
    price: 5.49,
    categoryId: 'cat-3',
    imageUrl: '/images/menu/onion-rings.jpg',
    isAvailable: true,
    isPopular: false,
    allergens: ['gluten', 'dairy'],
    nutritionInfo: { calories: 450, protein: 6, carbs: 55, fat: 24 },
  },
  {
    id: 'item-10',
    name: 'Coleslaw',
    description: 'Creamy house-made coleslaw with cabbage and carrots',
    price: 3.49,
    categoryId: 'cat-3',
    imageUrl: '/images/menu/coleslaw.jpg',
    isAvailable: true,
    isPopular: false,
    allergens: ['dairy', 'eggs'],
    nutritionInfo: { calories: 180, protein: 2, carbs: 15, fat: 12 },
  },
  {
    id: 'item-11',
    name: 'Sweet Potato Fries',
    description: 'Crispy sweet potato fries with honey mustard dip',
    price: 5.99,
    categoryId: 'cat-3',
    imageUrl: '/images/menu/sweet-potato-fries.jpg',
    isAvailable: true,
    isPopular: false,
    allergens: ['gluten'],
    nutritionInfo: { calories: 340, protein: 4, carbs: 52, fat: 14 },
  },
  {
    id: 'item-12',
    name: 'Classic Milkshake',
    description: 'Thick and creamy milkshake - choose from vanilla, chocolate, or strawberry',
    price: 5.99,
    categoryId: 'cat-4',
    imageUrl: '/images/menu/milkshake.jpg',
    isAvailable: true,
    isPopular: true,
    allergens: ['dairy'],
    nutritionInfo: { calories: 520, protein: 10, carbs: 70, fat: 22 },
  },
  {
    id: 'item-13',
    name: 'Fresh Lemonade',
    description: 'House-made lemonade with fresh lemons and a hint of mint',
    price: 3.99,
    categoryId: 'cat-4',
    imageUrl: '/images/menu/lemonade.jpg',
    isAvailable: true,
    isPopular: false,
    allergens: [],
    nutritionInfo: { calories: 120, protein: 0, carbs: 32, fat: 0 },
  },
  {
    id: 'item-14',
    name: 'Iced Tea',
    description: 'Freshly brewed iced tea, sweetened or unsweetened',
    price: 2.99,
    categoryId: 'cat-4',
    imageUrl: '/images/menu/iced-tea.jpg',
    isAvailable: true,
    isPopular: false,
    allergens: [],
    nutritionInfo: { calories: 80, protein: 0, carbs: 20, fat: 0 },
  },
  {
    id: 'item-15',
    name: 'Craft Soda',
    description: 'Artisan craft soda selection - ask for available flavors',
    price: 3.49,
    categoryId: 'cat-4',
    imageUrl: '/images/menu/craft-soda.jpg',
    isAvailable: true,
    isPopular: false,
    allergens: [],
    nutritionInfo: { calories: 160, protein: 0, carbs: 42, fat: 0 },
  },
];

/**
 * Fetches all menu categories.
 * @returns Promise resolving to array of menu categories
 */
export async function getCategories(): Promise<ApiResponse<MenuCategoryResponse[]>> {
  await delay(500);
  return {
    data: mockCategories,
    success: true,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Fetches menu items, optionally filtered by category.
 * @param categoryId - Optional category ID filter
 * @returns Promise resolving to array of menu items
 */
export async function getMenuItems(categoryId?: string): Promise<ApiResponse<MenuItemResponse[]>> {
  await delay(600);
  const items = categoryId
    ? mockMenuItems.filter((item) => item.categoryId === categoryId)
    : mockMenuItems;

  return {
    data: items,
    success: true,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Fetches a single menu item by its ID.
 * @param itemId - Menu item ID
 * @returns Promise resolving to the menu item details
 */
export async function getMenuItemById(itemId: string): Promise<ApiResponse<MenuItemResponse>> {
  await delay(400);
  const item = mockMenuItems.find((i) => i.id === itemId);

  if (!item) {
    throw {
      code: 'NOT_FOUND',
      message: 'Menu item not found',
      statusCode: 404,
    };
  }

  return {
    data: item,
    success: true,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Fetches popular/featured menu items.
 * @returns Promise resolving to array of popular menu items
 */
export async function getPopularItems(): Promise<ApiResponse<MenuItemResponse[]>> {
  await delay(400);
  const popular = mockMenuItems.filter((item) => item.isPopular);

  return {
    data: popular,
    success: true,
    timestamp: new Date().toISOString(),
  };
}
