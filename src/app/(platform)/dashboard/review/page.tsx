import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import ReviewListingClient from "./ReviewListingClient";

export const metadata = {
  title: "Process Review — Drawdown",
  description: "Review your plan adherence, risk discipline, and process quality for each completed trade.",
};

export default async function ReviewPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return <ReviewListingClient userId={user.id} />;
}
