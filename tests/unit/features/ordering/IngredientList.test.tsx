/**
 * IngredientList Component Tests
 * Tests for the ingredient list display component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IngredientList } from '@/features/ordering/components/MenuItemCard/IngredientList';

describe('IngredientList', () => {
  it('renders all ingredients when under max display limit', () => {
    const ingredients = ['Beef patty', 'Lettuce', 'Tomato'];
    render(<IngredientList ingredients={ingredients} />);

    expect(screen.getByText('Beef patty')).toBeInTheDocument();
    expect(screen.getByText('Lettuce')).toBeInTheDocument();
    expect(screen.getByText('Tomato')).toBeInTheDocument();
  });

  it('shows overflow indicator when ingredients exceed max display', () => {
    const ingredients = [
      'Beef patty',
      'Lettuce',
      'Tomato',
      'Cheese',
      'Onion',
      'Pickles',
      'Bacon',
      'Sauce',
    ];
    render(<IngredientList ingredients={ingredients} maxDisplay={5} />);

    // First 5 should be visible
    expect(screen.getByText('Beef patty')).toBeInTheDocument();
    expect(screen.getByText('Lettuce')).toBeInTheDocument();
    expect(screen.getByText('Tomato')).toBeInTheDocument();
    expect(screen.getByText('Cheese')).toBeInTheDocument();
    expect(screen.getByText('Onion')).toBeInTheDocument();

    // Should show +3 more
    expect(screen.getByText('+3 more')).toBeInTheDocument();

    // Last items should not be visible
    expect(screen.queryByText('Pickles')).not.toBeInTheDocument();
  });

  it('returns null when ingredients array is empty', () => {
    const { container } = render(<IngredientList ingredients={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when ingredients is undefined', () => {
    // @ts-expect-error Testing undefined case
    const { container } = render(<IngredientList ingredients={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it('uses default max display of 5', () => {
    const ingredients = [
      'Item 1',
      'Item 2',
      'Item 3',
      'Item 4',
      'Item 5',
      'Item 6',
    ];
    render(<IngredientList ingredients={ingredients} />);

    // Default is 5, so 6 items should show +1 more
    expect(screen.getByText('+1 more')).toBeInTheDocument();
  });

  it('renders with proper accessibility attributes', () => {
    const ingredients = ['Beef patty', 'Lettuce'];
    render(<IngredientList ingredients={ingredients} />);

    // Check for region role
    expect(screen.getByRole('region')).toBeInTheDocument();

    // Check for ingredients label
    expect(screen.getByText('Ingredients:')).toBeInTheDocument();

    // Check for list
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('applies correct styling to ingredient pills', () => {
    const ingredients = ['Beef patty'];
    render(<IngredientList ingredients={ingredients} />);

    const pill = screen.getByText('Beef patty');
    expect(pill).toHaveClass('bg-amber-100');
    expect(pill).toHaveClass('text-amber-800');
    expect(pill).toHaveClass('rounded-full');
  });

  it('respects custom maxDisplay prop', () => {
    const ingredients = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
    render(<IngredientList ingredients={ingredients} maxDisplay={2} />);

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('+2 more')).toBeInTheDocument();
    expect(screen.queryByText('Item 3')).not.toBeInTheDocument();
  });
});
