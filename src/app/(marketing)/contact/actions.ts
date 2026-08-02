"use server";

import { createInternalSupabase, createClient } from "@/lib/supabase/server";

export async function submitContactForm(formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
  subscribe?: boolean;
}) {
  try {
    const supabase = process.env.SUPABASE_SERVICE_ROLE_KEY
      ? createInternalSupabase()
      : await createClient();

    const subject = formData.subject || "General Support";
    const priority =
      subject.toLowerCase().includes("enterprise") ||
      subject.toLowerCase().includes("partnership")
        ? "high"
        : "normal";

    const { error } = await supabase.from("contact_submissions").insert([
      {
        name: formData.name,
        email: formData.email,
        subject: subject,
        message: formData.message,
        priority: priority,
      },
    ]);

    if (error) {
      console.error("Submission error:", error);
      return { success: false, error: error.message };
    }

    if (formData.subscribe) {
      const { error: subscribeError } = await supabase
        .from("newsletter_subscribers")
        .upsert(
          {
            email: formData.email,
            first_name: formData.name,
            source: "contact_form",
            status: "active",
          },
          { onConflict: "email" }
        );

      if (subscribeError) {
        console.error(
          "Newsletter subscription error during contact submission:",
          subscribeError
        );
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error("Unexpected submission error:", err);
    return { success: false, error: err?.message || "Submission failed" };
  }
}

