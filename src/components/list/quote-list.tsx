import { useEndReached } from "@/lib/use-reached-end";
import CountUp from "react-countup";
import { Quote, QuoteCard } from "../card";

function CitationCount({ totalCount }: { totalCount: number }) {
  return (
    <h2 className="w-full text-3xl font-bold text-gray-800 my-4 sm:px-8">
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
