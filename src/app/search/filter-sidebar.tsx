import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SearchFilters } from './search';
import { PoliticianFilter } from './politician-filter';
import { FunctionFilter } from './function-filter';
import { TagFilter } from './tag-filter';
import { QuoteFilter } from './quote-filter';

interface FilterSidebarProps {
  filters: SearchFilters;
  onFiltersChange: {
    politicians: (selected: string[]) => void;
    functions: (selected: string[]) => void;
    tags: (selected: string[]) => void;
    tagResultType: (type: 'politicians' | 'quotes') => void;
    quotes: (selected: string[]) => void;
  };
  onClear: () => void;
  availablePoliticians: { id: string; name: string }[];
  availableFunctions: string[];
  availableTags: string[];
}

export function FilterSidebar({
  filters,
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
    <div className="w-64 border-r h-full overflow-y-auto p-4">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">Filters</h2>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClear}>
              Clear
            </Button>
          )}
        </div>
        <Separator />

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

        <QuoteFilter value={filters.quotes} onChange={onFiltersChange.quotes} />
      </div>
    </div>
  );
}
