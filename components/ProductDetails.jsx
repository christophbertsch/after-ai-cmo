import React, { useEffect, useState } from 'react';

function ProductDetails({ productId, onBack }) {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    async function fetchDetails() {
      const response = await fetch(`/api/products/${productId}`);
      const data = await response.json();
      console.log("Fetched product details:", data); // Debugging line
      setDetails(data);
    }
    fetchDetails();
  }, [productId]);

  if (!details) return <div>Loading details...</div>;

  return (
    <div>
      <button onClick={onBack}>Back to List</button>
      <h2>{details.name}</h2>
      <p>{details.description}</p>

      {details.ExtendedProductInformation && (
        <div>
          <p>Price: {details.ExtendedProductInformation.price}</p>
          <ul>
            {details.ExtendedProductInformation.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
