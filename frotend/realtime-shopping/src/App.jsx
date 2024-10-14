import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './components/Footer';
import Cart from './components/Cart';
import Cards from './components/Cards';
import Products from './components/Products';
function App() {
  return (
    <>
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/carts" element={<Dashboard />} />
          <Route path="/Products" element={<Products />} />
        </Routes>
      </div>
      <Footer/>
    </Router>
    <ToastContainer />
    
    </>
  );
}

export default App;
