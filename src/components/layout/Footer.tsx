/**
 * Footer component – site-wide footer with links and branding.
 */

import { Link } from 'react-router';
import { APP_NAME } from '@/utils/constants';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <p className="text-lg font-bold text-primary">🍔 {APP_NAME}</p>
            <p className="mt-2 text-sm text-text-light">
              Handcrafted burgers made with premium ingredients. Order online or book a table for an
              unforgettable dine-in experience.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-text mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/menu" className="text-text-light hover:text-primary transition-colors">
                  Our Menu
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-text-light hover:text-primary transition-colors">
                  Book a Table
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-text-light hover:text-primary transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-text mb-3">Contact Us</h3>
            <ul className="space-y-2 text-sm text-text-light">
              <li>📍 123 Burger Lane, Foodville, CA 90210</li>
              <li>📞 (555) 123-BURG</li>
              <li>✉️ hello@burgerbliss.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-4 text-center text-xs text-text-light">
          &copy; {year} {APP_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
