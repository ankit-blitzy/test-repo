/**
 * Mock Menu Data
 * Sample menu items for development and testing
 * Includes ingredient information for the ingredient feature
 */

import type { MenuItem } from '@/types/menu.types';

export const mockMenuItems: MenuItem[] = [
  // Burgers
  {
    id: 'burger-001',
    categoryId: 'cat-burgers',
    name: 'Normal Burger',
    description: 'Our classic burger with fresh ingredients, perfectly grilled to perfection',
    price: 8.99,
    imageUrl: '/images/menu/normal-burger.jpg',
    isAvailable: true,
    ingredients: [
      'Quality beef patty',
      'Fresh lettuce',
      'Tomato slices',
      'Cheddar cheese',
      'Soft burger bun',
    ],
    updatedAt: new Date('2026-01-15T12:00:00Z'),
  },
  {
    id: 'burger-002',
    categoryId: 'cat-burgers',
    name: 'Deluxe Burger',
    description: 'Double patty burger loaded with premium toppings',
    price: 12.99,
    imageUrl: '/images/menu/deluxe-burger.jpg',
    isAvailable: true,
    ingredients: [
      'Double beef patty',
      'Crispy bacon',
      'American cheese',
      'Fresh lettuce',
      'Tomato slices',
      'Red onion rings',
      'Pickles',
      'Special sauce',
      'Brioche bun',
    ],
    updatedAt: new Date('2026-01-15T12:00:00Z'),
  },
  {
    id: 'burger-003',
    categoryId: 'cat-burgers',
    name: 'BBQ Bacon Burger',
    description: 'Smoky BBQ sauce with crispy bacon and onion rings',
    price: 11.49,
    imageUrl: '/images/menu/bbq-burger.jpg',
    isAvailable: true,
    ingredients: [
      'Beef patty',
      'Crispy bacon strips',
      'Cheddar cheese',
      'Crispy onion rings',
      'BBQ sauce',
      'Fresh lettuce',
      'Toasted sesame bun',
    ],
    updatedAt: new Date('2026-01-15T12:00:00Z'),
  },
  {
    id: 'burger-004',
    categoryId: 'cat-burgers',
    name: 'Veggie Burger',
    description: 'Plant-based patty with fresh vegetables',
    price: 10.99,
    imageUrl: '/images/menu/veggie-burger.jpg',
    isAvailable: true,
    ingredients: [
      'Plant-based patty',
      'Fresh lettuce',
      'Tomato slices',
      'Red onion',
      'Pickles',
      'Vegan mayo',
      'Whole grain bun',
    ],
    updatedAt: new Date('2026-01-15T12:00:00Z'),
  },
  {
    id: 'burger-005',
    categoryId: 'cat-burgers',
    name: 'Spicy Jalapeño Burger',
    description: 'For those who like it hot - jalapeños and pepper jack cheese',
    price: 11.99,
    imageUrl: '/images/menu/spicy-burger.jpg',
    isAvailable: true,
    ingredients: [
      'Seasoned beef patty',
      'Pepper jack cheese',
      'Fresh jalapeños',
      'Chipotle mayo',
      'Fresh lettuce',
      'Tomato slices',
      'Jalapeño bun',
    ],
    updatedAt: new Date('2026-01-15T12:00:00Z'),
  },

  // Sides
  {
    id: 'side-001',
    categoryId: 'cat-sides',
    name: 'Classic Fries',
    description: 'Golden crispy fries with sea salt',
    price: 3.99,
    imageUrl: '/images/menu/fries.jpg',
    isAvailable: true,
    ingredients: [
      'Idaho potatoes',
      'Sea salt',
      'Vegetable oil',
    ],
    updatedAt: new Date('2026-01-15T12:00:00Z'),
  },
  {
    id: 'side-002',
    categoryId: 'cat-sides',
    name: 'Onion Rings',
    description: 'Crispy battered onion rings',
    price: 4.49,
    imageUrl: '/images/menu/onion-rings.jpg',
    isAvailable: true,
    ingredients: [
      'Sweet onions',
      'Seasoned batter',
      'Breadcrumbs',
    ],
    updatedAt: new Date('2026-01-15T12:00:00Z'),
  },
  {
    id: 'side-003',
    categoryId: 'cat-sides',
    name: 'Loaded Nachos',
    description: 'Tortilla chips with cheese, jalapeños, and sour cream',
    price: 6.99,
    imageUrl: '/images/menu/nachos.jpg',
    isAvailable: true,
    ingredients: [
      'Tortilla chips',
      'Nacho cheese sauce',
      'Jalapeños',
      'Sour cream',
      'Salsa',
      'Green onions',
    ],
    updatedAt: new Date('2026-01-15T12:00:00Z'),
  },

  // Drinks
  {
    id: 'drink-001',
    categoryId: 'cat-drinks',
    name: 'Classic Cola',
    description: 'Refreshing cola drink',
    price: 2.49,
    imageUrl: '/images/menu/cola.jpg',
    isAvailable: true,
    updatedAt: new Date('2026-01-15T12:00:00Z'),
  },
  {
    id: 'drink-002',
    categoryId: 'cat-drinks',
    name: 'Fresh Lemonade',
    description: 'Homemade lemonade with fresh lemons',
    price: 3.49,
    imageUrl: '/images/menu/lemonade.jpg',
    isAvailable: true,
    ingredients: [
      'Fresh lemons',
      'Pure cane sugar',
      'Sparkling water',
    ],
    updatedAt: new Date('2026-01-15T12:00:00Z'),
  },
  {
    id: 'drink-003',
    categoryId: 'cat-drinks',
    name: 'Milkshake',
    description: 'Creamy vanilla milkshake',
    price: 4.99,
    imageUrl: '/images/menu/milkshake.jpg',
    isAvailable: true,
    ingredients: [
      'Vanilla ice cream',
      'Whole milk',
      'Whipped cream',
    ],
    updatedAt: new Date('2026-01-15T12:00:00Z'),
  },

  // Desserts
  {
    id: 'dessert-001',
    categoryId: 'cat-desserts',
    name: 'Chocolate Brownie',
    description: 'Warm chocolate brownie with vanilla ice cream',
    price: 5.99,
    imageUrl: '/images/menu/brownie.jpg',
    isAvailable: true,
    ingredients: [
      'Dark chocolate',
      'Butter',
      'Free-range eggs',
      'Flour',
      'Vanilla ice cream',
    ],
    updatedAt: new Date('2026-01-15T12:00:00Z'),
  },
  {
    id: 'dessert-002',
    categoryId: 'cat-desserts',
    name: 'Apple Pie',
    description: 'Classic apple pie with cinnamon',
    price: 4.99,
    imageUrl: '/images/menu/apple-pie.jpg',
    isAvailable: false,
    ingredients: [
      'Fresh apples',
      'Cinnamon',
      'Brown sugar',
      'Butter crust',
    ],
    updatedAt: new Date('2026-01-15T12:00:00Z'),
  },
];

/**
 * Get menu items by category
 */
export function getMenuItemsByCategory(categoryId: string): MenuItem[] {
  return mockMenuItems.filter((item) => item.categoryId === categoryId);
}

/**
 * Get available menu items
 */
export function getAvailableMenuItems(): MenuItem[] {
  return mockMenuItems.filter((item) => item.isAvailable);
}

/**
 * Get menu item by ID
 */
export function getMenuItemById(id: string): MenuItem | undefined {
  return mockMenuItems.find((item) => item.id === id);
}

/**
 * Search menu items by name or description
 */
export function searchMenuItems(query: string): MenuItem[] {
  const lowercaseQuery = query.toLowerCase();
  return mockMenuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(lowercaseQuery) ||
      item.description.toLowerCase().includes(lowercaseQuery)
  );
}
