import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`http://127.0.0.1:8000/api/cart/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCartItems(data.items); // Assumes `items` is the structure of the response
        } else {
          toast.error('Failed to fetch cart items');
        }
      } catch (err) {
        toast.error('An error occurred while fetching cart items');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://127.0.0.1:8000/api/cart/update_quantity/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id: productId, quantity: newQuantity }),
      });

      if (response.ok) {
        const updatedItems = cartItems.map((item) =>
          item.product.id === productId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedItems);
        toast.success('Quantity updated successfully');
      } else {
        toast.error('Failed to update quantity');
      }
    } catch (err) {
      toast.error('An error occurred while updating quantity');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://127.0.0.1:8000/api/cart/remove_from_cart/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id: productId }),
      });

      if (response.ok) {
        const filteredItems = cartItems.filter((item) => item.product.id !== productId);
        setCartItems(filteredItems);
        toast.success('Item removed from cart');
      } else {
        toast.error('Failed to remove item');
      }
    } catch (err) {
      toast.error('An error occurred while removing the item');
    }
  };

  if (loading) {
    return <p>Loading cart...</p>;
  }

  if (cartItems.length === 0) {
    return <p><h1>Your cart is empty</h1></p>;
  }

  const totalPrice = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="p-4 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>

      {cartItems.map((item) => (
        <div key={item.product.id} className="border-b border-gray-700 mb-4 pb-4">
          <div className="flex items-center">
            <img  src={`http://127.0.0.1:8000${item.product.image}`}  alt={item.product.name} className="w-30 h-20 object-cover mr-4" />
            <div>
              <h2 className="text-2xl">{item.product.name}</h2>
              <p className="text-xl">Price: ${item.product.price}</p>
              <p className="text-xl">Total: ${item.quantity * item.product.price}</p>

              {/* Quantity controls */}
              <div className="mt-2">
                <button
                  className="bg-gray-700 px-2 py-1 mr-2"
                  onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="bg-gray-700 px-2 py-1 ml-2"
                  onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>

              {/* Remove item button */}
              <button
                className="mt-2 bg-red-500 text-white py-1 px-4 rounded"
                onClick={() => handleRemoveItem(item.product.id)}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="mt-4">
        <h2 className="text-2xl font-bold">Total Price: ${totalPrice.toFixed(2)}</h2>
      </div>

      <button
        onClick={handleCheckout}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default Cart;
