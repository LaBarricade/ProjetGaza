import type { NextApiRequest, NextApiResponse } from 'next';

export type BaserowFilter =
  | {
      field: string;
      type: string;
      value: string | boolean | number;
      groups: BaserowFilter[];
    }
  | {
      filter_type: "AND" | "OR";
      filters: BaserowFilter[];
      groups: BaserowFilter[];
    };

export const baserowDefaultQueryFilters = (search: string) => {
  let searchPersonalityFilters: BaserowFilter | null = null;

  if (search) {
    const [firstName, name] = (search as string).split(" ");

    searchPersonalityFilters = {
      filter_type: "AND",
      filters: [{
        field: 'nom',
        type: "contains",
        value: name,
        groups: [],
      }, {
        field: 'prénom',
        type: "contains",
        value: firstName,
        groups: [],
      }],
      groups: [],
    }
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

  if (searchPersonalityFilters) {
    filters.groups[0].groups.push(
      searchPersonalityFilters,
    );
  }

  return filters;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = process.env.BASEROW_API_TOKEN;
  const url = process.env.BASEROW_URL;

  if (!token) {
    return res.status(500).json({ error: 'Missing Baserow API token' });
  }

  const filters = baserowDefaultQueryFilters(req.query.search as string);
  const page = req.query.page ? Number(req.query.page) : 1;
  const size = req.query.size ? Number(req.query.size) : 20;
  const queryParams = `filters=${encodeURIComponent(JSON.stringify(filters))}&page=${page}&size=${size}&order_by=-date`;

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
