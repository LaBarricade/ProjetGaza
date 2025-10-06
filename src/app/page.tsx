"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SearchBar } from "@/app/search-bar";
import { Quote } from "@/components/card";
import { QuoteList } from "@/components/list/quote-list";

export type BaserowData = {
  count: number
  next: null
  previous: null
  results: Quote[]
}

export default function Home() {
  const [data, setData] = useState<BaserowData | null>(null);
  const [filteredResults, setFilteredResults] = useState<Quote[] | null>(null);
  const [loading, setLoading] = useState(true);
  const pageRef = useRef(1);

  const handleResults = useCallback((results: Quote[] | null) => {
    pageRef.current = 1;
    setFilteredResults(results);
  }, []);

  const fetchData = useCallback(async (pageToLoad: number = pageRef.current) => {
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
  }, [setData, setLoading]);

  const loadMore = async () => {
    if (data && data?.count <= data?.results.length) return;
    if (loading) return;
    setLoading(true);
    fetchData(pageRef.current + 1)
    pageRef.current += 1;
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
      <SearchBar onLoading={(loading) => setLoading(loading)} onResults={handleResults} />

      <main className="flex flex-col gap-[32px] row-start-2 justify-center sm:items-center">
        {loading && <p>Chargement des données...</p>}

        {filteredResults && filteredResults.length > 0 && <QuoteList quotes={filteredResults} onEndReached={loadMore} />}
        {!filteredResults && data && data.results.length > 0 && <QuoteList quotes={data.results} totalCount={data.count} onEndReached={loadMore} />}

        {filteredResults && filteredResults.length === 0 && <p>Aucun résultat trouvé.</p>}
        {data && data.results.length === 0 && <p>Aucun résultat trouvé.</p>}
      </main>
    </div>
  );
}
