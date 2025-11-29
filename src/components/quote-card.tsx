import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getWikipediaImage } from "@/lib/wiki-img";

export type Quote = {
  id: number;
  order: string;
  prénom: string;
  nom: string;
  commune: string;
  département: string;
  région: string;
  parti_politique: {
    color: string;
    id: number;
    value: string;
  };
  fonction: string;
  citation: string;
  date: string;
  source: {
    color: string;
    id: number;
    value: string;
  };
  lien: string;
  tag: {
    color: string;
    id: number;
    value: string;
  }[];
  collecteur: string;
  commentaire: string;
  est_publié: boolean;
};

export function QuoteCard({ quote, hidePersonality }: { quote: Quote, hidePersonality ?: boolean }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageUrlLoading, setImageUrlLoading] = useState(false);

  useEffect(() => {
    if (quote.source?.value) {
      setImageUrlLoading(true);

      const fetchImage = async () => {
        const url = await getWikipediaImage(quote.source.value as string);
        setImageUrl(url);
        setImageUrlLoading(false);
      };

      fetchImage();
    }
  }, [quote]);

  return (
    <Card className="rounded-2xl shadow-md hover:shadow-lg transition h-[500px] overflow-hidden flex flex-col">
      <CardHeader>
        <div className="mb-4">
          <span className="bg-primary/30 text-white font-medium px-2 py-0.5 rounded-full text-xs">
            {new Intl.DateTimeFormat('fr').format(new Date(quote.date))}
          </span>
        </div>
        {!hidePersonality &&
          <>
            <Link
              href={`/personnalites/${quote.prénom} ${quote.nom}`}
              className="relative inline-block group -mx-2"
            >
              {/* Background simple */}
              <span
                className="absolute inset-0 rounded-lg bg-neutral-800/5 dark:bg-neutral-200/10
                   opacity-0 transition-opacity duration-200
                   group-hover:opacity-100"
              ></span>

              <CardTitle
                className="relative px-2 py-1 rounded-lg
                   text-lg font-semibold text-neutral-800 dark:text-neutral-200
                   transition-colors duration-200
                   group-hover:text-neutral-600 dark:group-hover:text-neutral-400"
              >
                {quote.prénom + " " + quote.nom}
              </CardTitle>
            </Link>
            <p className="text-sm text-muted-foreground">
              {quote.parti_politique.value} • {quote.fonction}
            </p>
          </>
        }
      </CardHeader>

      <CardContent className="space-y-3 flex-1 overflow-hidden flex flex-col">
        <blockquote className="italic text-sm border-l-4 px-4 pl-3 border-primary overflow-y-auto">
          {quote.citation}
        </blockquote>

        <div className="text-sm space-y-1">
          {/* <p><span className="font-medium">commune :</span> {quote.commune}</p>
          <p><span className="font-medium">département :</span> {quote.département}</p>
          <p><span className="font-medium">région :</span> {quote.région}</p> */}
          {!!quote.tag.length && (
            <p>
              <span className="font-medium"></span>{" "}
              {quote.tag.map((tag) => (
                <span
                  key={tag.id}
                  className="bg-primary/10 text-primary font-bold px-2 py-0.5 mr-1 rounded-full text-xs inline-block"
                >
                  {tag.value}
                </span>
              ))}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-end">
        <div className="flex flex-col items-center">
          {!imageUrlLoading ? (
            imageUrl && (
              <img
                src={imageUrl}
                alt={`${quote.source.value} logo`}
                width={96}
                height={96}
                className="mb-4 object-cover w-24 h-auto"
                style={{ width: "100px", height: "auto" }}
              />
            )
          ) : (
            <p>Chargement de l&apos;image...</p>
          )}
          <span className="text-xs text-muted-foreground">
            Source: {quote.source?.value}
          </span>
        </div>
        {quote.lien && (
          <Button asChild size="sm" variant="outline">
            <a
              href={quote.lien}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              Voir <ExternalLink size={14} />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
