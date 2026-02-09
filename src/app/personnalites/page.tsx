
import {getDbService} from '@/lib/backend/db-service';
import {MandateType} from '@/types/MandateType';
import {Personality} from '@/types/Personality';
import {Filters} from '@/types/Filters';
import {FiltersBar} from '@/components/filters/filters-bar';
import {PersonalityListCards} from "@/components/list/personality-list-cards";
import {Suspense} from "react";

//URL Parsing
function parseUrlIds(param: string | undefined): string[] {
    if (!param) return [];
    return param
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean);
}

async function computeFilters(urlParams: any): Promise<Filters> {
    const filters: Filters = {};

    try {
        if (urlParams.party) {
            const partyIds = parseUrlIds(urlParams.party);
            const parties = [];
            for (const id of partyIds) {
                const {item} = await getDbService().findParty(id);
                if (item) parties.push(item);
            }
            if (parties.length) filters.parties = parties;
        }

        if (urlParams.role) {
            const roleIds = parseUrlIds(urlParams.role);
            const roles: MandateType[] = [];
            for (const id of roleIds) {
                const roleId = parseInt(id, 10);
                if (!isNaN(roleId)) {
                    const {item} = await getDbService().findMandateType(roleId);
                    if (item) roles.push(item);
                }
            }
            if (roles.length) filters.roles = roles;
        }

        // Departments are plain strings — no DB resolution needed, just parse from URL
        if (urlParams.department) {
            const departments = urlParams.department
                .split(',')
                .map((d: string) => d.trim())
                .filter(Boolean);
            if (departments.length) filters.departments = departments;
        }

        if (urlParams.text) {
            filters.text = urlParams.text;
        }
    } catch (error) {
        console.error('Error computing personality filters:', error);
    }

    return filters;
}

async function fetchPersonalities(filters: Filters): Promise<{
    items: Personality[];
    count: number;
}> {
    try {
        const queryParams: { ids?: string[]; party?: string[]; department?: string[]; role?: string[]; text?: string; page?: string, size?: string } = {};

        if (filters.parties && filters.parties.length > 0)
            queryParams.party = filters.parties.map((p) => p.id.toString());
        if (filters.departments && filters.departments.length > 0)
            queryParams.department = filters.departments;
        if (filters.roles && filters.roles.length > 0)
            queryParams.role = filters.roles.map((r) => r.id.toString());
        if (filters.text)
            queryParams.text = filters.text

        queryParams.page = '1';
        queryParams.size = '20';

        const {items, count} = await getDbService().findPersonalities(queryParams);
        return {items: items || [], count};
    } catch (error) {
        console.error('Error fetching personalities:', error);
        return {items: [], count: 0};
    }
}

export default async function PersonalitiesPage({
    searchParams,
}: {
    searchParams: any;
}) {
    const urlParams = await searchParams;
    const filters = await computeFilters(urlParams);

    const {items: mandateTypesList} = await getDbService().findMandateTypes();
    const {items: departmentsList} = await getDbService().findTerritories({type: 'departement'});
    const {items: partiesList} = await getDbService().findParties({});
    const {items, count: totalCount} = await fetchPersonalities(filters);

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
                    <PersonalityListCards initialItems={items} totalCount={totalCount} filters={filters}/>
                </Suspense>
            ) : (
                <div className="flex flex-1 items-center h-full">
                    <p>Aucun résultat trouvé.</p>
                </div>
            )}
        </main>
    );
}
