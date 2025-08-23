"use client";

import { useEffect, useState } from "react";
import { SearchBar } from "@/app/search-bar";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <SearchBar />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div>
          <h1>🍉 Girouettes</h1>
        </div>
        {loading && <p>Chargement des données...</p>}
        {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
        {!loading && !data && <p>Impossible de récupérer les données.</p>}
      </main>
    </div>
  );
}
