import type {NextApiRequest, NextApiResponse} from 'next';
import { supabase } from '@/lib/supabase'

class Api {
    token: string | undefined;
    url: string | undefined;

    init(): void {
        this.token = process.env.SUPABASE_API_TOKEN;
        this.url = process.env.SUPABASE_URL;
    }

    checkErrors(supabaseResp: any) {
        if (supabaseResp.error)
            throw new Error(supabaseResp.error.message);
    }

    async findPersonalities(params: object) :  Promise<any> {
        const resp = await supabase
            .from('personnalites')
            .select(`id, lastname:nom, firstname:prenom, role:fonction, city:ville, department:departement, region, quotes_count:declarations(count),
                party:parti_politique_id(name:nom, id)`)
            .order('nom');
        this.checkErrors(resp);
        const adaptedData = resp.data?.map((personnality: any) => Object.assign(personnality, {
            quotes_count: personnality.quotes_count[0].count
        }));
        return adaptedData;
    }

    async findPersonality(id: any) :  Promise<any> {
        const resp = await supabase
            .from('personnalites')
            .select(`id, lastname:nom, firstname:prenom, role:fonction, city:ville, department:departement, region,
                party:parti_politique_id(name:nom, id)`)
            .eq('id', id);
        this.checkErrors(resp);
        const data = resp.data?.at(0);

        return data && Object.assign(data, {citations: await this.findQuotes({personnality: id})});
    }

    async findQuotes(params: any) :  Promise<any> {
        const query = supabase.from('declarations').select();
        let select = `id, text:citation, source:source_id(name:nom, id), date, link:lien, tags(name:nom, id)`;
        if (params.personnality)
            query.eq('personnalite_id', params.personnality);
        else
            select += `, personality:personnalite_id(id, lastname:nom, firstname:prenom, role:fonction, city:ville, department:departement, region,
                party:parti_politique_id(name:nom, id))`;

        query.select(select)

        const resp = await query;

        this.checkErrors(resp);
        return resp.data;
    }

    async findNews(params: any) :  Promise<any> {
        const query = supabase
            .from('actualites')
            .select(`id, text:texte, date`)
            .order('date', {ascending: false});

        const resp = await query;

        this.checkErrors(resp);
        return resp.data;
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse, path: string | undefined = undefined) {
    try {
        const api = new Api();
        api.init();
        let respData;

        path = path || req.query.path as string;

        if (path === 'personalities') {
            respData = await api.findPersonalities(req.query)
        }
        else if (path === 'personality') {
            respData = await api.findPersonality(req.query.id);
        }
        else if (path === 'quotes') {
            respData = await api.findQuotes(req.query);
        }
        else if (path === 'news') {
            respData = await api.findNews(req.query);
        }
        else
            throw new Error('Invalid path');

        res.status(200).json({
            data: respData,
            error: respData.error
        });
    } catch (error: any) {
        res.status(500).json({error: 'Something went wrong', details: error.message});
    }
}