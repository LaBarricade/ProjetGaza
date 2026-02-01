export type Mandate = {
  id: number;
  personality_id: number;
  mandate_type_id: number;
  organization_id: number | null;
  territory_id: number | null;
  start_date: string;
  end_date: string | null;
  notes: string | null;
  created_on: string;
  updated_on: string;
  created_by: string | null;
  last_modified_by: string | null;
};
