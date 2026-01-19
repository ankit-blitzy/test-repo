/**
 * Validation Schemas
 * Zod schemas for data validation throughout the application
 */

import { z } from 'zod';

/**
 * Menu item validation schema
 */
export const menuItemSchema = z.object({
  id: z.string().min(1),
  categoryId: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  price: z.number().positive(),
  imageUrl: z.string().url().optional(),
  isAvailable: z.boolean(),
  ingredients: z.array(z.string().min(1).max(100)).optional(),
  updatedAt: z.coerce.date(),
});

/**
 * Category validation schema
 */
export const categorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(50),
  description: z.string().max(200),
  imageUrl: z.string().url().optional(),
  displayOrder: z.number().int().positive(),
  isActive: z.boolean(),
});

/**
 * Cart item validation schema
 */
export const cartItemSchema = z.object({
  id: z.string().min(1),
  menuItemId: z.string().min(1),
  name: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().positive().max(99),
  specialInstructions: z.string().max(200).optional(),
  addedAt: z.coerce.date(),
});

/**
 * Login request validation schema
 */
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

/**
 * Registration request validation schema
 */
export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  phone: z
    .string()
    .regex(/^\+?[\d\s-()]+$/, 'Please enter a valid phone number')
    .optional(),
});

/**
 * Reservation request validation schema
 */
export const reservationSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please select a valid date'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Please select a valid time'),
  partySize: z.number().int().min(1).max(20, 'Maximum party size is 20'),
  specialRequests: z.string().max(500).optional(),
  contactName: z.string().min(1, 'Name is required').max(100),
  contactPhone: z.string().regex(/^\+?[\d\s-()]+$/, 'Please enter a valid phone number'),
  contactEmail: z.string().email('Please enter a valid email address'),
});

/**
 * Order creation validation schema
 */
export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        menuItemId: z.string().min(1),
        quantity: z.number().int().positive().max(99),
        specialInstructions: z.string().max(200).optional(),
      })
    )
    .min(1, 'Order must contain at least one item'),
  orderType: z.enum(['pickup', 'dine-in']),
  tableNumber: z.number().int().positive().optional(),
  specialRequests: z.string().max(500).optional(),
});

/**
 * Validate data against a schema
 */
export function validate<T>(
  schema: z.ZodType<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

/**
 * Type exports
 */
export type MenuItemInput = z.infer<typeof menuItemSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type CartItemInput = z.infer<typeof cartItemSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ReservationInput = z.infer<typeof reservationSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
