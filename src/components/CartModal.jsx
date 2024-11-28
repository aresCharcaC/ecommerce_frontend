import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, CheckCircle } from 'lucide-react';
import LoginModal from './LoginModal';
import CouponInput from './CouponInput';

const CartModal = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onUserLogin,
  appliedCoupon,
  setAppliedCoupon,
  total
}) => {
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const user = (() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  })();

  const subtotal = items.reduce((sum, item) => 
    sum + (item.current_price * item.quantity), 0
  );

  const handleCouponApply = (couponData) => {
    setAppliedCoupon(couponData);
  };

  const handleLoginSuccess = (userData) => {
    setIsLoginOpen(false);
    onUserLogin(userData);
    handleCheckout(userData);
  };

  const handleCheckout = (currentUser = user) => {
    if (!currentUser) {
      setIsLoginOpen(true);
      return;
    }
    
    onClose();
    setShowSuccessMessage(true);
    
    const orderSummary = {
      items,
      subtotal,
      coupon: appliedCoupon,
      discount: appliedCoupon ? appliedCoupon.discount_amount : 0,
      total,
      user: currentUser
    };
    navigate('/checkout');
    console.log('Orden procesada:', orderSummary);

    setTimeout(() => {
      setShowSuccessMessage(false);
      onClose();
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      {/* Mensaje de éxito */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center space-x-2 z-[60]">
          <CheckCircle className="w-5 h-5" />
          <span>¡Compra realizada con éxito!</span>
          {appliedCoupon && (
            <span className="font-semibold">
              (Cupón aplicado: -${appliedCoupon.discount_amount.toFixed(2)})
            </span>
          )}
        </div>
      )}

      <div className="w-full max-w-md h-full bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {user ? `Carrito de ${user.first_name || user.username}` : 'Carrito de Compras'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  {/* Imagen del producto */}
                  <img
                    src={item.image || '/placeholder.jpg'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  
                  {/* Detalles del producto */}
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <div className="text-sm text-gray-500 mt-1">
                      Precio unitario: ${item.current_price}
                    </div>
                    
                    {/* Controles de cantidad */}
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center border rounded">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 border-x">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {/* Subtotal del item */}
                    <div className="text-right mt-2 font-medium">
                      ${(item.current_price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resumen y Checkout */}
        <div className="border-t px-6 py-4 space-y-4">
          {/* Cupón */}
          {items.length > 0 && (
            <CouponInput 
              onApplyCoupon={handleCouponApply}
              cartTotal={subtotal}
            />
          )}

          {/* Resumen de precios */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            {appliedCoupon && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Descuento aplicado</span>
                <span>-${appliedCoupon.discount_amount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-lg font-semibold pt-2 border-t">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Botón de checkout */}
          <button
            onClick={() => handleCheckout()}
            disabled={items.length === 0}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                     disabled:bg-gray-300 disabled:cursor-not-allowed
                     transition-colors duration-200"
          >
            {user ? 'Proceder al pago' : 'Iniciar sesión para comprar'}
          </button>
        </div>
      </div>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default CartModal;