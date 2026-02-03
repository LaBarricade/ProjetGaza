import {supabase} from '@/lib/supabase';
import {Mandate} from '@/types/Mandate';
import {MandateType} from '@/types/MandateType';
import {Organization} from '@/types/Organization';
import {Personality} from '@/types/Personality';
import {Quote} from '@/types/Quote';
import {Tag} from '@/types/Tag';
import {Territory} from '@/types/Territory';

export class DbService {
    token: string | undefined;
    url: string | undefined;

    checkErrors(supabaseResp: any) {
        if (supabaseResp.error)
            throw new Error(supabaseResp.error.message);
        else if (!supabaseResp.data)
            throw new Error('No data returned from supabase');
    }

    async findParties(params: any): Promise<any> {
        const query = supabase.from('partis_politiques')
            .select(`id, name:nom, short_name:nom_court, color`, {count: 'exact'});
        const resp = await query;
        this.checkErrors(resp);
        return {
            items: resp.data,
            count: resp.count ?? 0,
        };
    }

    async findPersonalities(params: {
        ids?: string[];
        party?: string[];
        department?: string[];
        text?: string;
        page?: string;
        size?: string;
    }): Promise<{ items: Personality[] | null; count: number }> {
        const query = supabase.from('personnalites').select(
            `id, lastname:nom, firstname:prenom, role:fonction, city:ville, department:departement, region,
                     quotes_count:declarations(count),
                     party:parti_politique_id(id, name:nom, short_name:nom_court, color)`,
            {count: 'exact'}
        );

        if (params.ids && params.ids.length > 0)
            query.in('id', params.ids);

        if (params.party && params.party.length > 0)
            query.in('parti_politique_id', params.party);

        if (params.department && params.department.length > 0)
            query.in('departement', params.department);

        if (params.text) {
            const search = `%${params.text}%`;
            query.or(`nom.ilike.${search},prenom.ilike.${search}, ville.ilike.${search}`);
        }

        query.order('nom', {ascending: true, nullsFirst: false});
        this.addPaginationFilters(params, query);

        const resp = await query;
        this.checkErrors(resp);
        if (!resp.data)
            throw new Error('No data returned from supabase');

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

    async findPersonality(
        id: string
    ): Promise<{ item: Personality | null }> {
        const resp = await supabase
            .from('personnalites')
            .select(
                `id, lastname:nom, firstname:prenom, role:fonction, city:ville, department:departement, region,
                social1_url, social2_url, photo_url, public_contact,
                party:parti_politique_id(name:nom, id, short_name:nom_court, color), quotes_count:declarations(count)`
            )
            .eq('id', id);

        this.checkErrors(resp);
        const data = resp.data?.at(0);

        const quotes = await this.findQuotes({personality: id});
        const formattedData = data && {
            ...data,
            quotes_count: data.quotes_count.length > 0 ? data.quotes_count[0].count : 0,
            quotes: quotes.items,
            name: `${data.lastname} ${data.firstname}`,
        };

        return {
            item: formattedData,
        };
    }

    /**
     * Resolves a list of MandateType IDs → the unique personality IDs that hold at least 1 of those mandate types.
     */
    async findPersonalityIdsByRoles(roleIds: string[]): Promise<string[]> {
        const resp = await supabase
            .from('mandats')
            .select('personnalite_id')
            .in('type_mandat_id', roleIds);

        this.checkErrors(resp);

        if (!resp.data || resp.data.length === 0) return [];

        return [...new Set(resp.data.map((m: any) => m.personnalite_id.toString()))];
    }

    // Parties
    async findParty(id: any): Promise<any> {
        try {
            const query = supabase
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

    // Quotes
    async findQuotes(params: {
        role?: string,
        personality?: string | string[],
        party?: string | string[],
        tag?: string | string[],
        ids?: string[],
        text?: string
    }): Promise<any> {
        // Build select query
        let select = `id, 
            text:citation, 
            source:source_id(name:nom, id), 
            date, 
            link:lien, 
            tags${params.tag ? '!inner' : ''}(name:nom, id)`;

        select += `, personality:personnalite_id${params.party || params.personality || params.role ? '!inner' : ''}
            (
                id, lastname:nom, firstname:prenom, role:fonction, 
                city:ville, department:departement, region,
                party:parti_politique_id${params.party ? '!inner' : ''}(name:nom, id, color),
                mandates:mandats${params.role ? '!inner' : ''}(type_mandat_id, id)
            )`;

        const query = supabase.from('declarations').select(select, {count: 'exact'});

        if (params.role) {
            const ids = Array.isArray(params.role) ? params.role : [params.role];
            query.in('personality.mandates.type_mandat_id', ids);
        }

        if (params.personality) {
            const ids = Array.isArray(params.personality) ? params.personality : [params.personality];
            query.in('personnalite_id', ids);
        }

        if (params.tag) {
            const ids = Array.isArray(params.tag) ? params.tag : [params.tag];
            query.in('tags.id', ids);
        }

        if (params.text)
            query.textSearch('citation', params.text, {type: 'plain'});

        if (params.ids)
            query.in('id', params.ids);

        if (params.party) {
            const ids = Array.isArray(params.party) ? params.party : [params.party];
            query.in('personality.party.id', ids);
        }

        this.addPaginationFilters(params, query);
        query.order('date', {ascending: false, nullsFirst: false});

        const resp = await query;
        this.checkErrors(resp);

        //-- refaire la requêtes avec les ID pour préserver les jointures (recherche sur sous-table)
        if ((params.tag || params.role || params.party || params.personality) && resp.data) {
            const replayedResultWithIds = await this.findQuotes({ids: resp.data.map((q: any) => q.id)});
            //-- En filtrant sur les ids, on perd le count total : donc on le remet
            return {...replayedResultWithIds, count: resp.count};
        }

        return {
            items: resp.data || [],
            count: resp.count,
        };
    }

    // News
    async findNews(params: any = {}): Promise<any> {
        const query = supabase
            .from('actualites')
            .select(`id, text:texte, date`)
            .order('date', {ascending: false});

        const resp = await query;

        this.checkErrors(resp);
        return {
            items: resp.data,
        };
    }

    // Tags
    async findTag(id: string | string[]): Promise<any> {
        const ids = Array.isArray(id) ? id[0] : id;
        try {
            const query = supabase.from('tags').select(`id, name:nom, color`).eq('id', ids).single();

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
            let query = supabase
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
                    resp?.data?.map((item) => ({
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
        const query = supabase.from('popular_tags_view').select(`id, name, quotes_count`).range(0, 3);

        const resp = await query;

        this.checkErrors(resp);

        return {
            items: resp.data,
        };
    }

    // Organization
    async findOrganizations(
        params: any = {}
    ): Promise<{ items: Organization[] | null; count: number | null }> {
        try {
            const query = supabase
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

    // Territory
    async findTerritories(
        params: { type?: string; ids?: string[] } = {}
    ): Promise<{ items: Territory[] | null; count: number | null }> {
        try {
            const query = supabase
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
                items: resp.data,
                count: resp.count,
            };
        } catch (error) {
            console.error('Error finding territories:', error);
            return {
                items: null,
                count: null,
            };
        }
    }

    async findMandateTypes(): Promise<{ items: MandateType[] | null; count: number | null }> {
        try {
            const query = supabase.from('types_mandat')
                .select(`id, code, label:libelle, name:libelle`);

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
            const query = supabase
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
            const query = supabase
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
        if ((!param.size && param.page) || (param.size && !param.page))
            throw new Error('Pagination parameters "size" and "page" must be provided together');

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
