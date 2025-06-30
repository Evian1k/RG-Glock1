import React, { useEffect, useState } from "react";
import axios from "axios";

const categories = [
  "All", "Electronics", "Books", "Home & Kitchen", "Gift Cards", "Accessories", "Groceries", "Home Office", "Fitness", "Digital Assets", "Freelance Services"
];

function Marketplace() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    if (search) {
      axios.get(`/api/products/search?query=${encodeURIComponent(search)}`)
        .then(res => setProducts(res.data));
    } else {
      axios.get("/api/products").then(res => setProducts(res.data));
    }
  }, [search]);

  useEffect(() => {
    let items = products;
    if (category !== "All") {
      items = items.filter(p => p.category === category);
    }
    setFiltered(items);
  }, [products, category]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-4">Departments</h2>
        <ul className="space-y-2">
          {categories.map(cat => (
            <li key={cat}>
              <button
                className={`w-full text-left px-3 py-2 rounded ${category === cat ? 'bg-blue-600 text-white' : 'hover:bg-blue-100'}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">RG Fling Marketplace</h1>
            <p className="text-gray-600">Discover products, assets, and services. Secure payments via Stripe.</p>
          </div>
          <div className="flex gap-2 items-center">
            <input
              className="border rounded px-3 py-2 w-64"
              placeholder="Search Amazon..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="px-4 py-2 bg-green-600 text-white rounded">List an Item</button>
          </div>
        </div>
        {/* Product Grid */}
        <h2 className="text-2xl font-semibold mb-4">Best Sellers</h2>
        {filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <p>No products found</p>
            <p className="text-sm">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((p, i) => (
              <div key={p.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col">
                <img src={p.imageUrl} alt={p.name} className="h-40 w-full object-cover rounded mb-3" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{p.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{p.description}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-500">★</span>
                    <span className="font-semibold">{(4.5 + (i % 5) * 0.1).toFixed(1)}</span>
                    <span className="text-gray-400 text-xs">({(1000 + i * 37).toLocaleString()})</span>
                  </div>
                  <div className="font-bold text-blue-700 text-xl mb-2">${p.price.toFixed(2)}</div>
                  {p.discount && <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs">{p.discount} OFF</span>}
                </div>
                <button className="mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Buy Now</button>
              </div>
            ))}
          </div>
        )}
        {/* Footer Info */}
        <div className="mt-12 bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">Secure Payments & Fees</h3>
          <p className="mb-2"><b>Transaction Fees:</b> A competitive 3% fee is applied to all sales and transactions on the platform. This helps us maintain and improve RG Fling for everyone.</p>
          <p className="mb-2"><b>Payment Processing:</b> Secure payments are processed via Stripe. We do not store your credit card information. RGX Coins are used for platform-specific rewards and activities.</p>
          <a href="#" className="text-blue-600 underline">Learn more about payments & security</a>
        </div>
      </main>
    </div>
  );
}

export default Marketplace;
