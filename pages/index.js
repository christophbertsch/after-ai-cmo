import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const handleFileUpload = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const uniqueFilename = `${Date.now()}-${file.name}`;

      const res = await fetch(`${backendUrl}/api/generate-upload-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ filename: uniqueFilename }),
      });

      const { signedUrl } = await res.json();

      if (!signedUrl) {
        alert('❌ Failed to get signed upload URL');
        return;
      }

      await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      setFileName(uniqueFilename);
      alert(`✅ Uploaded ${file.name} successfully!`);
    } catch (error) {
      console.error('Upload error:', error);
      alert(`❌ Upload failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExtractProducts = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${backendUrl}/api/extract-products`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await res.json();
      alert(`✅ Products extracted: ${data.totalProducts}`);
    } catch (error) {
      console.error('Extract error:', error);
      alert(`❌ Extraction failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimizeSEO = async (optimizeAll = false) => {
    setLoading(true);

    try {
      const res = await fetch(`${backendUrl}/api/optimize-seo${optimizeAll ? '?optimizeAll=true' : ''}`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await res.json();
      alert(`✅ SEO optimization complete! Products optimized: ${data.report.optimizedCount}`);
    } catch (error) {
      console.error('SEO optimization error:', error);
      alert(`❌ SEO Optimization failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleConvertToOCI = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${backendUrl}/api/convert-to-oci`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await res.json();
      alert(`✅ OCI Catalog created! Products: ${data.ociProductsCount}`);
    } catch (error) {
      console.error('OCI conversion error:', error);
      alert(`❌ OCI Conversion failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>After AI CMO Copilot</h1>

      <input
        type="file"
        accept=".csv,.xml,.xlsx"
        onChange={(e) => {
          setFile(e.target.files[0]);
          setFileName('');
        }}
      />

      <div style={{ marginTop: '20px' }}>
        <button onClick={handleFileUpload} disabled={loading || !file}>
          {loading ? 'Uploading...' : '1️⃣ Upload Catalog'}
        </button>

        <button onClick={handleExtractProducts} disabled={loading}>
          2️⃣ Extract Products
        </button>

        <button onClick={() => handleOptimizeSEO(false)} disabled={loading}>
          3️⃣ Optimize First 10 Products
        </button>

        <button onClick={() => handleOptimizeSEO(true)} disabled={loading}>
          4️⃣ Optimize All Products
        </button>

        <button onClick={handleConvertToOCI} disabled={loading}>
          5️⃣ Convert to OCI
        </button>
      </div>

      {fileName && <p style={{ marginTop: '10px' }}>Selected file: {fileName}</p>}
    </div>
  );
}

// Dynamic behavior on Vercel
export async function getServerSideProps() {
  return { props: {} };
}
