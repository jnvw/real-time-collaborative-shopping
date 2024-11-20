import React, { useState } from 'react';
import axios from 'axios';

const AddToCartButton = ({ productId }) => {
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  const addToCart = async () => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/cart/${productId}/add_item/`, {
        product_id: productId,
        quantity: quantity,
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setMessage("Failed to add to cart");
    }
  };

  return (
    <div>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        min="1"
        max="10"
      />
      <button onClick={addToCart}>Add to Cart</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddToCartButton;
