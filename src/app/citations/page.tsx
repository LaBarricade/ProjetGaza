"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TopBar } from "@/app/top-bar";
import { QuoteList } from "@/components/list/quote-list";
import { Footer } from "../footer";
import {Quote} from "@/types/Quote";
import {Tag} from "@/types/Tag";
import {Party} from "@/types/Party";
import {ReadonlyURLSearchParams, redirect, useSearchParams} from "next/navigation";
import {callApi} from "@/lib/api-client";
import {Input} from "@/components/ui/input";
import {Search} from "lucide-react";

type SearchParams = {
  tag?: Tag | null;
  text?: string | null;
  party?: Party | null;
};

export default function QuotesPage({searchParams}: {searchParams: SearchParams} = {searchParams: {}}) {
  const [query, setQuery] = useState("");
  const searchParamsFromQs: ReadonlyURLSearchParams | null = useSearchParams();
  const [items, setItems] = useState<Quote[] | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [filteredResults, setFilteredResults] = useState<Quote[] | null>(null);
  const [loading, setLoading] = useState(true);
  const pageRef = useRef(1);

  const runSearch = () => {
    redirect(`/citations?text=${encodeURI(query)}`)
  }

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

      const apiResp = await callApi(`/api/v2/quotes?${queryParams.toString()}`);
      setTotalCount(apiResp.count);

      if (pageToLoad === 1) {
        setItems(apiResp.items);
      } else {
        setItems(prev => {
          const arr = prev ? [...prev, ...apiResp.items] : apiResp.items;
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

        {items && items.length &&
          <div className="flex w-full mt-4 justify-center">
            <div className="relative w-full md:max-w-md">
              <Input
                type="text"
                placeholder="Rechercher un politicien, un tag, ou un mot-clé..."
                className="bg-white pr-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runSearch()}
              />
              <Search className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"
                      onClick={() => runSearch()}/>
            </div>
          </div>
        }
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