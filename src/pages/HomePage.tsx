/**
 * HomePage Component
 * Landing page with hero section and featured content
 */

import { Link } from 'react-router';
import { ArrowRight, Clock, MapPin, Phone } from 'lucide-react';

/**
 * HomePage component
 */
export function HomePage(): React.ReactElement {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Fresh Burgers,
              <br />
              Made with <span className="text-primary-200">Love</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-100">
              Experience the taste of handcrafted burgers made with premium
              ingredients. Order online for pickup or dine-in with us today.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
              >
                Order Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/reserve"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Make Reservation
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-neutral-50 to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900">
              Why Choose Us?
            </h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              We're committed to serving you the best burgers with fresh,
              quality ingredients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="w-14 h-14 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-3xl" role="img" aria-label="Fresh ingredients">
                  🥬
                </span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Fresh Ingredients
              </h3>
              <p className="text-neutral-600">
                We source only the freshest vegetables, premium beef, and
                artisan buns for our burgers.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="w-14 h-14 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-3xl" role="img" aria-label="Fast service">
                  ⚡
                </span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Fast Service
              </h3>
              <p className="text-neutral-600">
                Order online and have your food ready when you arrive. No more
                waiting in lines.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="w-14 h-14 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-3xl" role="img" aria-label="Great taste">
                  ⭐
                </span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Great Taste
              </h3>
              <p className="text-neutral-600">
                Our secret recipes and cooking techniques deliver burgers that
                keep you coming back.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-600 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold">Ready to Order?</h2>
            <p className="mt-4 text-lg text-primary-100 max-w-xl mx-auto">
              Browse our menu and place your order online. Pickup or dine-in
              options available.
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 mt-8 px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
            >
              View Menu
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Location */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">Location</h3>
                <p className="text-neutral-600">123 Burger Street</p>
                <p className="text-neutral-600">Food City, FC 12345</p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">Hours</h3>
                <p className="text-neutral-600">Mon-Fri: 11am - 10pm</p>
                <p className="text-neutral-600">Sat-Sun: 10am - 11pm</p>
              </div>
            </div>

            {/* Contact */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">Contact</h3>
                <p className="text-neutral-600">(555) 123-4567</p>
                <p className="text-neutral-600">hello@burgerrestaurant.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
