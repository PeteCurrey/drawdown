"use server";

import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getAcceleratorApplicationConfirmationTemplate } from "@/lib/email-templates";
import { Resend } from "resend";
import { addSubscriberAction } from "./admin-actions";
import { revalidatePath } from "next/cache";

const resend = new Resend(process.env.RESEND_API_KEY || "re_mock_key");
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "petecurrey@gmail.com";

export interface AcceleratorApplicationInput {
  fullName: string;
  email: string;
  experienceLevel: string;
  tradingCapital: string;
  motivation: string;
}

/**
 * Submit accelerator application questionnaire (waitlist / onboarding)
 */
export async function submitAcceleratorApplicationAction(input: AcceleratorApplicationInput) {
  try {
    const { fullName, email, experienceLevel, tradingCapital, motivation } = input;

    if (!fullName || !email || !experienceLevel || !tradingCapital || !motivation) {
      return { success: false, error: "All application questionnaire fields are required." };
    }

    const supabase = createServiceRoleClient();

    // 1. Insert/Upsert into public.accelerator_applications table
    let dbError = null;
    let applicationData = null;
    try {
      const { data, error } = await supabase
        .from("accelerator_applications")
        .insert({
          full_name: fullName,
          email: email.toLowerCase().trim(),
          experience_level: experienceLevel,
          trading_capital: tradingCapital,
          motivation: motivation,
          status: "pending"
        })
        .select()
        .single();

      if (error) {
        dbError = error;
        console.error("Database insert application error:", error);
      } else {
        applicationData = data;
      }
    } catch (err: any) {
      dbError = err;
      console.error("Database connection exception during application insert:", err);
    }

    // 2. Add to email subscriber lists using standard addSubscriberAction from admin-actions
    let subscriptionSuccess = false;
    try {
      const nameParts = fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || "Trader";
      
      const subResult = await addSubscriberAction({
        email: email.toLowerCase().trim(),
        first_name: firstName,
        source: "accelerator_application"
      });
      subscriptionSuccess = subResult.success;
    } catch (subErr) {
      console.error("Failed to add to subscriber list:", subErr);
    }

    // 3. Dispatch premium HTML email via Resend
    let emailSent = false;
    let resendMessageId = null;
    let emailStatus = "failed";
    let emailErrorMessage = null;
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || "Trader";
    const welcomeHtml = getAcceleratorApplicationConfirmationTemplate(firstName);

    if (process.env.RESEND_API_KEY) {
      try {
        const emailRes = await resend.emails.send({
          from: "Pete @ Drawdown <onboarding@drawdown.trading>",
          to: email.toLowerCase().trim(),
          subject: "Your Drawdown Institutional Accelerator Candidate Dossier Received",
          html: welcomeHtml
        });

        if (emailRes.error) {
          console.error("Resend accelerator confirmation send failed:", emailRes.error);
          emailStatus = "failed";
          emailErrorMessage = emailRes.error.message;
        } else {
          emailSent = true;
          resendMessageId = emailRes.data?.id || null;
          emailStatus = "sent";
        }
      } catch (sendErr: any) {
        console.error("Resend API exception:", sendErr);
        emailStatus = "failed";
        emailErrorMessage = sendErr.message;
      }
    } else {
      console.log(`[DEV MODE] Mock sent accelerator confirmation email to ${email}`);
      emailSent = true;
      emailStatus = "sent";
    }

    // 4. Log the send in email_sends table
    try {
      await supabase.from("email_sends").insert({
        type: "accelerator_onboarding",
        subject: "Your Drawdown Institutional Accelerator Candidate Dossier Received",
        content_html: welcomeHtml,
        recipient_count: 1,
        resend_broadcast_id: resendMessageId,
        status: emailStatus,
        error_message: emailErrorMessage,
        sent_at: new Date().toISOString()
      });
    } catch (logErr) {
      console.error("Failed to log email send in database:", logErr);
    }

    if (dbError && dbError.message?.includes("relation \"public.accelerator_applications\" does not exist")) {
      return {
        success: true,
        warning: "Database table accelerator_applications does not exist yet. Please run the SQL migration script in your Supabase project dashboard. Your email auto-responder has successfully completed.",
        emailSent,
        subscriptionSuccess
      };
    }

    if (dbError) {
      return { success: false, error: `Database error: ${dbError.message}` };
    }

    return {
      success: true,
      emailSent,
      subscriptionSuccess,
      applicationId: applicationData?.id
    };

  } catch (err: any) {
    console.error("Accelerator submission action exception:", err);
    return { success: false, error: err.message || "An unexpected error occurred." };
  }
}

/**
 * Update general application questionnaire status
 */
export async function updateApplicationStatusAction(id: string, status: string, notes: string = "") {
  try {
    const supabase = createServiceRoleClient();
    
    const { data, error } = await supabase
      .from("accelerator_applications")
      .update({
        status,
        admin_notes: notes,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating application status:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("Exception in updateApplicationStatusAction:", err);
    return { success: false, error: err.message };
  }
}

/* ==========================================
   INSTITUTIONAL ACCELERATOR CURRICULUM ACTIONS
   ========================================== */

/**
 * Fetch Student Dashboard Data
 */
export async function getAcceleratorStudentDashboardAction() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // 1. Get student enrollment details (paid only)
    const { data: enrolment, error: enrolmentError } = await supabase
      .from("accelerator_enrolments")
      .select("*, cohort:accelerator_cohorts(*)")
      .eq("user_id", user.id)
      .eq("payment_status", "paid")
      .maybeSingle();

    if (enrolmentError) {
      console.error("Error fetching enrolment:", enrolmentError);
      return { success: false, error: enrolmentError.message };
    }

    if (!enrolment) {
      return { success: false, notEnrolled: true };
    }

    // 2. Fetch all 6 weeks of curriculum content
    const { data: weeks, error: weeksError } = await supabase
      .from("accelerator_weeks")
      .select("*")
      .order("week_number", { ascending: true });

    if (weeksError) {
      console.error("Error fetching weeks:", weeksError);
      return { success: false, error: weeksError.message };
    }

    // 3. Fetch all milestone submissions for this student
    const { data: milestones, error: milestonesError } = await supabase
      .from("accelerator_milestones")
      .select("*")
      .eq("enrolment_id", enrolment.id);

    if (milestonesError) {
      console.error("Error fetching milestones:", milestonesError);
      return { success: false, error: milestonesError.message };
    }

    // 4. Fetch personal workshops / 1on1 sessions scheduled for this student
    const { data: sessions, error: sessionsError } = await supabase
      .from("accelerator_personal_sessions")
      .select("*")
      .eq("enrolment_id", enrolment.id)
      .order("scheduled_at", { ascending: true });

    if (sessionsError) {
      console.error("Error fetching sessions:", sessionsError);
      return { success: false, error: sessionsError.message };
    }

    return {
      success: true,
      enrolment,
      weeks: weeks || [],
      milestones: milestones || [],
      sessions: sessions || []
    };
  } catch (err: any) {
    console.error("Exception in getAcceleratorStudentDashboardAction:", err);
    return { success: false, error: err.message || "An unexpected error occurred." };
  }
}

/**
 * Student submits a milestone for review
 */
export async function submitAcceleratorMilestoneAction(
  weekNumber: number,
  textSubmission: string,
  fileUrl: string | null = null,
  fileName: string | null = null
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // 1. Fetch enrolment
    const { data: enrolment, error: enrolmentError } = await supabase
      .from("accelerator_enrolments")
      .select("id, current_week")
      .eq("user_id", user.id)
      .eq("payment_status", "paid")
      .maybeSingle();

    if (enrolmentError || !enrolment) {
      return { success: false, error: "No active paid enrollment found." };
    }

    // 2. Security validation: student cannot submit for weeks ahead of current progression
    if (weekNumber > enrolment.current_week) {
      return { success: false, error: "You cannot submit a milestone for a locked week." };
    }

    // 3. Insert or update the milestone row (using upsert or raw insert with onConflict)
    const submissionContent = {
      text: textSubmission,
      file_url: fileUrl,
      file_name: fileName,
    };

    const { data: milestone, error: milestoneError } = await supabase
      .from("accelerator_milestones")
      .upsert({
        enrolment_id: enrolment.id,
        week_number: weekNumber,
        status: "submitted",
        submission_content: submissionContent,
        submitted_at: new Date().toISOString()
      }, {
        onConflict: "enrolment_id,week_number"
      })
      .select()
      .single();

    if (milestoneError) {
      console.error("Error submitting milestone:", milestoneError);
      return { success: false, error: milestoneError.message };
    }

    // 4. Send email notification to Founder (Pete) via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const fileAttachmentText = fileUrl ? `\n\n📁 Attached File: ${fileName}\nDownload Link: ${fileUrl}` : "";
        const emailHtml = `
          <div style="background-color: #0A0A0A; color: #E5E5E5; padding: 40px; font-family: monospace; border: 1px solid #1E293B;">
            <p style="color: #10B981; font-weight: bold; font-size: 16px;">[ACCELERATOR SUBMISSION] WEEK ${weekNumber}</p>
            <p><strong>Student:</strong> ${user.email}</p>
            <p><strong>Submitted At:</strong> ${new Date().toUTCString()}</p>
            <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;" />
            <p style="color: #94A3B8;">STUDENT SUBMISSION BRIEF:</p>
            <pre style="background-color: #121212; padding: 20px; border-left: 4px solid #10B981; white-space: pre-wrap; font-family: monospace; color: #F1F5F9;">${textSubmission}</pre>
            ${fileUrl ? `<p style="margin-top: 20px;"><strong>Uploaded Document:</strong> <a href="${fileUrl}" style="color: #10B981; text-decoration: underline;">${fileName}</a></p>` : ""}
            <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;" />
            <p style="font-size: 12px; color: #64748B;">To review and grade this submission, go to the <a href="https://drawdown.trading/admin/accelerator" style="color: #10B981;">Admin Panel</a>.</p>
          </div>
        `;

        await resend.emails.send({
          from: "Drawdown Accelerator <onboarding@drawdown.trading>",
          to: ADMIN_EMAIL,
          subject: `[Accelerator Sub] Week ${weekNumber} - ${user.email}`,
          html: emailHtml
        });
      } catch (err) {
        console.error("Failed to send submission email to admin:", err);
      }
    }

    revalidatePath("/dashboard/accelerator");
    return { success: true, milestone };
  } catch (err: any) {
    console.error("Exception in submitAcceleratorMilestoneAction:", err);
    return { success: false, error: err.message || "An unexpected error occurred." };
  }
}

/**
 * Fetch Administrative Dashboard Data (Restricted)
 */
export async function getAcceleratorAdminDashboardAction() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return { success: false, error: "Forbidden" };
    }

    // 1. Get all cohorts
    const { data: cohorts, error: cohortsError } = await supabase
      .from("accelerator_cohorts")
      .select("*")
      .order("start_date", { ascending: false });

    if (cohortsError) {
      console.error("Error fetching cohorts:", cohortsError);
      return { success: false, error: cohortsError.message };
    }

    const serviceClient = createServiceRoleClient();

    // 2. Fetch all profiles map for robust joins
    const { data: allProfiles } = await serviceClient.from("profiles").select("*");
    const profileMap = new Map((allProfiles || []).map((p: any) => [p.id, p]));

    // 3. Get student enrollments with cohort join, fallback gracefully if profile relationship fails
    let enrolments: any[] = [];
    let enrolmentsRes = await supabase
      .from("accelerator_enrolments")
      .select("*, profile:profiles(*), cohort:accelerator_cohorts(*)")
      .order("enrolled_at", { ascending: false });

    if (enrolmentsRes.error) {
      // Fallback query without PostgREST profiles relationship
      const rawRes = await serviceClient
        .from("accelerator_enrolments")
        .select("*, cohort:accelerator_cohorts(*)")
        .order("enrolled_at", { ascending: false });

      if (rawRes.error) {
        console.error("Error fetching enrolments:", rawRes.error);
        return { success: false, error: rawRes.error.message };
      }
      enrolments = (rawRes.data || []).map((e: any) => ({
        ...e,
        profile: profileMap.get(e.user_id) || { display_name: "Student Trader", email: "student@drawdown.trading" }
      }));
    } else {
      enrolments = (enrolmentsRes.data || []).map((e: any) => ({
        ...e,
        profile: e.profile || profileMap.get(e.user_id) || { display_name: "Student Trader", email: "student@drawdown.trading" }
      }));
    }

    const enrolmentMap = new Map(enrolments.map((e: any) => [e.id, e]));

    // 4. Get all submitted milestones awaiting grading / review
    let pendingMilestones: any[] = [];
    const pendingRes = await serviceClient
      .from("accelerator_milestones")
      .select("*")
      .eq("status", "submitted")
      .order("submitted_at", { ascending: true });

    if (!pendingRes.error && pendingRes.data) {
      pendingMilestones = pendingRes.data.map((m: any) => ({
        ...m,
        enrolment: enrolmentMap.get(m.enrolment_id)
      }));
    }

    // 5. Get all student milestones for matrix layout
    const { data: allMilestones, error: allMilestonesError } = await serviceClient
      .from("accelerator_milestones")
      .select("*");

    if (allMilestonesError) {
      console.error("Error fetching all milestones:", allMilestonesError);
      return { success: false, error: allMilestonesError.message };
    }

    // 6. Get personal workshops sessions scheduled
    let sessions: any[] = [];
    const sessionsRes = await serviceClient
      .from("accelerator_personal_sessions")
      .select("*")
      .order("scheduled_at", { ascending: true });

    if (!sessionsRes.error && sessionsRes.data) {
      sessions = sessionsRes.data.map((s: any) => ({
        ...s,
        enrolment: enrolmentMap.get(s.enrolment_id)
      }));
    }

    return {
      success: true,
      cohorts: cohorts || [],
      enrolments: enrolments || [],
      pendingMilestones: pendingMilestones || [],
      allMilestones: allMilestones || [],
      sessions: sessions || []
    };
  } catch (err: any) {
    console.error("Exception in getAcceleratorAdminDashboardAction:", err);
    return { success: false, error: err.message || "An unexpected error occurred." };
  }
}

/**
 * Grade student milestone submission (Clear or Request Resubmission)
 */
export async function gradeAcceleratorMilestoneAction(
  milestoneId: string,
  status: "cleared" | "needs_resubmission",
  reviewNotes: string
) {
  try {
    const supabase = await createClient();
    const serviceClient = createServiceRoleClient(); // Use service role to safely update enrollments and profiles bypass RLS
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return { success: false, error: "Forbidden" };
    }

    if (!milestoneId || !status) {
      return { success: false, error: "Milestone ID and status are required." };
    }

    // 1. Fetch milestone details first
    const { data: milestone, error: fetchError } = await serviceClient
      .from("accelerator_milestones")
      .select("*, enrolment:accelerator_enrolments(*)")
      .eq("id", milestoneId)
      .single();

    if (fetchError || !milestone) {
      return { success: false, error: "Milestone submission not found." };
    }

    // 2. Update milestone status and review details
    const { data: updatedMilestone, error: updateError } = await serviceClient
      .from("accelerator_milestones")
      .update({
        status,
        review_notes: reviewNotes,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString()
      })
      .eq("id", milestoneId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating milestone:", updateError);
      return { success: false, error: updateError.message };
    }

    // 3. If cleared, increment student's current_week progression in accelerator_enrolments (capped at 6)
    if (status === "cleared") {
      const nextWeek = Math.min(milestone.week_number + 1, 6);
      
      // Only increment current_week if we are clearing their actual current week progression
      if (milestone.week_number === milestone.enrolment.current_week) {
        const { error: enrolmentUpdateError } = await serviceClient
          .from("accelerator_enrolments")
          .update({
            current_week: nextWeek,
          })
          .eq("id", milestone.enrolment_id);

        if (enrolmentUpdateError) {
          console.error("Error upgrading student week progress:", enrolmentUpdateError);
        }
      }
    }

    // 4. Fetch student profile to get email and name for notifications
    const { data: studentProfile } = await serviceClient
      .from("profiles")
      .select("first_name, email")
      .eq("id", milestone.enrolment.user_id)
      .single();

    // 5. Send notification email to Student via Resend
    const studentEmail = studentProfile?.email;
    if (studentEmail && process.env.RESEND_API_KEY) {
      try {
        const studentName = studentProfile?.first_name || "Trader";
        let emailSubject = "";
        let emailHtml = "";

        if (status === "cleared") {
          emailSubject = `[Drawdown Accelerator] Week ${milestone.week_number} Milestone Cleared! 🎉`;
          emailHtml = `
            <div style="background-color: #0A0A0A; color: #E5E5E5; padding: 40px; font-family: monospace; border: 1px solid #1E293B;">
              <p style="color: #10B981; font-weight: bold; font-size: 18px;">CONGRATULATIONS, ${studentName.toUpperCase()}</p>
              <p>Your <strong>Week ${milestone.week_number}</strong> Milestone submission has been reviewed and <strong>CLEARED</strong> by Pete.</p>
              <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;" />
              <p style="color: #94A3B8;">FOUNDER FEEDBACK & CLINIC NOTES:</p>
              <pre style="background-color: #121212; padding: 20px; border-left: 4px solid #10B981; white-space: pre-wrap; font-family: monospace; color: #F1F5F9;">${reviewNotes || "Excellent work. You have demonstrated clear grasp of the systematic variables and risk rules. Approved."}</pre>
              <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;" />
              <p style="font-size: 15px; color: #E2E8F0;">🚀 You have unlocked <strong>Week ${Math.min(milestone.week_number + 1, 6)}</strong>! Log back in to resume your systematic training.</p>
              <p style="margin-top: 30px;"><a href="https://drawdown.trading/dashboard/accelerator" style="display: inline-block; background-color: #10B981; color: #000; padding: 12px 24px; font-weight: bold; text-decoration: none; border-radius: 4px;">RESUME WORKSTATION</a></p>
            </div>
          `;
        } else {
          emailSubject = `[Drawdown Accelerator] Action Required: Week ${milestone.week_number} Milestone Submission ⚠️`;
          emailHtml = `
            <div style="background-color: #0A0A0A; color: #E5E5E5; padding: 40px; font-family: monospace; border: 1px solid #1E293B;">
              <p style="color: #F59E0B; font-weight: bold; font-size: 18px;">ATTENTION REQUIRED: WEEK ${milestone.week_number} MILESTONE</p>
              <p>Pete has reviewed your Week ${milestone.week_number} Milestone. Your submission requires refinement and additional backtesting parameters before we can approve your progression.</p>
              <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;" />
              <p style="color: #94A3B8;">REQUIRED EDITS & FEEDBACK NOTES:</p>
              <pre style="background-color: #121212; padding: 20px; border-left: 4px solid #F59E0B; white-space: pre-wrap; font-family: monospace; color: #F1F5F9;">${reviewNotes}</pre>
              <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;" />
              <p style="font-size: 14px; color: #E2E8F0;">Please edit your submission or upload the corrected briefing documents directly in your workstation dashboard.</p>
              <p style="margin-top: 30px;"><a href="https://drawdown.trading/dashboard/accelerator" style="display: inline-block; background-color: #F59E0B; color: #000; padding: 12px 24px; font-weight: bold; text-decoration: none; border-radius: 4px;">REOPEN SUBMISSION WORKSTATION</a></p>
            </div>
          `;
        }

        await resend.emails.send({
          from: "Pete @ Drawdown <onboarding@drawdown.trading>",
          to: studentEmail,
          subject: emailSubject,
          html: emailHtml
        });
      } catch (err) {
        console.error("Failed to send grading email notification to student:", err);
      }
    }

    revalidatePath("/dashboard/accelerator");
    revalidatePath("/admin/accelerator");
    return { success: true, milestone: updatedMilestone };
  } catch (err: any) {
    console.error("Exception in gradeAcceleratorMilestoneAction:", err);
    return { success: false, error: err.message || "An unexpected error occurred." };
  }
}

/**
 * Create a new Cohort
 */
export async function createCohortAction(input: {
  name: string;
  startDate: string;
  seatCap: number;
  status: "upcoming" | "active" | "closed";
}) {
  try {
    const supabase = await createClient();
    const serviceClient = createServiceRoleClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (!profile || profile.role !== "admin") return { success: false, error: "Forbidden" };

    const { data: cohort, error } = await serviceClient
      .from("accelerator_cohorts")
      .insert({
        name: input.name,
        start_date: input.startDate,
        seat_cap: input.seatCap,
        status: input.status
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/accelerator");
    revalidatePath("/admin/accelerator/cohorts");
    return { success: true, cohort };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create cohort." };
  }
}

/**
 * Update Cohort details
 */
export async function updateCohortAction(id: string, input: {
  name?: string;
  startDate?: string;
  seatCap?: number;
  status?: "upcoming" | "active" | "closed";
}) {
  try {
    const supabase = await createClient();
    const serviceClient = createServiceRoleClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (!profile || profile.role !== "admin") return { success: false, error: "Forbidden" };

    const payload: any = {};
    if (input.name !== undefined) payload.name = input.name;
    if (input.startDate !== undefined) payload.start_date = input.startDate;
    if (input.seatCap !== undefined) payload.seat_cap = input.seatCap;
    if (input.status !== undefined) payload.status = input.status;

    const { data: cohort, error } = await serviceClient
      .from("accelerator_cohorts")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/accelerator");
    revalidatePath("/admin/accelerator/cohorts");
    return { success: true, cohort };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update cohort." };
  }
}

/**
 * Manually Enrol a Student into a Cohort by Email
 */
export async function manuallyEnrolStudentAction(input: {
  email: string;
  cohortId: string;
  paymentStatus?: "unpaid" | "paid" | "refunded";
}) {
  try {
    const supabase = await createClient();
    const serviceClient = createServiceRoleClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (!profile || profile.role !== "admin") return { success: false, error: "Forbidden" };

    const targetEmail = input.email.toLowerCase().trim();

    // 1. Find profile by email
    const { data: targetProfile, error: profileErr } = await serviceClient
      .from("profiles")
      .select("id, display_name, email")
      .eq("email", targetEmail)
      .maybeSingle();

    let targetUserId = targetProfile?.id;

    // If profile not found by email, check auth.users via service role RPC or listUsers
    if (!targetUserId) {
      const { data: usersData } = await serviceClient.auth.admin.listUsers();
      const matchedUser = usersData.users.find(u => u.email?.toLowerCase() === targetEmail);
      if (matchedUser) {
        targetUserId = matchedUser.id;
      }
    }

    if (!targetUserId) {
      return { success: false, error: `No user account found matching "${targetEmail}". Student must sign up on Drawdown first.` };
    }

    // 2. Insert into accelerator_enrolments
    const { data: enrolment, error: enrolErr } = await serviceClient
      .from("accelerator_enrolments")
      .upsert({
        user_id: targetUserId,
        cohort_id: input.cohortId,
        payment_status: input.paymentStatus || "paid",
        current_week: 1,
        enrolled_at: new Date().toISOString()
      }, { onConflict: "user_id,cohort_id" })
      .select()
      .single();

    if (enrolErr) return { success: false, error: enrolErr.message };

    revalidatePath("/admin/accelerator");
    revalidatePath("/admin/accelerator/students");
    return { success: true, enrolment };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to enrol student." };
  }
}

/**
 * Update Enrolment Status or Week
 */
export async function updateEnrolmentAction(enrolmentId: string, input: {
  currentWeek?: number;
  paymentStatus?: "unpaid" | "paid" | "refunded";
}) {
  try {
    const supabase = await createClient();
    const serviceClient = createServiceRoleClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (!profile || profile.role !== "admin") return { success: false, error: "Forbidden" };

    const payload: any = {};
    if (input.currentWeek !== undefined) payload.current_week = input.currentWeek;
    if (input.paymentStatus !== undefined) payload.payment_status = input.paymentStatus;

    const { data: enrolment, error } = await serviceClient
      .from("accelerator_enrolments")
      .update(payload)
      .eq("id", enrolmentId)
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/accelerator");
    revalidatePath("/admin/accelerator/students");
    return { success: true, enrolment };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update enrolment." };
  }
}

/**
 * Update Accelerator Week Curriculum Content
 */
export async function updateAcceleratorWeekAction(weekNumber: number, input: {
  title?: string;
  quote?: string;
  coreModules?: string[];
  milestoneDescription?: string;
  personalInputDescription?: string;
  toolingName?: string;
}) {
  try {
    const supabase = await createClient();
    const serviceClient = createServiceRoleClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (!profile || profile.role !== "admin") return { success: false, error: "Forbidden" };

    const payload: any = {};
    if (input.title !== undefined) payload.title = input.title;
    if (input.quote !== undefined) payload.quote = input.quote;
    if (input.coreModules !== undefined) payload.core_modules = input.coreModules;
    if (input.milestoneDescription !== undefined) payload.milestone_description = input.milestoneDescription;
    if (input.personalInputDescription !== undefined) payload.personal_input_description = input.personalInputDescription;
    if (input.toolingName !== undefined) payload.tooling_name = input.toolingName;

    const { data: week, error } = await serviceClient
      .from("accelerator_weeks")
      .update(payload)
      .eq("week_number", weekNumber)
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/accelerator/curriculum");
    revalidatePath("/dashboard/accelerator");
    return { success: true, week };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update week curriculum." };
  }
}

/**
 * Fetch detailed student information for student page
 */
export async function getSingleStudentDetailsAction(enrolmentId: string) {
  try {
    const supabase = await createClient();
    const serviceClient = createServiceRoleClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (!profile || profile.role !== "admin") return { success: false, error: "Forbidden" };

    // 1. Fetch enrolment
    const { data: enrolment, error: enrolErr } = await serviceClient
      .from("accelerator_enrolments")
      .select("*, cohort:accelerator_cohorts(*)")
      .eq("id", enrolmentId)
      .single();

    if (enrolErr || !enrolment) {
      return { success: false, error: "Enrolment not found." };
    }

    // 2. Fetch user profile
    const { data: studentProfile } = await serviceClient
      .from("profiles")
      .select("*")
      .eq("id", enrolment.user_id)
      .maybeSingle();

    // 3. Fetch all milestones for this student
    const { data: milestones } = await serviceClient
      .from("accelerator_milestones")
      .select("*")
      .eq("enrolment_id", enrolmentId)
      .order("week_number", { ascending: true });

    // 4. Fetch all sessions for this student
    const { data: sessions } = await serviceClient
      .from("accelerator_personal_sessions")
      .select("*")
      .eq("enrolment_id", enrolmentId)
      .order("scheduled_at", { ascending: true });

    // 5. Fetch all curriculum weeks
    const { data: weeks } = await serviceClient
      .from("accelerator_weeks")
      .select("*")
      .order("week_number", { ascending: true });

    return {
      success: true,
      enrolment,
      profile: studentProfile,
      milestones: milestones || [],
      sessions: sessions || [],
      weeks: weeks || []
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch student details." };
  }
}

