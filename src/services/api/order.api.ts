/**
 * Order API service module.
 * Handles order creation, retrieval, and order history operations.
 * Uses mock implementations for frontend development.
 */

import type {
  CreateOrderRequest,
  OrderResponse,
  ApiResponse,
} from '@/types/api.types';
import { delay, generateId } from '@/utils/helpers';

/** In-memory mock order store for development */
const mockOrders: OrderResponse[] = [];

/**
 * Creates a new order.
 * @param orderData - Order details including items and contact info
 * @returns Promise resolving to the created order
 */
export async function createOrder(orderData: CreateOrderRequest): Promise<ApiResponse<OrderResponse>> {
  await delay(1200);

  const orderId = generateId();
  const orderNumber = `BRG-${Date.now().toString(36).toUpperCase()}`;

  const order: OrderResponse = {
    id: orderId,
    orderNumber,
    status: 'confirmed',
    items: orderData.items.map((item, index) => ({
      id: `oi-${index + 1}`,
      menuItemId: item.menuItemId,
      name: `Item ${item.menuItemId}`,
      price: 0,
      quantity: item.quantity,
      subtotal: 0,
      customizations: item.customizations,
      specialInstructions: item.specialInstructions,
    })),
    subtotal: 0,
    tax: 0,
    total: 0,
    contactInfo: orderData.contactInfo,
    pickupTime: orderData.pickupTime || new Date(Date.now() + 30 * 60000).toISOString(),
    specialInstructions: orderData.specialInstructions,
    paymentMethod: orderData.paymentMethod,
    createdAt: new Date().toISOString(),
    estimatedReadyTime: new Date(Date.now() + 25 * 60000).toISOString(),
  };

  mockOrders.push(order);

  return {
    data: order,
    success: true,
    message: 'Order placed successfully',
    timestamp: new Date().toISOString(),
  };
}

/**
 * Retrieves an order by ID.
 * @param orderId - The order ID to retrieve
 * @returns Promise resolving to the order details
 */
export async function getOrderById(orderId: string): Promise<ApiResponse<OrderResponse>> {
  await delay(500);

  const order = mockOrders.find((o) => o.id === orderId);

  if (!order) {
    throw {
      code: 'NOT_FOUND',
      message: 'Order not found',
      statusCode: 404,
    };
  }

  return {
    data: order,
    success: true,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Retrieves the order history for the current user.
 * @returns Promise resolving to array of past orders
 */
export async function getOrderHistory(): Promise<ApiResponse<OrderResponse[]>> {
  await delay(600);

  return {
    data: [...mockOrders].reverse(),
    success: true,
    timestamp: new Date().toISOString(),
  };
}
