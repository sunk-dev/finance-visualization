'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CorpInfo } from '@/types/financial';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CorpInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (query.length < 1) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data.list || []);
        setShowDropdown(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (corp: CorpInfo) => {
    router.push(`/company/${corp.c}`);
    setQuery('');
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 0 && setShowDropdown(true)}
          placeholder="회사명이나 종목코드를 입력하세요..."
          className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
        />
        {loading && (
          <div className="absolute right-4 top-3.5">
            <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.map((corp) => (
            <button
              key={corp.c}
              onClick={() => handleSelect(corp)}
              className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition"
            >
              <div className="font-semibold text-gray-900">{corp.n}</div>
              <div className="text-sm text-gray-500">
                {corp.c} • {corp.s}
              </div>
            </button>
          ))}
        </div>
      )}

      {showDropdown && results.length === 0 && query.length > 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 px-4 py-3 text-gray-500">
          검색 결과가 없습니다
        </div>
      )}
    </div>
  );
}
