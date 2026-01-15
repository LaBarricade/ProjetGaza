"use client";

import { TopBar } from "@/app/top-bar";
import { QuoteList } from "@/components/list/quote-list";
import { useParams } from "next/navigation";
import React, { useRef, useEffect, useState } from "react";
import { LogoParti } from "@/components/logo/parti";
import { getWikipediaImage } from "@/lib/wiki-img";
import { Footer } from "@/app/footer";
import {Personality} from "@/types/Personality";
import {Quote} from "@/types/Quote";

const logoCache: { [key: string]: string } = {}

async function getPersonality(id: number): Promise<Personality | null> {
  const res = await fetch(`/api/v2/personalities?id=${encodeURIComponent(id)}`);
  const data = await res.json();
  return data.item
}

export default function PersonalityPage() {
  const params = useParams<{ id: string }>()

  if (!params)
    return null;

  const timelineRef = useRef<HTMLDivElement>(null);
  const [timelineData, setTimelineData] = useState<Record<string, unknown> | null>(null);
  const [personality, setPersonality] = useState<Personality | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageUrlLoading, setImageUrlLoading] = useState(false);

  const id = parseInt(params.id);
  const fullName = personality && `${personality.firstname} ${personality.lastname}`;


  //-- Quotes - vue object
  useEffect(() => {
    if (!personality?.quotes?.length) return;

    (async () => {
      const events = await Promise.all(
        personality.quotes.map(async (q: Quote, i: number) => {
          const [year, month, day] = q.date.split("-").map(Number);
          let logo = null;

          //-- Logo source
          if (q.source) {
            logo = await getWikipediaImage(q.source.name);
            if (logo)
              logoCache[q.source.name] = logo
          }

          return {
            start_date: { year, month, day },
            text: {
              headline: q.source?.name ?? `Citation #${i + 1}`,
              text: q.text,
            },
            ...(logo && {
              media: {
                url: logo,
                thumbnail: logo,
                caption: q.source?.name,
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

  //-- Timeline citations
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
        const p = await getPersonality(id);
        setPersonality(p);
      } catch (err) {
        console.error("Fetch failed:", err);
        setPersonality(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);
  
  useEffect(() => {
    if (personality && fullName) {
      setImageUrlLoading(true);

      const fetchImage = async () => {
        const url = await getWikipediaImage(fullName);
        setImageUrl(url);
        setImageUrlLoading(false);
      };

      fetchImage();
    }
  }, [personality, fullName]);

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
console.log('personality', personality)

  return (
    <>
      <TopBar />
      <div className="mx-auto p-6">
        <div className="flex flex-row">
          {!imageUrlLoading ? (
            imageUrl && (
              <img
                src={imageUrl}
                alt={`${fullName} portrait`}
                width={96}
                height={96}
                className="mb-4 object-cover rounded-full w-24 h-auto"
                style={{ width: "100px", height: "auto" }}
              />
            )
          ) :
            <p>Chargement de l&apos;image...</p>
          }
          <div className="ml-8">
            <h1 className="text-3xl font-bold mb-4">{fullName}</h1>
            <div className="space-y-2 text-gray-700">
              {personality.party && (<div className="flex items-center">
                <span className="font-semibold">Parti politique :</span>
                <span className="ml-4">
                  <LogoParti party={personality.party} />
                </span>
              </div>)
              }
              <p><span className="font-semibold">Fonction :</span> {personality.role}</p>
            </div>
          </div>
        </div>
        {/* Timeline */}
        {personality.quotes.length > 0 && (
          <div ref={timelineRef} style={{ width: "100%", height: "500px" }} />
        )}

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Citations</h2>
          {personality.quotes.length > 0 && <QuoteList quotes={personality.quotes} hidePersonality={true} />}
        </div>
      </div>
      <Footer />
    </>
  );
}
