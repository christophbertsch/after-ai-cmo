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
    const formData = new FormData();
    formData.append('file', file);

    try {
      await fetch(`${backendUrl}/api/upload-catalog`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // ✅ Important!
      });
      alert(`✅ Uploaded ${file.name} successfully!`);
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
        method: 'POST',
      });

      const data = await res.json();
      setOptimizedProducts(data.seo || []);
      alert(`✅ SEO optimization complete!`);
    } catch (error) {
      alert(`❌ SEO Optimization failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Product Catalog SEO Optimization</h1>

      <input
        type="file"
        accept=".csv,.xml,.xlsx"
        onChange={(e) => {
          setFile(e.target.files[0]);
          setFileName(e.target.files[0]?.name || '');
        }}
      />
      <button onClick={handleFileUpload} disabled={loading || !file}>
        {loading ? 'Uploading...' : 'Upload Catalog'}
      </button>

      {fileName && (
        <button onClick={() => handleOptimizeSEO(false)} disabled={loading}>
          Optimize First 10 Products
        </button>
      )}

      {optimizedProducts.length > 0 && (
        <div>
          <h3>Optimized Products:</h3>
          <ul>
            {optimizedProducts.map((product, idx) => (
              <li key={idx}>
                <strong>{product.ProductID}</strong>: {product.OptimizedDescription}
              </li>
            ))}
          </ul>
          {optimizedProducts.length === 10 && (
            <button onClick={() => handleOptimizeSEO(true)} disabled={loading}>
              Optimize All Products
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// 👇 Keep this for dynamic pages on Vercel
export async function getServerSideProps() {
  return { props: {} };
}
