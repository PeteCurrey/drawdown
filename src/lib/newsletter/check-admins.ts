import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAdmins() {
    const { data: admins, error } = await supabase
        .from('profiles')
        .select('email, role')
        .eq('role', 'admin');
    
    if (error) console.error(error);
    else console.log("Admins:", admins);
}

checkAdmins();
