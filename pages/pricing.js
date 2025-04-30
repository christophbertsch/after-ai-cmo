// pricing.js
export default function Pricing() {
  const startCheckout = async () => {
    const res = await fetch('/api/create-checkout-session', { method: 'POST' });
    const { url } = await res.json();
    if (url) window.location.href = url;
  };
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Pro Plan - €49/month</h1>
      <p>✔ 10,000 products optimized<br />✔ Amazon & OCI exports<br />✔ Competitive intelligence</p>
      <button className="mt-4 bg-blue-600 px-4 py-2 text-white" onClick={startCheckout}>Subscribe</button>
    </div>
  );
}

