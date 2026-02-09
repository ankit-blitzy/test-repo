/**
 * NotFoundPage – 404 error page displayed for unknown routes.
 */

import { Link } from 'react-router';
import { Button } from '@/components/ui';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-7xl font-extrabold text-primary">404</p>
      <h1 className="mt-4 text-2xl font-bold text-text">Page Not Found</h1>
      <p className="mt-2 text-text-light max-w-md">
        Sorry, the page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/" className="mt-6">
        <Button size="lg">Back to Home</Button>
      </Link>
    </div>
  );
}
