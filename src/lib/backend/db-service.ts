import {getSupabaseClient} from '@/lib/supabase';
import {Mandate} from '@/types/Mandate';
import {MandateType} from '@/types/MandateType';
import {Organization} from '@/types/Organization';
import {Personality} from '@/types/Personality';
import {Tag} from '@/types/Tag';
import {Territory, TerritoryType} from '@/types/Territory';
import {Party} from "@/types/Party";
import {PostgrestResponseSuccess, PostgrestSingleResponse} from "@supabase-js/source/packages/core/postgrest-js/src";
import {FiltersDto} from "@/lib/entities-filter";


export type ApiParams = FiltersDto & {
    page?: string;
    size?: string;
    ids?: string[]
}

class DbService {
    token: string | undefined;
    url: string | undefined;

    checkErrors(supabaseResp: PostgrestSingleResponse<any>)
        : asserts supabaseResp is (PostgrestResponseSuccess<any> & { data: any }) {
        if (supabaseResp.error) {
            console.error('Supabase error', supabaseResp);
            throw new Error(supabaseResp.error.message);
        }
        else if (!supabaseResp.data)
            throw new Error('No data returned from supabase');
    }

    async findParties(params: any = {}): Promise<any> {
        const query = getSupabaseClient().from('partis_politiques')
            .select(`id, name:nom, short_name:nom_court, color`, {count: 'exact'});
        const resp = await query;
        this.checkErrors(resp);

        const formattedData: Party[] = resp.data.map((item: any): Party =>
            Object.assign(item, {
                //quotes_count: item.quotes_count[0].count,
            })
        );

        return {
            items: formattedData,
            count: resp.count ?? 0,
        };
    }

    async findPersonalities(params: ApiParams): Promise<{ items: Personality[] | null; count: number }> {
        const query = getSupabaseClient().from('personnalites').select(
            `id, lastname:nom, firstname:prenom, role:fonction, city:ville, department:departement, region,
                     quotes_count:declarations(count), photo_url_none, photo_url,
                     party:parti_politique_id(id, name:nom, short_name:nom_court, color),
                     mandates:mandats${params.roles ? '!inner' : ''}(type_mandat_id, id)
                     `,
            {count: 'exact'}
        );

        if (params.ids)
            query.in('id', this.normalizeIdsParam(params.ids));

        if (params.parties)
            query.in('parti_politique_id', this.normalizeIdsParam(params.parties));

        if (params.roles)
            query.in('mandates.type_mandat_id', this.normalizeIdsParam(params.roles));

        if (params.departments) {
            const {items: departmentsInfo} = await this.findTerritories({ids: this.normalizeIdsParam(params.departments)});
            const departmentNames = departmentsInfo.map((d) => d.name);
            query.in('departement', departmentNames);
        }

        if (params.text) {
            const search = `%${params.text}%`;
            query.or(`nom.ilike.${search}, prenom.ilike.${search}, ville.ilike.${search}`);
        }

        query.order('nom', {ascending: true, nullsFirst: false});
        this.addPaginationFilters(params, query);

        const resp = await query;
        this.checkErrors(resp);

        const formattedData: Personality[] = resp.data.map(
            (personality: any): Personality =>
                Object.assign(personality, {
                    quotes_count: personality.quotes_count[0].count,
                    name: `${personality.lastname} ${personality.firstname}`,
                })
        );

        return {
            items: formattedData,
            count: resp.count ?? 0,
        };
    }

    async findPersonality(id: string): Promise<{ item: Personality | null }> {
        const resp = await getSupabaseClient()
            .from('personnalites')
            .select(
                `id, lastname:nom, firstname:prenom, role:fonction, city:ville, department:departement, region,
                social1_url, social2_url, photo_url, public_contact, photo_url_none,
                party:parti_politique_id(name:nom, id, short_name:nom_court, color), quotes_count:declarations(count)`
            )
            .eq('id', id);

        this.checkErrors(resp);
        const data = resp.data?.at(0) as any;

        const quotes = await this.findQuotes({personalities: [id]});
        const formattedData = data && {
            ...data,
            quotes_count: data.quotes_count.length > 0 ? data.quotes_count[0].count : 0,
            party: Array.isArray(data.party) ? data.party.at(0) : data.party,
            quotes: quotes.items,
            name: `${data.lastname} ${data.firstname}`,
        };

        return {
            item: formattedData as Personality,
        };
    }

    async findParty(id: any): Promise<any> {
        try {
            const query = getSupabaseClient()
                .from('partis_politiques')
                .select(`id, name:nom, short_name:nom_court,  color`)
                .eq('id', id)
                .single();

            const resp = await query;
            this.checkErrors(resp);
            return {
                item: resp.data,
            };
        } catch (error) {
            console.error('Error finding party:', error);
            return {
                item: null,
            };
        }
    }

    async findGeneralStats(): Promise<any> {
        let select = `min_date:date.min(), max_date:date.max()`;
        const query = getSupabaseClient().from('declarations').select(select).single();
        const resp: any = await query;

        this.checkErrors(resp);
        return {
            min_year: resp.data.min_date.split('-').at(0),
            max_year: resp.data.max_date.split('-').at(0)
        };
    }

    normalizeIdsParam(value: string | string[]) {
        if (Array.isArray(value))
            return value;
        else if (value.includes(','))
            return value.split(',');
        else
            return [value];
    }

    async findQuotes(params: ApiParams): Promise<any> {
        let select = `id, 
            text:citation, 
            source:source_id(name:nom, id), 
            date, 
            link:lien, 
            tags${params.tags ? '!inner' : ''}(name:nom, id)`;

        select += `, personality:personnalite_id${params.parties || params.personalities || params.roles || params.departments ? '!inner' : ''}
            (
                id, lastname:nom, firstname:prenom, role:fonction, 
                city:ville, department:departement, region,
                party:parti_politique_id${params.parties ? '!inner' : ''}(name:nom, id, color),
                mandates:mandats${params.roles || params.departments ? '!inner' : ''}(type_mandat_id, id)
            )`;

        const query = getSupabaseClient().from('declarations').select(select, {count: 'exact'});

        if (params.roles) {
            const ids = this.normalizeIdsParam(params.roles);
            query.in('personality.mandates.type_mandat_id', ids);
        }

        if (params.personalities) {
            const ids = this.normalizeIdsParam(params.personalities);
            query.in('personnalite_id', ids);
        }

        if (params.tags) {
            const ids = this.normalizeIdsParam(params.tags);
            query.in('tags.id', ids);
        }

        if (params.text)
            query.textSearch('citation', params.text, {type: 'websearch'});

        if (params.ids)
            query.in('id', params.ids);

        if (params.parties) {
            const ids = this.normalizeIdsParam(params.parties);
            query.in('personality.party.id', ids);
        }

        if (params.departments) {
            const ids = this.normalizeIdsParam(params.departments);
            query.in('personality.mandates.territoire_id', ids);
        }

        this.addPaginationFilters(params, query);
        query.order('date', {ascending: false, nullsFirst: false});

        const resp = await query;
        this.checkErrors(resp);

        //-- refaire la requêtes avec les ID pour préserver les jointures (recherche sur sous-table)
        if ((params.tags || params.roles || params.parties || params.personalities) && resp.data) {
            const replayedResultWithIds = await this.findQuotes({ids: resp.data.map((q: any) => q.id)});
            //-- En filtrant sur les ids, on perd le count total : donc on le remet
            return {...replayedResultWithIds, count: resp.count};
        }

        return {
            items: resp.data || [],
            count: resp.count,
        };
    }

    async findNews(params: any = {}): Promise<any> {
        const query = getSupabaseClient()
            .from('actualites')
            .select(`id, text:texte, date`)
            .order('date', {ascending: false});

        const resp = await query;

        this.checkErrors(resp);
        return {
            items: resp.data,
        };
    }

    async findTag(id: string | string[]): Promise<any> {
        const ids = Array.isArray(id) ? id[0] : id;
        try {
            const query = getSupabaseClient().from('tags').select(`id, name:nom, color`).eq('id', ids).single();

            const resp = await query;
            this.checkErrors(resp);

            return {
                item: resp.data,
            };
        } catch (error) {
            console.error('Error finding tag:', error);
            return {
                item: null,
            };
        }
    }

    async findTags(params: {
        ids?: number[];
    }): Promise<{ items: (Tag & { quotes_count: number })[]; count: number | null }> {
        try {
            let query = getSupabaseClient()
                .from('tags')
                .select(`id, name:nom, color, quotes_count:declarations(count)`, {count: 'exact'})
                .order('nom');

            if (params.ids && params.ids.length > 0) {
                query = query.in('id', params.ids);
            }

            const resp = await query;
            this.checkErrors(resp);

            return {
                count: resp.count,
                items:
                    resp?.data?.map((item: any) => ({
                        ...item,
                        quotes_count: item.quotes_count[0]?.count || 0,
                    })) ?? [],
            };
        } catch (error) {
            console.error('Error finding tags:', error);
            return {
                items: [],
                count: null,
            };
        }
    }

    async findPopularTags(): Promise<any> {
        const query = getSupabaseClient().from('popular_tags_view').select(`id, name, quotes_count`).range(0, 3);

        const resp = await query;

        this.checkErrors(resp);

        return {
            items: resp.data,
        };
    }

    async findOrganizations(
        params: any = {}
    ): Promise<{ items: Organization[] | null; count: number | null }> {
        try {
            const query = getSupabaseClient()
                .from('organisations')
                .select(
                    `id, name:nom, short_name:nom_court, type, color, created_on, updated_on, created_by, last_modified_by`
                );

            if (params.type) {
                query.eq('type', params.type);
            }

            const resp = await query;
            this.checkErrors(resp);
            return {
                items: resp.data,
                count: resp.count,
            };
        } catch (error) {
            console.error('Error finding organizations:', error);
            return {
                items: null,
                count: null,
            };
        }
    }

    async findTerritories(
        params: { type?: TerritoryType; ids?: string[] } = {}
    ): Promise<{ items: Territory[]; count: number | null }> {
        try {
            const query = getSupabaseClient()
                .from('territoires')
                .select(
                    `id, name:nom, type, parent_id, code_insee, created_on, updated_on, created_by, last_modified_by`
                );

            if (params.type)
                query.eq('type', params.type);

            if (params.ids && params.ids.length > 0)
                query.in('id', params.ids);

            const resp = await query;
            this.checkErrors(resp);
            return {
                items: resp.data as Territory[],
                count: resp.count,
            };
        } catch (error) {
            console.error('Error finding territories:', error);
            return {
                items: [],
                count: null,
            };
        }
    }

    async findMandateTypes(): Promise<{ items: MandateType[] | null; count: number | null }> {
        try {
            const query = getSupabaseClient().from('types_mandat')
                .select(`id, code, label:libelle, name:libelle`)
                .order('ordre');

            const resp = await query;
            this.checkErrors(resp);
            return {
                items: resp.data,
                count: resp.count,
            };
        } catch (error) {
            console.error('Error finding mandate types:', error);
            return {
                items: null,
                count: null,
            };
        }
    }

    async findMandates(params: any = {}): Promise<{ items: Mandate[] | null; count: number | null }> {
        try {
            const query = getSupabaseClient()
                .from('mandats')
                .select(
                    `id, personality_id:personnalite_id, mandate_type_id:type_mandat_id, 
                    organization_id:organisation_id, territory_id:territoire_id,
                    start_date:date_debut, end_date:date_fin, notes, created_on, updated_on,
                    created_by, last_modified_by`
                )
                .eq('personality_id', params.personalityId)
                .order('start_date', {ascending: false});
            const resp = await query;
            this.checkErrors(resp);
            return {
                items: resp.data,
                count: resp.count,
            };
        } catch (error) {
            console.error('Error finding mandates:', error);
            return {
                items: null,
                count: null,
            };
        }
    }

    async findMandateType(id: number): Promise<{ item: MandateType | null }> {
        try {
            const query = getSupabaseClient()
                .from('types_mandat')
                .select(`id, code, label:libelle, name:libelle`)
                .eq('id', id)
                .single();

            const resp = await query;
            this.checkErrors(resp);
            return {
                item: resp.data,
            };
        } catch (error) {
            console.error('Error finding mandate type:', error);
            return {
                item: null,
            };
        }
    }

    addPaginationFilters(param: any, restQuery: any) {
        if (!param.size && param.page)
            throw new Error('Pagination parameter "page" must be provided with a "size"');

        if (!param.size)
            return;

        const page = param.page || 1;
        const lowerBound = param.size * (page - 1);
        const upperBound = param.size * page - 1;
        restQuery.range(lowerBound, upperBound);
    }
}

const dbService = new DbService();

export function getDbService() {
    return dbService;
}
