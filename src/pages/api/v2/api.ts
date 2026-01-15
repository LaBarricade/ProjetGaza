import type {NextApiRequest, NextApiResponse} from 'next';
import {supabase} from '@/lib/supabase'
import {PostgrestQueryBuilder} from "@supabase-js/source/packages/core/postgrest-js/src";

class Api {
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
    const adaptedData = resp.data?.map((personnality: any) => Object.assign(personnality, {
      quotes_count: personnality.quotes_count[0].count
    }));
    return {
      items: adaptedData,
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

    if (params.tag)
      query.eq('tags.id', params.tag);
    if (params.text)
      query.textSearch('citation', params.text, {type: 'plain'});
    if (params.party)
      query.eq('personality.party.id', params.party);
    if (params.ids)
      query.in('id', params.ids)

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

  async findNews(params: any): Promise<any> {
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

export default async function handler(req: NextApiRequest, res: NextApiResponse, path: string | undefined = undefined) {
  try {
    const api = new Api();
    let respData;

    path = path || req.query.path as string;

    if (path === 'personalities' && req.query.id) {
      respData = await api.findPersonality(req.query.id);
    } else if (path === 'personalities') {
      respData = await api.findPersonalities(req.query)
    } else if (path === 'quotes') {
      respData = await api.findQuotes(req.query);
    } else if (path === 'news') {
      respData = await api.findNews(req.query);
    } else if (path === 'tags' && req.query.id) {
      respData = await api.findTag(req.query.id);
    } else if (path === 'parties' && req.query.id) {
      respData = await api.findParty(req.query.id);
    } else
      throw new Error('Invalid path');

    res.status(200).json(respData);
  } catch (error: any) {
    res.status(500).json({error: 'Something went wrong', details: error.message});
    //throw error;
  }
}