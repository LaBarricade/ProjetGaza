'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Briefcase,
  Building2,
  LucideProps,
  MapPin,
  Search,
  Tag as TagIcon,
  UserRound
} from 'lucide-react';
import { Personality } from '@/types/Personality';
import { Quote } from '@/types/Quote';
import { Tag as TagType } from '@/types/Tag';
import { Party } from '@/types/Party';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSearchFilters } from './useSearchFilters';
import { ForwardRefExoticComponent, RefAttributes, useEffect, useState } from 'react';
import { MandateType } from '@/types/MandateType';
import { Filters } from '@/app/citations/page';
import { TextFilter } from './text-filter';
import {OptionsFilter} from "@/components/filters/options-filter";
import {Territory} from "@/types/Territory";


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
  tagsList,
  mandateTypesList,
  departmentsList,
  partiesList,
  pageName = 'citations',
  computedFilters,
  config = {
    showPersonalities: true,
    showMandates: true,
    showText: true,
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
}: {
  personalitiesList: Personality[];
  quotesList?: Quote[];
  tagsList?: TagType[];
  mandateTypesList?: MandateType[];
  partiesList?: Party[];
  departmentsList?: Territory[];
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
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [initialized, setInitialized] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);

  const { filters, updateFilter, clearFilters } = useSearchFilters({
    initializedState: { initialized, setInitialized },
    computedFilters,
  });

  const hasActiveFilters = Object.values(filters).some(v => v.length > 0);

  const handleFilterChange = (filterType: string, values: string | string[]) => {
    updateFilter(filterType as keyof typeof filters, values);
    router.push(buildFilterUrl(pageName, filterType, values, searchParams));
  };

  const handleClearFilters = () => {
    clearFilters();
    router.push(`/${pageName}`);
  };

  return (
    <div className="max-w-screen-lg mx-auto ">
      {/* Header Section */}
      {hasActiveFilters && (
        <div className="bg-background z-10 p-6 border-b">
          <div className="flex justify-between items-center">
            <span></span>

            {/* Right: clear button — always visible when filters are active, regardless of open state */}

              <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                Réinitialiser les filtres
              </Button>

          </div>
        </div>
      )}
      {/* Collapsible body — everything below the header */}
      <div className={`py-6 grid transition-[grid-template-rows,opacity] duration-300 ease-out
          ${filtersOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="min-h-0 min-w-0">
          {/* Filters Section - Horizontal Layout */}
          <div className="flex min-w-0 w-full items-start gap-4 overflow-visible py-4 px-6">
            {config.showPersonalities && (
              <OptionsFilter
                selected={filters.personalities}
                onChange={(selected: string[]) => handleFilterChange('personalities', selected)}
                items={personalitiesList}
                headingNode={<><UserRound size={18} /> Politicien</>}
              />
            )}

            {config.showParties && partiesList && (
              <>
                {config.showPersonalities && (
                  <Separator orientation="vertical" className="h-16 opacity-50" />
                )}
                <OptionsFilter
                  selected={filters.parties}
                  onChange={(selected: string[]) => handleFilterChange('parties', selected)}
                  items={partiesList}
                  headingNode={<><Building2 size={18} /> Parti politique</>}
                />
              </>
            )}

            {config.showMandates && mandateTypesList && (
              <>
                <Separator orientation="vertical" className="h-16 opacity-50" />

                <OptionsFilter
                  selected={filters.roles}
                  onChange={(selected: string[]) => handleFilterChange('roles', selected)}
                  items={mandateTypesList}
                  headingNode={<><Briefcase size={18} /> Mandat</>}
                />
              </>
            )}

            {config.showDepartments && departmentsList && (
              <>
                <Separator orientation="vertical" className="h-16 opacity-50" />

                <OptionsFilter
                  selected={filters.departments}
                  onChange={(selected: string[]) => handleFilterChange('departments', selected)}
                  items={departmentsList}
                  headingNode={<><MapPin size={18} /> Département</>}
                />
              </>
            )}
          </div>
          {(config.showTags || config.showText) && <Separator className="opacity-50" />}

          {/* Text + Tags */}
          <div className="flex w-full items-start min-w-0 overflow-visible">
            {config.showTags && tagsList && (<>
              <div className="flex-1 min-w-0 overflow-y-visible">
                <div className="py-4 px-6">
                   <OptionsFilter
                    selected={filters.tags}
                    onChange={(selected: string[]) => handleFilterChange('tags', selected)}
                    items={tagsList}
                    headingNode={<><TagIcon size={18} />
                            Tags</>}
                  />
                </div>
              </div>
              <Separator orientation="vertical" className="h-16 my-4 opacity-50" />
            </>)}

            {config.showText && (
              <div className="flex-1 overflow-y-visible min-w-0">
                <div className="py-4 px-6">
                  <TextFilter
                    selected={filters.text}
                    onChange={(selected: string) => handleFilterChange('text', selected)}
                    config={config.textFilterConfig}
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
