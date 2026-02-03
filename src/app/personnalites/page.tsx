'use server';

import {getDbService} from '@/lib/backend/db-service';
import {MandateType} from '@/types/MandateType';
import {Personality} from '@/types/Personality';
import {Filters} from '@/types/Filters';
import {FiltersBar} from '@/components/filters/filters-bar';
import {PersonalityListCards} from "@/components/list/personality-list-cards";
import {Suspense} from "react";

//URL Parsing
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
        if (urlParams.party) {
            const partyIds = parseIds(urlParams.party);
            const parties = [];
            for (const id of partyIds) {
                const {item} = await getDbService().findParty(id);
                if (item) parties.push(item);
            }
            if (parties.length) filters.parties = parties;
        }

        if (urlParams.role) {
            const roleIds = parseIds(urlParams.role);
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

async function fetchMandateTypes(): Promise<MandateType[]> {
    try {
        const {items} = await getDbService().findMandateTypes();
        return items || [];
    } catch {
        return [];
    }
}

async function fetchPersonalities(filters: Filters): Promise<{
    items: Personality[];
    count: number;
}> {
    try {
        // Collect candidate ID sets from each indirect filter.
        const idSets: (string[] | null)[] = [];

        // Role → personality IDs via mandats
        if (filters.roles && filters.roles.length > 0) {
            const roleIds = filters.roles.map((r) => r.id.toString());
            idSets.push(await getDbService().findPersonalityIdsByRoles(roleIds));
        }

        // Intersect all active ID sets (AND semantics across filters).
        // If any set is empty the intersection is empty — return empty result.
        let finalIds: string[] | null = null;
        for (const set of idSets) {
            if (!set) continue; // filter not active, skip
            if (set.length === 0) return {items: [], count: 0};

            finalIds = finalIds ? finalIds.filter((id) => set.includes(id)) : set;

            if (finalIds.length === 0) return {items: [], count: 0};
        }

        const queryParams: { ids?: string[]; party?: string[]; department?: string[]; text?: string; page?: string, size?: string } = {};

        if (finalIds)
            queryParams.ids = finalIds;
        if (filters.parties && filters.parties.length > 0)
            queryParams.party = filters.parties.map((p) => p.id.toString());
        if (filters.departments && filters.departments.length > 0)
            queryParams.department = filters.departments;
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

    const mandateTypesList = await fetchMandateTypes();
    const departmentsList = (await getDbService().findTerritories({type: 'departement'})).items;
    const partiesList = await getDbService().findParties({});
    const {items, count: totalCount} = await fetchPersonalities(filters);
    const {items: allPersonalities} = await getDbService().findPersonalities({});

    return (
        <main
            className="flex flex-1 flex-col items-center w-full px-4 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
            <div className="w-full">
                <FiltersBar
                    computedFilters={filters}
                    departmentsList={departmentsList || []}
                    personalitiesList={allPersonalities ?? []}
                    tagsList={[]}
                    mandateTypesList={mandateTypesList}
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
                <Suspense fallback={<p>Chargement...</p>}>
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
