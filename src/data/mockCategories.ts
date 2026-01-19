/**
 * Mock Categories Data
 * Sample menu categories for development and testing
 */

import type { Category } from '@/types/menu.types';

export const mockCategories: Category[] = [
  {
    id: 'cat-burgers',
    name: 'Burgers',
    description: 'Our signature handcrafted burgers made with fresh ingredients',
    imageUrl: '/images/categories/burgers.jpg',
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 'cat-sides',
    name: 'Sides',
    description: 'Perfect accompaniments to your meal',
    imageUrl: '/images/categories/sides.jpg',
    displayOrder: 2,
    isActive: true,
  },
  {
    id: 'cat-drinks',
    name: 'Drinks',
    description: 'Refreshing beverages to complete your meal',
    imageUrl: '/images/categories/drinks.jpg',
    displayOrder: 3,
    isActive: true,
  },
  {
    id: 'cat-desserts',
    name: 'Desserts',
    description: 'Sweet treats to finish your meal',
    imageUrl: '/images/categories/desserts.jpg',
    displayOrder: 4,
    isActive: true,
  },
];

/**
 * Get category by ID
 */
export function getCategoryById(id: string): Category | undefined {
  return mockCategories.find((category) => category.id === id);
}

/**
 * Get active categories sorted by display order
 */
export function getActiveCategories(): Category[] {
  return mockCategories
    .filter((category) => category.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}
