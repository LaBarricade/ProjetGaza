"use client"
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FilterSidebar } from './filter-sidebar';
import { SearchResultsGrid } from './search-results-grid';
import { useSearchFilters } from './useSearchFilters';
import { SearchFilters } from './search';
import { Quote } from '@/components/quote-card';
import { Personality, Tag } from '../personnalites/page';
import { getPersonalities } from '@/repositories/personalities';
import { getQuotes } from '@/repositories/quotes';
import { TopBar } from '../top-bar';
import { Search } from 'lucide-react';

const CANONICAL_FUNCTIONS = [
  "Président de la République",
  "Secrétaire général",
  "Président de la région",
  "Député européen",
  "Premier Ministre"
];

const normalizeFunction = (fonction: string): string => {
  if (!fonction) return "";
  
  let value = fonction.trim();
  value = value.charAt(0).toUpperCase() + value.slice(1);
  value = value.replace(/ée/g, "é");
  value = value.replace(/te/g, "t");
  
  const canonical = CANONICAL_FUNCTIONS.find((title) =>
    value.startsWith(title)
  );
  if (canonical) return canonical;
  
  value = value.split(" ")[0];
  value = value.replace(/[.,;:!?]+$/, "");
  
  return value.trim();
};

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { filters, updateFilter, clearFilters } = useSearchFilters();
  const [loading, setLoading] = useState(true);
  const [baseFilterType, setBaseFilterType] = useState<'' | 'politicians' | 'quotes' | 'tags'>('');
  const [personalitiesList, setPersonalitiesList] = useState<Personality[]>([]);
  const [quotesList, setQuotesList] = useState<Quote[]>([]);
  const [initialized, setInitialized] = useState(false);

  const AVAILABLE_FUNCTIONS = useMemo(() => {
    const functionsSet = new Set<string>();
    personalitiesList.forEach(({ fonction }) => {
      const normalized = normalizeFunction(fonction ?? "");
      if (normalized) functionsSet.add(normalized);
    });
    return Array.from(functionsSet).sort();
  }, [personalitiesList]);

  const AVAILABLE_TAGS = useMemo(() => {
    const map = new Map<string, Tag>();
    personalitiesList
      .flatMap(p => p.tag || [])
      .forEach(t => {
        if (t && t.value) map.set(t.value, t);
      });
    quotesList
      .flatMap(q => q.tag || [])
      .forEach(t => {
        if (t && t.value) map.set(t.value, t);
      });
    return Array.from(map.values());
  }, [personalitiesList, quotesList]);

  const handleLoading = useCallback((isLoading: boolean) => setLoading(isLoading), []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [personalitiesRes, quotesRes] = await Promise.all([
        getPersonalities(),
        getQuotes()
      ]);
      setPersonalitiesList(personalitiesRes.count === 0 ? [] : personalitiesRes.results);
      setQuotesList(quotesRes.count === 0 ? [] : quotesRes.results);
    } catch (err) {
      console.error("Fetch failed:", err);
      setPersonalitiesList([]);
      setQuotesList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

    // Initialize filters from URL parameters
  useEffect(() => {
    if (loading || initialized) return;

    const q = searchParams?.get('q');
    const tag = searchParams?.get('tag');

    if (q) {
      // Search in quote text
      updateFilter('quotes', [q]);
      setBaseFilterType('quotes');
    } else if (tag) {
      // Search by tag
      updateFilter('tags', [tag]);
      setBaseFilterType('tags');
    }

    setInitialized(true);
  }, [searchParams, loading, initialized, updateFilter]);

  // Filter results based on active filters and base filter type
  const results = useMemo(() => {
    let filteredPoliticians: Personality[] = personalitiesList;
    let filteredQuotes: Quote[] = quotesList;

    // Apply politician filter
    if (filters.politicians.length > 0) {
      filteredPoliticians = filteredPoliticians.filter((p) =>
        filters.politicians.includes(p.id ? Number(p.id) : -1)
      );
      // Filter quotes by matching politician name
      const selectedPoliticianNames = new Set(
        filteredPoliticians.map(p => p.fullName.toLowerCase())
      );
      filteredQuotes = filteredQuotes.filter((q) => {
        const quoteName = `${q.prénom} ${q.nom}`.toLowerCase();
        return selectedPoliticianNames.has(quoteName);
      });
    }

    // Apply function filter
    if (filters.functions.length > 0) {
      filteredPoliticians = filteredPoliticians.filter((p) =>
        p.fonction && filters.functions.includes(normalizeFunction(p.fonction))
      );
      // Filter quotes by matching politician names with selected functions
      const politicianNames = new Set(
        filteredPoliticians.map(p => p.fullName.toLowerCase())
      );
      filteredQuotes = filteredQuotes.filter((q) => {
        const quoteName = `${q.prénom} ${q.nom}`.toLowerCase();
        return politicianNames.has(quoteName);
      });
    }

    // Apply tag filter
    if (filters.tags.length > 0) {
      filteredPoliticians = filteredPoliticians.filter((p) =>
        p.citations?.some((c) =>
          c.tag.some((qt) =>
            filters.tags.includes(qt.value)
          )
        )
      );
      filteredQuotes = filteredQuotes.filter((q) =>
        q.tag.some((qt) =>
          filters.tags.includes(qt.value)
        )
      );
    }

    // Apply quote search filter
    if (filters.quotes.length > 0 && filters.quotes[0]) {
      const searchTerm = filters.quotes[0].toLowerCase();
      filteredQuotes = filteredQuotes.filter((q) =>
        q.citation.toLowerCase().includes(searchTerm)
      );
      // Also filter politicians who have matching quotes
      const quoteNames = new Set(
        filteredQuotes.map(q => `${q.prénom} ${q.nom}`.toLowerCase())
      );
      filteredPoliticians = filteredPoliticians.filter((p) =>
        quoteNames.has(p.fullName.toLowerCase())
      );
    }

    // Return based on baseFilterType
    if (baseFilterType === 'politicians') {
      return filteredPoliticians;
    } else if (baseFilterType === 'quotes') {
      return filteredQuotes;
    } else if (baseFilterType === 'tags') {
      // When filtering by tags, show based on tagResultType
      return filters.tagResultType === 'politicians' ? filteredPoliticians : filteredQuotes;
    } else {
      // Return both (will be handled in SearchResultsGrid)
      return [...filteredPoliticians, ...filteredQuotes];
    }
  }, [filters, baseFilterType, personalitiesList, quotesList]);

  const resultType = baseFilterType === 'politicians' 
    ? 'politician' 
    : baseFilterType === 'quotes' 
    ? 'quote'
    : baseFilterType === 'tags'
    ? filters.tagResultType === 'politicians' ? 'politician' : 'quote'
    : '';

  const resultsCount = results.length;
  const resultLabel = resultType === 'politician' 
    ? resultsCount === 1 ? 'politicien trouvé' : 'politiciens trouvés'
    : resultType === 'quote'
    ? resultsCount === 1 ? 'citation trouvée' : 'citations trouvées'
    : resultsCount === 1 ? 'résultat trouvé' : 'résultats trouvés';

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar onLoading={handleLoading} />
      
      <div className="flex flex-1">
        <FilterSidebar
          filters={filters}
          onBaseFilterTypeChange={setBaseFilterType}
          baseFilterType={baseFilterType}
          onFiltersChange={{
            politicians: (selected) => updateFilter('politicians', selected),
            functions: (selected) => updateFilter('functions', selected),
            tags: (selected) => updateFilter('tags', selected),
            tagResultType: (type) => updateFilter('tagResultType', type),
            quotes: (selected) => updateFilter('quotes', selected),
          }}
          onClear={clearFilters}
          availablePoliticians={personalitiesList}
          availableFunctions={AVAILABLE_FUNCTIONS}
          availableTags={AVAILABLE_TAGS}
        />

        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold flex items-center gap-3 mb-2"><Search size={35} stroke='#636AE8' strokeWidth={2}/>Résultats de la recherche</h1>
              <p className="text-muted-foreground">
                {resultsCount} {resultLabel}
              </p>
            </div>

            <SearchResultsGrid
              results={results}
              type={resultType}
              isLoading={loading}
              isEmpty={results.length === 0 && !loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}