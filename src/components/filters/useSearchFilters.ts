'use client'

import {useSearchParams, useRouter} from 'next/navigation';
import {useCallback, useMemo} from 'react';
import {EntitiesFilter, FiltersDto, FiltersUrlParams} from "@/lib/entities-filter";

type UseSearchFiltersOptions = {
    /**
     * Base path for navigation (e.g., '/citations')
     */
    basePath: string;
};

/**
 * Hook for managing search filters synchronized with URL search params.
 *
 * URL is the single source of truth
 *
 * @example
 * ```tsx
 * const { filters, setFilter, clearAllFilters, hasActiveFilters } = useSearchFilters({
 *   basePath: '/citations'
 * });
 *
 * // Read current filters
 * console.log(filters.personalities); // ['1', '2']
 *
 * // Update a single filter
 * setFilter('personalities', ['1', '2', '3']);
 *
 * // Toggle a value in an array filter
 * toggleFilterValue('personalities', '4');
 *
 * // Clear everything
 * clearAllFilters();
 * ```
 */
export function useSearchFilters({basePath}: UseSearchFiltersOptions) {
    const urlParams = useSearchParams();
    const router = useRouter();

    console.log('useSearchFilters', urlParams && urlParams.entries().toArray());
    /**
     * Parse current filters from URL search params.
     */
    const entitiesFilter: EntitiesFilter = useMemo((): EntitiesFilter => {
        const entitiesFilter = EntitiesFilter.fromUrlParams(urlParams ? Object.fromEntries(urlParams.entries()) as FiltersUrlParams : {});
        return entitiesFilter;
    }, [urlParams]);

    const countActiveFilters = useMemo(() => {
        return entitiesFilter.countActiveFilters();
    }, [entitiesFilter]);

    /**
     * Check if any filters are currently active
     */
    const hasActiveFilters = useMemo(() => {
        return entitiesFilter.hasActiveFilters();
    }, [entitiesFilter]);

    /**
     * Update a single filter and navigate to the new URL
     */
    const setFilter = useCallback(
        <K extends keyof FiltersDto>(key: K, value: FiltersDto[K]) => {
            const newParams = new URLSearchParams(urlParams as URLSearchParams);

            // Always reset to page 1 when filters change
            newParams.delete('page');

            //const urlKey = FILTER_URL_KEYS[key];
            const isEmpty = Array.isArray(value) ? value.length === 0 : !value;

            if (isEmpty) {
                newParams.delete(key);
            } else {
                const stringValue = Array.isArray(value) ? value.join(',') : value;
                newParams.set(key, stringValue as string);
            }

            const newUrl = `${basePath}?${newParams.toString()}`;
            router.push(newUrl);
        },
        [basePath, router, urlParams]
    );

    /**
     * Toggle a value in an array-type filter.
     * Useful for multi-select filters.
     */
    const toggleFilterValue = useCallback(
        (key: Exclude<keyof FiltersDto, 'text'>, value: string) => {
            const allFiltersDto = entitiesFilter.toDto();
            const currentValues = allFiltersDto[key] as string[];
            const newValues = currentValues.includes(value)
                ? currentValues.filter((item) => item !== value)
                : [...currentValues, value];

            setFilter(key, newValues);
        },
        [entitiesFilter, setFilter]
    );

    /**
     * Clear all filters and navigate to base path
     */
    const clearAllFilters = useCallback(() => {
        router.push(basePath);
    }, [basePath, router]);

    /**
     * Update multiple filters at once (useful for batch operations)
     */
    const setMultipleFilters = useCallback(
        (updates: Partial<FiltersDto>) => {
            const newParams = new URLSearchParams(urlParams as URLSearchParams);
            newParams.delete('page');

            Object.entries(updates).forEach(([key, value]) => {
                const isEmpty = Array.isArray(value) ? value.length === 0 : !value;

                if (isEmpty) {
                    newParams.delete(key);
                } else {
                    const stringValue = Array.isArray(value) ? value.join(',') : value;
                    newParams.set(key, stringValue);
                }
            });

            const newUrl = `${basePath}?${newParams.toString()}`;
            router.push(newUrl);
        },
        [basePath, router, urlParams]
    );

    return {
        //filters,
        filtersDto: entitiesFilter.toDto(),
        entitiesFilter,
        setFilter,
        toggleFilterValue,
        clearAllFilters,
        setMultipleFilters,
        hasActiveFilters,
        countActiveFilters
    };
}
