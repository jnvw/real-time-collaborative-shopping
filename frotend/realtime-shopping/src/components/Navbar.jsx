import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // To manage mobile menu state
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchQuery}`);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Toggle mobile menu
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left side - Logo */}
        <div className="text-white font-bold text-lg">
          <Link to="/">MyShop</Link>
        </div>

        {/* Middle - Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded bg-gray-700 text-white focus:outline-none"
          />
          <button
            type="submit"
            className="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-600"
          >
            Search
          </button>
        </form>

        {/* Right side - Links */}
        <div className="hidden md:flex space-x-4 text-white font-semibold">
          <Link to="/login" className="hover:text-gray-400">Login</Link>
          <Link to="/register" className="hover:text-gray-400">Register</Link>
          <Link to="/carts" className="hover:text-gray-400">Carts</Link>
          <Link to="/products" className="hover:text-gray-400">Product</Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white font-medium size-4  focus:outline-none">
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <ul className="space-y-2 text-white  text-center py-4">
            <li>
              <Link to="/login" className="block hover:text-gray-400">Login</Link>
            </li>
            <li>
              <Link to="/register" className="block hover:text-gray-400">Register</Link>
            </li>
            <li>
              <Link to="/carts" className="block hover:text-gray-400">Carts</Link>
            </li>
            <li>
              <Link to="/products" className="block hover:text-gray-400">Product</Link>
            </li>
          </ul>
          <form onSubmit={handleSearchSubmit} className="flex justify-center py-2 px-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 rounded bg-gray-700 text-white focus:outline-none w-full"
            />
            <button
              type="submit"
              className="bg-blue-500 px-4 py-2 ml-2 rounded text-white hover:bg-blue-600"
            >
              Search
            </button>
          </form>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
