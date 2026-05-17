import { createClient } from '@supabase/supabase-js';

const URL = 'https://kcfsskuzddsxufhcskcg.supabase.co';
const KEY = 'sb_publishable_Dor9KqoRMKYANoN21SJQzg_3HSiPLyt';

export const supabase = createClient(URL, KEY);
