// src/app/api/lobby/preferences/follow/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createInternalSupabase } from "@/lib/supabase/server";
import { getUserPreferences, saveUserPreferences } from "@/lib/lobby-personalisation";
import type { UserLobbyPreferences } from "@/types/lobby-personalisation";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createInternalSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { entityType, entityName, follow } = body;

    if (!entityType || !entityName) {
      return NextResponse.json({ error: "entityType and entityName are required" }, { status: 400 });
    }

    const currentPrefs = await getUserPreferences(user.id);
    
    // Map entityType to preference field
    let field: keyof UserLobbyPreferences = 'followed_categories';
    if (entityType === 'market') field = 'followed_markets';
    else if (entityType === 'broker') field = 'followed_brokers';
    else if (entityType === 'prop_firm') field = 'followed_prop_firms';
    else if (entityType === 'platform') field = 'followed_platforms';
    else if (entityType === 'category') field = 'followed_categories';
    else if (entityType === 'tool') field = 'followed_tools';

    const currentList = (currentPrefs[field] as string[]) || [];
    let updatedList: string[];

    if (follow) {
      if (!currentList.includes(entityName)) {
        updatedList = [...currentList, entityName];
      } else {
        updatedList = currentList;
      }
    } else {
      updatedList = currentList.filter((item: string) => item !== entityName);
    }

    await saveUserPreferences(user.id, {
      [field]: updatedList
    });

    return NextResponse.json({ success: true, following: follow, list: updatedList });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update follow preference" }, { status: 500 });
  }
}
