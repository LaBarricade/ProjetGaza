export type Territory = {
  id: number;
  name: string;
  type: TerritoryType;
  parent_id: number | null;
  parent?: Territory;
  code_insee: string | null;
  created_on: string;
  updated_on: string;
  created_by: string | null;
  last_modified_by: string | null;
};

export type TerritoryType =
  | 'pays'
  | 'region'
  | 'departement'
  | 'commune'
  | 'circonscription'
  | 'autre';
