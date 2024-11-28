import React, { useState } from 'react';
import axios from 'axios';

const CouponInput = ({ onApplyCoupon, cartTotal }) => {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setError('Por favor ingrese un código de cupón');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = {
        code: couponCode.trim().toUpperCase(),
        cart_total: cartTotal.toString() // Enviar como string para mantener precisión decimal
      };

      console.log('Enviando datos del cupón:', data);

      const response = await axios.post('http://localhost:8000/api/cart/apply_coupon/', data);
      console.log('Respuesta del servidor:', response.data);

      if (response.data.valid) {
        const discountAmount = parseFloat(response.data.discount_amount);
        setSuccess(`¡Cupón aplicado! Descuento: $${discountAmount.toFixed(2)}`);
        onApplyCoupon({
          ...response.data,
          discount_amount: discountAmount,
          final_total: parseFloat(response.data.final_total)
        });
        setCouponCode('');
      }
    } catch (err) {
      console.error('Error al aplicar cupón:', err.response?.data);
      setError(err.response?.data?.message || 'Error al aplicar el cupón');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          placeholder="Código de cupón"
          className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          onClick={handleApplyCoupon}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Aplicando...' : 'Aplicar'}
        </button>
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      
      {success && (
        <p className="mt-2 text-sm text-green-600">{success}</p>
      )}

      <div className="mt-2 text-xs text-gray-500">
        Total del carrito: ${cartTotal.toFixed(2)}
      </div>
    </div>
  );
};

export default CouponInput;