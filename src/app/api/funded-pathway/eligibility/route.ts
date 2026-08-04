import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const authClient = await createServerClient();
    const { data: { user } } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Get user profile details
    const { data: profile, error: profileError } = await authClient
      .from("profiles")
      .select("subscription_tier, challenge_status, challenge_prop_firm_id, challenge_tier")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      console.error("Error fetching profile:", profileError);
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // 2. Check Phase 4 (Risk Manager) progress
    // Phase 4 has exactly 6 modules
    const { data: progressRows, error: progressError } = await authClient
      .from("course_progress")
      .select("module")
      .eq("user_id", user.id)
      .eq("phase", 4)
      .eq("completed", true);

    if (progressError) {
      console.error("Error fetching course progress:", progressError);
      return NextResponse.json({ error: "Failed to retrieve progress data" }, { status: 500 });
    }

    const completed_count = progressRows ? progressRows.length : 0;
    const total_count = 6;
    const subscription_tier = profile.subscription_tier || "free";
    
    // Eligibility Rule: Must have completed all 6 modules of Phase 4 (Risk Manager)
    // and must be on a paid tier (Foundation, Edge, Floor)
    const isPaidSubscriber = subscription_tier !== "free";
    const isCurriculumFinished = completed_count >= total_count;
    const eligible = isPaidSubscriber && isCurriculumFinished;

    let reason = "";
    if (!isPaidSubscriber) {
      reason = "Upgrade to Foundation (£49/mo) or above to unlock the Funded Pathway.";
    } else if (!isCurriculumFinished) {
      reason = `Complete all 6 modules of Phase 4: Risk Manager (Current progress: ${completed_count}/${total_count}).`;
    } else {
      reason = "Pathway unlocked. You are eligible to apply!";
    }

    return NextResponse.json({
      eligible,
      completed_count,
      total_count,
      subscription_tier,
      challenge_status: profile.challenge_status || "not_started",
      challenge_prop_firm_id: profile.challenge_prop_firm_id,
      challenge_tier: profile.challenge_tier,
      reason
    });

  } catch (error: any) {
    console.error("Funded Pathway Eligibility GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authClient = await createServerClient();
    const { data: { user } } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { challenge_status, challenge_prop_firm_id, challenge_tier } = body;

    // Validate challenge status if provided
    const validStatuses = ["not_started", "in_progress", "passed", "failed", "funded"];
    if (challenge_status && !validStatuses.includes(challenge_status)) {
      return NextResponse.json({ error: "Invalid challenge status value" }, { status: 400 });
    }

    // Build update payload
    const updateData: Record<string, any> = {};
    if (challenge_status !== undefined) updateData.challenge_status = challenge_status;
    if (challenge_prop_firm_id !== undefined) updateData.challenge_prop_firm_id = challenge_prop_firm_id;
    if (challenge_tier !== undefined) updateData.challenge_tier = challenge_tier;
    updateData.updated_at = new Date().toISOString();

    const { error: updateError } = await authClient
      .from("profiles")
      .update(updateData)
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating challenge status:", updateError);
      return NextResponse.json({ error: "Failed to update status in database" }, { status: 500 });
    }

    return NextResponse.json({ success: true, updated: updateData });

  } catch (error: any) {
    console.error("Funded Pathway Eligibility POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
