import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Slider } from './ui/slider';

const PriceFilter = ({ minPrice, maxPrice, currentRange, onChange }) => {
  const formatPrice = (price) => `$${Number(price).toFixed(2)}`;

  return (
    <div className="w-full mb-6 bg-white shadow-lg rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium flex items-center gap-2 text-gray-800">
          <SlidersHorizontal className="w-5 h-5" />
          Filtrar por Precio
        </h3>
      </div>
      
      <div className="space-y-6">
        <Slider
          defaultValue={[currentRange[0], currentRange[1]]}
          max={maxPrice}
          min={minPrice}
          step={1}
          value={[currentRange[0], currentRange[1]]}
          onValueChange={onChange}
          className="w-full"
        />
        
        <div className="flex justify-between items-center text-sm mt-6">
          <div className="bg-gray-50 px-4 py-2 rounded-md shadow-sm border border-gray-200">
            <span className="text-gray-600">Min: </span>
            <span className="font-medium text-blue-600">{formatPrice(currentRange[0])}</span>
          </div>
          <div className="h-px w-8 bg-gray-300"></div>
          <div className="bg-gray-50 px-4 py-2 rounded-md shadow-sm border border-gray-200">
            <span className="text-gray-600">Max: </span>
            <span className="font-medium text-blue-600">{formatPrice(currentRange[1])}</span>
          </div>
        </div>

        <div className="flex justify-between text-xs text-gray-500 px-1">
          <span>{formatPrice(minPrice)}</span>
          <span>{formatPrice(maxPrice)}</span>
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;