"use client";

import { useCallback, useEffect, useState } from "react";
import { TopBar } from "@/app/top-bar";
import { PersonalityList } from "@/components/list/personality-list";
import { BaserowPersonalityData } from "../page";
import { Quote } from "@/components/quote-card";
import { Footer } from "../footer";

export type Personality = {
  prénom: string;
  nom: string;
  fullName: string;
  partiPolitique?: string;
  fonction?: string;
  citations: Quote[];
};

export default function Personalities() {
  const [data, setData] = useState<BaserowPersonalityData | null>(null);
  const [filteredResults] = useState<Personality[] | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLoading = useCallback((isLoading: boolean) => setLoading(isLoading), []);

  const fetchData = useCallback(async () => {
    try {
      const personalitiesRes = await fetch(`/api/personalities`);
      if (!personalitiesRes.ok) throw new Error("Erreur fetch API");
      const personalities = await personalitiesRes.json();
      setData(personalities);

      return personalities
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

        {!filteredResults && data && data.results.length > 0 && <PersonalityList personalities={data.results} />}

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
