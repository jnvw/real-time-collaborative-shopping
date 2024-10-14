import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 ">
      <div className="container mx-auto flex flex-col md:flex-row px-9 justify-between items-center">
        {/* Footer Links */}
        <div className="mb-4 md:mb-0">
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:underline">Home</Link>
            </li>
            <li>
              <Link to="/products" className="hover:underline">Products</Link>
            </li>
            <li>
              <Link to="/carts" className="hover:underline">Cart</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Footer Info */}
        <div className="mb-4 md:mb-0 text-center">
          <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
          <ul className="flex space-x-4 justify-center">
            <li>
              <a href="#" className="hover:text-gray-400">Facebook</a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-400">Instagram</a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-400">Twitter</a>
            </li>
          </ul>
        </div>

        {/* Footer Copyright */}
        <div className="text-center">
          <p className="text-gray-400">© 2024 Your E-Commerce Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
