import { useEndReached } from "@/lib/use-reached-end";
import CountUp from "react-countup";
import { Quote, QuoteCard } from "../quote-card";

function CitationCount({ totalCount }: { totalCount: number }) {
  return (
    <h2 className="w-full text-3xl font-bold text-gray-800 mt-8 px-8">
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
    <div className="w-full max-w-screen-lg p-4 mx-auto mt-6 space-y-6">
      {totalCount && <CitationCount totalCount={totalCount} />}
      <div className="w-screen max-w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {quotes.map((q) => (
          <div key={q.id} className="mb-6 break-inside-avoid">
            <QuoteCard quote={q} />
          </div>
        ))}
      </div>

      {onEndReached && <div ref={loaderRef} className="h-6" aria-hidden />}
    </div>
  );
}
