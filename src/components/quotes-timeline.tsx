'use client'
import {Quote} from "@/types/Quote";
import React, {useEffect, useRef, useState} from "react";
import {getWikipediaImage} from "@/lib/wiki-img";
import url from "node:url";
import {FacebookIcon, InstagramIcon, TwitterIcon} from "@/components/logo/socials";
import Link from "next/link";

const logoCache: { [key: string]: string } = {}

export function QuotesTimeline({items}: { items: Quote[]}) {

    const timelineRef = useRef<HTMLDivElement>(null);
    const [timelineData, setTimelineData] = useState<Record<string, unknown> | null>(null);

    //-- Quotes - vue object
    useEffect(() => {
        if (items.length) return;

        (async () => {
            const events = await Promise.all(
                items.map(async (q: Quote, i: number) => {
                    const [year, month, day] = q.date.split("-").map(Number);
                    let logo = null;

                    //-- Logo source
                    if (q.source) {
                        logo = await getWikipediaImage(q.source.name);
                        if (logo)
                            logoCache[q.source.name] = logo
                    }

                    return {
                        start_date: {year, month, day},
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
                title: {text: {headline: "Frise des citations", text: ""}},
                events,
            });
        })();
    }, [items]);


    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://cdn.knightlab.com/libs/timeline3/latest/css/timeline.css";
        document.head.appendChild(link);

        return () => {
            document.head.removeChild(link);
        };
    }, []);

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
                    if (!items) return
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
    }, [timelineData, items]);

    return <div ref={timelineRef} style={{width: "100%", height: "500px", border: "1px solid #DDD"}}/>
}