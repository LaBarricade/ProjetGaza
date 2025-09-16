"use client";

import { useCallback, useEffect, useState } from "react";
import { SearchBar } from "@/app/search-bar";
import { QuoteList } from "@/components/list";
import { Quote } from "@/components/card";

export type BaserowData = {
  count: number
  next: null
  previous: null
  results: Quote[]
}

export default function Home() {
  const [data, setData] = useState<BaserowData | null>(null);
  const [page, setPage] = useState(1);
  const [filteredResults, setFilteredResults] = useState<Quote[] | null>(null);
  const [loading, setLoading] = useState(true);

  const handleResults = useCallback((results: Quote[] | null) => {
    setPage(1)
    setFilteredResults(results);
  }, []);

  const fetchData = async (pageToLoad: number = page) => {
    try {
      const res = await fetch(`/api/baserow?page=${pageToLoad}&size=20`);
      if (!res.ok) throw new Error("Erreur fetch API");
      const json = await res.json();

      if (pageToLoad === 1) {
        setData(json);
      } else {
        setData(prev => prev ? {
          ...json,
          results: [...prev.results, ...json.results],
        } : json);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (data && data?.count <= data?.results.length) return;
    if (loading) return;
    setLoading(true);
    fetchData(page + 1)
    setPage(prev => prev + 1);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
      <SearchBar onResults={handleResults} />

      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {loading && <p>Chargement des données...</p>}

        {filteredResults && filteredResults.length > 0 && <QuoteList quotes={filteredResults} onEndReached={loadMore} />}
        {!filteredResults && data && <QuoteList quotes={data.results} onEndReached={loadMore} />}

        {!loading && !data && <p>Impossible de récupérer les données.</p>}
        {filteredResults && filteredResults.length === 0 && <p>Aucun résultat trouvé.</p>}
      </main>
    </div>
  );
}
