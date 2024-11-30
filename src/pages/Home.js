import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import PriceFilter from '../components/PriceFilter';

function Home({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 1000]); // Valores iniciales por defecto para el filtrado

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let url = 'http://localhost:8000/api/products/';
        if (selectedCategory) {
          url += `?category=${selectedCategory}`;
        }
        const response = await axios.get(url);
        setProducts(response.data);

        // Establecer el rango de precios inicial basado en los productos
        const prices = response.data.map(product => product.current_price);
        const minPrice = Math.floor(Math.min(...prices));
        const maxPrice = Math.ceil(Math.max(...prices));
        setPriceRange([minPrice, maxPrice]);

        filterProducts(response.data, [minPrice, maxPrice]);

      } catch (error) {
        console.error('Error fetching products:', error);
      }
      setLoading(false);
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/categories/');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
    fetchData();
  }, [selectedCategory]);

//Filtro
const filterProducts = (productList, range) => {
  const filtered = productList.filter(product => {
    const price = product.current_price;
    return price >= range[0] && price <= range[1];
  });
  setFilteredProducts(filtered);
};

const handlePriceRangeChange = (newRange) => {
  setPriceRange(newRange);
  filterProducts(products, newRange);
};

const prices = products.map(product => product.current_price);
const minPrice = Math.floor(Math.min(...prices));
const maxPrice = Math.ceil(Math.max(...prices));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filtro de categorías */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded ${
            !selectedCategory 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todos
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.slug)}
            className={`px-4 py-2 rounded ${
              selectedCategory === category.slug
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Seccion de filtros */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar con filtros */}
        <div className="w-full md:w-64">
          <PriceFilter
            minPrice={minPrice}
            maxPrice={maxPrice}
            currentRange={priceRange}
            onChange={handlePriceRangeChange}
          />
        </div>

     {/* Grid de productos */}
     <div className="flex-1">
          {loading ? (
            <div className="text-center py-10">
              <p>Cargando productos...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;