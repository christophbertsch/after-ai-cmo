// index.js
import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [optimizedProducts, setOptimizedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const handleFileUpload = async () => {
    if (!file) return;
    setLoading(true);
    const timestamp = Date.now();
    const uniqueFilename = `${timestamp}-${file.name}`;

    const res = await fetch(`${backendUrl}/api/generate-upload-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: uniqueFilename })
    });
    const { signedUrl } = await res.json();

    await fetch(signedUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });
    setFileName(uniqueFilename);
    alert(`✅ Uploaded ${file.name}`);
    setLoading(false);
  };

  const handleOptimizeSEO = async (optimizeAll = false) => {
    if (!fileName) return;
    setLoading(true);
    const res = await fetch(`${backendUrl}/api/optimize-seo${optimizeAll ? '?optimizeAll=true' : ''}`, {
      method: 'POST'
    });
    const data = await res.json();
    setOptimizedProducts(data.seo);
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">AI Catalog Optimization</h1>
      <input type="file" accept=".xml,.csv" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleFileUpload} disabled={!file || loading} className="ml-4 bg-blue-600 text-white px-4 py-2">Upload</button>
      <button onClick={() => handleOptimizeSEO(false)} className="ml-2 px-4 py-2 bg-yellow-500 text-white">Optimize 10</button>
      <button onClick={() => handleOptimizeSEO(true)} className="ml-2 px-4 py-2 bg-green-500 text-white">Optimize All</button>

      {optimizedProducts.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Optimized Products</h2>
          <ul>
            {optimizedProducts.slice(0, 10).map((product, i) => (
              <li key={i} className="border p-2 mb-2">
                <strong>{product.ProductID}</strong>: {product.OptimizedDescription}<br />
                GTIN: {product.GTIN} — Manufacturer: {product.Manufacturer}<br />
                Price: {product.SuggestedPrice || '-'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

