/**
 * Unit tests for the Card component and its sub-components.
 * Verifies rendering, padding variants, hover effect, and Card header/footer sub-components.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardFooter } from '../../../src/components/ui/Card';

describe('Card', () => {
  it('renders children content', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('applies medium padding by default', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('p-4');
  });

  it('applies no padding when padding is none', () => {
    const { container } = render(<Card padding="none">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).not.toContain('p-4');
    expect(card.className).not.toContain('p-3');
    expect(card.className).not.toContain('p-6');
  });

  it('applies small padding when specified', () => {
    const { container } = render(<Card padding="sm">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('p-3');
  });

  it('applies large padding when specified', () => {
    const { container } = render(<Card padding="lg">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('p-6');
  });

  it('applies hover shadow class when hoverable is true', () => {
    const { container } = render(<Card hoverable>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('hover:shadow-md');
  });

  it('does not apply hover class by default', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).not.toContain('hover:shadow-md');
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="my-card">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('my-card');
  });

  it('has correct base styling classes', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('bg-surface');
    expect(card.className).toContain('rounded-xl');
    expect(card.className).toContain('shadow-sm');
  });

  it('passes through additional HTML attributes', () => {
    render(<Card data-testid="custom-card">Content</Card>);
    expect(screen.getByTestId('custom-card')).toBeInTheDocument();
  });
});

describe('CardHeader', () => {
  it('renders children content', () => {
    render(<CardHeader>Header Text</CardHeader>);
    expect(screen.getByText('Header Text')).toBeInTheDocument();
  });

  it('applies border-bottom class', () => {
    const { container } = render(<CardHeader>Header</CardHeader>);
    const header = container.firstChild as HTMLElement;
    expect(header.className).toContain('border-b');
  });

  it('applies custom className', () => {
    const { container } = render(<CardHeader className="extra">Header</CardHeader>);
    const header = container.firstChild as HTMLElement;
    expect(header.className).toContain('extra');
  });
});

describe('CardFooter', () => {
  it('renders children content', () => {
    render(<CardFooter>Footer Text</CardFooter>);
    expect(screen.getByText('Footer Text')).toBeInTheDocument();
  });

  it('applies border-top class', () => {
    const { container } = render(<CardFooter>Footer</CardFooter>);
    const footer = container.firstChild as HTMLElement;
    expect(footer.className).toContain('border-t');
  });

  it('applies custom className', () => {
    const { container } = render(<CardFooter className="extra">Footer</CardFooter>);
    const footer = container.firstChild as HTMLElement;
    expect(footer.className).toContain('extra');
  });
});
