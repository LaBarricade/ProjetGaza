'use client';

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [, setResults] = useState([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.length === 0) return;

      const fetchData = async () => {
        const res = await fetch(`/api/baserow?search=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data?.results || []);
      };

      fetchData();
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="absolute top-0 w-full bg-white shadow-md z-50">
      <div className="w-full max-w-md mx-auto p-4">
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Rechercher"
            className="pr-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
        </div>
      </div>
    </div>
  );
}
