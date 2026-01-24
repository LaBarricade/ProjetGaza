import {supabase} from "@/lib/supabase";
import { Tag } from "@/types/Tag";

export class DbService {
  token: string | undefined;
  url: string | undefined;

  checkErrors(supabaseResp: any) {
    if (supabaseResp.error)
      throw new Error(supabaseResp.error.message);
  }

  async findPersonalities(params: object): Promise<any> {
    const resp = await supabase
      .from('personnalites')
      .select(`id, lastname:nom, firstname:prenom, role:fonction, city:ville, department:departement, region, quotes_count:declarations(count),
                party:parti_politique_id(name:nom, id)`, {count: 'exact'})
      .order('nom');
    this.checkErrors(resp);
    const formatedData = resp.data?.map((personnality: any) => Object.assign(personnality, {
      quotes_count: personnality.quotes_count[0].count
    }));
    return {
      items: formatedData,
      count: resp.count
    };
  }

  async findPersonality(id: any): Promise<any> {
    const resp = await supabase
      .from('personnalites')
      .select(`id, lastname:nom, firstname:prenom, role:fonction, city:ville, department:departement, region,
                party:parti_politique_id(name:nom, id)`)
      .eq('id', id);
    this.checkErrors(resp);
    const data = resp.data?.at(0);

    return {
      item: data && Object.assign(data, {
        quotes: (await this.findQuotes({personality: id})).items
      })
    };
  }

  async findQuotes(params: any): Promise<any> {
    const query = supabase.from('declarations')
      .select('*', params.personality ? undefined : {count: 'exact'});
    let select = `id, 
            text:citation, 
            source:source_id(name:nom, id), 
            date, 
            link:lien, 
            tags${params.tag ? '!inner' : ''}(name:nom, id)`;
    if (params.personality)
      query.eq('personnalite_id', params.personality);
    else
      select += `, personality:personnalite_id${params.party ? '!inner' : ''}(
            id, lastname:nom, firstname:prenom, role:fonction, 
            city:ville, department:departement, region,
            party:parti_politique_id${params.party ? '!inner' : ''}(name:nom, id)
          )`;
    if (params.tag && Array.isArray(params.tag)) {
      query.in('tags.id', params.tag);
    } else if (params.tag) {
      query.eq('tags.id', params.tag);
    }
    if (params.text)
      query.textSearch('citation', params.text, {type: 'plain'});
    if (params.party)
      query.eq('personality.party.id', params.party);
    if (params.ids)
      query.in('id', params.ids)
    if(params.personality) {
      if(Array.isArray(params.personality)) 
        query.in('personality.id', params.personality);
      else 
        query.eq('personality.id', params.personality);
    }
    
    if(params.function)
      query.like('personality.role', params.function);

    this.addPaginationFilters(params, query);
    query.select(select)
      .order('date', {ascending: false, nullsFirst: false});

    const resp = await query;

    this.checkErrors(resp);

    //-- refaire la requêtes avec les ID pour préserver les jointures (recherche sur sous-table)
    if (params.tag && resp.data) {
      const replayedResultWithIds = this.findQuotes({ids: resp.data.map((q: any) => q.id)});
      return replayedResultWithIds;
    }

    return {
      items: resp.data,
      count: resp.count
    };
  }

  async findNews(params: any = {}): Promise<any> {
    const query = supabase
      .from('actualites')
      .select(`id, text:texte, date`)
      .order('date', {ascending: false});

    const resp = await query;

    this.checkErrors(resp);
    return {
      items: resp.data
    };
  }

  async findTag(id: any): Promise<any> {
    const query = supabase
      .from('tags')
      .select(`id, name:nom, color`)
      .eq('id', id)
      .single();

    const resp = await query;


    this.checkErrors(resp);
    return {
      item: resp.data
    };
  }

async findTags(params: any = {}): Promise<{items: (Tag & {quotes_count: number})[], count: number | null}> {
  let query = supabase
    .from('tags')
    .select(`id, name:nom, color, quotes_count:declarations(count)`, {count: 'exact'})
    .order('nom');

  if (params.id && params.id.length > 0) {
    query = query.in('id', params.id);
  }

  const resp = await query;

  this.checkErrors(resp);

  return {
    count: resp.count,
    items: (resp.data || []).map(item => ({
      ...item,
      quotes_count: item.quotes_count[0]?.count || 0
    }))
  };
}
  async findPopularTags(): Promise<any> {
    const query = supabase
      .from('popular_tags_view')
      .select(`id, name, quotes_count`)
      .range(0, 3);

    const resp = await query;

    this.checkErrors(resp);

    return {
      items: resp.data
    }
  }

  async findParty(id: any): Promise<any> {
    const query = supabase
      .from('partis_politiques')
      .select(`id, name:nom, color`)
      .eq('id', id)
      .single();

    const resp = await query;
    this.checkErrors(resp);
    return {
      item: resp.data
    };
  }

  addPaginationFilters(param: any, restQuery: any) {
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