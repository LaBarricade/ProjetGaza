import { useState } from 'react';
import { SearchFilters } from '@/types/search';

const initialFilters: SearchFilters = {
  politicians: [],
  functions: [],
  tags: [],
  tagResultType: 'politicians',
  quotes: [],
};

export function useSearchFilters() {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const addFilter = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: Array.isArray(prev[key])
        ? [...(prev[key] as string[]), value]
        : prev[key],
    }));
  };

  const removeFilter = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: Array.isArray(prev[key])
        ? (prev[key] as string[]).filter((item) => item !== value)
        : prev[key],
    }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const toggleFilter = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => {
      const current = prev[key] as string[];
      return {
        ...prev,
        [key]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  };

  return { filters, updateFilter, addFilter, removeFilter, clearFilters, toggleFilter };
}
