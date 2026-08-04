"use server";

import { createInternalSupabase } from "@/lib/supabase/server";
import { getAcceleratorApplicationConfirmationTemplate } from "@/lib/email-templates";
import { Resend } from "resend";
import { addSubscriberAction } from "./admin-actions";

export interface AcceleratorApplicationInput {
  fullName: string;
  email: string;
  experienceLevel: string;
  tradingCapital: string;
  motivation: string;
}

export async function submitAcceleratorApplicationAction(input: AcceleratorApplicationInput) {
  try {
    const { fullName, email, experienceLevel, tradingCapital, motivation } = input;

    if (!fullName || !email || !experienceLevel || !tradingCapital || !motivation) {
      return { success: false, error: "All application questionnaire fields are required." };
    }

    const supabase = createInternalSupabase();
    const resendKey = process.env.RESEND_API_KEY;
    const resend = new Resend(resendKey || "re_mock_key");

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
      // Split full name into first/last name
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

    if (resendKey) {
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

export async function updateApplicationStatusAction(id: string, status: string, notes: string = "") {
  try {
    const supabase = createInternalSupabase();
    
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
