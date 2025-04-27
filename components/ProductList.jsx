import React from 'react';

function ProductList({ products, onSelect }) {
  return (
    <ul>
      {products.slice(0, 10).map((product) => (
        <li key={product.id}>
          <button onClick={() => onSelect(product.id)}>
            {product.name || `Product ${product.id}`}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default ProductList;
