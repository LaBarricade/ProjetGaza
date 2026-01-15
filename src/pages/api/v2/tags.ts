import type { NextApiRequest, NextApiResponse } from 'next';
import apiHandler from './api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    apiHandler(req, res, 'tags');
}