"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface TrackPageViewProps {
  path: string;
}

export function TrackPageView({ path }: TrackPageViewProps) {
  const supabase = createClient();

  useEffect(() => {
    const trackView = async () => {
      // Basic client-side deduplication using sessionStorage
      const sessionKey = `viewed_${path}`;
      if (sessionStorage.getItem(sessionKey)) return;

      try {
        await (supabase as any).rpc('increment_page_view', { page_path: path });
        sessionStorage.setItem(sessionKey, 'true');
      } catch (err) {
        console.error('Failed to track page view:', err);
      }
    };

    trackView();
  }, [path, supabase]);

  return null;
}
