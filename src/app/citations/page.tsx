'use server';

import {QuoteList} from '@/components/list/quote-list';
import {Tag} from '@/types/Tag';
import {Party} from '@/types/Party';
import {getDbService} from '@/lib/backend/db-service';
import {MandateType} from '@/types/MandateType';
import {FiltersBar} from '@/components/filters/filters-bar';
import {Personality} from '@/types/Personality';
import TagLabel from "@/components/tag";
import TagsCloud from "@/components/tags-cloud";

export type Filters = {
    tags?: Tag[];
    text?: string;
    parties?: Party[];
    roles?: MandateType[];
    personalities?: Personality[];
};

export type ApiFilters = {
    page?: string;
    size?: string;
    tag?: string | string[];
    text?: string;
    personality?: string | string[];
    party?: string | string[];
    role?: string | string[];
};

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
                filters.tags = apiResp.items;
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

const fetchQuotes = async (
    filters: Filters,
    page: string
): Promise<{ items: any[]; count: number | null; apiFilters: ApiFilters }> => {
    const apiFilters: ApiFilters = {
        page,
        size: '20',
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
        return {items: [], count: null, apiFilters};
    }
};

export default async function QuotesPage({
    searchParams,
}: {
    searchParams: any;
}) {
    const urlParams = await searchParams;
    const filters: Filters = await computeFilters(urlParams);
    const {items: mandateTypesList} = await getDbService().findMandateTypes();
    const {items: departmentsList} = await getDbService().findTerritories({type: 'departement'});
    const {items: personalitiesList} =  await getDbService().findPersonalities({});
    const {items: partiesList} = await getDbService().findParties({});
    const {items: tagsList} = await getDbService().findTags({});

    const {
        items,
        count: totalCount,
        apiFilters,
    } = await fetchQuotes(filters, urlParams?.page || '1');

    return (
        <main
            className="flex flex-1 flex-col gap-[32px] row-start-2 justify-center sm:items-center items-center w-full px-4 mx-auto">
            <div className="w-full flex items-center justify-center border-slate-200 bg-background border-b">
                <div className="flex flex-row gap-2 w-full  items-center justify-center">
                    <div className="flex-1/3 mt-2 text-center ">
                        <TagsCloud tagsList={tagsList} />
                    </div>
                    <div className="flex-2/3">
                        <FiltersBar
                            departmentsList={departmentsList || []}
                            personalitiesList={personalitiesList || []}
                            partiesList={partiesList}
                            tagsList={tagsList}
                            mandateTypesList={mandateTypesList || []}
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
            </div>

            {items && items.length > 0 && (
                <QuoteList
                    initialItems={items}
                    totalCount={totalCount}
                    hidePersonality={false}
                    apiFilters={apiFilters}
                />
            )}

            {items && items.length === 0 && (
                <div className="flex flex-1 items-center h-full mt-4">
                    <p>Aucun résultat trouvé.</p>
                </div>
            )}
        </main>
    );
}
