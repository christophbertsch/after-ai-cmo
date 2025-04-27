import React, { useEffect, useState } from 'react';

function ProductDetails({ productId, onBack }) {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    async function fetchDetails() {
      const res = await fetch(`/api/products/${productId}`);
      const data = await res.json();
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
      {/* Other detailed fields */}
    </div>
  );
}

export default ProductDetails;
