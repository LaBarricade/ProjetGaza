import {QuoteList} from "@/components/list/quote-list";
import {LogoParti} from "@/components/logo/parti";
import {getWikipediaImage} from "@/lib/wiki-img";
import Link from "next/link";
import {FacebookIcon, InstagramIcon, TwitterIcon} from "@/components/logo/socials";
import {QuotesTimeline} from "@/components/quotes-timeline";
import {MailIcon} from "lucide-react";
import {Personality} from "@/types/Personality";
import {getDbService} from "@/lib/backend/db-service";

export default async function PersonalityPage({params}: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    const {item: p}: {item: Personality | null} = await getDbService().findPersonality(id);

    if (!p) return (
        <div className="h-screen flex justify-center items-center">
            <p>Personnalité non trouvée</p>
        </div>
    )

    const fullName = `${p.firstname} ${p.lastname}`;
    const imageUrl = await getWikipediaImage(fullName);

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
                <QuotesTimeline quotes={p.quotes}/>
            )}

            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">
                    Citations
                    <span className="font-normal"> ({p.quotes.length})</span>
                </h2>
                {p.quotes.length > 0 ?
                    <QuoteList initialItems={p.quotes} hidePersonality={true}/>
                    :
                    <p>Aucune citation trouvée</p>
                }
            </div>
        </div>
    );
}
