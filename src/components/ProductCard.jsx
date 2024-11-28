import React from 'react';
import { Tag } from 'lucide-react';

function ProductCard({ product, onAddToCart }) {
  // Calculamos si hay descuento activo
  const hasDiscount = product.active_discounts && product.active_discounts.length > 0;
  const originalPrice = product.price;
  const discountedPrice = product.current_price;
  
  // Calculamos el porcentaje de descuento
  const discountPercentage = hasDiscount ? 
    Math.round(((originalPrice - discountedPrice) / originalPrice) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden relative group">
      {/* Badge de descuento */}
      {hasDiscount && (
        <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full 
                      font-bold text-sm flex items-center gap-1 shadow-md z-10">
          <Tag size={14} />
          -{discountPercentage}%
        </div>
      )}

      {/* Imagen con overlay al hacer hover */}
      <div className="relative">
        <img 
          src={product.image || 'https://via.placeholder.com/300'} 
          alt={product.name}
          className="w-full h-56 object-cover transition-transform group-hover:scale-105"
        />
        {hasDiscount && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-lg font-bold">¡OFERTA!</span>
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Nombre del producto */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        {/* Precios */}
        <div className="space-y-1">
          {hasDiscount ? (
            <div className="flex items-center gap-2">
              {/* Precio original tachado */}
              <span className="text-sm text-gray-500 line-through">
                ${originalPrice}
              </span>
              {/* Precio con descuento */}
              <span className="text-xl font-bold text-red-600">
                ${discountedPrice}
              </span>
              {/* Etiqueta de ahorro */}
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                Ahorras: ${(originalPrice - discountedPrice).toFixed(2)}
              </span>
            </div>
          ) : (
            <span className="text-xl font-bold text-gray-900">
              ${originalPrice}
            </span>
          )}
        </div>

        {/* Stock */}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Stock: {product.stock}
          </span>
          {product.stock <= 5 && (
            <span className="text-xs text-orange-600 font-medium">
              ¡Últimas unidades!
            </span>
          )}
        </div>

        {/* Descuentos activos */}
        {hasDiscount && (
          <div className="mt-2 space-y-1 border-t pt-2">
            {product.active_discounts.map((discount, index) => (
              <div key={index} 
                   className="text-xs text-green-600 flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                <Tag size={12} />
                {discount.name}
              </div>
            ))}
          </div>
        )}

        {/* Botón de agregar al carrito */}
        <button 
          onClick={() => onAddToCart(product)}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 
                    transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
            />
          </svg>
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
}

export default ProductCard;