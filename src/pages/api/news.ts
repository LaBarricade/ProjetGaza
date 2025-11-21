import type { NextApiRequest, NextApiResponse } from 'next';
import { BaserowFilter } from './baserow';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = process.env.BASEROW_API_TOKEN;
  const url = process.env.BASEROW_URL_NEW;

  if (!token) {
    return res.status(500).json({ error: 'Missing Baserow API token' });
  }

  const filters: BaserowFilter = {
    filter_type: "AND",
    filters: [],
    groups: [{
      filter_type: "AND",
      filters: [{
        type: "boolean",
        field: 'est_publié',
        value: "1",
        groups: [],
      }, {
        type: "not_empty",
        field: 'date',
        value: "1",
        groups: [],
      }],
      groups: [],
    }],
  };

  const queryParams = `filters=${encodeURIComponent(JSON.stringify(filters))}&order_by=-date`;

  try {
    const response = await fetch(`${url}?user_field_names=true&${queryParams}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch Baserow data' });
    }

    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong', details: (error as Error).message });
  }
}
