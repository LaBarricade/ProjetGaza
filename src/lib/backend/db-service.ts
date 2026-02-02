import { supabase } from '@/lib/supabase';
import { Mandate } from '@/types/Mandate';
import { MandateType } from '@/types/MandateType';
import { Organization } from '@/types/Organization';
import { Personality } from '@/types/Personality';
import { Quote } from '@/types/Quote';
import { Tag } from '@/types/Tag';
import { Territory } from '@/types/Territory';

export class DbService {
  token: string | undefined;
  url: string | undefined;

  checkErrors(supabaseResp: any) {
    if (supabaseResp.error) throw new Error(supabaseResp.error.message);
  }

  async findParties(params: any): Promise<any> {
    const query = supabase.from('partis_politiques')
        .select(`id, name:nom, short_name:nom_court, color`, { count: 'exact' });
    const resp = await query;
    this.checkErrors(resp);
    return  {
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
    size?: number;
  }): Promise<{ items: Personality[] | null; count: number }> {
    const query = supabase.from('personnalites').select(
      `id, lastname:nom, firstname:prenom, role:fonction, city:ville, department:departement, region,
       quotes_count:declarations(count),
       party:parti_politique_id(id, name:nom, short_name:nom_court, color)`,
      { count: 'exact' }
    );

    if (params.ids && params.ids.length > 0) {
      query.in('id', params.ids);
    }

    if (params.party && params.party.length > 0) {
      query.in('parti_politique_id', params.party);
    }

    if (params.department && params.department.length > 0) {
      query.in('departement', params.department);
    }

    if (params.text) {
      const search = `%${params.text}%`;
      query.or(`nom.ilike.${search},prenom.ilike.${search}, ville.ilike.${search}`);
    }

    this.addPaginationFilters(params, query);

    query.order('nom', { ascending: true, nullsFirst: false });

    const resp = await query;
    this.checkErrors(resp);

    const formattedData: (Personality & { quotes_count: number })[] = resp.data?.map(
      (personnality: any) =>
        Object.assign(personnality, {
          quotes_count: personnality.quotes_count[0].count,
          name: `${personnality.lastname} ${personnality.firstname}`,
        })
    ) as (Personality & { quotes_count: number })[];

    return {
      items: formattedData,
      count: resp.count ?? 0,
    };
  }

  async findPersonality(
    id: string | string[]
  ): Promise<{ item: (Personality & { quotes: Quote[]; quotes_count: number }) | null }> {
    const ids = Array.isArray(id) ? id[0] : id;
    const resp = await supabase
      .from('personnalites')
      .select(
        `id, lastname:nom, firstname:prenom, role:fonction, city:ville, department:departement, region,
         party:parti_politique_id(name:nom, id, short_name:nom_court, color), quotes_count:declarations(count)`
      )
      .eq('id', ids);
    this.checkErrors(resp);
    const data = resp.data?.at(0);

    const formattedData = data && {
      ...data,
      quotes_count: data.quotes_count.length > 0 ? data.quotes_count[0].count : 0,
      party: data.party && data.party.length > 0 ? data.party[0] : undefined,
      quotes: await this.findQuotes({ personality: id }),
      name: `${data.lastname} ${data.firstname}`,
    };

    return {
      item: formattedData ? formattedData : null,
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
  async findQuotes(params: any): Promise<any> {
    let personalityIdsFromRole: string[] | null = null;
    // Handle role filter - query mandats table separately to get personality IDs
    if (params.role) {
      const roleIds = Array.isArray(params.role) ? params.role.map(Number) : [Number(params.role)];

      const mandatesResp = await supabase
        .from('mandats')
        .select('personnalite_id')
        .in('type_mandat_id', roleIds);

      this.checkErrors(mandatesResp);

      if (mandatesResp.data && mandatesResp.data.length > 0) {
        // Get unique personality IDs that have these roles
        personalityIdsFromRole = [
          ...new Set(mandatesResp.data.map((m: any) => m.personnalite_id.toString())),
        ];
      } else {
        // No personalities found with this mandate type, return empty result
        return {
          items: [],
          count: 0,
        };
      }
    }

    // Build select query
    let select = `id, 
    text:citation, 
    source:source_id(name:nom, id), 
    date, 
    link:lien, 
    tags${params.tag ? '!inner' : ''}(name:nom, id)`;

    select += `, personality:personnalite_id${params.party || params.personality || personalityIdsFromRole ? '!inner' : ''}(
      id, lastname:nom, firstname:prenom, role:fonction, 
      city:ville, department:departement, region,
      party:parti_politique_id${params.party ? '!inner' : ''}(name:nom, id, color)
    )`;

    const query = supabase.from('declarations').select(select, { count: 'exact' });

    let finalPersonalityIds: string[] | null = null;

    // Start with role-based personality IDs if they exist
    if (personalityIdsFromRole) {
      finalPersonalityIds = personalityIdsFromRole;
    }

    // If personality filter exists, intersect with role filter (if both exist)
    if (params.personality) {
      const personalityFilter = Array.isArray(params.personality)
        ? params.personality.map(String)
        : [String(params.personality)];

      if (finalPersonalityIds) {
        // Only keep personalities that match BOTH role AND personality filters
        finalPersonalityIds = finalPersonalityIds.filter((id) => personalityFilter.includes(id));

        if (finalPersonalityIds.length === 0) {
          return {
            items: [],
            count: 0,
          };
        }
      } else {
        // Only personality filter, no role filter
        finalPersonalityIds = personalityFilter;
      }
    }

    // Apply the combined personality filter
    if (finalPersonalityIds) {
      if (finalPersonalityIds.length === 1) {
        query.eq('personnalite_id', finalPersonalityIds[0]);
      } else {
        query.in('personnalite_id', finalPersonalityIds);
      }
    }

    // Tag filter
    if (params.tag) {
      if (Array.isArray(params.tag)) {
        query.in('tags.id', params.tag);
      } else {
        query.eq('tags.id', params.tag);
      }
    }

    // Text search
    if (params.text) {
      query.textSearch('citation', params.text, { type: 'plain' });
    }

    // IDs filter
    if (params.ids) {
      query.in('id', params.ids);
    }

    // Party filter (multiple parties supported)
    if (params.party) {
      if (Array.isArray(params.party)) {
        query.in('personality.party.id', params.party);
      } else {
        query.eq('personality.party.id', params.party);
      }
    }

    this.addPaginationFilters(params, query);
    query.order('date', { ascending: false, nullsFirst: false });

    const resp = await query;
    this.checkErrors(resp);

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
      .order('date', { ascending: false });

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
        .select(`id, name:nom, color, quotes_count:declarations(count)`, { count: 'exact' })
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

      if (params.type) {
        query.eq('type', params.type);
      }

      if (params.ids && params.ids.length > 0) {
        query.in('id', params.ids);
      }

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

  // Mandates
  async findMandateTypes(): Promise<{ items: MandateType[] | null; count: number | null }> {
    try {
      const query = supabase.from('types_mandat').select(`id, code, label:libelle, name:libelle`);

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
          `id, personality_id:personnalite_id, mandate_type_id:type_mandat_id, organization_id:organisation_id, territory_id:territoire_id,
           start_date:date_debut, end_date:date_fin, notes, created_on, updated_on,
           created_by, last_modified_by`
        )
        .eq('personality_id', params.personalityId)
        .order('start_date', { ascending: false });
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
    if (!param.size) return;
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
