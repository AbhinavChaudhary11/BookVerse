import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(q);
      }}
      className="flex gap-3 w-full max-w-prose mx-0"
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by title or author"
        className="border rounded-lg px-4 py-1 flex-1 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
      />
      <button className="px-6 py-1 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg font-semibold shadow">
        Search
      </button>
    </form>
  );
}
