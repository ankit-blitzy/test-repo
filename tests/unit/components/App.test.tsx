import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../../../src/App';

describe('App', () => {
  it('renders the header with restaurant name', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Burger Restaurant');
  });

  it('renders welcome message', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Welcome to Our Restaurant');
  });

  it('renders description text', () => {
    render(<App />);
    expect(screen.getByText(/Order delicious burgers online or book a table for dine-in/i)).toBeInTheDocument();
  });

  it('has correct layout structure', () => {
    render(<App />);
    expect(document.querySelector('header')).toBeInTheDocument();
    expect(document.querySelector('main')).toBeInTheDocument();
  });
});
