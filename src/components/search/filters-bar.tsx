'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PersonalityFilter } from './personality-filter';
import { MandateFilter } from './mandate-filter';
import { TagFilter } from './tag-filter';
import { PartyFilter } from './party-filter';
import { ChevronDown, Funnel, LucideProps, Search, UserRound } from 'lucide-react';
import { Personality } from '@/types/Personality';
import { Quote } from '@/types/Quote';
import { Tag } from '@/types/Tag';
import { Party } from '@/types/Party';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSearchFilters } from './useSearchFilters';
import { ForwardRefExoticComponent, RefAttributes, useEffect, useState } from 'react';
import { MandateType } from '@/types/MandateType';
import { Filters } from '@/app/citations/page';
import { TextFilter } from './text-filter';
import { DepartmentFilter } from './department-filter';

interface FiltersBarProps {
  personalitiesList: Personality[];
  quotesList?: Quote[];
  tagsList: Tag[];
  mandateTypesList: MandateType[];
  pageName: string;
  computedFilters: Filters;
  config?: {
    showPersonalities?: boolean;
    showMandates?: boolean;
    showText?: boolean;
    showTags?: boolean;
    showParties?: boolean;
    showDepartments?: boolean;
    layout?: 'horizontal' | 'vertical';
    textFilterConfig?: {
      headerTitle?: string | false;
      icon?: ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>;
      inputPlaceholder?: string;
    };
  };
}

export function parseIds(param: string | undefined): number[] {
  if (!param) return [];
  return param
    .split(',')
    .map((id: string) => parseInt(id.trim(), 10))
    .filter((id: number) => !isNaN(id) && id > 0);
}

const FILTER_URL_KEYS: Record<string, string> = {
  text: 'text',
  parties: 'party',
  personalities: 'personality',
  roles: 'role',
  tags: 'tag',
  departments: 'department',
};

function buildFilterUrl(
  pageName: string,
  filterType: string,
  values: string | string[],
  searchParams: URLSearchParams | null
): string {
  const params = new URLSearchParams(searchParams || undefined);
  params.delete('page');

  const urlKey = FILTER_URL_KEYS[filterType];
  if (!urlKey) return `/${pageName}?${params.toString()}`;

  const isEmpty = !values || (Array.isArray(values) && values.length === 0) || values === '';

  if (isEmpty) {
    params.delete(urlKey);
  } else {
    params.set(urlKey, Array.isArray(values) ? values.join(',') : values);
  }

  return `/${pageName}?${params.toString()}`;
}

export function FiltersBar({
  personalitiesList,
  quotesList = [],
  tagsList,
  mandateTypesList,
  pageName = 'citations',
  computedFilters,
  config = {
    showPersonalities: true,
    showMandates: true,
    showText: false,
    showTags: true,
    showParties: true,
    showDepartments: true,
    layout: 'horizontal',
    textFilterConfig: {
      headerTitle: 'Rechercher',
      icon: Search,
      inputPlaceholder: 'Rechercher...',
    },
  },
}: FiltersBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [initialized, setInitialized] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { filters, updateFilter, clearFilters } = useSearchFilters(
    { initialized, setInitialized },
    computedFilters,
    tagsList,
    personalitiesList
  );

  const hasActiveFilters =
    filters.personalities.length > 0 ||
    filters.roles.length > 0 ||
    filters.tags.length > 0 ||
    filters.departments.length > 0 ||
    filters.text.length > 0 ||
    filters.parties.length > 0;

  // Count how many distinct filter categories are active (for the badge)
  const activeFilterCount =
    (filters.personalities.length > 0 ? 1 : 0) +
    (filters.roles.length > 0 ? 1 : 0) +
    (filters.tags.length > 0 ? 1 : 0) +
    (filters.departments.length > 0 ? 1 : 0) +
    (filters.text.length > 0 ? 1 : 0) +
    (filters.parties.length > 0 ? 1 : 0);

  const handleFilterChange = (filterType: string, values: string | string[]) => {
    updateFilter(filterType as keyof typeof filters, values);
    router.push(buildFilterUrl(pageName, filterType, values, searchParams));
  };

  const handleClearFilters = () => {
    clearFilters();
    router.push(`/${pageName}`);
  };

  const partiesList: Party[] = Array.from(
    new Map(personalitiesList.filter((p) => p.party).map((p) => [p.party!.id, p.party!])).values()
  );

  const onFiltersChange = {
    personalities: (selected: string[]) => handleFilterChange('personalities', selected),
    roles: (selected: string[]) => handleFilterChange('roles', selected),
    tags: (selected: string[]) => handleFilterChange('tags', selected),
    parties: (selected: string[]) => handleFilterChange('parties', selected),
    departments: (selected: string[]) => handleFilterChange('departments', selected),
    text: (selected: string) => handleFilterChange('text', selected),
  };

  return (
    <div className="max-w-screen-lg mx-auto border-b border-slate-200 bg-background">
      {/* Header Section */}
      <div className="bg-background z-10 p-6 border-b">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setFiltersOpen((prev) => !prev)}
            className="flex items-center gap-2 text-xl font-semibold"
          >
            <Funnel size={20} />
            Filtres
            {/* Badge: visible only when collapsed and filters are active */}
            <div className="h-6 w-6 flex items-center justify-center">
              {hasActiveFilters && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-white text-xs font-semibold">
                  {activeFilterCount}
                </span>
              )}
            </div>
            {/* Chevron rotates based on open/closed state */}
            <span className="hover:bg-accent ml-6 px-2 py-1 transition-all rounded-md hover:text-accent-foreground dark:hover:bg-accent/50">
              <ChevronDown
                size={18}
                className={`text-muted-foreground transition-transform duration-200 ${filtersOpen ? 'rotate-180' : 'rotate-0'}`}
              />
            </span>
          </button>

          {/* Right: clear button — always visible when filters are active, regardless of open state */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              Réinitialiser les filtres
            </Button>
          )}
        </div>
      </div>

      {/* Collapsible body — everything below the header */}
      <div
        className={`
    grid transition-[grid-template-rows,opacity]
    duration-300 ease-out
    ${filtersOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
  `}
      >
        <div className="min-h-0 min-w-0">
          {/* Filters Section - Horizontal Layout */}
          <div className="flex min-w-0 w-full items-start gap-4 overflow-visible p-6">
            {config.showPersonalities && (
              <PersonalityFilter
                selected={filters.personalities}
                onChange={onFiltersChange.personalities}
                personalitiesList={personalitiesList}
              />
            )}

            {config.showParties && partiesList.length > 0 && (
              <>
                {config.showPersonalities && <Separator orientation="vertical" className="h-16" />}

                <PartyFilter
                  selected={filters.parties}
                  onChange={onFiltersChange.parties}
                  partiesList={partiesList}
                />
              </>
            )}

            {config.showMandates && (
              <>
                <Separator orientation="vertical" className="h-16" />

                <MandateFilter
                  selected={filters.roles}
                  onChange={onFiltersChange.roles}
                  mandateTypesList={mandateTypesList}
                />
              </>
            )}

            {config.showDepartments && (
              <>
                <Separator orientation="vertical" className="h-16" />

                <DepartmentFilter
                  selected={filters.departments}
                  onChange={onFiltersChange.departments}
                  personalitiesList={personalitiesList}
                />
              </>
            )}
          </div>

          {/* Text + Tags row */}
          <div className="flex w-full items-start min-w-0 overflow-visible">
            {config.showText && (
              <div className="flex-1 overflow-y-visible min-w-0">
                <Separator />
                <div className="p-6">
                  <TextFilter
                    selected={filters.text}
                    onChange={onFiltersChange.text}
                    config={config.textFilterConfig}
                  />
                </div>
              </div>
            )}
            {config.showTags && (
              <div className="flex-1 min-w-0 overflow-y-visible">
                <Separator />
                <div className="p-6">
                  <TagFilter
                    selected={filters.tags}
                    onChange={onFiltersChange.tags}
                    tagsList={tagsList}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
