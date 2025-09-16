'use client';

import { Quote } from "@/components/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type SearchBarProps = {
  onResults?: (results: Quote[] | null) => void; // facultatif
};

export function SearchBar({ onResults }: SearchBarProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!onResults) return; // si pas de callback, on ne fait rien

    const timeout = setTimeout(() => {
      if (query.length === 0) {
        onResults(null);
        return;
      }
      
      const fetchData = async () => {
        const res = await fetch(`/api/baserow?search=${encodeURIComponent(query)}`);
        const data = await res.json();
        onResults(data?.results || []);
      };

      fetchData();
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, onResults]);

  return (
    <div className="sticky top-0 w-full bg-white shadow-md z-50">
      <div className="w-full max-w-md mx-auto p-4">
        <div className="relative w-full flex items-center gap-2">
          
          {/* On n'affiche l'input que si onResults est défini */}
          {onResults && (
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Rechercher"
                className="pr-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            </div>
          )}

          <Button asChild className="shrink-0">
            <Link href="/">Citations</Link>
          </Button>
          
          <Button asChild className="shrink-0">
            <Link href="/personnalites">Personnalités</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
