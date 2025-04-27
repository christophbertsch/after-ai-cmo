import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

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

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="p-4 text-center text-2xl font-bold bg-black">After AI CMO Copilot</header>
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, idx) => (
          <div key={idx} className={\`p-3 rounded-lg max-w-xl mx-auto \${m.role === 'user' ? 'bg-blue-600 text-right' : 'bg-gray-700 text-left'}\`}>
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
    </div>
  );
}
