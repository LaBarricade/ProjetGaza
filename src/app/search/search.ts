export type FilterType = 'politician' | 'function' | 'tag' | 'quote';

export interface SearchFilters {
  politicians: string[];
  functions: string[];
  tags: string[];
  tagResultType: 'politicians' | 'quotes';
  quotes: string[];
}

export interface Politician {
  id: string;
  name: string;
  function: string;
  party?: string;
  imageUrl?: string;
  quotesCount: number;
  tagsCount: number;
}

export interface Quote {
  id: string;
  text: string;
  politicianId: string;
  politicianName: string;
  date: string;
  tags: string[];
}
