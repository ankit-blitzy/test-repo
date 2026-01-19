/**
 * Footer Component
 * Site footer with links and information
 */

import { Link } from 'react-router';

/**
 * Footer component
 */
export function Footer(): React.ReactElement {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white">
              <span className="text-2xl" role="img" aria-label="Burger">
                🍔
              </span>
              Burger Restaurant
            </Link>
            <p className="mt-4 text-sm">
              Serving delicious burgers made with fresh, quality ingredients since 2020.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/menu" className="hover:text-white transition-colors">
                  Our Menu
                </Link>
              </li>
              <li>
                <Link to="/reserve" className="hover:text-white transition-colors">
                  Make a Reservation
                </Link>
              </li>
              <li>
                <Link to="/dashboard/orders" className="hover:text-white transition-colors">
                  Order History
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li>123 Burger Street</li>
              <li>Food City, FC 12345</li>
              <li>Phone: (555) 123-4567</li>
              <li>Email: hello@burgerrestaurant.com</li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-white font-semibold mb-4">Hours</h4>
            <ul className="space-y-2 text-sm">
              <li>Monday - Friday: 11am - 10pm</li>
              <li>Saturday: 10am - 11pm</li>
              <li>Sunday: 10am - 9pm</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-neutral-700 text-sm text-center">
          <p>© {currentYear} Burger Restaurant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
