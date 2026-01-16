import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

export default function CartPage() {
  const { items, subtotal, tax, total, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
        <p className="text-gray-600 mb-8">Your cart is empty</p>
        <Link to="/menu">
          <Button>Browse Menu</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <Card key={item.menuItem.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">🍔</span>
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.menuItem.name}</h3>
                  <p className="text-gray-600 text-sm">{item.menuItem.description}</p>
                  <p className="text-amber-600 font-semibold mt-1">
                    ${item.menuItem.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    ${(item.menuItem.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.menuItem.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-amber-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Button className="w-full" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </Button>
            <Link to="/menu" className="block text-center text-amber-600 mt-4 hover:underline">
              Continue Shopping
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
