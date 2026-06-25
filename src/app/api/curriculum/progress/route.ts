import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { phases } from '@/data/courses';

export async function POST(request: Request) {
  try {
    const authClient = await createServerClient();
    const { data: { user } } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { phase_slug, module_number, quiz_score, quiz_passed } = await request.json();

    if (!phase_slug || typeof module_number !== 'number') {
      return NextResponse.json({ error: 'Missing phase_slug or module_number' }, { status: 400 });
    }

    const phaseConfig = phases.find(p => p.slug === phase_slug);
    if (!phaseConfig) {
      return NextResponse.json({ error: 'Invalid phase slug' }, { status: 400 });
    }

    // Initialize service role client to bypass RLS for inserting certificates if needed
    // or just course_progress update
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Update course progress
    const { error: upsertError } = await supabaseAdmin
      .from('course_progress')
      .upsert({
        user_id: user.id,
        phase: parseInt(phaseConfig.number, 10),
        module: module_number,
        completed: quiz_passed, // Mark completed if passed
        quiz_score: quiz_score,
        quiz_passed: quiz_passed,
        completed_at: quiz_passed ? new Date().toISOString() : null,
      }, { onConflict: 'user_id,phase,module' });

    if (upsertError) {
      console.error("Error upserting progress:", upsertError);
      return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 });
    }

    let certificateIssued = false;

    // 2. If completed, check if all modules in this phase are complete
    if (quiz_passed) {
      const { data: progressRows } = await supabaseAdmin
        .from('course_progress')
        .select('module')
        .eq('user_id', user.id)
        .eq('phase', parseInt(phaseConfig.number, 10))
        .eq('completed', true);

      const completedModules = progressRows ? progressRows.length : 0;
      
      if (completedModules >= phaseConfig.modules_count) {
        // Issue Certificate
        // Check if one already exists
        const { data: existingCert } = await supabaseAdmin
          .from('certificates')
          .select('id')
          .eq('user_id', user.id)
          .eq('phase_slug', phase_slug)
          .single();

        if (!existingCert) {
          // Generate Cert ID: DDT-[PHASE]-YYYY-[RANDOM4]
          const phasePrefix = phase_slug.split('-').map(s => s[0].toUpperCase()).join('');
          const year = new Date().getFullYear();
          const random = Math.random().toString(36).substring(2, 6).toUpperCase();
          const certNumber = \`DDT-\${phasePrefix}-\${year}-\${random}\`;

          const { error: certError } = await supabaseAdmin
            .from('certificates')
            .insert({
              user_id: user.id,
              phase_slug: phase_slug,
              phase_name: phaseConfig.name,
              certificate_number: certNumber
            });

          if (!certError) {
            certificateIssued = true;
          } else {
            console.error("Error issuing certificate:", certError);
          }
        } else {
          certificateIssued = true; // Already issued previously
        }
      }
    }

    return NextResponse.json({ success: true, certificateIssued });

  } catch (error: any) {
    console.error('Curriculum Progress API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
