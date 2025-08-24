import { Quote, QuoteCard } from "@/components/card";

export default function QuoteList({ quotes }: { quotes: Quote[] }) {
  return (
    <div className="w-full max-w-full mx-auto px-4 sm:px-8 columns-1 md:columns-3 gap-6 mt-4">
      {quotes.map((q) => (
        <div key={q.id} className="mb-6 break-inside-avoid">
          <QuoteCard quote={q} />
        </div>
      ))}
    </div>
  )
}