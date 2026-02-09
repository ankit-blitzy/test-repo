/**
 * Unit tests for the Input component.
 * Verifies label rendering, error states, helper text, and accessibility attributes.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../../../src/components/ui/Input';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders a label when label prop is provided', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('generates an id from the label text', () => {
    render(<Input label="First Name" />);
    const input = screen.getByLabelText('First Name');
    expect(input).toHaveAttribute('id', 'first-name');
  });

  it('uses the name prop as id fallback when no label', () => {
    render(<Input name="email" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'email');
  });

  it('uses an explicit id prop when provided', () => {
    render(<Input id="custom-id" label="Field" />);
    const input = screen.getByLabelText('Field');
    expect(input).toHaveAttribute('id', 'custom-id');
  });

  it('displays an error message when error prop is set', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByRole('alert')).toHaveTextContent('This field is required');
  });

  it('sets aria-invalid to true when error is present', () => {
    render(<Input error="Invalid" label="Field" />);
    const input = screen.getByLabelText('Field');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets aria-invalid to false when no error', () => {
    render(<Input label="Field" />);
    const input = screen.getByLabelText('Field');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('displays helper text when no error is present', () => {
    render(<Input helperText="Enter your email address" />);
    expect(screen.getByText('Enter your email address')).toBeInTheDocument();
  });

  it('hides helper text when error is present', () => {
    render(<Input error="Required" helperText="Enter your email address" />);
    expect(screen.queryByText('Enter your email address')).not.toBeInTheDocument();
  });

  it('shows a required indicator when required prop is true', () => {
    render(<Input label="Email" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('applies disabled styles when disabled prop is true', () => {
    render(<Input label="Field" disabled />);
    const input = screen.getByLabelText('Field');
    expect(input).toBeDisabled();
  });

  it('calls onChange when user types', () => {
    const handleChange = vi.fn();
    render(<Input label="Input" onChange={handleChange} />);
    const input = screen.getByLabelText('Input');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('applies custom className to the input element', () => {
    render(<Input className="my-custom-class" />);
    const input = screen.getByRole('textbox');
    expect(input.className).toContain('my-custom-class');
  });

  it('passes through additional HTML attributes', () => {
    render(<Input placeholder="Type here" />);
    const input = screen.getByPlaceholderText('Type here');
    expect(input).toBeInTheDocument();
  });

  it('applies error border styles when error is present', () => {
    render(<Input error="Error" label="Field" />);
    const input = screen.getByLabelText('Field');
    expect(input.className).toContain('border-red-500');
  });

  it('applies normal border styles when no error', () => {
    render(<Input label="Field" />);
    const input = screen.getByLabelText('Field');
    expect(input.className).toContain('border-gray-300');
  });
});
