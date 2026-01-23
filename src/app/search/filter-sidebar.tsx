'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PoliticianFilter } from './politician-filter';
import { FunctionFilter } from './function-filter';
import { TagFilter } from './tag-filter';
import { QuoteFilter } from './quote-filter';
import { AnimatedTabs, AnimatedTabsList, AnimatedTabsTrigger } from '@/components/ui/animated-tabs';
import { Funnel } from 'lucide-react';
import { Personality } from '@/types/Personality';
import { Quote } from '@/types/Quote';
import { Tag, Tag as TagType } from '@/types/Tag';
import { useRouter } from 'next/navigation';
import { useSearchFilters } from './useSearchFilters';
import { useEffect, useMemo, useState } from 'react';

interface FilterSidebarProps {
  apiFilters: {
    text?: string | null;
    party?: string | null;
    tag?: string | null;
    personality?: string | null;
    function?: string | null;
  };
  personalitiesList: Personality[];
  quotesList: Quote[];
  tagsList: TagType[];
  urlParams: any;
}

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

const CANONICAL_FUNCTIONS = [
  "Président de la République",
  "Secrétaire général",
  "Président de la région",
  "Député européen",
  "Premier Ministre"
];

export function FilterSidebar({
  apiFilters,
  personalitiesList,
  quotesList,
  tagsList,
  urlParams,
}: FilterSidebarProps) {
  const router = useRouter();
  const { filters, updateFilter, clearFilters, baseFilterType, updateBaseFilterType } = useSearchFilters();
  const [initialized, setInitialized] = useState(false);

  const hasActiveFilters =
    filters.politicians.length > 0 ||
    filters.functions.length > 0 ||
    filters.tags.length > 0 ||
    filters.quotes.length > 0;

  // Initialize filters from URL parameters
  useEffect(() => {
    if (initialized) return;

    const q = apiFilters?.text;
    const tag = apiFilters?.tag;
    const party = apiFilters?.party;
    const personality = apiFilters?.personality;
    const functionFilter = apiFilters?.function;

    if (q) {
      updateFilter('quotes', [q]);
    } 
        if (tag) {
      const tagIds = tag.split('+');
      const matchedTags = tagsList.filter(t => tagIds.includes(t.id.toString()));
      if (matchedTags.length > 0) {
        updateFilter('tags', matchedTags);
      }
    
    }  if (party) {
      updateFilter('politicians', [party]);
    }  if (personality) {
      updateFilter('politicians', [personality]);
    }
    
    if (functionFilter) {
      updateFilter('functions', [functionFilter]);
    }

    setInitialized(true);
  }, [apiFilters, initialized, updateFilter]);

  // Handle filter changes and navigation
  const handleFilterChange = (filterType: string, values: any) => {
    updateFilter(filterType as any, values);
    
    // Build new URL with updated filters
    const params = new URLSearchParams();
    
    // Add relevant filters based on the values and current state
    if (filterType === 'quotes' && values.length > 0) {
      params.set('text', values[0]);
    } 
    else if (filterType === 'party' && values.length > 0) {
      params.set('party', values[0]);
    }
    else if (filterType === 'politicians' && values.length > 0) {
      params.set('personality', values[0]);
    } else if (filterType === 'functions' && values.length > 0) {
      params.set('function', values[0]);
    }   else if (filterType === 'tags' && values.length > 0) {
      const tagIds = values.map((t: TagType) => t.id.toString()).join('+');
      params.set('tag', tagIds);
    }
    
    // Remove page param when filters change to start from page 1
    
    router.push(`/search?${params.toString()}`);
  };

  const handleClearFilters = () => {
    clearFilters();
    router.push('/search');
  };

  const handleTabChange = (value: string) => {
    updateBaseFilterType(value as '' | 'politicians' | 'quotes');
  };

  const onFiltersChange = {
    politicians: (selected: number[]) => handleFilterChange('politicians', selected),
    functions: (selected: string[]) => handleFilterChange('functions', selected),
    tags: (selected: Tag[]) => handleFilterChange('tags', selected),
    // tagResultType: (type: 'politicians' | 'quotes') => updateFilter('tagResultType', type),
    quotes: (selected: string[]) => handleFilterChange('quotes', selected),
    party: (selected: number[]) => handleFilterChange('party', selected)
  };

  const functionsList = useMemo(() => {
    const functionsSet = new Set<string>();
    personalitiesList.forEach(({ role }) => {
      const normalized = normalizeFunction(role ?? "");
      if (normalized) functionsSet.add(normalized);
    });
    return Array.from(functionsSet).sort();
  }, [personalitiesList]);

  return (
    <div className="w-80 border-r min-h-screen flex flex-col bg-background">
      <div className="sticky top-0 bg-background z-10 p-6 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold flex items-center gap-2 text-xl">
            <Funnel size={20} />Filtres
          </h2>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              Effacer tout
            </Button>
          )}
        </div>

        <AnimatedTabs value={baseFilterType} onValueChange={handleTabChange}>
          <AnimatedTabsList className="w-full grid grid-cols-3">
            <AnimatedTabsTrigger value="" className="text-xs text-center">Tout</AnimatedTabsTrigger>
            <AnimatedTabsTrigger value="politicians" className="text-xs text-center">Politiciens</AnimatedTabsTrigger>
            <AnimatedTabsTrigger value="quotes" className="text-xs text-center">Citations</AnimatedTabsTrigger>
          </AnimatedTabsList>
        </AnimatedTabs>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">

   
            <PoliticianFilter
              selected={filters.politicians}
              onChange={onFiltersChange.politicians}
              personalitiesList={personalitiesList}
            />
            <Separator />
            <FunctionFilter
              selected={filters.functions}
              onChange={onFiltersChange.functions}
              functionsList={functionsList}
            />
            <Separator />

        <TagFilter
          selected={filters.tags}
          onChange={onFiltersChange.tags}
          // resultType={filters.tagResultType}
          // onResultTypeChange={onFiltersChange.tagResultType}
          tagsList={tagsList}
        />


            <Separator />
            <QuoteFilter
              selected={filters.quotes}
              onChange={onFiltersChange.quotes}
              quotesList={quotesList}
            />

      </div>
    </div>
  );
}