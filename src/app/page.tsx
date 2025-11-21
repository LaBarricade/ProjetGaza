"use client";

import { useCallback, useEffect, useState } from "react";
import { TopBar } from "@/app/top-bar";
import { Quote } from "@/components/quote-card";
import { QuoteList } from "@/components/list/quote-list";
import { ChartLine, Users, Calendar1, ArrowRight, Mail } from "lucide-react"
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import CountUp from "react-countup";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Personality } from "./personnalites/page";

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

export default function Home() {
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

          <div className="flex w-full mt-4 justify-center">
            <div className="relative w-full md:max-w-md">
              <Input
                type="text"
                placeholder="Rechercher un politicien, un tag, ou un mot-clé..."
                className="bg-white pr-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            </div>
          </div>

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

      <div className="p-4 bg-white border-t border-black">
        <footer className="w-full max-w-xl mx-auto flex flex-col items-center py-8 space-y-6">

          <div className="w-12 h-1 bg-black rounded-full opacity-70" />

          <a
            href="/mentions-legales"
            className="text-sm hover:underline text-gray-700"
          >
            Mentions légales
          </a>

          <div className="grid grid-cols-4 gap-6 text-gray-700">

            {/* Instagram */}
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center hover:opacity-75"
            >
              <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
              >
                <title>Instagram</title>
                <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/>
              </svg>
              <span className="text-xs mt-1">Instagram</span>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center hover:opacity-75"
            >
              <svg
                role="img"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                xmlns="http://www.w3.org/2000/svg">
                  <title>Facebook</title>
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/>
              </svg>
              <span className="text-xs mt-1">Facebook</span>
            </a>

            {/* X / Twitter */}
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center hover:opacity-75"
            >
              <svg
                role="img"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                  <title>X</title>
                  <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z"/>
              </svg>
              <span className="text-xs mt-1">X</span>
            </a>

            {/* Email */}
            <a
              href="mailto:contact@example.com"
              className="flex flex-col items-center hover:opacity-75"
            >
              <Mail />
              <span className="text-xs mt-1">Email</span>
            </a>

          </div>

          <p className="text-xs text-gray-500 pt-2">
            © {new Date().getFullYear()} La Boussole Gaza — Tous droits réservés.
          </p>
        </footer>
      </div>
    </div>
  );
}
