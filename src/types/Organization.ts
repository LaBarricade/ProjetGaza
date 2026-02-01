export type Organization = {
  id: number;
  name: string;
  short_name: string | null;
  type: OrganizationType;
  color: string | null;
  created_on: string;
  updated_on: string;
  created_by: string | null;
  last_modified_by: string | null;
};

export type OrganizationType = 'parti_politique' | 'institution' | 'autre';
