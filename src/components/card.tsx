import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

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
  return (
    <Card className="rounded-2xl shadow-md hover:shadow-lg transition">
      <CardHeader>
        <Link
          href={"/personnalites/" + `${quote.prénom}-${quote.nom}`}
        >
          <CardTitle className="text-lg font-semibold">{quote.prénom + ' ' + quote.nom}</CardTitle>
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
        <span className="text-xs text-muted-foreground">{quote.source?.value}</span>
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