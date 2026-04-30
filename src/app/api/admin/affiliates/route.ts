import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();

  const { data: link, error } = await supabase
    .from('affiliate_links')
    .insert({
      slug: body.slug,
      display_name: body.display_name,
      type: body.type,
      destination_url: body.destination_url,
      commission_type: body.commission_type || null,
      commission_detail: body.commission_detail || null,
      notes: body.notes || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ link });
}

export async function PUT(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();
  const { id, ...update } = body;

  const { error } = await supabase
    .from('affiliate_links')
    .update({
      slug: update.slug,
      display_name: update.display_name,
      type: update.type,
      destination_url: update.destination_url,
      commission_type: update.commission_type || null,
      commission_detail: update.commission_detail || null,
      notes: update.notes || null,
    })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { id, is_active } = await req.json();

  const { error } = await supabase
    .from('affiliate_links')
    .update({ is_active })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
