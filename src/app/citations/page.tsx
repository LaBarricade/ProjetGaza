'use server';

//import {Suspense, useCallback, useEffect, useRef, useState} from "react";
import { QuoteList } from "@/components/list/quote-list";
import {Quote} from "@/types/Quote";
import {Tag} from "@/types/Tag";
import {Party} from "@/types/Party";
import {ReadonlyURLSearchParams, redirect} from "next/navigation";
import {Input} from "@/components/ui/input";
import {Search} from "lucide-react";
import SearchInput from "@/components/search-input";
import {getDbService} from "@/lib/backend/db-service";

type Filters = {
  tag?: Tag | null;
  text?: string | null;
  party?: Party | null;
};


async function runSearch (q: string)  {
  'use server';

  redirect(`/citations?text=${encodeURI(q)}`)
}

async function computeFilters (urlParams : any){
  //-- Fetch quotes
  const filters : Filters = {}
  let apiResp;

  if (urlParams) {
    //-- Fetch search params info
    if (urlParams.tag) {
      const id = urlParams.tag;
      apiResp = await getDbService().findTag({id: id});
      filters.tag = apiResp.item;
    }
    if (urlParams.party) {
      const id = urlParams.party;
      apiResp = await getDbService().findParty({id: id});
      filters.party = apiResp.item;
    }
    if (urlParams.text) {
      filters.text = urlParams.text;
    }
  }

  return filters;
}

const fetchQuotes = async (filters: Filters, page: string) => {
  let apiFilters: any = {}
  apiFilters.page = page;
  apiFilters.size = 20;

  if (filters.tag)
    apiFilters.tag = filters.tag.id.toString();
  if (filters.text)
    apiFilters.text = filters.text;
  if (filters.party)
    apiFilters.party = filters.party.id.toString();

  const apiResp = await getDbService().findQuotes(apiFilters);

  return {items: apiResp.items, count: apiResp.count, apiFilters};
}

export default async function QuotesPage({params, searchParams}: {params: any, searchParams: any}) {
  const urlParams = await searchParams;
  const filters: Filters = await computeFilters(urlParams);
  const {items, count: totalCount, apiFilters} = await fetchQuotes(filters, urlParams?.page || '1');

  let searchTitle = null;
  if (Object.keys(filters).length > 0) {
    searchTitle = 'Recherche pour ';
    if (filters.tag)
      searchTitle += ' le tag "' + filters.tag.name + '"'
    else if (filters.text)
      searchTitle += ' "' + filters.text + '"'
    else if (filters.party)
      searchTitle += ' le parti politique "' + filters.party.name + '"'
  }

  return (
      <main className="flex flex-1 flex-col gap-[32px] row-start-2 justify-center sm:items-center items-center w-full px-4 mx-auto">
        {items && items.length &&
            <SearchInput runSearch={runSearch} />
        }

        {searchTitle && <h2 className="text-3xl font-bold">{searchTitle}</h2>}

        {items && items.length > 0 &&
            <QuoteList initialItems={items} totalCount={totalCount} apiFilters={apiFilters} />
        }

        {items && items.length === 0 &&
          <div className="flex flex-1 items-center h-full">
            <p>Aucun résultat trouvé.</p>
          </div>
        }
      </main>
  );
}