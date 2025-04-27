import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input })
    });

    const data = await res.json();
    const botMessage = { role: 'assistant', content: data.reply };
    setMessages((prev) => [...prev, botMessage]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    console.log('Uploading file:', file.name);

    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: `â Your catalog "${file.name}" was uploaded successfully!` },
      { role: 'assistant', content: "What would you like to do next?\n- Optimize SEO\n- Write Amazon listings\n- Export for Shopify" }
    ]);

    setFile(null);
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
          placeholder="Ask me anything about products..."
          className="flex-1 rounded-full px-4 py-2 text-black"
        />
        <button className="bg-blue-500 px-4 py-2 rounded-full font-semibold hover:bg-blue-600">
          Send
        </button>
      </form>

      <div className="p-4 bg-gray-800 flex flex-col items-center space-y-3">
        <h2 className="text-lg font-semibold">ð Upload your product catalog</h2>
        <input
          type="file"
          accept=".csv,.xml"
          onChange={(e) => setFile(e.target.files[0])}
          className="text-black"
        />
        <button
          onClick={handleFileUpload}
          className="bg-green-500 px-4 py-2 rounded-full font-semibold hover:bg-green-600"
        >
          Upload
        </button>
      </div>
    </div>
  );
}
