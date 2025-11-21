"use client";

import { useCallback, useEffect, useState } from "react";
import { TopBar } from "@/app/top-bar";
import { NewsList } from "@/components/list/news-list";
import { Footer } from "../footer";

export type News = {
  text: string;
  date: string;
};

type BaserowNewsData = {
  count: number
  next: null
  previous: null
  results: News[]
}

export default function News() {
  const [data, setData] = useState<BaserowNewsData | null>(null);
  const [filteredResults] = useState<News[] | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLoading = useCallback((isLoading: boolean) => setLoading(isLoading), []);

  const fetchData = useCallback(async () => {
    try {
      const newsRes = await fetch(`/api/news`);
      if (!newsRes.ok) throw new Error("Erreur fetch API");
      const news = await newsRes.json();
      setData(news);

      return news
    } catch (err) {
      console.error("Fetch failed:", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [setData, setLoading]);

  useEffect(() => {
    const fetchDataAsync = async () => {
      await fetchData();
    };
    fetchDataAsync();
  }, []);

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <TopBar onLoading={handleLoading} />

      <main className="flex flex-1 flex-col items-center w-full px-4 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
        {loading && (
          <div className="flex flex-1 items-center h-full">
            <p>Chargement des données...</p>
          </div>
        )}

        {!filteredResults && data && data.results.length > 0 && <NewsList news={data.results} />}
        {data && data.results.length === 0 && (
          <div className="flex flex-1 items-center h-full">
            <p>Aucun résultat trouvé.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
