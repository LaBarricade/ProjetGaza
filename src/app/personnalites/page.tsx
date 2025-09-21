"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SearchBar } from "@/app/search-bar";
import { PersonalityList } from "@/components/list/personality-list";
import { Quote } from "@/components/card";
import { citationsByPersonality, Personality } from "@/lib/citations-group-by-personality";
import { BaserowData } from "../page";

export default function Home() {
  const [data, setData] = useState<BaserowData | null>(null);
  const [filteredResults, setFilteredResults] = useState<Personality[] | null>(null);
  const [loading, setLoading] = useState(true);
  const pageRef = useRef(1);

  const handleResults = useCallback((results: Quote[] | null) => {
    pageRef.current = 1
    const personalities = citationsByPersonality(results)
    setFilteredResults(personalities);
  }, []);

  const fetchData = useCallback(async (pageToLoad: number = pageRef.current) => {
    try {
      const res = await fetch(`/api/baserow?page=${pageToLoad}&size=50`);
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

      return json;
    } catch (err) {
      console.error("Fetch failed:", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [setData, setLoading]);

  const loadMore = useCallback(async () => {
    const newData = await fetchData(pageRef.current + 1);
    if (!newData) return false;

    pageRef.current += 1;
    await fetchData(pageRef.current);
    return newData.results.length > 0;

  }, [fetchData]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // charge la première page
      await fetchData(1);

      // boucle pour charger les suivantes
      while (!cancelled) {
        const hasMore = await loadMore();
        if (!hasMore) {
          break;
        }
        await new Promise(r => setTimeout(r, 100)); // throttle un peu
      }
    })();

    return () => { cancelled = true; }
  }, [fetchData, loadMore]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
      <SearchBar onResults={handleResults} />

      <main className="flex flex-col gap-[32px] min-h-full row-start-2 items-center sm:items-start">
        {loading && <p>Chargement des données...</p>}

        {filteredResults && filteredResults.length > 0 && <PersonalityList personalities={filteredResults} />}
        {!filteredResults && data && data.results.length > 0 && <PersonalityList personalities={citationsByPersonality(data.results)!} />}

        {!loading && !data && <p>Impossible de récupérer les données.</p>}
        {filteredResults && filteredResults.length === 0 && <p>Aucun résultat trouvé.</p>}
        {data && data.results.length === 0 && <p>Aucun résultat trouvé.</p>}
      </main>
    </div>
  );
}
