"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitContactForm(formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from('contact_submissions').insert([
    {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      priority: formData.subject.toLowerCase().includes('enterprise') || formData.subject.toLowerCase().includes('partnership') ? 'high' : 'normal'
    }
  ]);

  if (error) {
    console.error("Submission error:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
