import React, { useEffect, useState } from 'react';
import ProductDetails from './ProductDetails';

function ProductsContainer() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  if (selectedProductId) {
    return <ProductDetails productId={selectedProductId} onBack={() => setSelectedProductId(null)} />;
  }

  return (
    <div>
      <h2>Product List</h2>
      <ul>
        {products.map(product => (
          <li key={product.id} onClick={() => setSelectedProductId(product.id)}>
            {product.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductsContainer;
