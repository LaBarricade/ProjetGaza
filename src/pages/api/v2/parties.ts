import type { NextApiRequest, NextApiResponse } from 'next';
import localApiHandler from "./local-api";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    localApiHandler(req, res, 'parties');
}