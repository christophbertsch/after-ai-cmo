import React, { useEffect, useState } from 'react';

function ProductDetails({ productId, onBack }) {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    async function fetchDetails() {
      const response = await fetch(`/api/products/${productId}`);
      const data = await response.json();
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
      {/* Additional product fields */}
    </div>
  );
}

export default ProductDetails;
