/**
 * CartPage – full-page cart view with items and summary.
 */

import { Link } from 'react-router';
import { useCart } from '@/features/cart/hooks/useCart';
import { CartItemComponent } from '@/features/cart/components/CartItem';
import { CartSummary } from '@/features/cart/components/CartSummary';
import { Button } from '@/components/ui';

export default function CartPage() {
  const { items, clearCart } = useCart();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text">Your Cart</h1>
        {items.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearCart}>
            Clear Cart
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🛒</p>
          <p className="text-lg text-text-light mb-4">Your cart is empty</p>
          <Link to="/menu">
            <Button>Browse Menu</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <CartItemComponent key={item.id} item={item} />
            ))}
          </div>
          <div>
            <CartSummary />
            <Link to="/checkout" className="block mt-4">
              <Button fullWidth size="lg">
                Proceed to Checkout
              </Button>
            </Link>
            <Link to="/menu" className="block mt-2">
              <Button fullWidth variant="ghost" size="sm">
                ← Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
