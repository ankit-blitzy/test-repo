/**
 * @fileoverview HomePage component for the Burger House restaurant application.
 *
 * This is the landing page that users see when first visiting the application.
 * It features:
 * - A hero section with restaurant branding and call-to-action buttons
 * - A featured menu items showcase displaying popular items
 * - Restaurant feature highlights (Fast Delivery, Online Ordering, Table Booking)
 * - A final call-to-action section encouraging users to order or book
 *
 * The component uses React hooks for state management and data fetching,
 * React Router for navigation, and follows responsive design principles
 * with Tailwind CSS using an amber/orange color scheme.
 *
 * @module pages/HomePage
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from '../components';
import { getAllMenuItems } from '../services/menu';
import type { MenuItem } from '../types';

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Number of featured items to display on the homepage.
 * This limits the menu items shown to keep the UI clean and focused.
 */
const FEATURED_ITEMS_COUNT = 4;

/**
 * Restaurant features data for the features section.
 * Each feature includes an icon, title, and description.
 */
const RESTAURANT_FEATURES = [
  {
    id: 'fast-delivery',
    icon: '🚀',
    title: 'Fast Delivery',
    description: 'Fresh burgers delivered to your door in 30 minutes or less.',
  },
  {
    id: 'online-ordering',
    icon: '📱',
    title: 'Online Ordering',
    description: 'Easy ordering from your phone, tablet, or computer anytime.',
  },
  {
    id: 'table-booking',
    icon: '🪑',
    title: 'Table Booking',
    description: 'Reserve your spot for a memorable dine-in experience.',
  },
] as const;

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * HomePage component - The main landing page of the Burger House application.
 *
 * This component renders the primary landing experience for users, including:
 * - Hero section with restaurant name, tagline, and primary CTAs
 * - Featured menu items dynamically loaded from the menu service
 * - Three feature highlight cards showcasing key restaurant services
 * - Final CTA section to encourage user action
 *
 * State Management:
 * - featuredItems: Array of MenuItem objects for the featured section
 * - isLoading: Boolean indicating if data is being fetched
 * - error: Error message if data fetch fails
 *
 * @returns JSX.Element The rendered homepage component
 *
 * @example
 * // In App.tsx routes:
 * <Route path="/" element={<HomePage />} />
 */
function HomePage(): JSX.Element {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------

  /**
   * Featured menu items to display in the featured section.
   * Limited to FEATURED_ITEMS_COUNT items for optimal display.
   */
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);

  /**
   * Loading state indicator for the featured items fetch operation.
   */
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Error message if the featured items fetch fails.
   * Null when no error has occurred.
   */
  const [error, setError] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // EFFECTS
  // ---------------------------------------------------------------------------

  /**
   * Fetches featured menu items on component mount.
   * Retrieves all menu items and selects the first FEATURED_ITEMS_COUNT
   * items for display in the featured section.
   */
  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedItems = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        const allItems = await getAllMenuItems();

        // Only update state if component is still mounted
        if (isMounted) {
          // Select the first FEATURED_ITEMS_COUNT items as featured
          // These typically include specials and popular items
          const featured = allItems.slice(0, FEATURED_ITEMS_COUNT);
          setFeaturedItems(featured);
        }
      } catch (fetchError) {
        // Handle fetch errors gracefully
        if (isMounted) {
          const errorMessage =
            fetchError instanceof Error
              ? fetchError.message
              : 'Failed to load featured items. Please try again later.';
          setError(errorMessage);
          console.error('Error fetching featured items:', fetchError);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchFeaturedItems();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, []);

  // ---------------------------------------------------------------------------
  // HELPER FUNCTIONS
  // ---------------------------------------------------------------------------

  /**
   * Formats a price value to USD currency string.
   * @param price - The price value to format
   * @returns Formatted price string (e.g., "$9.99")
   */
  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen">
      {/* ===================================================================
          HERO SECTION
          Main banner with restaurant branding and primary call-to-actions
          =================================================================== */}
      <section className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white">
        {/* Background pattern overlay for visual interest */}
        <div className="absolute inset-0 bg-black/10" aria-hidden="true" />

        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            {/* Restaurant name */}
            <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
              Burger House
            </h1>

            {/* Restaurant tagline */}
            <p className="text-xl md:text-2xl mb-8 text-amber-100 font-light">
              Crafted with passion, served with love
            </p>

            {/* Additional description */}
            <p className="text-lg md:text-xl mb-10 text-white/90 max-w-2xl mx-auto">
              Experience the juiciest, most flavorful burgers in town. Made fresh
              daily with premium ingredients and served with a smile.
            </p>

            {/* Call-to-action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/menu" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto font-semibold shadow-lg hover:shadow-xl transition-shadow"
                >
                  Order Now
                </Button>
              </Link>

              <Link to="/booking" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white text-white hover:bg-white/20 font-semibold"
                >
                  Book a Table
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative wave shape at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{
          clipPath: 'ellipse(75% 100% at 50% 100%)',
        }} aria-hidden="true" />
      </section>

      {/* ===================================================================
          FEATURED ITEMS SECTION
          Showcase of popular menu items fetched from the menu service
          =================================================================== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          {/* Section header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Items
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most popular burgers and sides, crafted with the
              finest ingredients for an unforgettable taste experience.
            </p>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent" />
              <span className="sr-only">Loading featured items...</span>
            </div>
          )}

          {/* Error state */}
          {error && !isLoading && (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button
                variant="primary"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Featured items grid */}
          {!isLoading && !error && featuredItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredItems.map((item) => (
                <Card
                  key={item.id}
                  className="group overflow-hidden"
                  hoverable
                >
                  {/* Item image placeholder with fallback */}
                  <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback to emoji on image load error
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML =
                            '<span class="text-6xl">🍔</span>';
                        }}
                      />
                    ) : (
                      <span className="text-6xl" aria-hidden="true">
                        🍔
                      </span>
                    )}
                  </div>

                  {/* Item details */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Price and action */}
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-amber-600">
                        {formatPrice(item.price)}
                      </span>
                      <Link to="/menu">
                        <Button variant="primary" size="sm">
                          View Menu
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && featuredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">
                No featured items available at the moment.
              </p>
            </div>
          )}

          {/* View full menu link */}
          <div className="text-center mt-12">
            <Link to="/menu">
              <Button variant="outline" size="lg">
                View Full Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================================
          FEATURES SECTION
          Highlights of restaurant services and benefits
          =================================================================== */}
      <section className="py-16 md:py-24 bg-amber-50">
        <div className="container mx-auto px-4">
          {/* Section header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We&apos;re committed to providing the best burger experience,
              whether you&apos;re dining in or ordering from home.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {RESTAURANT_FEATURES.map((feature) => (
              <Card
                key={feature.id}
                className="text-center p-8"
                variant="elevated"
              >
                {/* Feature icon */}
                <div className="text-5xl mb-4" aria-hidden="true">
                  {feature.icon}
                </div>

                {/* Feature title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>

                {/* Feature description */}
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================
          CALL-TO-ACTION SECTION
          Final encouragement for users to order or book
          =================================================================== */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-amber-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          {/* CTA heading */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Taste the Best?
          </h2>

          {/* CTA description */}
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Don&apos;t wait any longer! Order your favorite burger now or reserve
            a table for an amazing dine-in experience with family and friends.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/menu" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto font-semibold shadow-lg"
              >
                Order Online
              </Button>
            </Link>

            <Link to="/booking" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-white text-white hover:bg-white/20 font-semibold"
              >
                Reserve a Table
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export default HomePage;
