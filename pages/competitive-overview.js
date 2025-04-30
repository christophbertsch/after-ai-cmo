// competitive-overview.js
import { useEffect, useState } from 'react';

export default function CompetitiveOverview() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/get-optimized-products')
      .then(res => res.json())
      .then(data => setProducts(data.products || []));
  }, []);

  const filtered = products.filter(p => p.product_id?.includes(search));

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Competitive Overview</h1>
      <input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} className="border p-2 mb-4 w-full" />
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th>Product</th><th>GTIN</th><th>Your Price</th><th>Market Price</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p, i) => {
            const market = parseFloat((p.market_price_range || '').split('–')[0]?.replace(/[^\d.]/g, '') || 0);
            const yours = parseFloat(p.suggested_price?.replace(/[^\d.]/g, '') || 0);
            return (
              <tr key={i} className="border-t">
                <td>{p.product_id}</td>
                <td>{p.gtin}</td>
                <td>{p.suggested_price}</td>
                <td>{p.market_price_range} ({(yours - market).toFixed(2)})</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
