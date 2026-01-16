import { forwardRef, type ReactNode, type HTMLAttributes } from 'react';

/**
 * Props interface for the Card component.
 * Extends standard HTML div attributes for maximum flexibility.
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Content to be rendered inside the card */
  children: ReactNode;
  /** Optional additional CSS classes to merge with default styles */
  className?: string;
  /** Visual variant of the card */
  variant?: 'default' | 'elevated' | 'bordered';
  /** Whether to include padding (default: true) */
  noPadding?: boolean;
  /** Whether to enable hover shadow effect (default: true) */
  hoverable?: boolean;
}

/**
 * Props interface for CardHeader component.
 */
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

/**
 * Props interface for CardContent component.
 */
export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

/**
 * Props interface for CardFooter component.
 */
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

/**
 * Helper function to merge class names.
 * Filters out falsy values and joins with space.
 * 
 * @param classes - Array of class name strings or falsy values
 * @returns Merged class name string
 */
const mergeClassNames = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Card component - A content container with shadow, padding, and rounded corners.
 * Provides consistent styling for content blocks throughout the application
 * including menu items, order summaries, and booking details.
 * 
 * Uses Tailwind CSS with white background and subtle shadow for depth.
 * Supports ref forwarding for advanced use cases.
 * 
 * @example
 * // Basic usage
 * <Card>
 *   <p>Card content here</p>
 * </Card>
 * 
 * @example
 * // With custom className
 * <Card className="max-w-md mx-auto">
 *   <p>Centered card</p>
 * </Card>
 * 
 * @example
 * // With variant and no hover effect
 * <Card variant="bordered" hoverable={false}>
 *   <p>Static bordered card</p>
 * </Card>
 * 
 * @example
 * // With sub-components
 * <Card>
 *   <CardHeader>Title</CardHeader>
 *   <CardContent>Main content</CardContent>
 *   <CardFooter>Actions</CardFooter>
 * </Card>
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className,
      variant = 'default',
      noPadding = false,
      hoverable = true,
      ...props
    },
    ref
  ) => {
    // Base styles: white background, rounded corners
    const baseStyles = 'bg-white rounded-lg overflow-hidden';

    // Padding styles (default: p-6 for consistent spacing)
    const paddingStyles = noPadding ? '' : 'p-6';

    // Variant-specific styles for different visual appearances
    const variantStyles: Record<string, string> = {
      default: 'shadow-md',
      elevated: 'shadow-xl',
      bordered: 'border border-gray-200 shadow-sm',
    };

    // Hover effect styles for interactive cards
    const hoverStyles = hoverable ? 'hover:shadow-lg transition-shadow duration-200' : '';

    // Merge all styles together with any custom className
    const combinedClassName = mergeClassNames(
      baseStyles,
      paddingStyles,
      variantStyles[variant],
      hoverStyles,
      className
    );

    return (
      <div ref={ref} className={combinedClassName} {...props}>
        {children}
      </div>
    );
  }
);

// Display name for React DevTools debugging
Card.displayName = 'Card';

/**
 * CardHeader component - Header section for Card with title styling.
 * Typically used for card titles, headings, or top-aligned content.
 * 
 * @example
 * <CardHeader>
 *   <h3 className="text-lg font-semibold">Card Title</h3>
 * </CardHeader>
 */
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...props }, ref) => {
    const combinedClassName = mergeClassNames(
      'px-6 py-4 border-b border-gray-100',
      className
    );

    return (
      <div ref={ref} className={combinedClassName} {...props}>
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

/**
 * CardContent component - Main content area for Card.
 * Provides consistent padding for the primary content section.
 * 
 * @example
 * <CardContent>
 *   <p>This is the main content of the card.</p>
 * </CardContent>
 */
export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className, ...props }, ref) => {
    const combinedClassName = mergeClassNames('px-6 py-4', className);

    return (
      <div ref={ref} className={combinedClassName} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

/**
 * CardFooter component - Footer section for Card.
 * Typically used for action buttons, links, or bottom-aligned content.
 * Includes a top border for visual separation from content.
 * 
 * @example
 * <CardFooter>
 *   <Button variant="primary">Save</Button>
 *   <Button variant="outline">Cancel</Button>
 * </CardFooter>
 */
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, ...props }, ref) => {
    const combinedClassName = mergeClassNames(
      'px-6 py-4 border-t border-gray-100 bg-gray-50',
      className
    );

    return (
      <div ref={ref} className={combinedClassName} {...props}>
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';
