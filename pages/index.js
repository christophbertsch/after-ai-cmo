import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const res = await fetch(`${backendUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMessage = { role: 'assistant', content: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `❌ Chat failed: ${error.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!file || loading) return;

    setLoading(true);
    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: `📤 Uploading ${file.name}...` },
    ]);

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
          { role: 'assistant', content: `✅ Uploaded successfully!` },
          { role: 'assistant', content: "✨ Ready to Optimize SEO for your catalog!" },
        ]);
      } else {
        throw new Error(data.message || 'Unknown upload error');
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `❌ Upload failed: ${error.message}` },
      ]);
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  const handleOptimizeSEO = async () => {
    if (loading) return;

    setLoading(true);
    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: "🚀 Starting SEO optimization..." },
    ]);

    try {
      const res = await fetch(`${backendUrl}/api/optimize-seo`, {
        method: 'POST',
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: "✅ SEO Titles and Descriptions generated!" },
          { role: 'assistant', content: `📦 SEO Results (Sample): ${JSON.stringify(data.seo.slice(0, 3), null, 2)}` },
        ]);
      } else {
        throw new Error(data.message || 'Unknown SEO error');
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
            {m.content}
          </div>
        ))}
      </main>

      <form onSubmit={sendMessage} className="p-4 bg-black flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about catalogs, SEO, products..."
          className="flex-1 rounded-full px-4 py-2 text-black"
          disabled={loading}
        />
        <button type="submit" className="bg-blue-500 px-4 py-2 rounded-full font-semibold hover:bg-blue-600" disabled={loading}>
          Send
        </button>
      </form>

      <div className="p-4 bg-gray-800 flex flex-col items-center space-y-3">
        <input type="file" accept=".csv,.xml" onChange={(e) => setFile(e.target.files[0])} className="text-black" disabled={loading} />
        <button onClick={handleFileUpload} className="bg-green-500 px-4 py-2 rounded-full hover:bg-green-600" disabled={loading || !file}>
          📤 Upload Catalog
        </button>

        <button onClick={handleOptimizeSEO} className="bg-yellow-500 px-4 py-2 rounded-full hover:bg-yellow-600" disabled={loading}>
          ✨ Optimize SEO
        </button>
      </div>
    </div>
  );
}
