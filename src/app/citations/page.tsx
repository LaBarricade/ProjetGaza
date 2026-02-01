'use server';

import { QuoteList } from '@/components/list/quote-list';
import { Tag } from '@/types/Tag';
import { Party } from '@/types/Party';
import { getDbService } from '@/lib/backend/db-service';
import { MandateType } from '@/types/MandateType';
import { FiltersBar } from '@/components/filters/filters-bar';
import { Personality } from '@/types/Personality';

export type Filters = {
  tags?: Tag[];
  text?: string;
  parties?: Party[];
  roles?: MandateType[];
  personalities?: Personality[];
};

export type ApiFilters = {
  page?: string;
  size?: number;
  tag?: string | string[];
  text?: string;
  personality?: string | string[];
  party?: string | string[];
  role?: string | string[];
};

// async function runSearch(q: string) {
//   'use server';
//   redirect(`/citations?text=${encodeURIComponent(q)}`);
// }

function parseIds(param: string | undefined): string[] {
  if (!param) return [];
  return param
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
}

async function computeFilters(urlParams: any): Promise<Filters> {
  const filters: Filters = {};

  try {
    // Handle tags (multiple)
    if (urlParams.tag) {
      const tagIds = parseIds(urlParams.tag);
      if (tagIds.length > 0) {
        const apiResp = await getDbService().findTags({
          ids: tagIds.map((id) => parseInt(id, 10)),
        });
        filters.tags = apiResp.items || [];
      }
    }

    // Handle parties (multiple)
    if (urlParams.party) {
      const partyIds = parseIds(urlParams.party);
      if (partyIds.length > 0) {
        const parties: Party[] = [];
        for (const id of partyIds) {
          const apiResp = await getDbService().findParty(id);
          if (apiResp.item) {
            parties.push(apiResp.item);
          }
        }
        filters.parties = parties;
      }
    }

    // Handle text search
    if (urlParams.text) {
      filters.text = urlParams.text;
    }

    // Handle roles (multiple)
    if (urlParams.role) {
      const roleIds = parseIds(urlParams.role);
      if (roleIds.length > 0) {
        const roles: MandateType[] = [];
        for (const id of roleIds) {
          const roleId = parseInt(id, 10);
          if (!isNaN(roleId)) {
            const apiResp = await getDbService().findMandateType(roleId);
            if (apiResp.item) {
              roles.push(apiResp.item);
            }
          }
        }
        filters.roles = roles;
      }
    }

    // Handle personalities (multiple)
    if (urlParams.personality) {
      const personalityIds = parseIds(urlParams.personality);
      if (personalityIds.length > 0) {
        const apiResp = await getDbService().findPersonalities({
          ids: personalityIds,
        });
        filters.personalities = apiResp.items || [];
      }
    }
  } catch (error) {
    console.error('Error computing filters:', error);
  }

  return filters;
}

const fetchTags = async (params?: {
  ids?: number[];
}): Promise<{
  items: Tag[];
  count: number | null;
}> => {
  try {
    const apiResp = await getDbService().findTags(params || { ids: [] });
    return { items: apiResp.items, count: apiResp.count };
  } catch (error) {
    console.error('Error fetching tags:', error);
    return { items: [], count: null };
  }
};

const fetchMandateTypes = async (): Promise<{
  items: MandateType[];
  count: number | null;
}> => {
  try {
    const apiResp = await getDbService().findMandateTypes();
    return { items: apiResp.items || [], count: apiResp.count };
  } catch (error) {
    console.error('Error fetching mandate types:', error);
    return { items: [], count: null };
  }
};

const fetchQuotes = async (
  filters: Filters,
  page: string
): Promise<{ items: any[]; count: number | null; apiFilters: ApiFilters }> => {
  const apiFilters: ApiFilters = {
    page,
    size: 20,
  };

  // Handle tags (multiple)
  if (filters.tags && filters.tags.length > 0) {
    apiFilters.tag = filters.tags.map((t) => t.id.toString());
  }

  // Handle text search
  if (filters.text) {
    apiFilters.text = filters.text;
  }

  // Handle parties (multiple)
  if (filters.parties && filters.parties.length > 0) {
    apiFilters.party = filters.parties.map((p) => p.id.toString());
  }

  // Handle roles (multiple)
  if (filters.roles && filters.roles.length > 0) {
    apiFilters.role = filters.roles.map((r) => r.id.toString());
  }

  // Handle personalities (multiple)
  if (filters.personalities && filters.personalities.length > 0) {
    apiFilters.personality = filters.personalities.map((p) => p.id.toString());
  }

  try {
    const apiResp = await getDbService().findQuotes(apiFilters);
    return {
      items: apiResp.items || [],
      count: apiResp.count ?? 0,
      apiFilters,
    };
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return { items: [], count: null, apiFilters };
  }
};

const fetchPersonalities = async (): Promise<{
  items: Personality[];
  count: number | null;
}> => {
  try {
    const apiResp = await getDbService().findPersonalities({});
    return { items: apiResp.items || [], count: apiResp.count };
  } catch (error) {
    console.error('Error fetching personalities:', error);
    return { items: [], count: null };
  }
};

export default async function QuotesPage({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) {
  const urlParams = await searchParams;
  const filters: Filters = await computeFilters(urlParams);
  const { items: mandateTypesList } = await fetchMandateTypes();
  const { items: personalitiesList } = await fetchPersonalities();
  const { items: tagsList } = await fetchTags();
  const {
    items,
    count: totalCount,
    apiFilters,
  } = await fetchQuotes(filters, urlParams?.page || '1');

  const hasFilters =
    (filters.tags && filters.tags.length > 0) ||
    (filters.parties && filters.parties.length > 0) ||
    (filters.roles && filters.roles.length > 0) ||
    (filters.personalities && filters.personalities.length > 0) ||
    !!filters.text;

  const searchTitle = hasFilters ? 'Résultats de la recherche' : null;

  return (
    <main className="flex flex-1 flex-col gap-[32px] row-start-2 justify-center sm:items-center items-center w-full px-4 mx-auto">
      <div className="w-full flex items-center justify-center">
        <div className="flex flex-col gap-4 w-full">
          {/* <div>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-md flex items-center justify-start gap-2">
                <Search size={18} />
                Recherche
              </h3>
            </div>
            <SearchInput runSearch={runSearch} textFilter={filters?.text ?? ''} />
          </div> */}

          <FiltersBar
            computedFilters={filters}
            personalitiesList={personalitiesList}
            quotesList={items}
            tagsList={tagsList}
            mandateTypesList={mandateTypesList}
            pageName="citations"
            config={{
              showPersonalities: true,
              showMandates: true,
              showText: true,
              showTags: true,
              showParties: true,
              layout: 'horizontal',
            }}
          />
        </div>
      </div>

      {searchTitle && (
        <h2 className="text-3xl font-bold">
          {searchTitle}
          <span className="text-slate-500 text-2xl"> ({totalCount})</span>
        </h2>
      )}

      {items && items.length > 0 && (
        <QuoteList initialItems={items} totalCount={totalCount} apiFilters={apiFilters} />
      )}

      {items && items.length === 0 && (
        <div className="flex flex-1 items-center h-full">
          <p>Aucun résultat trouvé.</p>
        </div>
      )}
    </main>
  );
}
