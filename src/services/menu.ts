/**
 * @fileoverview Menu service module for the Burger House restaurant application.
 * Provides mock menu data and retrieval functions for menu items and categories.
 * Contains 17 predefined menu items across 5 categories: burgers, sides, drinks,
 * desserts, and specials.
 *
 * This service uses simulated async operations to mimic real API behavior,
 * making it easy to swap out for actual backend integration in the future.
 *
 * @module services/menu
 * @version 1.0.0
 */

import { MenuItem, MenuCategory } from '../types';

// =============================================================================
// MOCK MENU DATA
// =============================================================================

/**
 * Complete menu items array containing all 17 items across 5 categories.
 * Each item includes id, name, description, price, image, category, and availability.
 *
 * Categories:
 * - Burgers (5 items): Classic, Cheese, Bacon BBQ, Mushroom Swiss, Veggie
 * - Sides (4 items): French Fries, Onion Rings, Sweet Potato Fries, Coleslaw
 * - Drinks (4 items): Soft Drink, Milkshake, Iced Tea, Craft Beer
 * - Desserts (2 items): Brownie Sundae, Apple Pie
 * - Specials (2 items): Double Stack Burger, Loaded Nachos
 */
export const menuItems: MenuItem[] = [
  // =============================================================================
  // BURGERS (5 items)
  // =============================================================================
  {
    id: 'burger-1',
    name: 'Classic Burger',
    description: 'Our signature beef patty with lettuce, tomato, onion, and special sauce',
    price: 8.99,
    image: '/images/classic-burger.jpg',
    category: MenuCategory.Burgers,
    isAvailable: true,
  },
  {
    id: 'burger-2',
    name: 'Cheese Burger',
    description: 'Classic burger topped with melted American cheese',
    price: 9.99,
    image: '/images/cheese-burger.jpg',
    category: MenuCategory.Burgers,
    isAvailable: true,
  },
  {
    id: 'burger-3',
    name: 'Bacon BBQ Burger',
    description: 'Smoky bacon, BBQ sauce, onion rings, and cheddar',
    price: 11.99,
    image: '/images/bacon-bbq-burger.jpg',
    category: MenuCategory.Burgers,
    isAvailable: true,
  },
  {
    id: 'burger-4',
    name: 'Mushroom Swiss Burger',
    description: 'Sautéed mushrooms and Swiss cheese on grilled beef',
    price: 10.99,
    image: '/images/mushroom-swiss-burger.jpg',
    category: MenuCategory.Burgers,
    isAvailable: true,
  },
  {
    id: 'burger-5',
    name: 'Veggie Burger',
    description: 'House-made plant-based patty with all the fixings',
    price: 9.49,
    image: '/images/veggie-burger.jpg',
    category: MenuCategory.Burgers,
    isAvailable: true,
  },

  // =============================================================================
  // SIDES (4 items)
  // =============================================================================
  {
    id: 'side-1',
    name: 'French Fries',
    description: 'Crispy golden fries with sea salt',
    price: 3.99,
    image: '/images/french-fries.jpg',
    category: MenuCategory.Sides,
    isAvailable: true,
  },
  {
    id: 'side-2',
    name: 'Onion Rings',
    description: 'Beer-battered onion rings',
    price: 4.99,
    image: '/images/onion-rings.jpg',
    category: MenuCategory.Sides,
    isAvailable: true,
  },
  {
    id: 'side-3',
    name: 'Sweet Potato Fries',
    description: 'Crispy sweet potato with chipotle mayo',
    price: 4.49,
    image: '/images/sweet-potato-fries.jpg',
    category: MenuCategory.Sides,
    isAvailable: true,
  },
  {
    id: 'side-4',
    name: 'Coleslaw',
    description: 'Creamy house-made coleslaw',
    price: 2.99,
    image: '/images/coleslaw.jpg',
    category: MenuCategory.Sides,
    isAvailable: true,
  },

  // =============================================================================
  // DRINKS (4 items)
  // =============================================================================
  {
    id: 'drink-1',
    name: 'Soft Drink',
    description: 'Coca-Cola, Sprite, or Fanta',
    price: 2.49,
    image: '/images/soft-drink.jpg',
    category: MenuCategory.Drinks,
    isAvailable: true,
  },
  {
    id: 'drink-2',
    name: 'Milkshake',
    description: 'Chocolate, Vanilla, or Strawberry',
    price: 5.99,
    image: '/images/milkshake.jpg',
    category: MenuCategory.Drinks,
    isAvailable: true,
  },
  {
    id: 'drink-3',
    name: 'Iced Tea',
    description: 'Fresh-brewed iced tea with lemon',
    price: 2.99,
    image: '/images/iced-tea.jpg',
    category: MenuCategory.Drinks,
    isAvailable: true,
  },
  {
    id: 'drink-4',
    name: 'Craft Beer',
    description: 'Local craft beer selection',
    price: 6.99,
    image: '/images/craft-beer.jpg',
    category: MenuCategory.Drinks,
    isAvailable: true,
  },

  // =============================================================================
  // DESSERTS (2 items)
  // =============================================================================
  {
    id: 'dessert-1',
    name: 'Brownie Sundae',
    description: 'Warm brownie with vanilla ice cream and chocolate sauce',
    price: 6.49,
    image: '/images/brownie-sundae.jpg',
    category: MenuCategory.Desserts,
    isAvailable: true,
  },
  {
    id: 'dessert-2',
    name: 'Apple Pie',
    description: 'Homemade apple pie with whipped cream',
    price: 4.99,
    image: '/images/apple-pie.jpg',
    category: MenuCategory.Desserts,
    isAvailable: true,
  },

  // =============================================================================
  // SPECIALS (2 items)
  // =============================================================================
  {
    id: 'special-1',
    name: 'Double Stack Burger',
    description: 'Two beef patties, double cheese, special sauce',
    price: 13.99,
    image: '/images/double-stack-burger.jpg',
    category: MenuCategory.Specials,
    isAvailable: true,
  },
  {
    id: 'special-2',
    name: 'Loaded Nachos',
    description: 'Tortilla chips with cheese, jalapeños, sour cream, guacamole',
    price: 8.99,
    image: '/images/loaded-nachos.jpg',
    category: MenuCategory.Specials,
    isAvailable: true,
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Creates a Promise that resolves after a random delay to simulate network latency.
 * Delay ranges from 200ms to 500ms to mimic realistic API response times.
 *
 * @returns A Promise that resolves after the simulated delay
 */
const simulateNetworkDelay = (): Promise<void> => {
  const minDelay = 200;
  const maxDelay = 500;
  const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

// =============================================================================
// SERVICE FUNCTIONS
// =============================================================================

/**
 * Retrieves all menu items from the mock database.
 * Returns a Promise containing the complete list of 17 menu items across all categories.
 *
 * @returns Promise resolving to an array of all MenuItem objects
 *
 * @example
 * ```typescript
 * const allItems = await getAllMenuItems();
 * console.log(`Total items: ${allItems.length}`); // 17
 * ```
 */
export async function getAllMenuItems(): Promise<MenuItem[]> {
  await simulateNetworkDelay();
  return [...menuItems];
}

/**
 * Retrieves menu items filtered by a specific category.
 * Returns only items that belong to the specified MenuCategory.
 *
 * @param category - The menu category to filter by (burgers, sides, drinks, desserts, specials)
 * @returns Promise resolving to an array of MenuItem objects in the specified category
 *
 * @example
 * ```typescript
 * const burgers = await getMenuItemsByCategory(MenuCategory.Burgers);
 * console.log(`Burgers count: ${burgers.length}`); // 5
 * ```
 */
export async function getMenuItemsByCategory(category: MenuCategory): Promise<MenuItem[]> {
  await simulateNetworkDelay();
  return menuItems.filter((item) => item.category === category);
}

/**
 * Retrieves a single menu item by its unique identifier.
 * Returns null if no item with the specified ID exists.
 *
 * @param id - The unique identifier of the menu item (e.g., 'burger-1', 'side-2')
 * @returns Promise resolving to the MenuItem if found, or null if not found
 *
 * @example
 * ```typescript
 * const item = await getMenuItemById('burger-1');
 * if (item) {
 *   console.log(item.name); // 'Classic Burger'
 * }
 * ```
 */
export async function getMenuItemById(id: string): Promise<MenuItem | null> {
  await simulateNetworkDelay();

  // Validate input
  if (!id || typeof id !== 'string') {
    return null;
  }

  const trimmedId = id.trim();
  if (trimmedId.length === 0) {
    return null;
  }

  const foundItem = menuItems.find((item) => item.id === trimmedId);
  return foundItem ?? null;
}

/**
 * Searches menu items by name or description.
 * Performs a case-insensitive search across both the name and description fields.
 * Returns items that contain the search query in either field.
 *
 * @param query - The search string to match against item names and descriptions
 * @returns Promise resolving to an array of MenuItem objects matching the search criteria
 *
 * @example
 * ```typescript
 * const results = await searchMenuItems('cheese');
 * // Returns: Cheese Burger, Mushroom Swiss Burger, Double Stack Burger, Loaded Nachos
 * ```
 */
export async function searchMenuItems(query: string): Promise<MenuItem[]> {
  await simulateNetworkDelay();

  // Handle empty or invalid queries
  if (!query || typeof query !== 'string') {
    return [];
  }

  const trimmedQuery = query.trim().toLowerCase();
  if (trimmedQuery.length === 0) {
    return [];
  }

  // Search in both name and description fields (case-insensitive)
  return menuItems.filter((item) => {
    const nameMatch = item.name.toLowerCase().includes(trimmedQuery);
    const descriptionMatch = item.description.toLowerCase().includes(trimmedQuery);
    return nameMatch || descriptionMatch;
  });
}

/**
 * Retrieves all menu categories with their item counts.
 * Returns an array of category information objects showing how many items
 * are available in each category.
 *
 * @returns Promise resolving to an array of category objects with category enum value and count
 *
 * @example
 * ```typescript
 * const categories = await getCategories();
 * // Returns:
 * // [
 * //   { category: MenuCategory.Burgers, count: 5 },
 * //   { category: MenuCategory.Sides, count: 4 },
 * //   { category: MenuCategory.Drinks, count: 4 },
 * //   { category: MenuCategory.Desserts, count: 2 },
 * //   { category: MenuCategory.Specials, count: 2 }
 * // ]
 * ```
 */
export async function getCategories(): Promise<{ category: MenuCategory; count: number }[]> {
  await simulateNetworkDelay();

  // Build a map of category counts
  const categoryCountMap = new Map<MenuCategory, number>();

  // Initialize all categories with 0 count to ensure consistent ordering
  const allCategories: MenuCategory[] = [
    MenuCategory.Burgers,
    MenuCategory.Sides,
    MenuCategory.Drinks,
    MenuCategory.Desserts,
    MenuCategory.Specials,
  ];

  for (const category of allCategories) {
    categoryCountMap.set(category, 0);
  }

  // Count items per category
  for (const item of menuItems) {
    const currentCount = categoryCountMap.get(item.category) ?? 0;
    categoryCountMap.set(item.category, currentCount + 1);
  }

  // Convert map to array of objects in the correct order
  return allCategories.map((category) => ({
    category,
    count: categoryCountMap.get(category) ?? 0,
  }));
}
