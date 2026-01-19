/**
 * Order Type Definitions
 * Defines interfaces for order management
 */

/**
 * Order status enum
 */
export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled';

/**
 * Order type (pickup or dine-in)
 */
export type OrderType = 'pickup' | 'dine-in';

/**
 * Represents an item within an order
 */
export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
  subtotal: number;
}

/**
 * Represents a complete order
 */
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  orderType: OrderType;
  subtotal: number;
  tax: number;
  total: number;
  estimatedReadyTime?: Date;
  tableNumber?: number;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Order creation request payload
 */
export interface CreateOrderRequest {
  items: Array<{
    menuItemId: string;
    quantity: number;
    specialInstructions?: string;
  }>;
  orderType: OrderType;
  tableNumber?: number;
  specialRequests?: string;
}

/**
 * Order API response
 */
export interface OrderAPIResponse {
  success: boolean;
  data: Order;
  message?: string;
}

/**
 * Order list API response
 */
export interface OrderListAPIResponse {
  success: boolean;
  data: Order[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
}

/**
 * Order summary for display
 */
export interface OrderSummary {
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
}
