/**
 * MainLayout component – wraps page content with Header and Footer.
 * Uses <Outlet> from react-router to render nested routes.
 */

import { Suspense } from 'react';
import { Outlet } from 'react-router';
import { Header } from './Header';
import { Footer } from './Footer';
import { Loader } from '@/components/ui';

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Suspense fallback={<Loader size="lg" label="Loading page…" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
