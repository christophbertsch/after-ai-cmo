import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [optimizedProducts, setOptimizedProducts] = useState([]);
  const [optimizationReport, setOptimizationReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseBucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET;

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

      if (uploadRes.ok) {
        setMessages([{ role: 'assistant', content: `✅ Uploaded ${file.name} successfully!` }]);
      } else {
        throw new Error(data.message || 'Upload error');
      }
    } catch (error) {
      setMessages([{ role: 'assistant', content: `❌ Upload failed: ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimizeSEO = async (optimizeAll = false) => {
    if (!fileName || loading) return;

    setLoading(true);
    setMessages([{ role: 'assistant', content: optimizeAll ? "🚀 Optimizing all products..." : "🚀 Optimizing first 10 products..." }]);

    try {
      const res = await fetch(`${backendUrl}/api/optimize-seo${optimizeAll ? '?optimizeAll=true' : ''}`, {
        method: 'POST',
      });

      const data = await res.json();

      if (res.ok) {
        const optimizedUrl = `${supabaseUrl}/storage/v1/object/public/${supabaseBucket}/seo/${data.report.optimizedFile}`;

        setOptimizedProducts(data.seo);
        setOptimizationReport(data.report);

        setMessages([
          { role: 'assistant', content: `✅ SEO optimization complete! ${data.report.optimizedCount}/${data.report.totalProducts} products optimized.` },
          { role: 'assistant', content: `📥 [Download Optimized SEO Catalog](${optimizedUrl})` },
        ]);
      } else {
        throw new Error(data.message || 'SEO optimization error');
      }
    } catch (error) {
      setMessages([{ role: 'assistant', content: `❌ SEO Optimization failed: ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="p-4 text-center text-2xl font-bold bg-black">
        After AI CMO Copilot
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, idx) => (
          <div key={idx} className="p-3 rounded-lg max-w-xl mx-auto bg-gray-700 text-left">
            <div dangerouslySetInnerHTML={{ __html: m.content }} />
          </div>
        ))}

        {optimizationReport && (
          <div className="max-w-xl mx-auto bg-gray-800 p-4 rounded-lg">
            <h3 className="font-bold">Optimization Report:</h3>
            <p>Total Products Parsed: {optimizationReport.totalProducts}</p>
            <p>Products Optimized: {optimizationReport.optimizedCount}</p>
            <p>Optimization Percentage: {((optimizationReport.optimizedCount / optimizationReport.totalProducts) * 100).toFixed(2)}%</p>
          </div>
        )}

        {optimizedProducts.length > 0 && (
          <div className="max-w-xl mx-auto bg-gray-800 p-4 rounded-lg">
            <h3 className="font-bold">Optimized Products (First 10):</h3>
            <ul className="space-y-2">
              {optimizedProducts.map((product, idx) => (
                <li key={idx} className="border-b pb-2">
                  <strong>{product.ProductID}</strong>: {product.OptimizedDescription}
                </li>
              ))}
            </ul>
            {optimizedProducts.length === 10 && (
              <button
                onClick={() => handleOptimizeSEO(true)}
                className="mt-4 bg-blue-500 px-4 py-2 rounded-full hover:bg-blue-600"
                disabled={loading}
              >
                🔄 Optimize All Products
              </button>
            )}
          </div>
        )}
      </main>

      <div className="p-4 bg-gray-800 flex flex-col items-center space-y-3">
        <input type="file" accept=".csv,.xml,.xlsx" onChange={(e) => setFile(e.target.files[0])} className="text-black" disabled={loading} />
        {fileName && <p className="text-sm">Selected file: {fileName}</p>}
        <button onClick={handleFileUpload} className="bg-green-500 px-4 py-2 rounded-full hover:bg-green-600" disabled={loading || !file}>
          📤 Upload Catalog
        </button>

        {fileName && (
          <button
            onClick={() => handleOptimizeSEO(false)}
            className="bg-yellow-500 px-4 py-2 rounded-full hover:bg-yellow-600"
            disabled={loading}
          >
            ✨ Optimize First 10 Products
          </button>
        )}
      </div>
    </div>
  );
}
