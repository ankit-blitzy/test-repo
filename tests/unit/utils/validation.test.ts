/**
 * Unit tests for validation schemas.
 * Tests all Zod schemas used for form validation throughout the application.
 */

import { describe, it, expect } from 'vitest';
import {
  emailSchema,
  passwordSchema,
  nameSchema,
  phoneSchema,
  loginSchema,
  registerSchema,
  contactInfoSchema,
  checkoutSchema,
  bookingSchema,
  profileSchema,
} from '../../../src/utils/validation';

describe('emailSchema', () => {
  it('accepts a valid email address', () => {
    const result = emailSchema.safeParse('user@example.com');
    expect(result.success).toBe(true);
  });

  it('rejects an empty string', () => {
    const result = emailSchema.safeParse('');
    expect(result.success).toBe(false);
  });

  it('rejects a string without @ symbol', () => {
    const result = emailSchema.safeParse('not-an-email');
    expect(result.success).toBe(false);
  });

  it('rejects an email exceeding maximum length', () => {
    const longEmail = `${'a'.repeat(250)}@b.co`;
    const result = emailSchema.safeParse(longEmail);
    expect(result.success).toBe(false);
  });
});

describe('passwordSchema', () => {
  it('accepts a valid password with uppercase, lowercase, and digit', () => {
    const result = passwordSchema.safeParse('Password1');
    expect(result.success).toBe(true);
  });

  it('rejects a password shorter than minimum length', () => {
    const result = passwordSchema.safeParse('Pa1');
    expect(result.success).toBe(false);
  });

  it('rejects a password without uppercase letters', () => {
    const result = passwordSchema.safeParse('password1');
    expect(result.success).toBe(false);
  });

  it('rejects a password without lowercase letters', () => {
    const result = passwordSchema.safeParse('PASSWORD1');
    expect(result.success).toBe(false);
  });

  it('rejects a password without digits', () => {
    const result = passwordSchema.safeParse('Passwordd');
    expect(result.success).toBe(false);
  });
});

describe('nameSchema', () => {
  it('accepts a valid name', () => {
    const result = nameSchema.safeParse('John');
    expect(result.success).toBe(true);
  });

  it('rejects an empty name', () => {
    const result = nameSchema.safeParse('');
    expect(result.success).toBe(false);
  });

  it('rejects a name exceeding maximum length', () => {
    const longName = 'A'.repeat(101);
    const result = nameSchema.safeParse(longName);
    expect(result.success).toBe(false);
  });
});

describe('phoneSchema', () => {
  it('accepts a valid phone number', () => {
    const result = phoneSchema.safeParse('555-0100');
    expect(result.success).toBe(true);
  });

  it('accepts an empty string', () => {
    const result = phoneSchema.safeParse('');
    expect(result.success).toBe(true);
  });

  it('accepts a phone number with country code', () => {
    const result = phoneSchema.safeParse('+1 (555) 012-3456');
    expect(result.success).toBe(true);
  });

  it('rejects a string of letters', () => {
    const result = phoneSchema.safeParse('not-a-phone');
    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('accepts valid login data', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'Password1',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing email', () => {
    const result = loginSchema.safeParse({
      email: '',
      password: 'Password1',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  const validData = {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    password: 'Password1',
    confirmPassword: 'Password1',
  };

  it('accepts valid registration data', () => {
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({
      ...validData,
      confirmPassword: 'Different1',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing first name', () => {
    const result = registerSchema.safeParse({
      ...validData,
      firstName: '',
    });
    expect(result.success).toBe(false);
  });

  it('accepts optional phone field', () => {
    const result = registerSchema.safeParse({
      ...validData,
      phone: '555-0199',
    });
    expect(result.success).toBe(true);
  });
});

describe('contactInfoSchema', () => {
  it('accepts valid contact info', () => {
    const result = contactInfoSchema.safeParse({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      phone: '555-0100',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing phone', () => {
    const result = contactInfoSchema.safeParse({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      phone: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('checkoutSchema', () => {
  const validData = {
    contactInfo: {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      phone: '555-0100',
    },
    pickupTime: '12:30',
    paymentMethod: 'credit_card' as const,
  };

  it('accepts valid checkout data', () => {
    const result = checkoutSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects missing pickup time', () => {
    const result = checkoutSchema.safeParse({
      ...validData,
      pickupTime: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid payment method', () => {
    const result = checkoutSchema.safeParse({
      ...validData,
      paymentMethod: 'bitcoin',
    });
    expect(result.success).toBe(false);
  });

  it('accepts optional special instructions', () => {
    const result = checkoutSchema.safeParse({
      ...validData,
      specialInstructions: 'Extra napkins please',
    });
    expect(result.success).toBe(true);
  });
});

describe('bookingSchema', () => {
  const validData = {
    date: '2025-06-15',
    time: '18:00',
    partySize: 4,
    contactInfo: {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      phone: '555-0100',
    },
  };

  it('accepts valid booking data', () => {
    const result = bookingSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects party size below minimum', () => {
    const result = bookingSchema.safeParse({
      ...validData,
      partySize: 0,
    });
    expect(result.success).toBe(false);
  });

  it('rejects party size above maximum', () => {
    const result = bookingSchema.safeParse({
      ...validData,
      partySize: 25,
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing date', () => {
    const result = bookingSchema.safeParse({
      ...validData,
      date: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing time', () => {
    const result = bookingSchema.safeParse({
      ...validData,
      time: '',
    });
    expect(result.success).toBe(false);
  });

  it('accepts optional special requests', () => {
    const result = bookingSchema.safeParse({
      ...validData,
      specialRequests: 'Window seat please',
    });
    expect(result.success).toBe(true);
  });
});

describe('profileSchema', () => {
  it('accepts valid profile data', () => {
    const result = profileSchema.safeParse({
      firstName: 'Jane',
      lastName: 'Doe',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty first name', () => {
    const result = profileSchema.safeParse({
      firstName: '',
      lastName: 'Doe',
    });
    expect(result.success).toBe(false);
  });

  it('accepts optional phone number', () => {
    const result = profileSchema.safeParse({
      firstName: 'Jane',
      lastName: 'Doe',
      phone: '555-0100',
    });
    expect(result.success).toBe(true);
  });
});
