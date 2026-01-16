import type { MenuItem, MenuCategory } from '../types';

// Mock menu data
const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, and our special sauce',
    price: 12.99,
    category: 'burgers',
    available: true,
  },
  {
    id: '2',
    name: 'Cheeseburger',
    description: 'Classic burger topped with melted American cheese',
    price: 13.99,
    category: 'burgers',
    available: true,
  },
  {
    id: '3',
    name: 'Bacon Burger',
    description: 'Loaded with crispy bacon and cheddar cheese',
    price: 15.99,
    category: 'burgers',
    available: true,
  },
  {
    id: '4',
    name: 'Veggie Burger',
    description: 'Plant-based patty with fresh vegetables',
    price: 13.99,
    category: 'burgers',
    available: true,
  },
  {
    id: '5',
    name: 'French Fries',
    description: 'Crispy golden fries with sea salt',
    price: 4.99,
    category: 'sides',
    available: true,
  },
  {
    id: '6',
    name: 'Onion Rings',
    description: 'Beer-battered onion rings',
    price: 5.99,
    category: 'sides',
    available: true,
  },
  {
    id: '7',
    name: 'Coleslaw',
    description: 'Creamy homemade coleslaw',
    price: 3.99,
    category: 'sides',
    available: true,
  },
  {
    id: '8',
    name: 'Cola',
    description: 'Refreshing cola drink',
    price: 2.99,
    category: 'drinks',
    available: true,
  },
  {
    id: '9',
    name: 'Lemonade',
    description: 'Fresh squeezed lemonade',
    price: 3.99,
    category: 'drinks',
    available: true,
  },
  {
    id: '10',
    name: 'Milkshake',
    description: 'Thick and creamy vanilla milkshake',
    price: 5.99,
    category: 'drinks',
    available: true,
  },
  {
    id: '11',
    name: 'Chocolate Brownie',
    description: 'Warm chocolate brownie with ice cream',
    price: 6.99,
    category: 'desserts',
    available: true,
  },
  {
    id: '12',
    name: 'Apple Pie',
    description: 'Homestyle apple pie slice',
    price: 5.99,
    category: 'desserts',
    available: true,
  },
  {
    id: '13',
    name: 'Chicken Burger',
    description: 'Grilled chicken breast with mayo and lettuce',
    price: 13.99,
    category: 'burgers',
    available: true,
  },
  {
    id: '14',
    name: 'Fish Burger',
    description: 'Crispy fish fillet with tartar sauce',
    price: 14.99,
    category: 'burgers',
    available: true,
  },
  {
    id: '15',
    name: 'Sweet Potato Fries',
    description: 'Crispy sweet potato fries',
    price: 5.99,
    category: 'sides',
    available: true,
  },
  {
    id: '16',
    name: 'Iced Tea',
    description: 'Freshly brewed iced tea',
    price: 2.99,
    category: 'drinks',
    available: true,
  },
  {
    id: '17',
    name: 'Cheesecake',
    description: 'New York style cheesecake',
    price: 7.99,
    category: 'desserts',
    available: true,
  },
];

export async function getMenuItems(category?: string): Promise<MenuItem[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (category) {
    return menuItems.filter(item => item.category === category);
  }
  return menuItems;
}

export async function getMenuItem(id: string): Promise<MenuItem | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return menuItems.find(item => item.id === id) || null;
}

export async function getCategories(): Promise<MenuCategory[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const categoryMap = new Map<string, number>();
  menuItems.forEach(item => {
    const count = categoryMap.get(item.category) || 0;
    categoryMap.set(item.category, count + 1);
  });
  
  return Array.from(categoryMap.entries()).map(([name, count]) => ({
    id: name,
    name: name.charAt(0).toUpperCase() + name.slice(1),
    count,
  }));
}

export async function getFeaturedItems(): Promise<MenuItem[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return menuItems.slice(0, 4);
}
