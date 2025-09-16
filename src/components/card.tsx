import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { toKebabCase } from "@/lib/kebab"
import Link from "next/link"

export type Quote = {
  id: number
  order: string
  "Personnalité politique": string
  Commune: string
  Département: string
  Région: string
  "Parti politique": string
  Fonction: string
  Citation: string
  date: string
  source: string
  lien: string
  Tag: string
  Collecteur: string
  Commentaire: string
}

export function QuoteCard({ quote }: { quote: Quote }) {
  return (
    <Card className="rounded-2xl shadow-md hover:shadow-lg transition">
      <CardHeader>
        <Link
          href={"/personnalites/" + toKebabCase(quote["Personnalité politique"])}
        >
          <CardTitle className="text-lg font-semibold">{quote["Personnalité politique"]}</CardTitle>
        </Link>
        <p className="text-sm text-muted-foreground">{quote["Parti politique"]} • {quote.Fonction}</p>
      </CardHeader>

      <CardContent className="space-y-3">
        <blockquote className="italic text-sm border-l-4 pl-3 border-primary">
          {quote.Citation}
        </blockquote>

        <div className="text-sm space-y-1">
          <p><span className="font-medium">Commune :</span> {quote.Commune}</p>
          <p><span className="font-medium">Département :</span> {quote.Département}</p>
          <p><span className="font-medium">Région :</span> {quote.Région}</p>
          <p><span className="font-medium">Date :</span> {quote.date}</p>
          {quote.Tag && (
            <p>
              <span className="font-medium">Tags :</span>{" "}
              {quote.Tag.split(', ').map((tag) => (
                <span
                  key={tag}
                  className="bg-primary/10 text-primary px-2 py-0.5 mr-1 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">{quote.source}</span>
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