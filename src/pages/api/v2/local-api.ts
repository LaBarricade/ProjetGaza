import type {NextApiRequest, NextApiResponse} from 'next';
import {DbService} from "@/lib/backend/db-service";


export default async function localApiHandler(req: NextApiRequest, res: NextApiResponse, path: string | undefined = undefined) {
  try {
    const api = new DbService();
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
    } else if (path === 'tags' && req.query.popular) {
      respData = await api.findPopularTags();
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