import React, { useEffect, useState } from 'react';
import ProductList from './ProductList';
import ProductDetails from './ProductDetails';

function ProductsContainer() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  return (
    <div>
      {!selectedProductId ? (
        <ProductList products={products} onSelect={setSelectedProductId} />
      ) : (
        <ProductDetails 
          productId={selectedProductId} 
          onBack={() => setSelectedProductId(null)} 
        />
      )}
    </div>
  );
}

export default ProductsContainer;
