// pages/index.js
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

    try {
      const res = await fetch(`${backendUrl}/api/generate-upload-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: uniqueFilename, contentType: file.type })
      });
      const { signedUrl } = await res.json();

      await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      setFileName(uniqueFilename);
      alert(`✅ Uploaded ${file.name}`);
    } catch (error) {
      alert(`❌ Upload failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimizeSEO = async (optimizeAll = false) => {
    if (!fileName) return;
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/optimize-seo${optimizeAll ? '?optimizeAll=true' : ''}`, {
        method: 'POST'
      });
      const data = await res.json();
      setOptimizedProducts(data.seo || []);
      alert(`✅ SEO optimization complete: ${data.report.optimizedCount} products optimized.`);
    } catch (error) {
      alert(`❌ SEO Optimization failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">AI Catalog Optimization</h1>

      <input type="file" accept=".xml,.csv" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleFileUpload} disabled={!file || loading} className="ml-4 bg-blue-600 text-white px-4 py-2">Upload</button>
      <button onClick={() => handleOptimizeSEO(false)} disabled={loading} className="ml-2 px-4 py-2 bg-yellow-500 text-white">Optimize 10</button>
      <button onClick={() => handleOptimizeSEO(true)} disabled={loading} className="ml-2 px-4 py-2 bg-green-600 text-white">Optimize All</button>

      {optimizedProducts.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Optimized Products</h2>
          <ul>
            {optimizedProducts.map((p, idx) => (
              <li key={idx} className="mb-4 border p-3 rounded">
                <strong>{p.ProductID}</strong><br />
                {p.OptimizedDescription}<br />
                GTIN: {p.GTIN || '—'} — {p.Manufacturer || '—'}<br />
                Price: {p.SuggestedPrice || 'N/A'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
