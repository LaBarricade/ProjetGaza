'use client'

import { useEndReached } from "@/lib/use-reached-end";
import CountUp from "react-countup";
import { QuoteCard } from "../quote-card";
import {Quote} from "@/types/Quote";
import {useCallback, useEffect, useRef, useState} from "react";
import {callLocalApi} from "@/lib/backend/api-client";

function CitationCount({ totalCount }: { totalCount: number }) {
  return (
    <h2 className="w-full text-3xl font-bold text-gray-800 mt-8">
      <CountUp end={totalCount} duration={1.2} /> citations
    </h2>
  )
}

export function QuoteList({
  initialItems,
  totalCount,
  hidePersonality,
  apiFilters,
}: {
  initialItems: Quote[];
  totalCount?: number | null;
  hidePersonality?: boolean;
  apiFilters?: {};
}) {
  const [items, setItems] = useState<Quote[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const pageRef = useRef(1)

  const fetchData = useCallback(async (
    pageToLoad: number = pageRef.current,
    apiFilters: {}
  ) => {
    //-- Fetch quotes
    const queryParams = new URLSearchParams(apiFilters);
    queryParams.set('page', pageToLoad.toString());
    const apiResp = await callLocalApi(`/api/v2/quotes?${queryParams.toString()}`);

    console.log('fetchData')

    if (pageToLoad === 1) {
      setItems(apiResp.items);
    } else {
      setItems(prev => {
        const arr = prev ? [...prev, ...apiResp.items] : apiResp.items;
        return arr;
      });
    }

    setLoading(false);
  }, [setItems, setLoading]);

  const loadMore = async () => {
    console.log('loadMore ? ', totalCount, items.length, apiFilters, loading)

    if (items && totalCount && totalCount <= items.length)
      return;
    if (loading || !apiFilters)
      return;

    setLoading(true);
    fetchData(pageRef.current + 1, apiFilters)
    pageRef.current += 1;
  };

  const loaderRef = useEndReached(loadMore);


  return (
    <div className="w-full max-w-screen-lg p-4 mx-auto mt-6 space-y-6">
      {totalCount && <CitationCount totalCount={totalCount} />}
      <div className="w-screen max-w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {items.map((q) => (
          <div key={q.id} className="mb-6 break-inside-avoid">
            <QuoteCard quote={q} hidePersonality={hidePersonality} />
          </div>
        ))}
      </div>

      <div ref={loaderRef} className="h-6" aria-hidden />
    </div>
  );
}
