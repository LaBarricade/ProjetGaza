import { PoliticianCard } from '@/components/politician-card';
import { Quote, QuoteCard } from '@/components/quote-card';
import type { Politician } from './search';

interface SearchResultsGridProps {
  results: Politician[] | Quote[];
  type: 'politician' | 'quote';
  isLoading?: boolean;
  isEmpty?: boolean;
}

export function SearchResultsGrid({
  results,
  type,
  isLoading,
  isEmpty,
}: SearchResultsGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading results...</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">No results found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {results.map((result) =>
        type === 'politician' ? (
          <PoliticianCard key={result.id} politician={result as Politician} />
        ) : (
          <QuoteCard key={result.id} quote={result as Quote} />
        )
      )}
    </div>
  );
}
