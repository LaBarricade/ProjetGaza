'use client';

import { PoliticianCard } from '@/components/politician-card';
import { QuoteCard } from '@/components/quote-card';
import ScrollAreaComponent from '@/components/ui/scroll-area';
import { Quote as QuoteIcon, Search, UserRound } from 'lucide-react';
import { Quote } from '@/types/Quote';
import { Personality } from '@/types/Personality';
import { useSearchFilters } from './useSearchFilters';
import { useEffect } from 'react';

interface SearchResultsGridProps {
  personalitiesList: Personality[];
  quotesList: Quote[];
  isEmpty?: boolean;
  apiFilters?: any;
}

export function SearchResultsGrid({
  personalitiesList,
  quotesList,
  isEmpty,
  apiFilters
}: SearchResultsGridProps) {

  const { baseFilterType, updateBaseFilterType } = useSearchFilters();

  const resultsCount = personalitiesList.length + quotesList.length;
  const resultLabel = resultsCount === 1 ? 'résultat trouvé' : 'résultats trouvés';

  // Update base filter type based on API filters (in useEffect to avoid render loop)
  useEffect(() => {
    if (apiFilters?.text || apiFilters?.tag) {
      updateBaseFilterType('quotes');
    } else if (apiFilters?.personality || apiFilters?.function) {
      updateBaseFilterType('politicians');
    } else if (apiFilters?.party) {
      updateBaseFilterType('');
    }
  }, [apiFilters?.text, apiFilters?.tag, apiFilters?.personality, apiFilters?.function, apiFilters?.party, updateBaseFilterType]);

  if (isEmpty) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
            <Search size={35} stroke='#636AE8' strokeWidth={2}/>
            Résultats de la recherche
          </h1>
          <p className="text-muted-foreground">
            {resultsCount} {resultLabel}
          </p>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">Aucun résultat trouvé.</p>
            <p className="text-sm text-muted-foreground">Essayez d'ajuster vos filtres.</p>
          </div>
        </div>
      </div>
    );
  }

  // When type is '', show both politicians (horizontal scroll) and quotes (grid)
  if (baseFilterType === '') {
    return (
      <div className="space-y-12 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
            <Search size={35} stroke='#636AE8' strokeWidth={2}/>
            Résultats de la recherche
          </h1>
          <p className="text-muted-foreground">
            {resultsCount} {resultLabel}
          </p>
        </div>
        
        {personalitiesList.length > 0 && (
          <div className="space-y-4 w-full">
            <h2 className="text-xl flex items-center gap-2 font-semibold">
              <UserRound size={22} stroke='#636AE8' />
              Politiciens
            </h2>
            <ScrollAreaComponent>
              <div className="flex w-full overflow-x-scroll pt-4 gap-4 pb-1 mb-4">
                {personalitiesList.map((politician) => (
                  <div key={politician.id} className="w-[280px] flex-shrink-0">
                    <PoliticianCard politician={politician} quotes={quotesList} />
                  </div>
                ))}
              </div>
            </ScrollAreaComponent>
          </div>
        )}

        {quotesList.length > 0 && (
          <div className="space-y-4 pt-8">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <QuoteIcon size={22} stroke='#636AE8' />
              Citations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quotesList.map((quote) => (
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
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
          <Search size={35} stroke='#636AE8' strokeWidth={2}/>
          Résultats de la recherche
        </h1>
        <p className="text-muted-foreground">
          {resultsCount} {resultLabel}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {baseFilterType === 'politicians'
          ? personalitiesList.map((politician) => (
              <PoliticianCard key={politician.id} politician={politician} quotes={quotesList} />
            ))
          : quotesList.map((quote) => (
              <QuoteCard key={quote.id} quote={quote} />
            ))}
      </div>
    </div>
  );
}