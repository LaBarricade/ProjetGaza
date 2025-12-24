// import { PoliticianCard } from '@/components/politician-card';
// import { Quote, QuoteCard } from '@/components/quote-card';
// import { Personality } from '../personnalites/page';

// interface SearchResultsGridProps {
//   results: Personality[] | Quote[];
//   type: '' | 'politician' | 'quote';
//   isLoading?: boolean;
//   isEmpty?: boolean;
// }

// export function SearchResultsGrid({
//   results,
//   type,
//   isLoading,
//   isEmpty,
// }: SearchResultsGridProps) {
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <p className="text-muted-foreground">Loading results...</p>
//       </div>
//     );
//   }

//   if (isEmpty) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <p className="text-muted-foreground">No results found. Try adjusting your filters.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//       {results.map((result) =>
//         type === 'politician' ? (
//           <PoliticianCard key={result.id} politician={result as Personality} />
//         ) : type === 'quote' ? (
//           <QuoteCard key={result.id} quote={result as Quote} />
//         ) : null
//       )}
//     </div>
//   );
// }

import { PoliticianCard } from '@/components/politician-card';
import { Quote, QuoteCard } from '@/components/quote-card';
import { Personality } from '../personnalites/page';
import  ScrollAreaComponent from '@/components/ui/scroll-area';

interface SearchResultsGridProps {
  results: (Personality | Quote)[];
  type: '' | 'politician' | 'quote';
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
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground text-sm">Chargement des résultats...</p>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">Aucun résultat trouvé.</p>
          <p className="text-sm text-muted-foreground">Essayez d'ajuster vos filtres.</p>
        </div>
      </div>
    );
  }

  // Separate politicians and quotes
  const politicians = results.filter((r): r is Personality => 'fullName' in r);
  const quotes = results.filter((r): r is Quote => !('fullName' in r));

  // When type is '', show both politicians (horizontal scroll) and quotes (grid)
  if (type === '') {
    return (
      <div className="space-y-8">
        {politicians.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Politiciens</h2>
            <ScrollAreaComponent>
              <div className="flex gap-4 pb-4">
                {politicians.map((politician) => (
                  <div key={politician.id} className="w-[280px] flex-shrink-0">
                    <PoliticianCard politician={politician} />
                  </div>
                ))}
              </div>
              {/* <ScrollBar orientation="horizontal" /> */}
            </ScrollAreaComponent>
          </div>
        )}

        {quotes.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Citations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quotes.map((quote) => (
                <QuoteCard key={quote.id} quote={quote} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Single type view
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {results.map((result) =>
        type === 'politician' ? (
          <PoliticianCard key={result.id} politician={result as Personality} />
        ) : (
          <QuoteCard key={result.id} quote={result as Quote} />
        )
      )}
    </div>
  );
}
