import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('access_token'); // Adjust this based on your token storage
    if (token) {
      navigate('/dashboard'); // Redirect to dashboard if logged in
    }
  }, [navigate]); 
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://127.0.0.1:8000/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success(`Login successful!`);
      console.log('Access Token:', data.access); // Access token
      console.log('Refresh Token:', data.refresh); // Refresh token
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      navigate('/dashboard');
    } else {
      toast.error(data.detail);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-950">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <h2 className="text-center text-white text-2xl font-bold mb-6">Login</h2>
          <div className="mb-4">
            <label
              className="block text-gray-100 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border bg-gray-800 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-100 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border bg-gray-800 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Login

            </button>
            <Link to="/register" className='italic underline text-blue-500'>if not registered</Link>

          </div>
        </form>

      </div>
    </div>
  );
};

export default Login;
