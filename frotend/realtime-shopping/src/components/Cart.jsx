import React, { useState, useEffect } from 'react';

const Cart = ({ familyId }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Fetch the cart when the component mounts
    const fetchCart = async () => {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/carts/?family_id=${familyId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setCartItems(data.items);
    };

    fetchCart();
  }, [familyId]);

  return (
    <div>
      <h1>Cart Items</h1>
      <ul>
        {cartItems.map((item, index) => (
          <li key={index}>
            {item.name} - ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cart;
