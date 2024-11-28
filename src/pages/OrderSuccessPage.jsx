import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';

const OrderSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          ¡Gracias por tu compra!
        </h1>
        
        <p className="text-gray-600 mb-8">
          Tu orden ha sido procesada exitosamente. Recibirás un correo electrónico con los detalles de tu compra.
        </p>

        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver a la tienda</span>
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;