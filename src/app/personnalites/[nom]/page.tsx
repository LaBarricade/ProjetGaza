"use client";

import { TopBar } from "@/app/top-bar";
import { QuoteList } from "@/components/list/quote-list";
import { useParams } from "next/navigation";
import React, { useRef, useEffect, useState } from "react";
import { Quote } from "@/components/quote-card";
import { LogoParti } from "@/components/logo/parti";
import { getWikipediaImage } from "@/lib/wiki-img";
import { Personality } from "../page";
import { Footer } from "@/app/footer";

const logoCache: { [key: string]: string } = {}

async function getPersonality(nom: string): Promise<Personality | null> {
  const res = await fetch(`/api/personalities?search=${encodeURIComponent(nom)}`);
  const data = await res.json();

  const personalities = data.results
  if (!Array.isArray(personalities) || personalities.length === 0) return null;

  return personalities[0]
}

export default function PersonalityPage() {
  const params = useParams<{ nom: string }>()

  const timelineRef = useRef<HTMLDivElement>(null);
  const [timelineData, setTimelineData] = useState<Record<string, unknown> | null>(null);
  const { nom } = params?.nom ? params : {}

  const [personality, setPersonality] = useState<Personality | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageUrlLoading, setImageUrlLoading] = useState(false);

  useEffect(() => {
    if (!personality?.citations?.length) return;

    (async () => {
      const events = await Promise.all(
        personality.citations.map(async (q: Quote, i: number) => {
          const [year, month, day] = q.date.split("-").map(Number);
          const logo = q.source?.value
            ? await getWikipediaImage(q.source.value)
            : null;

          if (logo) {
            logoCache[q.source?.value] = logo
          }

          return {
            start_date: { year, month, day },
            text: {
              headline: q.source?.value ?? `Citation #${i + 1}`,
              text: q.citation,
            },
            ...(logo && {
              media: {
                url: logo,
                thumbnail: logo,
                caption: q.source?.value,
              },
            }),
          };
        })
      );

      setTimelineData({
        title: { text: { headline: "Frise des citations", text: "" } },
        events,
      });
    })();
  }, [personality]);

  useEffect(() => {
    if (!timelineData) return;

    const script = document.createElement("script");
    script.src = "https://cdn.knightlab.com/libs/timeline3/latest/js/timeline.js";
    script.async = true;
    script.onload = () => {
      // @ts-expect-error TL est global
      if (window.TL && timelineRef.current) {
        const options = {
          lang: "fr",
          initial_zoom: 2,
          timenav_position: "bottom",
        };

        // @ts-expect-error TL est global
        new window.TL.Timeline(timelineRef.current, timelineData, options);

        setTimeout(() => {
          const markers = document.querySelectorAll(".tl-timemarker-content");
          if (!personality) return
          [...markers].forEach((marker) => {
            const source = (marker as HTMLElement).querySelector('.tl-headline')?.textContent as string
            const logo = logoCache[source];
            if (logo) {
              (marker as HTMLElement).style.backgroundSize = 'cover';
              (marker as HTMLElement).style.backgroundRepeat = 'no-repeat';
              (marker as HTMLElement).style.backgroundPosition = 'bottom';
              (marker as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
              (marker as HTMLElement).style.backgroundBlendMode = 'lighten';
              (marker as HTMLElement).style.backgroundImage = `url(${logo})`;

              const headline: HTMLElement = (marker as HTMLElement).querySelector('.tl-headline') as HTMLElement
              (headline as HTMLElement).style.color = 'white';
              (headline as HTMLElement).style.fontWeight = 'bold';
            }
          });
        }, 500);
      }
    };

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [timelineData, personality]);

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
        const url = await getWikipediaImage(personality.fullName as string);
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
      <TopBar />
      <div className="mx-auto p-6">
        {!imageUrlLoading ? (
          imageUrl && (
            <img
              src={imageUrl}
              alt={`${personality.fullName} portrait`}
              width={96}
              height={96}
              className="mb-4 object-cover rounded-full w-24 h-auto"
              style={{ width: "100px", height: "auto" }}
            />
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
      <Footer />
    </>
  );
}
