/**
 * Zod validation schemas for form validation across the application.
 * Provides reusable, composable validation rules with descriptive error messages.
 */

import { z } from 'zod';
import { VALIDATION, MIN_PARTY_SIZE, MAX_PARTY_SIZE } from './constants';

/** Email validation schema */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(VALIDATION.EMAIL_MAX_LENGTH, `Email must be less than ${VALIDATION.EMAIL_MAX_LENGTH} characters`);

/** Password validation schema */
export const passwordSchema = z
  .string()
  .min(VALIDATION.MIN_PASSWORD_LENGTH, `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`)
  .max(VALIDATION.MAX_PASSWORD_LENGTH, `Password must be less than ${VALIDATION.MAX_PASSWORD_LENGTH} characters`)
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

/** Name field validation schema */
export const nameSchema = z
  .string()
  .min(VALIDATION.MIN_NAME_LENGTH, 'This field is required')
  .max(VALIDATION.MAX_NAME_LENGTH, `Must be less than ${VALIDATION.MAX_NAME_LENGTH} characters`)
  .trim();

/** Phone number validation schema */
export const phoneSchema = z
  .string()
  .regex(VALIDATION.PHONE_REGEX, 'Please enter a valid phone number')
  .or(z.literal(''));

/** Login form validation schema */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

/** Registration form validation schema */
export const registerSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    phone: phoneSchema.optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/** Contact information validation schema */
export const contactInfoSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(VALIDATION.PHONE_REGEX, 'Please enter a valid phone number'),
});

/** Checkout form validation schema */
export const checkoutSchema = z.object({
  contactInfo: contactInfoSchema,
  pickupTime: z.string().min(1, 'Please select a pickup time'),
  specialInstructions: z.string().max(500, 'Special instructions must be less than 500 characters').optional(),
  paymentMethod: z.enum(['credit_card', 'debit_card', 'cash'], {
    required_error: 'Please select a payment method',
  }),
});

/** Booking form validation schema */
export const bookingSchema = z.object({
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  partySize: z
    .number()
    .min(MIN_PARTY_SIZE, `Party size must be at least ${MIN_PARTY_SIZE}`)
    .max(MAX_PARTY_SIZE, `Party size cannot exceed ${MAX_PARTY_SIZE}`),
  contactInfo: contactInfoSchema,
  specialRequests: z.string().max(500, 'Special requests must be less than 500 characters').optional(),
});

/** Profile update validation schema */
export const profileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema.optional(),
});

/** Inferred types from schemas for form use */
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type BookingFormData = z.infer<typeof bookingSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type ContactInfoData = z.infer<typeof contactInfoSchema>;
