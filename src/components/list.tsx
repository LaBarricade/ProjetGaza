import { Quote, QuoteCard } from "@/components/card";

export default function QuoteList({ quotes }: { quotes: Quote[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {quotes.map((q) => (
        <QuoteCard key={q.id} quote={q} />
      ))}
    </div>
  )
}