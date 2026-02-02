'use client';

import { useEndReached } from '@/lib/use-reached-end';
import CountUp from 'react-countup';
import { QuoteCard } from '../quote-card';
import { Quote } from '@/types/Quote';
import { useCallback, useEffect, useRef, useState } from 'react';
import { callLocalApi } from '@/lib/backend/api-client';
import {objectToQueryString} from "@/lib/utils";

type ApiFilters = Record<string, string | string[]>;

export function QuoteList({
  initialItems,
  totalCount,
  hidePersonality,
  apiFilters = {},
}: {
  initialItems: Quote[];
  totalCount?: number | null;
  hidePersonality?: boolean;
  apiFilters?: any;
}) {
  const [items, setItems] = useState<Quote[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const pageRef = useRef(1);

  //  When filters (or initialItems) change because URL changed / SSR re‑ran,
  //  reset local state so we start fresh for this new filter set.
  useEffect(() => {
    setItems(initialItems);
    pageRef.current = 1;
  }, [initialItems, JSON.stringify(apiFilters)]);

  const fetchData = useCallback(async (pageToLoad: number, filters: ApiFilters) => {
    /*const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          params.set(key, value.join(','));
        }
      } else if (value != null && value !== '') {
        params.set(key, value);
      }
    });

    params.set('page', pageToLoad.toString());
     */
    const qs = objectToQueryString(Object.assign(filters, {page: pageToLoad.toString()}));

    const apiResp = await callLocalApi(`/api/v2/quotes?${qs}`);

    if (pageToLoad === 1) {
      setItems(apiResp.items);
    } else {
      setItems((prev) => [...prev, ...apiResp.items]);
    }

    setLoading(false);
  }, []);

  const loadMore = async () => {
    if (!totalCount || totalCount <= items.length) return;
    if (loading) return;

    setLoading(true);
    const nextPage = pageRef.current + 1;
    pageRef.current = nextPage;
    fetchData(nextPage, apiFilters);
  };

  const loaderRef = useEndReached(loadMore);

  return (
    <div className="w-full max-w-screen-lg p-4 mx-auto mt-0 space-y-6">
      {totalCount &&
          <h2 className="w-full text-3xl font-bold text-gray-800 mt-0">
            <CountUp end={totalCount} duration={1.2} /> citations
          </h2>
      }

      <div className="w-screen max-w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {items.map((q) => (

            <QuoteCard quote={q} hidePersonality={hidePersonality} />

        ))}
      </div>

      <div ref={loaderRef} className="h-6" aria-hidden />
    </div>
  );
}

export default QuoteList;
