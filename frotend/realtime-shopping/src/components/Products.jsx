import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Cards from './Cards';
import { Link } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null); // Updated to null to handle file input
  const [error, setError] = useState('');
   
  // Fetch Products with JWT Token
  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('access_token'); // Get JWT token from localStorage
      try {
        const response = await fetch('http://127.0.0.1:8000/api/products/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Attach token in Authorization header
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          setProducts(data);
        } else {
          toast.error('Need to login first');
        }
      } catch (err) {
        toast.error('Error: Unable to fetch products');
      }
    };

    fetchProducts();
  }, []);

  // Post new product with JWT Token and image
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token'); // Get JWT token from localStorage
    const formData = new FormData(); // Using FormData to handle file uploads
    formData.append('name', name);
    formData.append('price', price);
    formData.append('image', image); // Append the image file

    try {
      const response = await fetch('http://127.0.0.1:8000/api/products/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // Attach token in Authorization header
        },
        body: formData, // Sending the FormData with the request
      });

      const data = await response.json();
      
      if (response.ok) {
        setProducts([...products, data]);
        toast.success('Product added successfully!');
        setName('');
        setPrice('');
        setImage(null);
      } else {
        if (data.error) {
          toast.warning(data.error);
        } else {
          const errorMessage = Object.values(data).flat().join(' ');
          setError(errorMessage);
          toast.error(errorMessage);
        }
      }
    } catch (err) {
      toast.error('An error occurred while adding the product.');
    }
  };

  return (
    <div className="p-4 bg-gray-900">
      <h1 className="lg:text-2xl text-xl text-white font-bold mb-4 px-2">Products</h1>

      {/* Display list of products */}
      <ul className="grid lg:grid-cols-3 px-2 sm:grid-cols-2 sm:gap-2 md:grid-cols-3 gap-4 mb-4">
        {products.map((product) => (
          <li key={product.id} className="mb-2">
            <Cards name={product.name} price={product.price} image={product.image} />
          </li>
        ))}
      </ul>
      
      {/* Add new product form */}
      <form onSubmit={handleSubmit} className="mb-4 mt-10" encType="multipart/form-data">
        <div className="mb-2">
          <label className="block text-xl mt-7 mb-3 text-white pb-2">Product Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border  border-t-emerald-900 text-white bg-gray-800 font-semibold text-md p-2 rounded  lg:w-1/2 sm:w-full"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block text-xl mt-7 mb-3 text-white">Product Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className=" border bg-slate-700 text-white font-semibold text-md p-2 lg:w-1/2 rounded sm:w-full"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block text-xl mt-7 mb-3 text-white">Product Image:</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])} // Capture file input
            className="text-white bg-slate-700 p-2 lg:w-1/2 rounded sm:w-full"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white text-xl mt-7 mb-3 p-2 rounded">
          Add Product
        </button>
      </form>

      {error && <p className="text-red-500">{erroe}<Link to="/login" className='underline mx-4 italic font-bold text-red-500'>Login first</Link> </p>}
    </div>
  );
};

export default Products;
