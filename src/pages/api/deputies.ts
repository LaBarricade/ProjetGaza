import type { NextApiRequest, NextApiResponse } from 'next';
import { baserowDefaultQueryFilters } from './baserow';
import { Personality } from '@/app/personnalites/page';

export type Deputy = {
  id: string;
  nom: string;
  prénom: string;
  date_de_naissance: string;
  date_de_décès: string | null;
  lieu_de_naissance: string;
  lieu_de_décès: string | null;
  sexe: string;
  fonction: string;
  groupe_politique: string;
  annee_de_fin_mandat: string | null;
  annee_de_début_mandat: string | null;
  circonscription: string;
};
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = process.env.NEXT_PUBLIC_DEPUTIES_API_URL;

  if (!url) {
    return res.status(500).json({ error: 'Missing URL' });
  }

  const filters = baserowDefaultQueryFilters(req.query.search as string);
//   const queryParams = `filters=${encodeURIComponent(JSON.stringify(filters))}&order_by=-date`;

  try {
    const response = await fetch(`${url}`, 
    //     {
    //   headers: {
    //     Authorization: `Token ${token}`,
    //   },
    // }
);

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch deputies data' });
    }

    const data : { deputies: Deputy[] } = await response.json();


        // const map = new Map<string, Partial<Deputy>>();
    
    // for (const deputy of data.deputies) {
    //   if (!deputy.nom || !deputy.prénom) continue
  
    //   const fullName = `${deputy.prénom} ${deputy.nom}`;
    //   if (!fullName) continue
  
    //   if (!map.has(fullName)) {
    //     map.set(fullName, {
    //       // id: deputy.id,
    //       nom: deputy.nom,
    //       prénom: deputy.prénom,
    //       groupe_politique: deputy.groupe_politique,
    //       fonction: deputy.fonction
    //     });
    //   } else {
    //     map.get(fullName)!.citations.push(deputy);
    //   }
    // }


    res.status(200).json({results: data.deputies, count: data.deputies.length});
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong', details: (error as Error).message });
  }
}
