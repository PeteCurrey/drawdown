import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateProfileImage() {
    const email = 'petecurrey@gmail.com';
    const avatarUrl = '/assets/brand/logo-icon.png';

    console.log(`Updating avatar for ${email}...`);

    const { data, error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('email', email);

    if (error) {
        console.error("Error updating profile:", error);
    } else {
        console.log("Successfully updated profile image!");
    }
}

updateProfileImage();
