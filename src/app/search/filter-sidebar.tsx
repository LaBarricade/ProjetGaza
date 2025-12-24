import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SearchFilters } from './search';
import { PoliticianFilter } from './politician-filter';
import { FunctionFilter } from './function-filter';
import { TagFilter } from './tag-filter';
import { QuoteFilter } from './quote-filter';
import { Personality, Tag as TagType } from '../personnalites/page';
import { AnimatedTabs, AnimatedTabsList, AnimatedTabsTrigger } from '@/components/ui/animated-tabs';

interface FilterSidebarProps {
  filters: SearchFilters;
  onBaseFilterTypeChange: (type: '' | 'politicians' | 'quotes' | 'tags') => void;  
  baseFilterType: '' | 'politicians' | 'quotes' | 'tags';
  onFiltersChange: {
    politicians: (selected: number[]) => void;
    functions: (selected: string[]) => void;
    tags: (selected: string[]) => void;
    tagResultType: (type: 'politicians' | 'quotes') => void;
    quotes: (selected: string[]) => void;
  };
  onClear: () => void;
  availablePoliticians: Personality[];
  availableFunctions: string[];
  availableTags: TagType[];
}

export function FilterSidebar({
  filters,
  onBaseFilterTypeChange,
  baseFilterType,
  onFiltersChange,
  onClear,
  availablePoliticians,
  availableFunctions,
  availableTags,
}: FilterSidebarProps) {
  const hasActiveFilters =
    filters.politicians.length > 0 ||
    filters.functions.length > 0 ||
    filters.tags.length > 0 ||
    filters.quotes.length > 0;

  return (
    <div className="w-80 border-r h-full overflow-y-auto bg-background">
      <div className="sticky top-0 bg-background z-10 p-6 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Filtres</h2>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClear}>
              Effacer tout
            </Button>
          )}
        </div>

        <AnimatedTabs 
          value={baseFilterType} 
          onValueChange={(value) => onBaseFilterTypeChange(value as '' | 'politicians' | 'quotes' | 'tags')}
        >
          <AnimatedTabsList className="w-full grid grid-cols-4">
            <AnimatedTabsTrigger value="" className="text-xs">Tout</AnimatedTabsTrigger>
            <AnimatedTabsTrigger value="politicians" className="text-xs">Politiciens</AnimatedTabsTrigger>
            <AnimatedTabsTrigger value="quotes" className="text-xs">Citations</AnimatedTabsTrigger>
            <AnimatedTabsTrigger value="tags" className="text-xs">Tags</AnimatedTabsTrigger>
          </AnimatedTabsList>
        </AnimatedTabs>
      </div>

      <div className="p-6 space-y-6">
        {baseFilterType === '' && (
          <>
            <PoliticianFilter
              selected={filters.politicians}
              onChange={onFiltersChange.politicians}
              availablePoliticians={availablePoliticians}
            />
            <Separator />
            <FunctionFilter
              selected={filters.functions}
              onChange={onFiltersChange.functions}
              availableFunctions={availableFunctions}
            />
            <Separator />
            <TagFilter
              selected={filters.tags}
              onChange={onFiltersChange.tags}
              resultType={filters.tagResultType}
              onResultTypeChange={onFiltersChange.tagResultType}
              availableTags={availableTags}
            />
            <Separator />
            <QuoteFilter 
              value={filters.quotes} 
              onChange={onFiltersChange.quotes} 
            />
          </>
        )}

        {baseFilterType === 'politicians' && (
          <>
            <PoliticianFilter
              selected={filters.politicians}
              onChange={onFiltersChange.politicians}
              availablePoliticians={availablePoliticians}
            />
            <Separator />
            <FunctionFilter
              selected={filters.functions}
              onChange={onFiltersChange.functions}
              availableFunctions={availableFunctions}
            />
          </>
        )}

        {baseFilterType === 'quotes' && (
          <QuoteFilter 
            value={filters.quotes} 
            onChange={onFiltersChange.quotes} 
          />
        )}

        {baseFilterType === 'tags' && (
          <TagFilter
            selected={filters.tags}
            onChange={onFiltersChange.tags}
            resultType={filters.tagResultType}
            onResultTypeChange={onFiltersChange.tagResultType}
            availableTags={availableTags}
          />
        )}
      </div>
    </div>
  );
}