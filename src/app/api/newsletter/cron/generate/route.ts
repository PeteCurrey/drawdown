import { NextRequest, NextResponse } from "next/server";
import { generateNewsletterEdition } from "@/lib/newsletter/generation";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') as 'daily' | 'weekend';

  if (!type) return new NextResponse('Type required', { status: 400 });

  try {
    const editionId = await generateNewsletterEdition(type);
    console.log(`[CRON] Generated ${type} edition: ${editionId}`);
    return NextResponse.json({ success: true, editionId });
  } catch (error) {
    console.error(`[CRON] Generation failed for ${type}:`, error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
