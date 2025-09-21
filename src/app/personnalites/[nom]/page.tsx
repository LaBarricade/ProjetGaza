"use client";

import { SearchBar } from "@/app/search-bar";
import { QuoteList } from "@/components/list/quote-list";
import { citationsByPersonality, Personality } from "@/lib/citations-group-by-personality";
import { getPoliticalPortrait } from "@/lib/political-portrait";
import { useParams } from "next/navigation";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Quote } from "@/components/card";
import { LogoParti } from "@/components/logo/parti";

async function getPersonality(nom: string): Promise<Personality | null> {
  const res = await fetch(`/api/baserow?search=${encodeURIComponent(nom).replaceAll('-', ' ')}`);
  const data = await res.json();

  if (!Array.isArray(data.results) || data.results.length === 0) return null;
  
  const personalities = citationsByPersonality(data.results)
  if (!Array.isArray(personalities) || personalities.length === 0) return null;

  return personalities[0]
}

export default function PersonalityPage() {
  const params = useParams<{ nom: string }>()

  const timelineRef = useRef<HTMLDivElement>(null);
  const { nom } = params?.nom ? params : {}

  const [personality, setPersonality] = useState<Personality | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageUrlLoading, setImageUrlLoading] = useState(false);

  // inject TimelineJS
  const createTimeline = (personality: Personality) => {
    if (!personality.citations?.length) return;

    return {
      title: { text: { headline: "Frise des citations", text: "" } },
      events: personality.citations.map((q: Quote, i: number) => {
        const [year, month, day] = q.date.split("-").map(Number);

        return {
          start_date: {
            year,
            month,
            day,
          },
          text: { headline: q.source?.value ?? `Citation #${i + 1}`, text: q.citation },
        }
      }),
    };
  }

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.knightlab.com/libs/timeline3/latest/js/timeline.js";
    script.async = true;
    script.onload = () => {
      // @ts-expect-error parce que que chatgpt me dit que c'est ça qu'il faut faire et que je suis un garçon plutôt facile.
      if (window.TL && timelineRef.current) {
        const options = {
          lang: "fr",
          initial_zoom: 2,
          timenav_position: "bottom"
        };

        // @ts-expect-error same
        new window.TL.Timeline(timelineRef.current, createTimeline(personality), options);
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [personality]);
  
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.knightlab.com/libs/timeline3/latest/css/timeline.css";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const p = await getPersonality(nom as string);
        setPersonality(p);

        if (p) {
          createTimeline(p);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
        setPersonality(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [nom]);
  
  useEffect(() => {
    if (personality) {
      setImageUrlLoading(true);

      const fetchImage = async () => {
        const url = await getPoliticalPortrait(personality.fullName as string);
        setImageUrl(url);
        setImageUrlLoading(false);
      };

      fetchImage();
    }
  }, [personality]);

  if (loading) return (
    <div className="h-screen flex justify-center items-center">
      <p>Chargement des données...</p>
    </div>
  )
  if (!personality) return (
    <div className="h-screen flex justify-center items-center">
      <p>Personnalité non trouvée</p>
    </div>
  )

  return (
    <>
      <SearchBar />
      <div className="mx-auto p-6">
        {!imageUrlLoading ? (
          imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${personality.fullName} portrait`}
              width={96}
              height={96}
              className="mb-4 object-cover rounded-full w-24 h-auto"
              style={{ width: "100px", height: "auto" }}
            />
          ) : (
            'Pas de photo trouvé'
          )
        ) :
          <p>Chargement de l&apos;image...</p>
        }
        <h1 className="text-3xl font-bold mb-4">{personality.fullName}</h1>
        <div className="space-y-2 text-gray-700">
          {personality.partiPolitique && (<div className="flex items-center">
            <span className="font-semibold">Parti politique :</span>
            <span className="ml-4">
              <LogoParti parti={personality.partiPolitique} />
            </span>
          </div>)
          }
          <p><span className="font-semibold">Fonction :</span> {personality.fonction}</p>
        </div>

        {/* Timeline */}
        {personality.citations.length > 0 && (
          <div ref={timelineRef} style={{ width: "100%", height: "500px" }} />
        )}

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Citations</h2>
          {personality.citations.length > 0 && <QuoteList quotes={personality.citations} />}
        </div>
      </div>
    </>
  );
}
