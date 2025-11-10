"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TopBar } from "@/app/top-bar";
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

  const handleLoading = useCallback((isLoading: boolean) => setLoading(isLoading), []);

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
    <div className="flex flex-col items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <TopBar onLoading={handleLoading}  onResults={handleResults} />

      <main className="flex flex-1 flex-col items-center w-full px-4 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
        {loading && (
          <div className="flex flex-1 items-center h-full">
            <p>Chargement des données...</p>
          </div>
        )}

        {filteredResults && filteredResults.length > 0 && <PersonalityList personalities={filteredResults} />}
        {!filteredResults && data && data.results.length > 0 && <PersonalityList personalities={citationsByPersonality(data.results)!} />}

        {filteredResults && filteredResults.length === 0 && <p>Aucun résultat trouvé.</p>}
        {data && data.results.length === 0 && <p>Aucun résultat trouvé.</p>}
      </main>
    </div>
  );
}
