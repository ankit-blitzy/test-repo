import { useState, useEffect } from 'react';
import { getMenuItems, getCategories } from '../services/menu';
import { useCart } from '../context/CartContext';
import type { MenuItem, MenuCategory } from '../types';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [items, cats] = await Promise.all([
          getMenuItems(),
          getCategories(),
        ]);
        setMenuItems(items);
        setCategories(cats);
      } catch (err) {
        setError('Failed to load menu');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadFilteredItems = async () => {
      setIsLoading(true);
      try {
        const items = await getMenuItems(selectedCategory || undefined);
        setMenuItems(items);
      } catch (err) {
        setError('Failed to load menu');
      } finally {
        setIsLoading(false);
      }
    };
    loadFilteredItems();
  }, [selectedCategory]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Our Menu</h1>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full transition-colors ${
            selectedCategory === null
              ? 'bg-amber-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedCategory === category.id
                ? 'bg-amber-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      {/* Menu Items */}
      {isLoading ? (
        <LoadingSpinner className="py-12" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems.map(item => (
            <Card key={item.id} className="flex flex-col">
              <div className="aspect-video bg-amber-100 flex items-center justify-center">
                <span className="text-6xl">
                  {item.category === 'burgers' && '🍔'}
                  {item.category === 'sides' && '🍟'}
                  {item.category === 'drinks' && '🥤'}
                  {item.category === 'desserts' && '🍰'}
                </span>
              </div>
              <div className="p-4 flex-grow flex flex-col">
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-lg font-bold text-amber-600">
                    ${item.price.toFixed(2)}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => addToCart(item)}
                    disabled={!item.available}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && menuItems.length === 0 && (
        <p className="text-center text-gray-600 py-12">No items found in this category.</p>
      )}
    </div>
  );
}
