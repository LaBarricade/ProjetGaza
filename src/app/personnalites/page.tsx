"use client";

import { useCallback, useEffect, useState } from "react";
import { TopBar } from "@/app/top-bar";
import { PersonalityList } from "@/components/list/personality-list";
import { Footer } from "../footer";
import {Personality} from "@/types/Personality";
import {callApi} from "@/lib/api-client";

export default function PersonalitiesPage() {
  const [data, setData] = useState<Personality[] | null>(null);
  const [filteredResults] = useState<Personality[] | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLoading = useCallback((isLoading: boolean) => setLoading(isLoading), []);

  const fetchData = useCallback(async () => {
    try {
      const apiResp = await callApi(`/api/v2/personalities`);
      const personalities = apiResp.items;
      setData(personalities);

      //return personalities
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
    <main className="flex flex-1 flex-col items-center w-full px-4 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
      {loading && (
        <div className="flex flex-1 items-center h-full">
          <p>Chargement des données...</p>
        </div>
      )}

      {!filteredResults && data && data.length > 0 && <PersonalityList personalities={data} />}

      {data && data.length === 0 && (
        <div className="flex flex-1 items-center h-full">
          <p>Aucun résultat trouvé.</p>
        </div>
      )}
    </main>
  );
}
