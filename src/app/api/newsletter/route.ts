import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email address is required." },
        { status: 400 }
      );
    }

    // In production, insert into Supabase newsletter_subscribers table
    // const supabase = createServerClient();
    // const { error } = await supabase.from('newsletter_subscribers').upsert({ email, confirmed: false });

    console.log(`[Newsletter] New subscriber: ${email}`);

    return NextResponse.json({
      success: true,
      message: "You're on the list. Check your inbox for confirmation.",
    });
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}
