"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TopBar } from "@/app/top-bar";
import { QuoteList } from "@/components/list/quote-list";
import { Footer } from "../footer";
import {Quote} from "@/types/Quote";
import {Tag} from "@/types/Tag";
import {Party} from "@/types/Party";
import {ReadonlyURLSearchParams, useSearchParams} from "next/navigation";
import {callApi} from "@/lib/api-client";

type SearchParams = {
  tag?: Tag | null;
  text?: string | null;
  party?: Party | null;
};

export default function QuotesPage({searchParams}: {searchParams: SearchParams} = {searchParams: {}}) {
  const searchParamsFromQs: ReadonlyURLSearchParams | null = useSearchParams();
  const [items, setItems] = useState<Quote[] | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [filteredResults, setFilteredResults] = useState<Quote[] | null>(null);
  const [loading, setLoading] = useState(true);
  const pageRef = useRef(1);

  const handleResults = useCallback((results: Quote[] | null) => {
    pageRef.current = 1;
    setFilteredResults(results);
  }, []);

  const handleLoading = useCallback((isLoading: boolean) => setLoading(isLoading), []);

  const fetchData = useCallback(async (
    pageToLoad: number = pageRef.current,
    searchParamsFromQs: ReadonlyURLSearchParams | null
  ) => {
    try {
      if (searchParamsFromQs) {
        //-- Fetch search params info
        if (searchParamsFromQs.get('tag')) {
          const id = searchParamsFromQs.get('tag');
          const apiResp = await callApi(`/api/v2/tags?id=${id}`);
          searchParams.tag = apiResp.item;
        }
        if (searchParamsFromQs.get('party')) {
          const id = searchParamsFromQs.get('party');
          const apiResp = await callApi(`/api/v2/parties?id=${id}`);
          searchParams.party = apiResp.item;
        }
        if (searchParamsFromQs.get('text')) {
          searchParams.text = searchParamsFromQs.get('text');
        }
      }

      //-- Fetch quotes
      const queryParams = new URLSearchParams();
      queryParams.set('page', pageToLoad.toString());
      queryParams.set('size', '20');
      if (searchParams.tag)
        queryParams.set(`tag`, searchParams.tag.id.toString());
      if (searchParams.text)
        queryParams.set('text', searchParams.text)
      if (searchParams.party)
        queryParams.set('party', searchParams.party.id.toString())

      const res = await fetch(`/api/v2/quotes?${queryParams.toString()}`);
      if (!res.ok)
        throw new Error("Erreur fetch API");
      const newData = await res.json();

      setTotalCount(newData.count);

      if (pageToLoad === 1) {
        setItems(newData.items);
      } else {
        setItems(prev => {
          const arr = prev ? [...prev, ...newData.items] : newData.items;
          return arr;
        });
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      setItems(null);
    } finally {
      setLoading(false);
    }
  }, [setItems, setLoading, searchParams]);

  const loadMore = async () => {
    if (items && totalCount && totalCount <= items.length) return;
    if (loading) return;
    setLoading(true);
    fetchData(pageRef.current + 1, searchParamsFromQs)
    pageRef.current += 1;
  };

  useEffect(() => {
    fetchData(pageRef.current, searchParamsFromQs);
  }, [fetchData]);

  let searchTitle = null;
  if (Object.keys(searchParams).length > 0) {
    searchTitle = 'Recherche pour ';
    if (searchParams.tag)
      searchTitle += ' le tag "' + searchParams.tag.name + '"'
    else if (searchParams.text)
      searchTitle += ' "' + searchParams.text + '"'
    else if (searchParams.party)
      searchTitle += ' le parti politique "' + searchParams.party.name + '"'
  }


  //<TopBar onLoading={handleLoading} onResults={handleResults} />
  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <TopBar />

      <main className="flex flex-1 flex-col gap-[32px] row-start-2 justify-center sm:items-center items-center w-full px-4 mx-auto">
        {loading && (
          <div className="flex flex-1 items-center h-full">
            <p>Chargement des données...</p>
          </div>
        )}

        {searchTitle && <h2 className="text-3xl font-bold">{searchTitle}</h2>}

        {filteredResults && filteredResults.length > 0 &&
            <QuoteList quotes={filteredResults} onEndReached={loadMore} />}
        {!filteredResults && items && items.length > 0 &&
            <QuoteList quotes={items} totalCount={totalCount} onEndReached={loadMore} />}

        {filteredResults && filteredResults.length === 0 && <p>Aucun résultat trouvé.</p>}
        
        {items && items.length === 0 && (
          <div className="flex flex-1 items-center h-full">
            <p>Aucun résultat trouvé.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}