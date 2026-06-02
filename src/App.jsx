import React, { useEffect, useState } from 'react';
import './App.css';
import Home from './layouts/Home';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import ProductsContainer from './components/ProductsContainer';
import Cart from './components/Cart';
import Contact from './layouts/Contact';
import About from './layouts/About';
import ProductDetail from './components/ProductDetail';
import Login from './components/Login';
import Admin from './components/Admin';
import NotFound from './layouts/NotFound';
import Checkout from './components/Checkout';
import { CartProvider } from './contexts/CartContext';
import ProductForm from './components/ProductForm';
import { addProduct } from './assets/requests';
import Register from './components/Register';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import Favorites from './components/Favorites';
import { SettingsProvider } from './contexts/SettingsContext';
import { MaterialsProvider } from "./contexts/MaterialsContext";

function InnerApp() {
  const { verificationLog, isAdmin } = useAuthContext();

  useEffect(() => {
    verificationLog();}, []);

  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/productos" element={<ProductsContainer />} />
        <Route path="/productos/:id" element={<ProductDetail />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/nosotros" element={<About />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin" element={isAdmin ? <Admin /> : <Navigate to="/login" />} />
        <Route path="/admin/agregarProductos" element={isAdmin ? <ProductForm onAdd={addProduct} /> : <Navigate to="/login" />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/panel" element={<AdminPanel />} />
         <Route path="/favoritos" element={<Favorites />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <SettingsProvider>
      <MaterialsProvider>
        <CartProvider>
          <AuthProvider>
            <Router>
              <InnerApp />
            </Router>
          </AuthProvider>
        </CartProvider>
      </MaterialsProvider>
    </SettingsProvider>
  );
}

export default App;