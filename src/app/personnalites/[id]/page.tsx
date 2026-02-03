"use client";

import {QuoteList} from "@/components/list/quote-list";
import {useParams} from "next/navigation";
import React, {useRef, useEffect, useState} from "react";
import {LogoParti} from "@/components/logo/parti";
import {getWikipediaImage} from "@/lib/wiki-img";
import {Personality} from "@/types/Personality";
import {Quote} from "@/types/Quote";
import {callLocalApi} from "@/lib/backend/api-client";
import * as url from "node:url";
import Link from "next/link";
import {FacebookIcon, InstagramIcon, TwitterIcon} from "@/components/logo/socials";
import {WebcamIcon} from "lucide-react/dist/lucide-react.suffixed";
import {QuotesTimeline} from "@/components/quotes-timeline";
import {ExternalLink, MailIcon} from "lucide-react";


async function getPersonality(id: number): Promise<Personality | null> {
    const apiResp = await callLocalApi(`/api/v2/personalities?id=${encodeURIComponent(id)}`);
    return apiResp.item
}

export default function PersonalityPage() {
    const params = useParams<{ id: string }>()

    if (!params)
        return null;

    const [p, setPersonality] = useState<Personality | null>(null);
    const [loading, setLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const id = parseInt(params.id);
    const fullName = p && `${p.firstname} ${p.lastname}`;

    console.log('p', p)

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
        if (p && fullName) {
            const fetchImage = async () => {
                const url = await getWikipediaImage(fullName);
                setImageUrl(url);
            };

            fetchImage();
        }
    }, [p, fullName]);

    if (loading) return (
        <div className="h-screen flex justify-center items-center">
            <p>Chargement des données...</p>
        </div>
    )
    if (!p) return (
        <div className="h-screen flex justify-center items-center">
            <p>Personnalité non trouvée</p>
        </div>
    )

    return (
        <div className="mx-auto p-6 w-4xl ">
            <div className="flex flex-row gap-0 max-w-3xl mx-auto mb-8">
                <img
                    src={imageUrl || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}
                    alt=""
                    width={96}
                    height={96}
                    className="object-cover rounded-2xl w-24 h-auto"
                    style={{width: "100px", height: "auto"}}
                />

                <div className="ml-4 self-center mr-4">
                    <h1 className="text-3xl font-bold mb-2">{fullName}</h1>
                    <div className="space-y-2 text-gray-700">
                        <p>{p.role}</p>
                    </div>
                    <ul className="flex flex-row gap-2 mt-3">
                        {[p.social1_url, p.social2_url].map((social_url, i) => {
                            const parsedUrl = URL.parse(social_url);
                            let icon;
                            if (!parsedUrl)
                                return null;
                            else if (parsedUrl.hostname.includes('x.com'))
                                icon = <TwitterIcon/>;
                            else if (parsedUrl.hostname.includes('facebook.com'))
                                icon = <FacebookIcon/>;
                            else if (parsedUrl.hostname.includes('instagram.com'))
                                icon = <InstagramIcon/>;
                            else
                                icon = <span>{parsedUrl.hostname}</span>;

                            return <li>
                                <Link href={social_url} key={`social-${i}`}>{icon}</Link>
                            </li>

                        })}
                        {p.public_contact && <li className="">
                            {p.public_contact.includes('@') ?
                                <button onClick={() => window.location.href = 'mailto:' + p.public_contact}>
                                    <MailIcon/>
                                </button>
                                :
                                <Link href={p.public_contact}>
                                    <MailIcon/>
                                </Link>
                            }
                        </li>}
                    </ul>
                </div>
                {p.party &&
                    <div className="flex items-center justify-self-end ml-auto w-24">
                        <LogoParti party={p.party}/>
                    </div>
                }
            </div>

            {p.quotes.length > 3 && (
                <QuotesTimeline items={p.quotes}/>
            )}

            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Citations</h2>
                {p.quotes.length > 0 ?
                    <QuoteList initialItems={p.quotes} hidePersonality={true}/>
                    :
                    <p>Aucune citation trouvée</p>
                }
            </div>
        </div>
    );
}
