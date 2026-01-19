/**
 * Navigation Component
 * Main navigation links
 */

import { NavLink } from 'react-router';
import { clsx } from 'clsx';

/**
 * Navigation props interface
 */
export interface NavigationProps {
  className?: string;
  onNavigate?: () => void;
}

/**
 * Navigation links configuration
 */
const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/reserve', label: 'Reservations' },
  { to: '/dashboard', label: 'My Account' },
];

/**
 * Navigation component
 */
export function Navigation({
  className,
  onNavigate,
}: NavigationProps): React.ReactElement {
  return (
    <ul className={clsx('flex items-center gap-6', className)}>
      {navLinks.map((link) => (
        <li key={link.to}>
          <NavLink
            to={link.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              clsx(
                'text-sm font-medium transition-colors',
                'hover:text-primary-600',
                isActive ? 'text-primary-600' : 'text-neutral-600'
              )
            }
          >
            {link.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export default Navigation;
