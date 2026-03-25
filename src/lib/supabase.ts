import {createClient} from '@supabase/supabase-js';

type SupabaseClientType = ReturnType<typeof createClient>;

let supabase :  SupabaseClientType;

export function getSupabaseClient(): SupabaseClientType {
    if (!supabase) {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('No supabase url or key xxx. Create .env.local file with supabase url and key');
        }

        supabase = createClient(supabaseUrl, supabaseKey);

        if (!supabase) {
            throw new Error('Supabase could not be instatiated');
        }
    }
    return supabase;

}