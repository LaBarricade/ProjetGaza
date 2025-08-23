import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = process.env.BASEROW_API_TOKEN;
  const url = process.env.BASEROW_URL;

  if (!token) {
    return res.status(500).json({ error: 'Missing Baserow API token' });
  }

  try {
    const response = await fetch(`${url}?user_field_names=true`, {
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
