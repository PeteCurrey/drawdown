import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role for bypass
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch { /* Server component cookie limitation */ }
        },
      },
    }
  );

  const { searchParams } = new URL(request.url);
  const targetEmail = searchParams.get("email");

  let targetUserId;

  if (targetEmail) {
    // If an email is provided, use the admin API to find the user
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
       return NextResponse.json({ error: "Failed to fetch users list" }, { status: 500 });
    }
    
    const user = users.find(u => u.email?.toLowerCase() === targetEmail.toLowerCase());
    if (!user) {
       return NextResponse.json({ error: "User not found with that email" }, { status: 404 });
    }
    targetUserId = user.id;
  } else {
    // Otherwise use the currently logged-in user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not logged in and no email provided" }, { status: 401 });
    }
    targetUserId = user.id;
  }

  const { error } = await supabase
    .from('profiles')
    .update({ subscription_tier: 'floor' })
    .eq('id', targetUserId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ 
    success: true, 
    message: "User upgraded to Floor (Top-Level) tier.",
    user_id: targetUserId
  });
}
