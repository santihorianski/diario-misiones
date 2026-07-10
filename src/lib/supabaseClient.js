import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Inicializar el cliente. Solo se usará en Server Components y Server Actions
// por lo que es seguro usar la service_role key.
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
