import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RegisterForm from './components/RegisterForm';
import CartModal from './components/CartModal';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import './App.css';

function App() {
  const [cartItems, setCartItems] = useState(() => {
    // Recupera los datos del carrito desde localStorage
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Calcular total y descuento
  const subtotal = cartItems.reduce((sum, item) => 
    sum + (item.current_price * item.quantity), 0
  );
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const total = appliedCoupon 
    ? subtotal - appliedCoupon.discount_amount 
    : subtotal;

   // Persistir el carrito en localStorage cuando cambie el estado del carrito
   useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

    
  const handleAddToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== productId));
    } else {
      setCartItems(cartItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const handleRemoveItem = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const handleUserLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Navbar 
          user={user}
          onLogout={handleLogout}
          cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          onOpenCart={() => setIsCartOpen(true)}
          onLoginSuccess={handleUserLogin}
        />
        
        <Routes>
          <Route 
            path="/" 
            element={<Home onAddToCart={handleAddToCart} />} 
          />
          <Route 
            path="/register" 
            element={<RegisterForm onRegisterSuccess={handleUserLogin} />} 
          />
          <Route 
            path="/checkout" 
            element={
              <CheckoutPage 
                cartItems={cartItems}
                total={total}
                appliedCoupon={appliedCoupon}
                onCheckoutComplete={() => setCartItems([])}
              />
            } 
          />
          <Route path="/order-success" element={<OrderSuccessPage />} />
        </Routes>

        <CartModal
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onUserLogin={handleUserLogin}
          appliedCoupon={appliedCoupon}
          setAppliedCoupon={setAppliedCoupon}
          total={total}
        />
      </div>
    </Router>
  );
}

export default App;