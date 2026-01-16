import { OrderStatus, type Order, type CartItem } from '../types';

// Mock orders storage
const orders: Map<string, Order> = new Map();

export interface CreateOrderData {
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  deliveryAddress?: string;
  specialInstructions?: string;
}

export async function createOrder(data: CreateOrderData): Promise<Order> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const order: Order = {
    id: `order_${Date.now()}`,
    userId: data.userId,
    items: data.items,
    subtotal: data.subtotal,
    tax: data.tax,
    total: data.total,
    status: OrderStatus.Confirmed,
    createdAt: new Date(),
    deliveryAddress: data.deliveryAddress,
    specialInstructions: data.specialInstructions,
  };
  
  orders.set(order.id, order);
  return order;
}

export async function getOrder(orderId: string): Promise<Order | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return orders.get(orderId) || null;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return Array.from(orders.values())
    .filter(order => order.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function updateOrderStatus(
  orderId: string,
  status: Order['status']
): Promise<Order | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const order = orders.get(orderId);
  if (order) {
    order.status = status;
    orders.set(orderId, order);
    return order;
  }
  return null;
}
