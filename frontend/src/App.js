import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Collection from './pages/Collection';
import ProductDetail from './pages/ProductDetail';
import Admin from './pages/Admin';
import { Toaster } from './components/ui/toaster';

const StoreLayout = ({ children }) => (
  <>
    <Header />
    <CartDrawer />
    <main>{children}</main>
    <Footer />
  </>
);

function App() {
  return (
    <div className="App">
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<StoreLayout><Home /></StoreLayout>} />
            <Route path="/collections/:handle" element={<StoreLayout><Collection /></StoreLayout>} />
            <Route path="/products/:slug" element={<StoreLayout><ProductDetail /></StoreLayout>} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </CartProvider>
    </div>
  );
}

export default App;
