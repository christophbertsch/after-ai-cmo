import React, { useState, useEffect } from 'react';
import ProductDetails from './ProductDetails';

function ProductsContainer() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  if (selectedProduct) {
    return (
      <ProductDetails
        productId={selectedProduct}
        onBack={() => setSelectedProduct(null)}
      />
    );
  }

  return (
    <div>
      {products.slice(0, 10).map(product => (
        <div key={product.id}>
          <button onClick={() => setSelectedProduct(product.id)}>
            {product.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export default ProductsContainer;
