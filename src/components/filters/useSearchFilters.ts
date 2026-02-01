import { Filters } from '@/types/Filters';
import { Personality } from '@/types/Personality';
import { Tag } from '@/types/Tag';
import { useState, useCallback, useEffect } from 'react';

export type SearchFilters = {
  personalities: string[];
  roles: string[];
  parties: string[];
  tags: string[];
  departments: string[];
  text: string;
};

const initialFilters: SearchFilters = {
  personalities: [],
  roles: [],
  parties: [],
  tags: [],
  departments: [],
  text: '',
};

type UseSearchFiltersProps = {
  initializedState: {
    initialized: boolean;
    setInitialized: (value: boolean) => void;
  };
  computedFilters: Filters;
};

/**
 * Hook for managing search filters with proper SSR state synchronization.
 */
export function useSearchFilters({ initializedState, computedFilters }: UseSearchFiltersProps) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);

  /**
   * Update a single filter.
   */
  const updateFilter = useCallback((key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  /**
   * Clear all filters.
   */
  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  /**
   * Toggle a value in a filter array.
   */
  const toggleFilter = useCallback((key: keyof SearchFilters, value: string) => {
    setFilters((prev) => {
      const current = prev[key] as string[];
      return {
        ...prev,
        [key]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  }, []);

  /**
   * Initialization: maps the server-resolved filter objects down to
   * the string-ID arrays that the individual filter components expect.
   */
  useEffect(() => {
    const { initialized, setInitialized } = initializedState;
    if (initialized) return;

    const newFilters: SearchFilters = {
      personalities: computedFilters.personalities?.map((p) => p.id.toString()) ?? [],
      roles: computedFilters.roles?.map((r) => r.id.toString()) ?? [],
      parties: computedFilters.parties?.map((p) => p.id.toString()) ?? [],
      tags: computedFilters.tags?.map((t) => t.id.toString()) ?? [],
      departments: computedFilters.departments ?? [],
      text: computedFilters.text ?? '',
    };

    setFilters(newFilters);
    setInitialized(true);
  }, [computedFilters, initializedState]);

  return { filters, updateFilter, clearFilters, toggleFilter };
}
