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

  // Handle purchase
  const handlePurchase = async (productId) => {
    try {
      const res = await axios.post("/api/create-checkout-session", {
        product_id: productId,
        success_url: window.location.origin + "/marketplace?success=true",
        cancel_url: window.location.origin + "/marketplace?canceled=true"
      });
      if (res.data && res.data.checkout_url) {
        window.location.href = res.data.checkout_url;
      } else {
        alert("Failed to create checkout session.");
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white/10 backdrop-blur-md shadow-xl p-6 hidden md:block rounded-r-3xl border-l-4 border-purple-400">
        <h2 className="text-xl font-extrabold mb-4 text-purple-200 tracking-widest">Categories</h2>
        <ul className="space-y-2">
          {categories.map(cat => (
            <li key={cat}>
              <button
                className={`w-full text-left px-3 py-2 rounded-xl font-semibold transition-all duration-200 ${category === cat ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg scale-105' : 'hover:bg-purple-200/30 text-purple-100'}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-white drop-shadow-lg tracking-tight">RG Fling Marketplace</h1>
            <p className="text-purple-200 font-medium mt-1">A new way to discover, buy, and sell. Unique, secure, and fun.</p>
          </div>
          <div className="flex gap-2 items-center">
            <input
              className="border-0 rounded-l-xl px-4 py-2 w-64 bg-white/20 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 backdrop-blur-md"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-r-xl shadow-lg hover:scale-105 transition-all">Search</button>
            <button className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold rounded-xl shadow-lg ml-2 hover:scale-105 transition-all">List an Item</button>
          </div>
        </div>
        {/* Product Grid */}
        <h2 className="text-2xl font-bold mb-6 text-purple-100 tracking-wider">Featured</h2>
        {filtered.length === 0 ? (
          <div className="text-center text-purple-200 py-16">
            <p className="text-2xl font-bold">No products found</p>
            <p className="text-md mt-2">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {filtered.map((p, i) => (
              <div key={p.id} className="relative bg-white/10 backdrop-blur-lg border border-purple-300/30 rounded-3xl shadow-2xl p-5 flex flex-col items-center group hover:scale-105 hover:shadow-purple-500/30 transition-all duration-300">
                {/* Glassmorphism effect */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-br from-pink-400 to-purple-500 text-white text-xs px-3 py-1 rounded-full shadow-lg font-bold opacity-90 group-hover:scale-110 transition-all">
                  {p.category}
                </div>
                <img
                  src={p.imageUrl + '?w=300&h=300&fit=crop'}
                  alt={p.name}
                  className="h-36 w-36 object-cover rounded-2xl border-4 border-white/30 shadow mb-4 transition-all duration-300 group-hover:scale-105 bg-gray-200"
                  loading="lazy"
                  style={{ aspectRatio: '1/1', background: '#e5e7eb' }}
                />
                <h3 className="font-extrabold text-lg text-white mb-1 text-center drop-shadow">{p.name}</h3>
                <p className="text-purple-100 text-sm mb-2 text-center line-clamp-2">{p.description}</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-cyan-300 font-bold text-xl">${p.price.toFixed(2)}</span>
                  {p.discount && <span className="bg-pink-400/80 text-white px-2 py-1 rounded-full text-xs font-bold ml-2 animate-pulse">{p.discount} OFF</span>}
                </div>
                <div className="flex gap-3 mt-3 w-full">
                  <button
                    className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow hover:from-pink-500 hover:to-purple-500 transition-all duration-200"
                    onClick={() => handlePurchase(p.id)}
                  >
                    Purchase
                  </button>
                  <button className="flex-1 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold rounded-xl shadow hover:from-blue-500 hover:to-cyan-400 transition-all duration-200">Gift</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Footer Info */}
        <div className="mt-16 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border-t-4 border-purple-400">
          <h3 className="font-extrabold text-xl mb-2 text-purple-100">Secure Payments & Fees</h3>
          <p className="mb-2 text-purple-200"><b>Transaction Fees:</b> 3% per sale. This helps us keep RG Fling unique and secure for everyone.</p>
          <p className="mb-2 text-purple-200"><b>Payment Processing:</b> Stripe-secured. RGX Coins for rewards and activities.</p>
          <a href="#" className="text-cyan-300 underline">Learn more about payments & security</a>
        </div>
      </main>
    </div>
  );
}

export default Marketplace;
