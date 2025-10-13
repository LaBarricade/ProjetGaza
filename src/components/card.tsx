import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getWikipediaImage } from "@/lib/wiki-img"

export type Quote = {
  id: number
  order: string
  prénom: string
  nom: string
  commune: string
  département: string
  région: string
  parti_politique: {
    color: string;
    id: number;
    value: string;
  }
  fonction: string
  citation: string
  date: string
  source: {
    color: string;
    id: number;
    value: string;
  }
  lien: string
  tag: {
    color: string;
    id: number;
    value: string;
  }[]
  collecteur: string
  commentaire: string
  est_publié: boolean
}

export function QuoteCard({ quote }: { quote: Quote }) {
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
    <Card className="rounded-2xl shadow-md hover:shadow-lg transition">
      <CardHeader>
        <Link
          href={`/personnalites/${quote.prénom}-${quote.nom.replaceAll(' ', '-')}`}
          className="relative inline-block group"
        >
          <CardTitle className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 transition-colors duration-300 group-hover:text-neutral-600 dark:group-hover:text-neutral-400">
            {quote.prénom + ' ' + quote.nom}
          </CardTitle>
          <span className="absolute left-1/2 bottom-0 w-0 h-[1px] bg-neutral-500/40 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
        </Link>
        <p className="text-sm text-muted-foreground">{quote.parti_politique.value} • {quote.fonction}</p>
      </CardHeader>

      <CardContent className="space-y-3">
        <blockquote className="italic text-sm border-l-4 pl-3 border-primary">
          {quote.citation}
        </blockquote>

        <div className="text-sm space-y-1">
          <p><span className="font-medium">commune :</span> {quote.commune}</p>
          <p><span className="font-medium">département :</span> {quote.département}</p>
          <p><span className="font-medium">région :</span> {quote.région}</p>
          <p><span className="font-medium">Date :</span> {quote.date}</p>
          {!!quote.tag.length && (
            <p>
              <span className="font-medium">Tags :</span>{" "}
              {quote.tag.map((tag) => (
                <span
                  key={tag.id}
                  className="bg-primary/10 text-primary px-2 py-0.5 mr-1 rounded-full text-xs"
                >
                  {tag.value}
                </span>
              ))}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center">
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
          ) :
            <p>Chargement de l&apos;image...</p>
          }
          <span className="text-xs text-muted-foreground">{quote.source?.value}</span>
        </div>
        {quote.lien && (
          <Button asChild size="sm" variant="outline">
            <a href={quote.lien} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
              Source <ExternalLink size={14} />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}