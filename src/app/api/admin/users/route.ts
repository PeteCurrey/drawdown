import { NextResponse } from "next/server";
import { createInternalSupabase } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export async function GET() {
  try {
    const guard = await requireAdmin();
    if ("error" in guard) return guard.error;

    const adminClient = createInternalSupabase();
    
    // Fetch profiles
    const { data: profiles, error: pErr } = await adminClient
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (pErr) throw pErr;

    // Fetch auth users
    const { data: authData, error: aErr } = await adminClient.auth.admin.listUsers();
    if (aErr) throw aErr;

    const authMap = new Map((authData?.users || []).map(u => [u.id, u]));

    const users = (profiles || []).map(p => {
      const authUser = authMap.get(p.id);
      return {
        ...p,
        email: authUser?.email || "Unknown",
        last_sign_in_at: authUser?.last_sign_in_at || null,
        metadata_tier: authUser?.user_metadata?.subscription_tier || null,
      };
    });

    return NextResponse.json({ success: true, users });
  } catch (err: any) {
    console.error("GET /api/admin/users error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const guard = await requireAdmin();
    if ("error" in guard) return guard.error;

    const body = await req.json();
    const { email, password, firstName, lastName, subscription_tier = "free", role = "trader" } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const adminClient = createInternalSupabase();

    const fullName = `${firstName || ""} ${lastName || ""}`.trim() || email.split("@")[0];

    // 1. Create auth user with service role
    const { data: authResult, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        full_name: fullName,
        subscription_tier,
        role,
      },
    });

    if (authError || !authResult.user) {
      console.error("Admin createUser error:", authError);
      return NextResponse.json({ error: authError?.message || "Failed to create user" }, { status: 400 });
    }

    const newUserId = authResult.user.id;

    // 2. Upsert profile with selected tier & role
    const { error: profileError } = await adminClient
      .from("profiles")
      .upsert({
        id: newUserId,
        display_name: fullName,
        full_name: fullName,
        subscription_tier: subscription_tier.toLowerCase(),
        role,
        subscription_status: subscription_tier === "free" ? "inactive" : "active",
        email_preferences: {},
        updated_at: new Date().toISOString(),
      }, { onConflict: "id" });

    if (profileError) {
      console.error("Profile upsert error:", profileError);
    }

    return NextResponse.json({
      success: true,
      message: `User ${email} created successfully with tier '${subscription_tier}'.`,
      user: {
        id: newUserId,
        email,
        display_name: fullName,
        subscription_tier,
        role,
      },
    });
  } catch (err: any) {
    console.error("POST /api/admin/users error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const guard = await requireAdmin();
    if ("error" in guard) return guard.error;

    const body = await req.json();
    const { userId, subscription_tier, role, subscription_status } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required." }, { status: 400 });
    }

    const adminClient = createInternalSupabase();

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (subscription_tier !== undefined) {
      updates.subscription_tier = subscription_tier.toLowerCase();
      if (subscription_tier !== "free" && !subscription_status) {
        updates.subscription_status = "active";
      }
    }
    if (role !== undefined) updates.role = role;
    if (subscription_status !== undefined) updates.subscription_status = subscription_status;

    // 1. Update profiles table
    const { error: profileError } = await adminClient
      .from("profiles")
      .update(updates)
      .eq("id", userId);

    if (profileError) {
      throw profileError;
    }

    // 2. Also update user_metadata in auth.users for full sync
    const metadataUpdates: Record<string, any> = {};
    if (subscription_tier !== undefined) metadataUpdates.subscription_tier = subscription_tier.toLowerCase();
    if (role !== undefined) metadataUpdates.role = role;

    if (Object.keys(metadataUpdates).length > 0) {
      await adminClient.auth.admin.updateUserById(userId, {
        user_metadata: metadataUpdates,
      });
    }

    return NextResponse.json({ success: true, message: "User updated successfully" });
  } catch (err: any) {
    console.error("PATCH /api/admin/users error:", err);
    return NextResponse.json({ error: err.message || "Failed to update user" }, { status: 500 });
  }
}
