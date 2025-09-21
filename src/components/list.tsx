import { Personality } from "@/app/personnalites/page";
import { Quote, QuoteCard } from "@/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toKebabCase } from "@/lib/kebab";
import { useEndReached } from "@/lib/use-reached-end";
import { useRouter } from "next/navigation";
import CountUp from "react-countup";

function CitationCount({ totalCount }: { totalCount: number }) {
  return (
    <h2 className="w-full text-3xl font-bold text-gray-800 mt-4 px-4 sm:px-8">
      <CountUp end={totalCount} duration={1.2} /> citations
    </h2>
  )
}

export function QuoteList({
  quotes,
  totalCount,
  onEndReached,
}: {
  quotes: Quote[];
  onEndReached?: () => void;
  totalCount?: number;
}) {
  const loaderRef = useEndReached(onEndReached);

  return (
    <>
      {totalCount && <CitationCount totalCount={totalCount} />}
      <div className="w-screen max-w-full mx-auto px-4 sm:px-8 columns-1 md:columns-3 gap-6 mb-6">
        {quotes.map((q) => (
          <div key={q.id} className="mb-6 break-inside-avoid">
            <QuoteCard quote={q} />
          </div>
        ))}
      </div>

      {onEndReached && <div ref={loaderRef} className="h-6" aria-hidden />}
    </>
  );
}

export function PersonalityList({
  personalities,
}: {
  personalities: Personality[];
}) {
  const router = useRouter();

  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Parti politique</TableHead>
            <TableHead>Fonction</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {personalities.map((p, index) => (
            <TableRow
              key={p.nom}
              className="hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => router.push(`/personnalites/${toKebabCase(p.nom)}`)}
            >
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{p.nom}</TableCell>
              <TableCell>{p.partiPolitique ?? "-"}</TableCell>
              <TableCell>{p.fonction ?? "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {<div className="h-6" aria-hidden />}
    </div>
  );
}