import React, { useState } from 'react';

function ProductsContainer() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [optimizedProducts, setOptimizedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const handleFileUpload = async () => {
    if (!file || loading) return;

    setLoading(true);
    setFileName(file.name);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadRes = await fetch(`${backendUrl}/api/upload-catalog`, {
        method: 'POST',
        body: formData,
      });

      const data = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(data.message || 'Upload failed');

      alert(`✅ Uploaded ${file.name} successfully!`);
    } catch (error) {
      alert(`❌ Upload failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimizeSEO = async (optimizeAll = false) => {
    if (!fileName || loading) return;

    setLoading(true);

    try {
      const res = await fetch(`${backendUrl}/api/optimize-seo${optimizeAll ? '?optimizeAll=true' : ''}`, {
        method: 'POST',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Optimization failed');

      setOptimizedProducts(data.seo);
      alert(`✅ SEO optimization complete for ${data.report.optimizedCount} products.`);
    } catch (error) {
      alert(`❌ Optimization failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <input
        type="file"
        accept=".csv,.xml,.xlsx"
        onChange={(e) => setFile(e.target.files[0])}
        disabled={loading}
      />

      <button
        onClick={handleFileUpload}
        disabled={loading || !file}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        📤 Upload Catalog
      </button>

      {fileName && (
        <button
          onClick={() => handleOptimizeSEO(false)}
          disabled={loading}
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          ✨ Optimize First 10 Products
        </button>
      )}

      {optimizedProducts.length === 10 && (
        <button
          onClick={() => handleOptimizeSEO(true)}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          🔄 Optimize All Products
        </button>
      )}

      <ul>
        {optimizedProducts.map((product, idx) => (
          <li key={idx} className="border-b py-2">
            <strong>{product.ProductID}</strong>: {product.OptimizedDescription}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductsContainer;
