import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Verify course completion (passed all quizzes)
    const { data: course } = await supabase
      .from("courses" as any)
      .select("id, title")
      .eq("slug", "prop-firm-survival-kit")
      .single();

    if (!course) {
      return new Response("Course not found", { status: 404 });
    }

    const { data: attempts } = await supabase
      .from("course_quiz_attempts" as any)
      .select("passed")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .eq("passed", true);

    if (!attempts || attempts.length < 6) {
      return new Response("Forbidden - All module quizzes must be passed first", { status: 403 });
    }

    const { data: profile } = await supabase
      .from("profiles" as any)
      .select("display_name")
      .eq("id", user.id)
      .single();

    const name = (profile as any)?.display_name || user.email || "Funded Trader";
    const date = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Drawdown Certificate of Completion</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Space+Grotesk:wght@500;700&display=swap');
    body {
      background-color: #050505;
      color: #ffffff;
      font-family: 'Outfit', sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .cert-container {
      width: 850px;
      height: 600px;
      padding: 40px;
      border: 8px solid #22C55E;
      background: #0A0A0A;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-sizing: border-box;
      background-image: radial-gradient(circle at center, rgba(34, 197, 94, 0.05) 0%, transparent 70%);
    }
    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 120px;
      font-weight: 900;
      color: rgba(34, 197, 94, 0.02);
      letter-spacing: 15px;
      pointer-events: none;
      user-select: none;
      z-index: 1;
    }
    .header {
      text-align: center;
      z-index: 2;
    }
    .logo {
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
      font-size: 24px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #22C55E;
      margin-bottom: 20px;
    }
    .title {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 4px;
      color: #6B7280;
      margin-top: 10px;
    }
    .content {
      text-align: center;
      z-index: 2;
    }
    .recipient-label {
      font-size: 14px;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .name {
      font-size: 42px;
      font-weight: 900;
      text-transform: uppercase;
      color: #ffffff;
      margin: 15px 0;
      border-bottom: 2px solid #22C55E;
      display: inline-block;
      padding-bottom: 10px;
      min-width: 300px;
    }
    .desc {
      font-size: 16px;
      color: #9CA3AF;
      max-width: 550px;
      margin: 15px auto;
      line-height: 1.6;
    }
    .course {
      color: #ffffff;
      font-weight: 700;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      z-index: 2;
    }
    .sign-block {
      border-top: 1px solid #1E1E1E;
      padding-top: 10px;
      width: 180px;
      text-align: center;
    }
    .sign-title {
      font-size: 11px;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .sign-val {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 16px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 5px;
    }
    .date-val {
      font-size: 13px;
      color: #ffffff;
      font-weight: 700;
      margin-bottom: 5px;
    }
    .btn-print {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #22C55E;
      color: #000;
      border: none;
      padding: 10px 20px;
      font-size: 12px;
      font-weight: 700;
      border-radius: 4px;
      cursor: pointer;
      font-family: 'Outfit', sans-serif;
    }
    @media print {
      .btn-print {
        display: none;
      }
      body {
        background-color: #ffffff;
        color: #000000;
      }
      .cert-container {
        border-color: #000000;
        box-shadow: none;
        background: #ffffff;
      }
      .name {
        color: #000000;
        border-bottom-color: #000000;
      }
      .desc {
        color: #333333;
      }
      .course {
        color: #000000;
      }
      .sign-val, .date-val {
        color: #000000;
      }
    }
  </style>
</head>
<body>
  <div class="cert-container">
    <div class="watermark">PASSED</div>
    
    <div class="header">
      <div class="logo">Drawdown.</div>
      <div class="title">Certificate of Completion</div>
    </div>
    
    <div class="content">
      <div class="recipient-label">This is awarded to</div>
      <div class="name">${name}</div>
      <div class="desc">
        for successfully passing all evaluations, quizzes, and modules of the
        <span class="course">${course.title}</span> program.
      </div>
    </div>
    
    <div class="footer">
      <div class="sign-block">
        <div class="date-val">${date}</div>
        <div class="sign-title">Date Completed</div>
      </div>
      
      <div class="sign-block">
        <div class="sign-val">Pete Currey</div>
        <div class="sign-title">Founder, Drawdown</div>
      </div>
    </div>
  </div>

  <button class="btn-print" onclick="window.print()">Print Certificate</button>
</body>
</html>
    `;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
}
