"use client"
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FilterSidebar } from './filter-sidebar';
// import { FilterSidebar } from '@/components/filters/FilterSidebar';
// import { SearchResultsGrid } from '@/components/search/SearchResultsGrid';
import { SearchResultsGrid } from './search-results-grid';

import { useSearchFilters } from './useSearchFilters';
import { Politician, SearchFilters } from './search';
import { Quote } from '@/components/quote-card';

// Mock data - replace with actual API calls

const MOCK_QUOTES: Quote[] = [
    {
        id: 1,
        order: "1",
        prénom: "Jean",
        nom: "Dupont",
        commune: "Paris",
        département: "75",
        région: "Île-de-France",
        parti_politique: { color: "#ff0000", id: 1, value: "Parti Socialiste" },
        fonction: "Senator",
        citation: "L'économie doit être au service de tous.",
        date: "2023-01-15",
        source: { color: "#0000ff", id: 1, value: "Le Monde" },
        lien: "https://www.lemonde.fr/article1",
        tag: [
            { color: "#00ff00", id: 1, value: "economy" },
            { color: "#ff00ff", id: 2, value: "policy" },
        ],
        collecteur: "Alice",
        commentaire: "Discours au Sénat",
        est_publié: true,
    },
    {
        id: 2,
        order: "2",
        prénom: "Marie",
        nom: "Curie",
        commune: "Rennes",
        département: "35",
        région: "Bretagne",
        parti_politique: { color: "#00ff00", id: 2, value: "Les Verts" },
        fonction: "Mayor",
        citation: "L'environnement est notre priorité.",
        date: "2023-02-10",
        source: { color: "#ff9900", id: 2, value: "Ouest-France" },
        lien: "https://www.ouest-france.fr/article2",
        tag: [
            { color: "#00ff00", id: 3, value: "environment" },
            { color: "#0000ff", id: 4, value: "policy" },
        ],
        collecteur: "Bob",
        commentaire: "Interview radio",
        est_publié: true,
    },
    {
        id: 3,
        order: "3",
        prénom: "Luc",
        nom: "Martin",
        commune: "Marseille",
        département: "13",
        région: "Provence-Alpes-Côte d'Azur",
        parti_politique: { color: "#0000ff", id: 3, value: "Les Républicains" },
        fonction: "Governor",
        citation: "La sécurité est essentielle pour la prospérité.",
        date: "2023-03-05",
        source: { color: "#ff0000", id: 3, value: "France Info" },
        lien: "https://www.franceinfo.fr/article3",
        tag: [
            { color: "#ff0000", id: 5, value: "security" },
            { color: "#00ff00", id: 6, value: "policy" },
        ],
        collecteur: "Charlie",
        commentaire: "Débat télévisé",
        est_publié: false,
    },
];

const MOCK_POLITICIANS: Politician[] = [
    {
        id: "1",
        name: "Jean Dupont",
        function: "Senator",
        party: "Parti Socialiste",
        imageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
        quotesCount: 5,
        tagsCount: 3,
    },
    {
        id: "2",
        name: "Marie Curie",
        function: "Mayor",
        party: "Les Verts",
        imageUrl: "https://randomuser.me/api/portraits/women/2.jpg",
        quotesCount: 8,
        tagsCount: 4,
    },
    {
        id: "3",
        name: "Luc Martin",
        function: "Governor",
        party: "Les Républicains",
        imageUrl: "https://randomuser.me/api/portraits/men/3.jpg",
        quotesCount: 3,
        tagsCount: 2,
    },
];

const AVAILABLE_FUNCTIONS = ['Senator', 'Mayor', 'Governor', 'Representative', 'President'];
const AVAILABLE_TAGS = ['economy', 'health', 'education', 'environment', 'security', 'policy'];

export default function SearchPage() {
  const router = useRouter();
  const { filters, updateFilter, addFilter, removeFilter, clearFilters, toggleFilter } =
    useSearchFilters();
  const [isLoading, setIsLoading] = useState(false);

  // Filter results based on active filters
  const results = useMemo(() => {
    let filtered: Politician[] | Quote[] = [];

    if (filters.tags.length > 0) {
      // When tags are selected, show results based on tagResultType
      if (filters.tagResultType === 'politicians') {
        filtered = MOCK_POLITICIANS.filter((p) =>
          filters.tags.length === 0 || true // Add actual filtering logic
        );
      } else {
        filtered = MOCK_QUOTES.filter((q) =>
          filters.tags.some((tag: string) =>
            // q.tags can be either an array of strings (mock) or an array of tag objects { color, id, value }
            q.tag.some((qt: any) =>
              typeof qt === 'string' ? qt === tag : qt.value === tag
            )
          )
        );
      }
    } else {
      filtered = MOCK_POLITICIANS;
    }

    // Apply politician filter
    if (filters.politicians.length > 0) {
      filtered = (filtered as Politician[]).filter((p) =>
        filters.politicians.includes(p.id)
      );
    }

    // Apply function filter
    if (filters.functions.length > 0) {
      filtered = (filtered as Politician[]).filter((p) =>
        filters.functions.includes(p.function)
      );
    }

    // Apply quote search filter
    if (filters.quotes.length > 0 && filters.quotes[0]) {
      filtered = (filtered as Quote[]).filter((q) =>
        q.citation.toLowerCase().includes(filters.quotes[0].toLowerCase())
      );
    }

    return filtered;
  }, [filters]);

  const resultType = filters.tags.length > 0 ? filters.tagResultType : 'politician';

  return (
    <div className="flex h-screen bg-background">
      <FilterSidebar
        filters={filters}
        onFiltersChange={{
          politicians: (selected) => updateFilter('politicians', selected),
          functions: (selected) => updateFilter('functions', selected),
          tags: (selected) => updateFilter('tags', selected),
          tagResultType: (type) => updateFilter('tagResultType', type),
          quotes: (selected) => updateFilter('quotes', selected),
        }}
        onClear={clearFilters}
        availablePoliticians={MOCK_POLITICIANS.map((p) => ({ id: p.id, name: p.name }))}
        availableFunctions={AVAILABLE_FUNCTIONS}
        availableTags={AVAILABLE_TAGS}
      />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Search Results</h1>
            <p className="text-muted-foreground">
              Showing {results.length} {resultType === 'politician' ? 'politicians' : 'quotes'}
            </p>
          </div>

          <SearchResultsGrid
            results={results}
            type={resultType as 'politician' | 'quote'}
            isLoading={isLoading}
            isEmpty={results.length === 0}
          />
        </div>
      </div>
    </div>
  );
}
