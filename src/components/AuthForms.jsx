import React, { useState } from 'react';

export default function AuthForms({ onAuthSuccess }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const endpoint = mode === 'signup' ? '/api/signup' : '/api/login';
      const body = mode === 'signup' ? form : { username: form.username, password: form.password };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        // Store JWT in memory only (not localStorage)
        onAuthSuccess({ ...data.user, access_token: data.access_token });
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4 text-center">{mode === 'signup' ? 'Sign Up' : 'Log In'}</h2>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full mb-2 px-3 py-2 rounded text-black"
          required
        />
        {mode === 'signup' && (
          <input
            name="email"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full mb-2 px-3 py-2 rounded text-black"
            required
          />
        )}
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-2 px-3 py-2 rounded text-black"
          required
        />
        {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 py-2 rounded font-semibold mt-2"
          disabled={loading}
        >
          {loading ? 'Please wait...' : mode === 'signup' ? 'Sign Up' : 'Log In'}
        </button>
        <div className="text-xs text-gray-300 mt-3 text-center">
          {mode === 'signup' ? (
            <>
              Already have an account?{' '}
              <button type="button" className="underline" onClick={() => setMode('login')}>Log In</button>
            </>
          ) : (
            <>
              New here?{' '}
              <button type="button" className="underline" onClick={() => setMode('signup')}>Sign Up</button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
