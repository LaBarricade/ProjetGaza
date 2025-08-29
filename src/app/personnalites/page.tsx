"use client";

import { useCallback, useEffect, useState } from "react";
import { SearchBar } from "@/app/search-bar";
import { PersonalityList } from "@/components/list";
import { Quote } from "@/components/card";

export type Personality = {
  nom: string;
  partiPolitique?: string;
  fonction?: string;
  citations: Quote[];
};

export const getPersonalityList = (results: Quote[] | null) => {
  if (!results) {
    return null;
  }

  const map = new Map<string, Personality>();

  for (const r of results) {
    const nom = r["Personnalité politique"];

    if (!nom) continue

    if (!map.has(nom)) {
      map.set(nom, {
        nom,
        partiPolitique: r["Parti politique"],
        fonction: r["Fonction"],
        citations: [r],
      });
    } else {
      map.get(nom)!.citations.push(r);
    }
  }

  return Array.from(map.values());
}

export default function Home() {
  const [data, setData] = useState<Personality[] | null>(null);
  const [filteredResults, setFilteredResults] = useState<Personality[] | null>(null);
  const [loading, setLoading] = useState(true);

  

  const handleResults = useCallback((results: Quote[] | null) => {
    const personalities = getPersonalityList(results)
    setFilteredResults(personalities);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/baserow`);
        if (!res.ok) throw new Error("Erreur fetch API");
        const json = await res.json();
        const personalities = getPersonalityList(json.results)
        setData(personalities);
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

        {filteredResults && filteredResults.length > 0 && <PersonalityList personalities={filteredResults} />}
        {!filteredResults && data && <PersonalityList personalities={data} />}

        {!loading && !data && <p>Impossible de récupérer les données.</p>}
        {filteredResults && filteredResults.length === 0 && <p>Aucun résultat trouvé.</p>}
      </main>
    </div>
  );
}
