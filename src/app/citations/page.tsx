"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TopBar } from "@/app/top-bar";
import { QuoteList } from "@/components/list/quote-list";
import { Footer } from "../footer";
import {Quote} from "@/types/Quote";

/*export type BaserowData = {
  count: number
  next: null
  previous: null
  results: Quote[]
}*/

export default function QuotesPage() {
  const [items, setItems] = useState<Quote[] | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [filteredResults, setFilteredResults] = useState<Quote[] | null>(null);
  const [loading, setLoading] = useState(true);
  const pageRef = useRef(1);

  const handleResults = useCallback((results: Quote[] | null) => {
    pageRef.current = 1;
    setFilteredResults(results);
  }, []);

  const handleLoading = useCallback((isLoading: boolean) => setLoading(isLoading), []);

  const fetchData = useCallback(async (pageToLoad: number = pageRef.current) => {
    try {
      const res = await fetch(`/api/v2/quotes?page=${pageToLoad}&size=20`);
      if (!res.ok) throw new Error("Erreur fetch API");
      const newData = await res.json();

      setTotalCount(newData.count);

      if (pageToLoad === 1) {
        setItems(newData.items);
      } else {
        setItems(prev => {
          const arr = prev ? [...prev, ...newData.items] : newData.items;
          /*const arr =  prev ? {
            ...newData.data,
            results: [...prev, ...newData.data],
          } : newData.data
          console.log('avant apres', prev, arr)*/
          return arr;
        });
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      setItems(null);
    } finally {
      setLoading(false);
    }
  }, [setItems, setLoading]);

  const loadMore = async () => {
    if (items && totalCount && totalCount <= items.length) return;
    if (loading) return;
    setLoading(true);
    fetchData(pageRef.current + 1)
    pageRef.current += 1;
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <TopBar onLoading={handleLoading} onResults={handleResults} />

      <main className="flex flex-1 flex-col gap-[32px] row-start-2 justify-center sm:items-center items-center w-full px-4 mx-auto">
        {loading && (
          <div className="flex flex-1 items-center h-full">
            <p>Chargement des données...</p>
          </div>
        )}

        {filteredResults && filteredResults.length > 0 &&
            <QuoteList quotes={filteredResults} onEndReached={loadMore} />}
        {!filteredResults && items && items.length > 0 &&
            <QuoteList quotes={items} totalCount={totalCount} onEndReached={loadMore} />}

        {filteredResults && filteredResults.length === 0 && <p>Aucun résultat trouvé.</p>}
        
        {items && items.length === 0 && (
          <div className="flex flex-1 items-center h-full">
            <p>Aucun résultat trouvé.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}