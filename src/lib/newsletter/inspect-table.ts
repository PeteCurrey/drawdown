import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function inspectTable() {
    const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .limit(1);
    
    if (error) console.error(error);
    else console.log("Table Columns:", data.length > 0 ? Object.keys(data[0]) : "Empty table");
}

inspectTable();
