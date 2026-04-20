
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://miiasjbonwlleggiukyf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1paWFzamJvbndsbGVnZ2l1a3lmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjE1Njc1OCwiZXhwIjoyMDkxNzMyNzU4fQ.FZdZVV4N0JTZ61HAwdxzHP3HrUmDy3UBFcB_OapIzng';

const supabase = createClient(supabaseUrl, supabaseKey);

async function listUsers() {
  const { data, error } = await supabase.from('profiles').select('id, display_name, subscription_tier').limit(20);
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log(JSON.stringify(data, null, 2));
}

listUsers();
