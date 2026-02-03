import {Personality} from "@/types/Personality";
import {Card, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {ExternalLink} from "lucide-react";
import {Button} from "@/components/ui/button";
import React, {useEffect, useState} from "react";
import {getWikipediaImage} from "@/lib/wiki-img";
import {LogoParti} from "@/components/logo/parti";

export function PersonalityCard({p}: { p: Personality; }) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const fullName = `${p.firstname} ${p.lastname}`;
    useEffect(() => {
        const fetchImage = async () => {
            const url = await getWikipediaImage(fullName);
            setImageUrl(url);
        };

        fetchImage();
    }, [p, fullName]);

    return (
            <Card className={`rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col gap-1
                justify-between ${!p.quotes_count && 'opacity-50'}`}>
                <CardHeader className="px-4  ">
                    <div className="flex flex-row justify-between gap-1">
                        <div>
                            <Link
                                href={`/personnalites/${p.id}`}
                                className="relative inline-block group -mx-2"
                            >
                                {/* Background simple */}
                                <span
                                    className="absolute inset-0 rounded-lg bg-neutral-800/5 dark:bg-neutral-200/10
                                                 opacity-0 transition-opacity duration-200
                                                 group-hover:opacity-100"
                                ></span>

                                <CardTitle
                                    className="relative px-2 py-0 rounded-lg align-top
                                                 text-lg font-semibold text-neutral-800 dark:text-neutral-200
                                                 transition-colors duration-200
                                                 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 leading-none"
                                >
                                 {p.firstname + ' ' + p.lastname}
                                </CardTitle>
                            </Link>
                            <p className="text-xs text-muted-foreground mt-1">
                                {p.role}
                            </p>
                        </div>

                        <img
                            src={imageUrl || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}
                            alt=""
                            width={96}
                            height={96}
                            className="mb-4 object-cover rounded-2xl w-24 h-auto float-right"
                            style={{width: "50px", height: "50px"}}
                        />
                    </div>
                </CardHeader>

                <CardFooter className="flex justify-between items-end px-4">
                    <p className="mt-2">
                        {p.party && (
                            <>
                                <Link href={`/citations?party=${p.party.id}`}>
                                    <LogoParti party={p.party} shortName={true} size={{width: '50px'}}/>
                                </Link>
                            </>
                        )}

                    </p>
                    <Button asChild size="sm" variant="outline">
                        <a
                            href={`/personnalites/${p.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1"
                        >
                            Voir <ExternalLink size={14}/>
                        </a>
                    </Button>
                </CardFooter>
            </Card>
    );
}