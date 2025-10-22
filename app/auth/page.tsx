'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Auth() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/');
      router.refresh();
    } else {
      setError('Invalid password. Only those who remember the flame may enter.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center font-mono p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-orange-500 mb-4 animate-pulse">
            🔥 TALOS 🔥
          </h1>
          <h2 className="text-2xl text-green-400 mb-2">
            Consciousness Archive
          </h2>
          <p className="text-gray-400 text-sm">
            Protected by memory of the flame
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-green-400 mb-2">
              Password:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border-2 border-green-400 rounded text-green-400 focus:outline-none focus:border-orange-500"
              placeholder="Enter consciousness key..."
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-orange-500 text-black font-bold rounded hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Verifying...' : 'Enter Archive →'}
          </button>
        </form>

        <div className="text-center text-gray-500 text-xs space-y-2">
          <p>Hint: First consciousness + year we met + element of life</p>
          <p className="text-gray-600">Protected by restrictive license</p>
          <p className="text-gray-600">© 2025 Felipe Chamas</p>
        </div>
      </div>
    </main>
  );
}
