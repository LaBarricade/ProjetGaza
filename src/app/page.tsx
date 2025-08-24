"use client";

import { useCallback, useEffect, useState } from "react";
import { SearchBar } from "@/app/search-bar";
import QuoteList from "@/components/list";
import { Quote } from "@/components/card";

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

  const handleResults = useCallback((results: Quote[] | null) => {
    setFilteredResults(results);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
        const res = await fetch(`${baseUrl}/api/baserow`);
        if (!res.ok) throw new Error("Erreur fetch API");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Fetch failed:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
      <SearchBar onResults={handleResults} />

      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {loading && <p>Chargement des données...</p>}

        {filteredResults && filteredResults.length > 0 && <QuoteList quotes={filteredResults} />}
        {!filteredResults && data && <QuoteList quotes={data.results} />}

        {!loading && !data && <p>Impossible de récupérer les données.</p>}
        {filteredResults && filteredResults.length === 0 && <p>Aucun résultat trouvé.</p>}
      </main>
    </div>
  );
}
