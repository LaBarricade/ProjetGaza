import {useSearchParams, useRouter} from 'next/navigation';
import {useCallback, useMemo} from 'react';

export type SearchFilters = {
    personalities: string[];
    roles: string[];
    parties: string[];
    tags: string[];
    departments: string[];
    text: string;
};

/**
 * Mapping between filter keys and their URL parameter names
 */
const FILTER_URL_KEYS = {
    personalities: 'personality',
    roles: 'role',
    parties: 'party',
    tags: 'tag',
    departments: 'department',
    text: 'text',
} as const satisfies Record<keyof SearchFilters, string>;

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
    const searchParams = useSearchParams();
    const router = useRouter();

    /**
     * Parse current filters from URL search params.
     */
    const filters: SearchFilters = useMemo(() => {
        return {
            personalities: parseArrayParam(searchParams?.get(FILTER_URL_KEYS.personalities)),
            roles: parseArrayParam(searchParams?.get(FILTER_URL_KEYS.roles)),
            parties: parseArrayParam(searchParams?.get(FILTER_URL_KEYS.parties)),
            tags: parseArrayParam(searchParams?.get(FILTER_URL_KEYS.tags)),
            departments: parseArrayParam(searchParams?.get(FILTER_URL_KEYS.departments)),
            text: searchParams?.get(FILTER_URL_KEYS.text) ?? '',
        };
    }, [searchParams]);

    /**
     * Check if any filters are currently active
     */
    const hasActiveFilters = useMemo(() => {
        return (
            filters.personalities.length > 0 ||
            filters.roles.length > 0 ||
            filters.parties.length > 0 ||
            filters.tags.length > 0 ||
            filters.departments.length > 0 ||
            filters.text.length > 0
        );
    }, [filters]);

    /**
     * Update a single filter and navigate to the new URL
     */
    const setFilter = useCallback(
        <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
            const newParams = new URLSearchParams(searchParams as URLSearchParams);

            // Always reset to page 1 when filters change
            newParams.delete('page');

            const urlKey = FILTER_URL_KEYS[key];
            const isEmpty = Array.isArray(value) ? value.length === 0 : !value;

            if (isEmpty) {
                newParams.delete(urlKey);
            } else {
                const stringValue = Array.isArray(value) ? value.join(',') : value;
                newParams.set(urlKey, stringValue as string);
            }

            const newUrl = `${basePath}?${newParams.toString()}`;
            router.push(newUrl);
        },
        [basePath, router, searchParams]
    );

    /**
     * Toggle a value in an array-type filter.
     * Useful for multi-select filters.
     */
    const toggleFilterValue = useCallback(
        (key: Exclude<keyof SearchFilters, 'text'>, value: string) => {
            const currentValues = filters[key] as string[];
            const newValues = currentValues.includes(value)
                ? currentValues.filter((item) => item !== value)
                : [...currentValues, value];

            setFilter(key, newValues);
        },
        [filters, setFilter]
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
        (updates: Partial<SearchFilters>) => {
            const newParams = new URLSearchParams(searchParams as URLSearchParams);
            newParams.delete('page');

            Object.entries(updates).forEach(([key, value]) => {
                const urlKey = FILTER_URL_KEYS[key as keyof SearchFilters];
                const isEmpty = Array.isArray(value) ? value.length === 0 : !value;

                if (isEmpty) {
                    newParams.delete(urlKey);
                } else {
                    const stringValue = Array.isArray(value) ? value.join(',') : value;
                    newParams.set(urlKey, stringValue);
                }
            });

            const newUrl = `${basePath}?${newParams.toString()}`;
            router.push(newUrl);
        },
        [basePath, router, searchParams]
    );

    return {
        filters,
        setFilter,
        toggleFilterValue,
        clearAllFilters,
        setMultipleFilters,
        hasActiveFilters,
    };
}

/**
 * Parse a comma-separated string into an array of strings.
 * Returns empty array if null/undefined/empty.
 */
function parseArrayParam(param: string | null | undefined): string[] {
    if (!param || param.trim() === '') {
        return [];
    }
    return param.split(',').filter(Boolean);
}
