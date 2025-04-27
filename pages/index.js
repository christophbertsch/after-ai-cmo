import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [optimizedFileUrl, setOptimizedFileUrl] = useState('');
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

      if (uploadRes.ok) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `✅ Uploaded ${file.name} successfully!` },
        ]);
      } else {
        throw new Error(data.message || 'Upload error');
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `❌ Upload failed: ${error.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimizeSEO = async () => {
    if (!fileName || loading) return;

    setLoading(true);
    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: "🚀 Optimizing SEO..." },
    ]);

    try {
      const res = await fetch(`${backendUrl}/api/optimize-seo`, {
        method: 'POST',
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `✅ SEO optimization complete! ${data.report.changesMade} products optimized.` },
        ]);

        const optimizedUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}/seo/${data.report.optimizedFile}`;

        setOptimizedFileUrl(optimizedUrl);

        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `📥 [Download Optimized SEO Catalog](${optimizedUrl})` },
        ]);
      } else {
        throw new Error(data.message || 'SEO optimization error');
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `❌ SEO Optimization failed: ${error.message}` },
      ]);
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
          <div
            key={idx}
            className={`p-3 rounded-lg max-w-xl mx-auto ${m.role === 'user' ? 'bg-blue-600 text-right' : 'bg-gray-700 text-left'}`}
          >
            <div dangerouslySetInnerHTML={{ __html: m.content }} />
          </div>
        ))}
      </main>

      <div className="p-4 bg-gray-800 flex flex-col items-center space-y-3">
        <input type="file" accept=".csv,.xml,.xlsx" onChange={(e) => setFile(e.target.files[0])} className="text-black" disabled={loading} />
        {fileName && <p className="text-sm">Selected file: {fileName}</p>}
        <button onClick={handleFileUpload} className="bg-green-500 px-4 py-2 rounded-full hover:bg-green-600" disabled={loading || !file}>
          📤 Upload Catalog
        </button>

        {fileName && (
          <button onClick={handleOptimizeSEO} className="bg-yellow-500 px-4 py-2 rounded-full hover:bg-yellow-600" disabled={loading}>
            ✨ Optimize SEO
          </button>
        )}
      </div>
    </div>
  );
}
