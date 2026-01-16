/**
 * @fileoverview Order service module for the Burger House restaurant application.
 * Handles order creation, tracking, and management with mock API functions.
 * Provides simulated async operations for creating orders from cart items,
 * fetching order history by user ID, getting order status, and cancelling orders.
 *
 * @module services/order
 * @version 1.0.0
 */

import { Order, OrderStatus, CartItem, MenuCategory } from '../types';

// =============================================================================
// CONSTANTS
// =============================================================================

/** Tax rate for order calculations (8.25%) */
const TAX_RATE = 0.0825;

/** Minimum delivery time in minutes */
const MIN_DELIVERY_TIME_MINUTES = 30;

/** Maximum delivery time in minutes */
const MAX_DELIVERY_TIME_MINUTES = 45;

/** Minimum simulated network delay in milliseconds */
const MIN_NETWORK_DELAY_MS = 300;

/** Maximum simulated network delay in milliseconds */
const MAX_NETWORK_DELAY_MS = 800;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Generates a random network delay between MIN and MAX values.
 * @returns Random delay in milliseconds
 */
function getRandomDelay(): number {
  return Math.floor(
    Math.random() * (MAX_NETWORK_DELAY_MS - MIN_NETWORK_DELAY_MS + 1) + MIN_NETWORK_DELAY_MS
  );
}

/**
 * Creates a promise that resolves after a simulated network delay.
 * @returns Promise that resolves after random delay
 */
function simulateNetworkDelay(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, getRandomDelay());
  });
}

/**
 * Generates a unique order ID using timestamp and random string.
 * Format: 'order-{timestamp}-{randomString}'
 * @returns Unique order ID string
 */
function generateOrderId(): string {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `order-${timestamp}-${randomPart}`;
}

/**
 * Calculates the estimated delivery time (30-45 minutes from now).
 * @returns Date object representing estimated delivery time
 */
function calculateEstimatedDelivery(): Date {
  const now = new Date();
  const deliveryMinutes =
    MIN_DELIVERY_TIME_MINUTES +
    Math.floor(Math.random() * (MAX_DELIVERY_TIME_MINUTES - MIN_DELIVERY_TIME_MINUTES + 1));
  return new Date(now.getTime() + deliveryMinutes * 60 * 1000);
}

/**
 * Calculates tax amount based on subtotal.
 * @param subtotal - The subtotal amount before tax
 * @returns Tax amount rounded to 2 decimal places
 */
function calculateTax(subtotal: number): number {
  return Math.round(subtotal * TAX_RATE * 100) / 100;
}

// =============================================================================
// MOCK DATA STORAGE
// =============================================================================

/**
 * Mock orders array simulating database storage.
 * Initialized with sample orders for demo purposes.
 */
const mockOrders: Order[] = [
  {
    id: 'order-1704067200000-abc123',
    userId: 'user-1',
    items: [
      {
        item: {
          id: 'burger-1',
          name: 'Classic Burger',
          description: 'Juicy beef patty with lettuce, tomato, and our special sauce',
          price: 12.99,
          image: '/images/classic-burger.jpg',
          category: MenuCategory.Burgers,
          isAvailable: true,
        },
        quantity: 2,
      },
      {
        item: {
          id: 'side-1',
          name: 'French Fries',
          description: 'Crispy golden fries with sea salt',
          price: 4.99,
          image: '/images/fries.jpg',
          category: MenuCategory.Sides,
          isAvailable: true,
        },
        quantity: 1,
      },
    ],
    status: OrderStatus.Delivered,
    subtotal: 30.97,
    tax: 2.55,
    total: 33.52,
    createdAt: new Date('2024-01-01T12:00:00Z'),
    estimatedDelivery: new Date('2024-01-01T12:35:00Z'),
    deliveryAddress: '123 Main Street, Apt 4B',
    specialInstructions: 'Extra ketchup please',
  },
  {
    id: 'order-1704153600000-def456',
    userId: 'user-1',
    items: [
      {
        item: {
          id: 'burger-2',
          name: 'Bacon Deluxe',
          description: 'Double beef patties with crispy bacon and cheddar cheese',
          price: 15.99,
          image: '/images/bacon-deluxe.jpg',
          category: MenuCategory.Burgers,
          isAvailable: true,
        },
        quantity: 1,
      },
      {
        item: {
          id: 'drink-1',
          name: 'Chocolate Milkshake',
          description: 'Creamy chocolate milkshake with whipped cream',
          price: 5.99,
          image: '/images/chocolate-shake.jpg',
          category: MenuCategory.Drinks,
          isAvailable: true,
        },
        quantity: 2,
      },
    ],
    status: OrderStatus.Confirmed,
    subtotal: 27.97,
    tax: 2.31,
    total: 30.28,
    createdAt: new Date('2024-01-02T14:00:00Z'),
    estimatedDelivery: new Date('2024-01-02T14:40:00Z'),
    deliveryAddress: '456 Oak Avenue',
  },
  {
    id: 'order-1704240000000-ghi789',
    userId: 'user-2',
    items: [
      {
        item: {
          id: 'special-1',
          name: 'BBQ Brisket Burger',
          description: "Limited time: Smoked brisket with tangy BBQ sauce",
          price: 18.99,
          image: '/images/bbq-brisket.jpg',
          category: MenuCategory.Specials,
          isAvailable: true,
        },
        quantity: 1,
      },
    ],
    status: OrderStatus.Preparing,
    subtotal: 18.99,
    tax: 1.57,
    total: 20.56,
    createdAt: new Date('2024-01-03T18:00:00Z'),
    estimatedDelivery: new Date('2024-01-03T18:45:00Z'),
  },
];

// =============================================================================
// SERVICE FUNCTIONS
// =============================================================================

/**
 * Creates a new order with the provided cart items and details.
 * Generates unique ID, calculates tax, sets initial status to 'pending',
 * and adds order to mock storage.
 *
 * @param userId - ID of the user placing the order
 * @param items - Array of cart items to include in the order
 * @param total - Total price of the order (subtotal before tax)
 * @param deliveryAddress - Optional delivery address for the order
 * @param specialInstructions - Optional special instructions from the customer
 * @returns Promise resolving to the created Order object
 *
 * @example
 * ```typescript
 * const order = await createOrder(
 *   'user-123',
 *   cartItems,
 *   45.99,
 *   '123 Main St',
 *   'No onions please'
 * );
 * ```
 */
export async function createOrder(
  userId: string,
  items: CartItem[],
  total: number,
  deliveryAddress?: string,
  specialInstructions?: string
): Promise<Order> {
  await simulateNetworkDelay();

  // Validate inputs
  if (!userId || userId.trim() === '') {
    throw new Error('User ID is required to create an order');
  }

  if (!items || items.length === 0) {
    throw new Error('Order must contain at least one item');
  }

  if (total <= 0) {
    throw new Error('Order total must be greater than zero');
  }

  // Calculate subtotal and tax
  const subtotal = total;
  const tax = calculateTax(subtotal);
  const finalTotal = Math.round((subtotal + tax) * 100) / 100;

  // Create the new order
  const newOrder: Order = {
    id: generateOrderId(),
    userId: userId.trim(),
    items: [...items], // Create a copy of items array
    status: OrderStatus.Pending,
    subtotal,
    tax,
    total: finalTotal,
    createdAt: new Date(),
    estimatedDelivery: calculateEstimatedDelivery(),
    deliveryAddress: deliveryAddress?.trim(),
    specialInstructions: specialInstructions?.trim(),
  };

  // Add to mock storage
  mockOrders.push(newOrder);

  return newOrder;
}

/**
 * Retrieves all orders for a specific user, sorted by creation date (newest first).
 *
 * @param userId - ID of the user whose orders to fetch
 * @returns Promise resolving to array of Order objects for the user
 *
 * @example
 * ```typescript
 * const userOrders = await getOrdersByUser('user-123');
 * console.log(`User has ${userOrders.length} orders`);
 * ```
 */
export async function getOrdersByUser(userId: string): Promise<Order[]> {
  await simulateNetworkDelay();

  if (!userId || userId.trim() === '') {
    return [];
  }

  // Filter orders by user ID and sort by creation date (newest first)
  const userOrders = mockOrders
    .filter((order) => order.userId === userId.trim())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Return copies to prevent external mutations
  return userOrders.map((order) => ({ ...order, items: [...order.items] }));
}

/**
 * Fetches a single order by its unique ID.
 *
 * @param orderId - Unique identifier of the order to fetch
 * @returns Promise resolving to the Order object, or null if not found
 *
 * @example
 * ```typescript
 * const order = await getOrderById('order-1704067200000-abc123');
 * if (order) {
 *   console.log(`Order status: ${order.status}`);
 * }
 * ```
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  await simulateNetworkDelay();

  if (!orderId || orderId.trim() === '') {
    return null;
  }

  const order = mockOrders.find((o) => o.id === orderId.trim());

  if (!order) {
    return null;
  }

  // Return a copy to prevent external mutations
  return { ...order, items: [...order.items] };
}

/**
 * Updates the status of an existing order.
 * Used for admin/demo purposes to simulate order progression.
 *
 * @param orderId - ID of the order to update
 * @param status - New status to set for the order
 * @returns Promise resolving to the updated Order object, or null if not found
 *
 * @example
 * ```typescript
 * const updatedOrder = await updateOrderStatus(
 *   'order-123',
 *   OrderStatus.Preparing
 * );
 * ```
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<Order | null> {
  await simulateNetworkDelay();

  if (!orderId || orderId.trim() === '') {
    return null;
  }

  const orderIndex = mockOrders.findIndex((o) => o.id === orderId.trim());

  if (orderIndex === -1) {
    return null;
  }

  // Update the order status
  mockOrders[orderIndex] = {
    ...mockOrders[orderIndex],
    status,
  };

  // Return a copy of the updated order
  return {
    ...mockOrders[orderIndex],
    items: [...mockOrders[orderIndex].items],
  };
}

/**
 * Cancels an order if it hasn't started preparation or been delivered.
 * Orders can only be cancelled if their status is 'pending' or 'confirmed'.
 *
 * @param orderId - ID of the order to cancel
 * @returns Promise resolving to true if cancelled successfully, false otherwise
 *
 * @example
 * ```typescript
 * const cancelled = await cancelOrder('order-123');
 * if (cancelled) {
 *   console.log('Order cancelled successfully');
 * } else {
 *   console.log('Order cannot be cancelled');
 * }
 * ```
 */
export async function cancelOrder(orderId: string): Promise<boolean> {
  await simulateNetworkDelay();

  if (!orderId || orderId.trim() === '') {
    return false;
  }

  const orderIndex = mockOrders.findIndex((o) => o.id === orderId.trim());

  if (orderIndex === -1) {
    return false;
  }

  const order = mockOrders[orderIndex];

  // Check if order can be cancelled
  // Orders that are preparing, ready, delivered, or already cancelled cannot be cancelled
  const nonCancellableStatuses: OrderStatus[] = [
    OrderStatus.Preparing,
    OrderStatus.Ready,
    OrderStatus.Delivered,
    OrderStatus.Cancelled,
  ];

  if (nonCancellableStatuses.includes(order.status)) {
    return false;
  }

  // Cancel the order
  mockOrders[orderIndex] = {
    ...order,
    status: OrderStatus.Cancelled,
  };

  return true;
}
