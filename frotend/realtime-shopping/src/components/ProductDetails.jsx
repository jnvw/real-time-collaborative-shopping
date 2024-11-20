import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { gsap } from 'gsap';
import GsapLoader from './GsapLoader';

const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1); // Add state for quantity

  const imageRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`http://127.0.0.1:8000/api/products/${id}/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          toast.error('Failed to fetch product details');
        }
      } catch (err) {
        toast.error('An error occurred while fetching product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://127.0.0.1:8000/api/cart/add/${id}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }), // Send quantity in the request body
      });

      if (response.ok) {
        toast.success('Product added to cart!');
      } else {
        toast.error('Failed to add product to cart');
      }
    } catch (err) {
      toast.error('An error occurred while adding product to cart');
    }
  };

  if (loading) {
    return <GsapLoader />;
  }

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4 bg-gray-900 text-white">
      {/* Product Title */}
      <h1 ref={titleRef} className="text-3xl font-bold mb-4">{product.name}</h1>
      
      {/* Product Image with Amazon-like Zoom */}
      <div className="mb-4 max-w-lg">
        <Zoom>
          <img
            alt={product.name}
            src={product.image}
            className="object-cover w-full h-full"
          />
        </Zoom>
      </div>

      {/* Product Price */}
      <p className="mt-2 text-2xl">Price: ${product.price}</p>

      {/* Product Category */}
      <div className="mt-4">
        <p className="text-xl">Category: {product.category}</p>
      </div>

      {/* Product Description */}
      <div ref={descriptionRef} className="mt-4">
        <p className="text-xl">Description: {product.description || 'No description available'}</p>
      </div>

      {/* Quantity Selector */}
      <div className="mt-4">
        <label htmlFor="quantity" className="text-xl mr-2">Quantity:</label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="1"
          className="p-2 text-black"
        />
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetails;
