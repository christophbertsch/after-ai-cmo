import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const uploadCatalog = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await fetch(`${backendUrl}/api/upload-catalog`, {
        method: 'POST',
        body: formData,
      });
      setStatus('✅ Catalog uploaded successfully!');
      extractProducts();
    } catch (error) {
      setStatus(`❌ Upload failed: ${error.message}`);
      setLoading(false);
    }
  };

  const extractProducts = async () => {
    const res = await fetch(`${backendUrl}/api/extract-products`);
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      const chunk = decoder.decode(value, { stream: true });
      setStatus(chunk);
    }
    setLoading(false);
  };

  const optimizeProducts = async (optimizeAll = false) => {
    setLoading(true);
    const endpoint = optimizeAll ? 'all=true' : 'all=false';
    const res = await fetch(`${backendUrl}/api/optimize-seo?${endpoint}`);
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      const chunk = decoder.decode(value, { stream: true });
      setStatus(chunk);
    }
    integrateCatalog();
  };

  const integrateCatalog = async () => {
    const res = await fetch(`${backendUrl}/api/integrate-catalog`);
    const data = await res.json();
    setStatus(data.message);
    setLoading(false);
  };

  return (
    <div>
      <h1>Catalog SEO Optimization</h1>
      <input type="file" accept=".csv,.xml,.xlsx" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadCatalog} disabled={loading || !file}>Upload Catalog</button>

      {status && <div style={{ marginTop: '20px' }}>{status}</div>}

      {!loading && status.includes('✅ All products extracted successfully!') && (
        <button onClick={() => optimizeProducts(false)}>Optimize First 10 Products</button>
      )}

      {!loading && status.includes('✅ SEO optimization of first 10 products complete!') && (
        <button onClick={() => optimizeProducts(true)}>Optimize All Products</button>
      )}
    </div>
  );
}
