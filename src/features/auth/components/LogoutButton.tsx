/**
 * Logout button component that signs the user out.
 * Clears authentication tokens and redirects to home page.
 */

import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui';
import { useNavigate } from 'react-router';
import { ROUTES } from '@/utils/constants';

/** Props for the LogoutButton component */
export interface LogoutButtonProps {
  /** Visual variant passed to the underlying Button */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  /** Additional CSS classes */
  className?: string;
}

/**
 * LogoutButton triggers the logout flow and redirects to the home page.
 */
export function LogoutButton({ variant = 'ghost', className }: LogoutButtonProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  return (
    <Button variant={variant} onClick={handleLogout} className={className} size="sm">
      Sign Out
    </Button>
  );
}
