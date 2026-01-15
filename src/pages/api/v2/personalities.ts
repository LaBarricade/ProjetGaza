import type { NextApiRequest, NextApiResponse } from 'next';
import apiHandler from './api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.query.id)
        apiHandler(req, res, 'personality');
    else
        apiHandler(req, res, 'personalities');
}