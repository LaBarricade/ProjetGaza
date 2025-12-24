"use client";

import { useCallback, useEffect, useState } from "react";
import { TopBar } from "@/app/top-bar";
import { Quote } from "@/components/quote-card";
import { QuoteList } from "@/components/list/quote-list";
import { ChartLine, Users, Calendar1, ArrowRight } from "lucide-react"
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import CountUp from "react-countup";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Personality } from "./personnalites/page";
import { Footer } from "./footer";
import { useRouter } from "next/navigation";

export type BaserowData = {
  count: number
  next: null
  previous: null
  results: Quote[]
}

export type BaserowPersonalityData = {
  count: number
  results: Personality[]
}

export type BaserowQuoteData = {
  count: number
  results: Quote[]
}

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [data, setData] = useState<BaserowData | null>(null);
  const [personalities, setPersonalities] = useState<BaserowPersonalityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [popularTags] = useState(['déni de génocide', 'apartheid', 'complicité de crimes de guerre']);

  const fetchData = useCallback(async () => {
    try {
      const personalitiesRes = await fetch(`/api/personalities`);
      if (!personalitiesRes.ok) throw new Error("Erreur fetch API");
      const personalities = await personalitiesRes.json();
      setPersonalities(personalities);

      const res = await fetch(`/api/baserow?page=1&size=5`);
      if (!res.ok) throw new Error("Erreur fetch API");
      const json = await res.json();

      setData(json);
    } catch (err) {
      console.error("Fetch failed:", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [setData, setLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  //Search functionality
    const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }, [query, router]);

  const handleTagClick = useCallback((tag: string) => {
    router.push(`/search?tag=${encodeURIComponent(tag)}`);
  }, [router]);


  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <TopBar />

      <div className="flex flex-col justify-center items-center min-h-screen h-full w-full bg-gradient-to-br from-[#cbd9f6] via-[#d6d4f5] to-[#decef5]">
        <div className="h-full flex flex-col gap-4 justify-center items-center md:max-w-2xl p-4">
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-5xl font-bold text-center">
              La boussole Gaza
            </h2>
            <h2 className="text-5xl font-bold text-center text-[#5f49ea]">
              Plateforme de contrôle citoyen
            </h2>
          </div>

          <div className="flex flex-col justify-center items-center text-center">
            <h4 className="text-gray-600">Archive des déclarations politiques sur le conflit israélo-palestinien.</h4>
            <h4 className="text-gray-600">Découvrez l&apos;évolution des positions de vos élus dans le temps en fonction de leurs déclarations et de leurs votes.</h4>
          </div>

          <form onSubmit={handleSearch} className="flex w-full mt-4 justify-center">
            <div className="relative w-full md:max-w-md">
              <Input
                type="text"
                placeholder="Rechercher un politicien, un tag, ou un mot-clé..."
                className="bg-white pr-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
                        <button 
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-primary transition-colors"
              >
                <Search className="h-5 w-5 text-gray-500 hover:text-primary" />
              </button>
              {/* <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" /> */}
            </div>
          </form>

          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="min-w-1/3 flex-1 flex flex-col justify-center items-center bg-white rounded-sm p-4">
              <div className="rounded-full bg-purple-300 p-2 mb-2">
                <Users />
              </div>
              <div className="font-bold text-gray-800 text-xl">
                <CountUp end={personalities?.count ?? 0} duration={1.2} />
              </div>
              <div className="text-center text-gray-500">
                Politiciens suivis
              </div>
            </div>
            <div className="min-w-1/3 flex-1 flex flex-col justify-center items-center bg-white rounded-sm p-4">
              <div className="rounded-full bg-purple-300 p-2 mb-2">
                <ChartLine />
              </div>
              <div className="font-bold text-gray-800 text-xl">
                <CountUp end={data?.count ?? 0} duration={1.2} />
              </div>
              <div className="text-center text-gray-500">
                Déclarations archivées
              </div>
            </div>
            <div className="min-w-1/3 flex-1 flex flex-col justify-center items-center bg-white rounded-sm p-4">
              <div className="rounded-full bg-purple-300 p-2 mb-2">
                <Calendar1 />
              </div>
              <div className="font-bold text-gray-800 text-xl">
                2019&nbsp;-&nbsp;<CountUp end={2025} duration={1.2} separator={''} start={2019} />
              </div>
              <div className="text-center text-gray-500">
                Période couverte
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="flex justify-between items-center my-8">
          <h2 className="text-3xl font-bold">Dernières citations</h2>
          <Link href={"/citations"}>
            <Button
              variant="ghost"
              className={`cursor-pointer font-semibold text-primary shrink-0 text-gray-700 border border-gray-300 hover:bg-transparent transition-colors duration-200`}>
              Voir tout
              <ArrowRight />
            </Button>
          </Link>
        </div>
        {loading && <p>Chargement des données...</p>}
        {data && data.results.length > 0 && <QuoteList quotes={data.results} />}
      </div>

      <div className="p-4 bg-gray-100">
        <div className="flex flex-col justify-center items-center my-8">
          <h2 className="text-3xl font-bold">Tags</h2>
          <div className="w-full justify-center flex flex-wrap mt-4 gap-2">
            {popularTags.map((tag) => (
              <span
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="bg-primary/10 text-primary font-bold px-2 py-0.5 mr-1 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-700 text-white">
        <div className="flex flex-col justify-center items-center my-8">
          <h2 className="text-3xl font-bold">Contribuez à l&apos;archive</h2>
          <div className="w-full justify-center flex flex-wrap mt-4 gap-2">
            <p className="text-center max-w-2xl">
              Aidez-nous à enrichir cette archive en nous envoyant des déclarations politiques pertinentes. Votre contribution est précieuse pour documenter les positions des élus sur ce sujet crucial.
            </p>
          </div>
          <div className="w-full justify-center flex flex-wrap mt-4 gap-2">
            <Button
              variant="outline"
              className="cursor-pointer font-semibold text-white
                bg-gradient-to-r from-[#335eeb] to-[#8c35ea] 
                transition-all duration-300">
              <Link
                href="https://baserow.io/form/f0E5WXs2bZZyKRfJIteDPHdv43QOH2BFNhjnNO4gQ6E"
                target="_blank"
              >
                Contribuer
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
