import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseKey)
    throw new Error('No supabase url or key. Create .env.local file with supabase url and key')

export const supabase = createClient(supabaseUrl, supabaseKey);
