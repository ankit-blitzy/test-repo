import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedItems } from '../services/menu';
import type { MenuItem } from '../types';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function HomePage() {
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const items = await getFeaturedItems();
        setFeaturedItems(items);
      } finally {
        setIsLoading(false);
      }
    };
    loadFeatured();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            The Best Burgers in Town
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Fresh ingredients, handcrafted with love. Order online or book a table for the ultimate burger experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu">
              <Button size="lg" variant="secondary">
                View Menu
              </Button>
            </Link>
            <Link to="/booking">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Book a Table
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🍔</div>
              <h3 className="text-xl font-semibold mb-2">Fresh Ingredients</h3>
              <p className="text-gray-600">We use only the freshest, locally sourced ingredients in all our burgers.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-xl font-semibold mb-2">Quick Service</h3>
              <p className="text-gray-600">Order online and have your food ready in no time.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold mb-2">Great Experience</h3>
              <p className="text-gray-600">Dine in our cozy restaurant or enjoy at home.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Items</h2>
          {isLoading ? (
            <LoadingSpinner className="py-12" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredItems.map(item => (
                <Card key={item.id} className="p-4">
                  <div className="aspect-square bg-amber-100 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-6xl">🍔</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-amber-600">${item.price.toFixed(2)}</span>
                    <Link to="/menu">
                      <Button size="sm">Order Now</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/menu">
              <Button variant="outline">View Full Menu</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Don't wait, get your delicious burger now!
          </p>
          <Link to="/menu">
            <Button size="lg">Order Online</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
