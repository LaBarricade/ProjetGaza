export type FilterType = 'politician' | 'function' | 'tag' | 'quote';

//The filters used in the filters page
export interface SearchFilters {
  politicians: number[];
  functions: string[];
  tags: string[];
  tagResultType: 'politicians' | 'quotes';
  quotes: string[];
}
