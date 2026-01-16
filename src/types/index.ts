// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

// Menu Types
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  count: number;
}

// Cart Types
export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  createdAt: string;
  deliveryAddress?: string;
  specialInstructions?: string;
}

// Booking Types
export interface Booking {
  id: string;
  userId: string;
  date: string;
  time: string;
  guestCount: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}
