"use server";
import { FilterSidebar } from './filter-sidebar';
import { SearchResultsGrid } from './search-results-grid';
import { getDbService } from '@/lib/backend/db-service';
import { Tag } from '@/types/Tag';
import { Party } from '@/types/Party';
import { Personality } from '@/types/Personality';

export type Filters = {
  tag?: (Tag & {quotes_count: number}) | (Tag & {quotes_count: number})[] | null;
  text?: string | null;
  party?: Party | null;
  personality?: Personality | null; 
  function?: string | null;
};

async function computeFilters(urlParams: any): Promise<Filters> {
  const filters: Filters = {};
  let apiResp;

  if (urlParams) {
    if (urlParams.tag) {
      const tagIds = urlParams.tag.split('+');
      if (tagIds.length > 1) {
        // Multiple tags
        apiResp = await getDbService().findTags({ id: tagIds });
        filters.tag = apiResp.items;
      } else {
        // Single tag
        apiResp = await getDbService().findTag(tagIds[0]);
        filters.tag = apiResp.item;
      }
    }
    if (urlParams.party) {
      apiResp = await getDbService().findParty(urlParams.party);
      filters.party = apiResp.item;
    }
    if (urlParams.text) {
      filters.text = urlParams.text;
    }
    if (urlParams.personality) {
      apiResp = await getDbService().findPersonality(urlParams.personality);
      filters.personality = apiResp.item;
    }
    if (urlParams.function) {
      filters.function = urlParams.function;
    }
  }

  return filters;
}

async function fetchQuotes(filters: Filters, page: string) {
  const apiFilters: any = {
    page,
    size: 20,
  };

  if (filters.tag) {
    apiFilters.tag = Array.isArray(filters.tag) ? filters.tag.map((t) => t.id.toString()) : filters.tag.id
  }
  // filters.tag.id.toString();
  if (filters.text) apiFilters.text = filters.text;
  if (filters.party) apiFilters.party = filters.party.id.toString();
  if (filters.personality) apiFilters.personality = filters.personality.id.toString();
  if (filters.function) apiFilters.function = filters.function;

  const apiResp = await getDbService().findQuotes(apiFilters);
  console.log("Fetched quotes with filters:", apiFilters, "\nResponse:", apiResp);

  return { items: apiResp.items, count: apiResp.count, apiFilters };
}

async function fetchPersonalities(filters: Filters, page: string) {
  const apiFilters: any = {
    page,
    size: 20,
  };

  // if (filters.tag) apiFilters.tag = filters.tag.id.toString();
  
  if (filters.tag) {
    apiFilters.tag = Array.isArray(filters.tag) ? filters.tag.map((t) => t.id.toString()) : filters.tag.id
  }
  if (filters.text) apiFilters.text = filters.text;
  if (filters.party) apiFilters.party = filters.party.id.toString();
  if (filters.function) apiFilters.function = filters.function;
  if( filters.personality) apiFilters.personality = filters.personality.id.toString();

  const apiResp = await getDbService().findPersonalities(apiFilters);
  console.log("Fetched personalities with filters:", apiFilters, "\nResponse:", apiResp);

  return { items: apiResp.items, count: apiResp.count, apiFilters };
}

async function fetchTags(filters: Filters) {
  const apiFilters: any = {};
  if (filters.tag) {
    apiFilters.tag = Array.isArray(filters.tag) ? filters.tag.map((t) => t.id.toString()) : filters.tag.id.toString();
  }

  const apiResp = await getDbService().findTags(apiFilters);
  return { items: apiResp.items, count: apiResp.count, apiFilters };
}

export default async function SearchPage({
  searchParams,
}: {
  params: any;
  searchParams: any;
}) {
  const urlParams = await searchParams;
  const searchFilters = await computeFilters(urlParams);
  
  const { items: quoteItems, count: quotesTotalCount, apiFilters } = 
    await fetchQuotes(searchFilters, urlParams?.page || '1');
  const { items: personalityItems, count: personalitiesTotalCount } = 
    await fetchPersonalities(searchFilters, urlParams?.page || '1');
  const { items: tagItems, count: tagsTotalCount } = 
    await fetchTags(searchFilters);

  return (
    <div className="flex min-h-screen max-w-screen">
      <div className="w-fit">
          <FilterSidebar
        apiFilters={apiFilters}
        personalitiesList={personalityItems}
        quotesList={quoteItems}
        tagsList={tagItems}
        urlParams={urlParams}
      />
      </div>


      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <SearchResultsGrid
            personalitiesList={personalityItems}
            quotesList={quoteItems}
            isEmpty={(personalityItems.length + quoteItems.length) === 0}
            apiFilters={apiFilters}
          />
        </div>
      </div>
    </div>
  );
}

function findTags(tagIds: any) {
    throw new Error('Function not implemented.');
  }
