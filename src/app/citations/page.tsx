'use server';

import {QuoteList} from '@/components/list/quote-list';
import {ApiParams, getDbService} from '@/lib/backend/db-service';
import {FiltersBar} from '@/components/filters/filters-bar';
import TagsCloud from "@/components/tags-cloud";
import {EntitiesFilter} from "@/lib/entities-filter";


const fetchQuotes = async (
    filters: EntitiesFilter,
    page: string
): Promise<{ items: any[]; count: number | null; apiParams: ApiParams }> => {

    const filtersDto = filters.toDto();
    const apiParams = {
        page,
        size: '21',
        ...filtersDto
    };

    try {
        const apiResp = await getDbService().findQuotes(apiParams);
        return {
            items: apiResp.items || [],
            count: apiResp.count ?? 0,
            apiParams
        };
    } catch (error) {
        console.error('Error fetching quotes:', error);
        return {items: [], count: null, apiParams};
    }
};

export default async function QuotesPage({
    searchParams,
}: {
    searchParams: any;
}) {
    const urlParams = await searchParams;

    const entitiesFilter = EntitiesFilter.fromUrlParams(urlParams);

    //const filters: Filters = await computeFilters(urlParams);
    const {items: mandateTypesList} = await getDbService().findMandateTypes();
    const {items: departmentsList} = await getDbService().findTerritories({type: 'departement'});
    const {items: personalitiesList} =  await getDbService().findPersonalities({});
    const {items: partiesList} = await getDbService().findParties();
    const {items: tagsList} = await getDbService().findTags({});

    const {
        items,
        count: totalCount,
        apiParams,
    } = await fetchQuotes(entitiesFilter, urlParams?.page || '1');

    return (
        <main
            className="flex flex-1 flex-col gap-[32px] row-start-2 justify-center sm:items-center items-center w-full px-4 mx-auto">
            <div className="w-full flex items-center justify-center border-slate-200 bg-background border-b">
                <div className="flex flex-col gap-2 w-full  items-center justify-center">
                    <div className=" mt-6 text-center max-w-[600px]">
                        <TagsCloud tagsList={tagsList} />
                    </div>
                    <div className="">
                        <FiltersBar
                            departmentsList={departmentsList || []}
                            personalitiesList={personalitiesList || []}
                            partiesList={partiesList}
                            tagsList={tagsList}
                            mandateTypesList={mandateTypesList || []}
                            pageName="citations"
                            alwaysVisible={false}
                            config={{
                                showPersonalities: true,
                                showMandates: true,
                                showText: true,
                                showTags: true,
                                showParties: true,
                                layout: 'horizontal',
                                textFilterConfig: {
                                    headerTitle: 'Citation',
                                    inputPlaceholder: 'Rechercher...',
                                },
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
                    apiParams={apiParams}
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
