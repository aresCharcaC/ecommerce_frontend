import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CreditCard, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/Alert';

const CheckoutPage = ({ cartItems, total, appliedCoupon }) => {
  const navigate = useNavigate();
  const [paymentError, setPaymentError] = useState('');
  const [orderProcessed, setOrderProcessed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.current_price * item.quantity), 0);
  const discount = appliedCoupon ? appliedCoupon.discount_amount : 0;
  const finalTotal = total;

  const handlePaymentSuccess = async (details) => {
    setIsProcessing(true);
    try {
      console.log('Payment completed successfully', details);
      setOrderProcessed(true);
      setTimeout(() => {
        navigate('/order-success');
      }, 2000);
    } catch (error) {
      setPaymentError('Error al procesar el pago. Por favor intente nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="border-b pb-4 mb-6">
            <h1 className="text-2xl font-semibold">Finalizar Compra</h1>
          </div>

          {/* Order Summary */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Resumen de la Orden</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={item.image || '/placeholder.jpg'} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">${(item.current_price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-6 space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento aplicado</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          {!orderProcessed && (
            <div>
              <h2 className="text-lg font-medium mb-4">Método de Pago</h2>
              <div className="space-y-4">
                {paymentError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{paymentError}</AlertDescription>
                  </Alert>
                )}

                <PayPalScriptProvider 
                  options={{ 
                    "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
                    components: "buttons",
                    currency: "USD"
                  }}
                >
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    disabled={isProcessing}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: finalTotal.toString(),
                              currency_code: "USD"
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={async (data, actions) => {
                      const details = await actions.order.capture();
                      handlePaymentSuccess(details);
                    }}
                    onError={(err) => {
                      setPaymentError('Error al procesar el pago con PayPal');
                      console.error(err);
                    }}
                  />
                </PayPalScriptProvider>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">o paga con tarjeta</span>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <CreditCard className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">Tarjeta de Crédito/Débito</span>
                  </div>
                  
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Número de Tarjeta</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Fecha de Expiración</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">CVV</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {orderProcessed && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">¡Pago Exitoso!</h2>
              <p className="text-gray-600">Redirigiendo...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;