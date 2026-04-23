import { createClient } from "@/lib/supabase/server";
import { EditionEditorClient } from "@/components/admin/newsletter/EditionEditor";
import { notFound } from "next/navigation";

export default async function AdminEditionReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: edition } = await supabase
    .from('newsletter_editions')
    .select('*, newsletter_sections(*)')
    .eq('id', id)
    .single();

  if (!edition) {
    notFound();
  }

  return (
    <EditionEditorClient edition={edition} />
  );
}
