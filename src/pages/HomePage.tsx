/**
 * HomePage – landing page with hero section, featured menu items, and CTAs.
 */

import { Link } from 'react-router';
import { Button, Card } from '@/components/ui';
import { APP_NAME } from '@/utils/constants';

/** Featured menu items displayed on the home page */
const FEATURED_ITEMS = [
  {
    id: 'classic-burger',
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, and our secret sauce.',
    price: '$12.99',
    image: '🍔',
  },
  {
    id: 'bacon-deluxe',
    name: 'Bacon Deluxe',
    description: 'Smoky bacon, cheddar cheese, and crispy onion rings.',
    price: '$15.99',
    image: '🥓',
  },
  {
    id: 'veggie-burger',
    name: 'Veggie Burger',
    description: 'Plant-based patty with avocado, sprouts, and herb mayo.',
    price: '$13.99',
    image: '🥬',
  },
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero section */}
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-6xl font-extrabold text-text leading-tight">
          Welcome to <span className="text-primary">{APP_NAME}</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-text-light max-w-2xl mx-auto">
          Handcrafted gourmet burgers made with the freshest ingredients. Order online for pickup or
          book a table for an unforgettable dine-in experience.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/menu">
            <Button size="lg">View Menu</Button>
          </Link>
          <Link to="/booking">
            <Button variant="outline" size="lg">
              Book a Table
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured items */}
      <section>
        <h2 className="text-2xl font-bold text-text text-center mb-8">Our Favorites</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_ITEMS.map((item) => (
            <Card key={item.id} hoverable className="flex flex-col items-center text-center p-6">
              <span className="text-6xl mb-4">{item.image}</span>
              <h3 className="text-lg font-bold text-text">{item.name}</h3>
              <p className="mt-2 text-sm text-text-light">{item.description}</p>
              <p className="mt-3 text-xl font-bold text-primary">{item.price}</p>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/menu">
            <Button variant="outline">See Full Menu →</Button>
          </Link>
        </div>
      </section>

      {/* CTA: Dine-in */}
      <section className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-text">Dine With Us</h2>
        <p className="mt-3 text-text-light max-w-xl mx-auto">
          Experience our burgers fresh off the grill in a cozy, welcoming atmosphere. Reserve your
          table in just a few clicks.
        </p>
        <Link to="/booking">
          <Button className="mt-6" size="lg">
            Reserve a Table
          </Button>
        </Link>
      </section>
    </div>
  );
}
