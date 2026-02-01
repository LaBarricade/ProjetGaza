import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseKey)
  throw new Error('No supabase url or key. Create .env.local file with supabase url and key');

console.error('Supabase URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseKey);
