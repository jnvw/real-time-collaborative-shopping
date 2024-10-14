import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login'; // Redirect to login page after logout
  };

  return (
    <div className="min-h-screen bg-gray-200">
      {/* Dashboard Header */}
      <header className="bg-slate-400 p-4 text-gray-800 flex justify-between">
        <h1 className="text-2xl">Products</h1>
        <div className="flex space-x-4">
          
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-gray-300 font-bold py-2 px-4 rounded ring-2"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Manage Products */}
          <Link to="/admin/products" className="block bg-white p-4 rounded shadow hover:bg-gray-50">
            <h2 className="text-xl font-bold mb-4">Manage Products</h2>
            <p className="text-gray-600">Add, edit, or remove products.</p>
          </Link>

          {/* Manage Orders */}
          <Link to="/admin/orders" className="block bg-white p-4 rounded shadow hover:bg-gray-50">
            <h2 className="text-xl font-bold mb-4">Manage Orders</h2>
            <p className="text-gray-600">View and manage customer orders.</p>
          </Link>

          {/* Manage Users */}
          <Link to="/admin/users" className="block bg-white p-4 rounded shadow hover:bg-gray-50">
            <h2 className="text-xl font-bold mb-4">Manage Users</h2>
            <p className="text-gray-600">View, edit, or delete users.</p>
          </Link>
        </div>

        {/* Additional Sections */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sales Reports */}
          <Link to="/admin/reports" className="block bg-white p-4 rounded shadow hover:bg-gray-50">
            <h2 className="text-xl font-bold mb-4">Sales Reports</h2>
            <p className="text-gray-600">View and download sales reports.</p>
          </Link>

          {/* Analytics */}
          <Link to="/admin/analytics" className="block bg-white p-4 rounded shadow hover:bg-gray-50">
            <h2 className="text-xl font-bold mb-4">Analytics</h2>
            <p className="text-gray-600">Analyze traffic and sales patterns.</p>
          </Link>

          {/* Inventory Management */}
          <Link to="/admin/inventory" className="block bg-white p-4 rounded shadow hover:bg-gray-50">
            <h2 className="text-xl font-bold mb-4">Inventory Management</h2>
            <p className="text-gray-600">Track stock and manage inventory.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
