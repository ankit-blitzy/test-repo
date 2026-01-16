import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🍔</span>
              <span className="text-xl font-bold text-amber-500">Burger House</span>
            </Link>
            <p className="text-gray-400">
              Serving the best burgers in town since 2020. Fresh ingredients, made with love.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-amber-500">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-gray-400 hover:text-amber-500">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-gray-400 hover:text-amber-500">
                  Book a Table
                </Link>
              </li>
              <li>
                <Link to="/account" className="text-gray-400 hover:text-amber-500">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>123 Burger Street</li>
              <li>Food City, FC 12345</li>
              <li>Phone: (555) 123-4567</li>
              <li>Email: hello@burgerhouse.com</li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Opening Hours</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Monday - Friday: 11am - 10pm</li>
              <li>Saturday: 10am - 11pm</li>
              <li>Sunday: 10am - 9pm</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Burger House. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
