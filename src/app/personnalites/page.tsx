
import {ApiParams, getDbService} from '@/lib/backend/db-service';
import {MandateType} from '@/types/MandateType';
import {Personality} from '@/types/Personality';
import {Filters} from '@/types/Filters';
import {FiltersBar} from '@/components/filters/filters-bar';
import {PersonalityListCards} from "@/components/list/personality-list-cards";
import {Suspense} from "react";
import {EntitiesFilter} from "@/lib/EntitiesFilter";

async function fetchPersonalities(entitiesFilter: EntitiesFilter): Promise<{
    items: Personality[];
    count: number;
    apiParams: ApiParams;
}> {
    const filtersDto = entitiesFilter.toDto();
    const apiParams = {
        page: '1',
        size: '21',
        ...filtersDto
    };

    try {
        const {items, count} = await getDbService().findPersonalities(apiParams);
        return {items: items || [], count, apiParams};
    } catch (error) {
        console.error('Error fetching personalities:', error);
        return {items: [], count: 0, apiParams};
    }
}

export default async function PersonalitiesPage({
    searchParams,
}: {
    searchParams: any;
}) {
    const urlParams = await searchParams;

    const entitiesFilter = new EntitiesFilter();
    await entitiesFilter.fromUrlParams(urlParams)

    //const filters = await computeFilters(urlParams);

    const {items: mandateTypesList} = await getDbService().findMandateTypes();
    const {items: departmentsList} = await getDbService().findTerritories({type: 'departement'});
    const {items: partiesList} = await getDbService().findParties();
    const {items, count: totalCount, apiParams} = await fetchPersonalities(entitiesFilter);

    return (
        <main
            className="flex flex-1 flex-col items-center w-full px-4 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
            <div className="w-full">
                <FiltersBar
                    departmentsList={departmentsList || []}
                    personalitiesList={[]}
                    tagsList={[]}
                    mandateTypesList={mandateTypesList || []}
                    partiesList={partiesList}
                    pageName="personnalites"
                    config={{
                        showPersonalities: false,
                        showParties: true,
                        showMandates: true,
                        showDepartments: true,
                        showTags: false,
                        showText: true,
                        textFilterConfig: {
                            headerTitle: false,
                            inputPlaceholder: 'Rechercher un nom, prénom, ville...',
                        },
                    }}
                />
            </div>

            {items.length > 0 ? (
                <Suspense fallback={<p className="mt-4">Chargement...</p>}>
                    <PersonalityListCards initialItems={items} totalCount={totalCount} apiParams={apiParams}/>
                </Suspense>
            ) : (
                <div className="flex flex-1 items-center h-full">
                    <p>Aucun résultat trouvé.</p>
                </div>
            )}
        </main>
    );
}
