import { Tag } from '@/types/Tag';
import { useState, useCallback } from 'react';

export type SearchFilters = {
  politicians: number[];
  functions: string[];
  tags: Tag[];
  tagResultType: 'politicians' | 'quotes';
  quotes: string[];
};

const initialFilters: SearchFilters = {
  politicians: [],
  functions: [],
  tags: [],
  tagResultType: 'politicians',
  quotes: [],
};

/**
 * Hook for managing search filters.
 *
 * @returns {
 *   filters: Current search filters.
 *   updateFilter: Update a single filter.
 *   addFilter: Add a value to a filter.
 *   addFilterMultiple: Add a list of values to a filter.
 *   removeFilter: Remove a value from a filter.
 *   clearFilters: Clear all filters.
 *   toggleFilter: Toggle a value in a filter.
 *   baseFilterType: Current view type.
 *   updateBaseFilterType: Update the view type.
 * }
 */
export function useSearchFilters() {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [baseFilterType, setBaseFilterType] = useState<'' | 'politicians' | 'quotes'>('');

  /**
   * Update a single filter.
   * @param key The key of the filter to update.
   * @param value The new value of the filter.
   */
  const updateFilter = useCallback((key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  /**
   * Add a value to a filter.
   * @param key The key of the filter to add to.
   * @param value The value to add to the filter.
   */
  const addFilter = useCallback((key: keyof SearchFilters, value: number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: Array.isArray(prev[key])
        ? [...(prev[key] as number[]), value]
        : prev[key],
    }));
  }, []);

  /**
   * Add a list of values to a filter.
   * @param key The key of the filter to add to.
   * @param values The list of values to add to the filter.
   */
  const addFilterMultiple = useCallback((key: keyof SearchFilters, values: number[]) => {
    setFilters((prev) => ({
      ...prev,
      [key]: Array.isArray(prev[key])
        ? [...(prev[key] as number[]), ...values]
        : [...values],
    }));
  }, []);

  /**
   * Remove a value from a filter.
   * @param key The key of the filter to remove from.
   * @param value The value to remove from the filter.
   */
  const removeFilter = useCallback((key: keyof SearchFilters, value: number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: Array.isArray(prev[key])
        ? (prev[key] as number[]).filter((item) => item !== value)
        : prev[key],
    }));
  }, []);

  /**
   * Clear all filters.
   */
  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
    setBaseFilterType('');
  }, []);

  /**
   * Toggle a value in a filter.
   * @param key The key of the filter to toggle.
   * @param value The value to toggle in the filter.
   */
  const toggleFilter = useCallback((key: keyof SearchFilters, value: number) => {
    setFilters((prev) => {
      const current = prev[key] as number[];
      return {
        ...prev,
        [key]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  }, []);

  /**
   * Update the base filter type (view mode).
   */
  const updateBaseFilterType = useCallback((type: '' | 'politicians' | 'quotes') => {
    setBaseFilterType(type);
  }, []);

  return {
    filters,
    baseFilterType,
    updateFilter,
    addFilter,
    addFilterMultiple,
    removeFilter,
    clearFilters,
    toggleFilter,
    updateBaseFilterType
  };
}