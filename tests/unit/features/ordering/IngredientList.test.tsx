/**
 * IngredientList Component Unit Tests
 * 
 * Tests for the IngredientList component that displays ingredient information
 * for menu items, including preview mode and full mode rendering.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { 
  IngredientList, 
  IngredientTag, 
  IngredientsCount 
} from '@/features/ordering/components/IngredientList';

describe('IngredientList', () => {
  const mockIngredients = [
    'Quality beef patty',
    'Fresh lettuce',
    'Tomato slices',
    'Cheddar cheese',
    'Soft burger bun',
  ];

  describe('Full Mode (default)', () => {
    it('renders all ingredients when preview is false', () => {
      render(<IngredientList ingredients={mockIngredients} />);
      
      mockIngredients.forEach((ingredient) => {
        expect(screen.getByText(ingredient)).toBeInTheDocument();
      });
    });

    it('renders the "Ingredients" heading in full mode', () => {
      render(<IngredientList ingredients={mockIngredients} />);
      
      expect(screen.getByText('Ingredients')).toBeInTheDocument();
    });

    it('renders ingredients as a list with proper role', () => {
      render(<IngredientList ingredients={mockIngredients} />);
      
      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
      
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(mockIngredients.length);
    });

    it('applies custom className', () => {
      const { container } = render(
        <IngredientList ingredients={mockIngredients} className="custom-class" />
      );
      
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Preview Mode', () => {
    it('shows only first 3 ingredients in preview mode', () => {
      render(<IngredientList ingredients={mockIngredients} preview />);
      
      // First 3 should be in the text
      expect(screen.getByText(/Quality beef patty/)).toBeInTheDocument();
      expect(screen.getByText(/Fresh lettuce/)).toBeInTheDocument();
      expect(screen.getByText(/Tomato slices/)).toBeInTheDocument();
    });

    it('shows "+N more" indicator when there are more than 3 ingredients', () => {
      render(<IngredientList ingredients={mockIngredients} preview />);
      
      // Should show +2 more (5 - 3 = 2)
      expect(screen.getByText('+2 more')).toBeInTheDocument();
    });

    it('does not show "+more" when there are 3 or fewer ingredients', () => {
      const shortIngredients = ['Beef patty', 'Lettuce', 'Cheese'];
      render(<IngredientList ingredients={shortIngredients} preview />);
      
      expect(screen.queryByText(/\+\d+ more/)).not.toBeInTheDocument();
    });

    it('shows all ingredients when there are exactly 3', () => {
      const threeIngredients = ['Beef patty', 'Lettuce', 'Cheese'];
      render(<IngredientList ingredients={threeIngredients} preview />);
      
      threeIngredients.forEach((ingredient) => {
        expect(screen.getByText(new RegExp(ingredient))).toBeInTheDocument();
      });
    });

    it('renders with food emoji icon', () => {
      render(<IngredientList ingredients={mockIngredients} preview />);
      
      expect(screen.getByText('🥬')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('shows "No ingredients listed" when ingredients array is empty', () => {
      render(<IngredientList ingredients={[]} />);
      
      expect(screen.getByText('No ingredients listed')).toBeInTheDocument();
    });

    it('applies aria-label for accessibility on empty state', () => {
      render(<IngredientList ingredients={[]} />);
      
      expect(screen.getByLabelText('No ingredients listed')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label for full ingredient list', () => {
      render(<IngredientList ingredients={mockIngredients} />);
      
      const list = screen.getByRole('list');
      expect(list).toHaveAttribute('aria-labelledby', 'ingredients-heading');
    });

    it('has proper aria-label for preview mode', () => {
      render(<IngredientList ingredients={mockIngredients} preview />);
      
      const container = screen.getByLabelText(`Ingredients: ${mockIngredients.join(', ')}`);
      expect(container).toBeInTheDocument();
    });
  });
});

describe('IngredientTag', () => {
  it('renders the ingredient text', () => {
    render(<IngredientTag ingredient="Fresh lettuce" />);
    
    expect(screen.getByText('Fresh lettuce')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<IngredientTag ingredient="Test" className="custom-class" />);
    
    expect(screen.getByText('Test')).toHaveClass('custom-class');
  });

  it('has proper styling classes', () => {
    render(<IngredientTag ingredient="Cheese" />);
    
    const tag = screen.getByText('Cheese');
    expect(tag).toHaveClass('bg-amber-100');
    expect(tag).toHaveClass('text-amber-800');
    expect(tag).toHaveClass('rounded-full');
  });
});

describe('IngredientsCount', () => {
  it('renders singular "ingredient" for count of 1', () => {
    render(<IngredientsCount count={1} />);
    
    expect(screen.getByText('1 ingredient')).toBeInTheDocument();
  });

  it('renders plural "ingredients" for count greater than 1', () => {
    render(<IngredientsCount count={5} />);
    
    expect(screen.getByText('5 ingredients')).toBeInTheDocument();
  });

  it('has proper aria-label', () => {
    render(<IngredientsCount count={3} />);
    
    expect(screen.getByLabelText('3 ingredients')).toBeInTheDocument();
  });

  it('shows emoji icon', () => {
    render(<IngredientsCount count={2} />);
    
    expect(screen.getByText('🥬')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<IngredientsCount count={2} className="custom-class" />);
    
    expect(screen.getByLabelText('2 ingredients')).toHaveClass('custom-class');
  });
});
