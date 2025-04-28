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

    try {
      // Step 1: Request signed upload URL from backend
      const res = await fetch(`${backendUrl}/api/generate-upload-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ filename: file.name }),
      });

      const { signedUrl } = await res.json();

      if (!signedUrl) {
        alert('❌ Failed to get signed upload URL');
        return;
      }

      // Step 2: Upload the file directly to Supabase using the signed URL
      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error('Upload to Supabase failed');
      }

      alert(`✅ Uploaded ${file.name} successfully!`);
    } catch (error) {
      console.error('Upload error:', error);
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
        credentials: 'include',
      });

      const data = await res.json();
      setOptimizedProducts(data.seo || []);
      alert(`✅ SEO optimization complete!`);
    } catch (error) {
      console.error('SEO optimization error:', error);
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

// Required for dynamic behavior on Vercel
export async function getServerSideProps() {
  return { props: {} };
}
