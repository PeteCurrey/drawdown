"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

export default function CalEmbed({ calLink, name, email, userId }: { calLink: string, name: string, email: string, userId: string }) {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        styles: { branding: { brandColor: "#000000" } },
        hideEventTypeDetails: false,
        layout: "month_view"
      });
    })();
  }, []);

  return (
    <div className="w-full h-full min-h-[600px] overflow-hidden rounded-xl border border-[#e5e7eb]">
      <Cal 
        calLink={calLink}
        style={{ width: "100%", height: "100%", overflow: "scroll" }}
        config={{
          name: name,
          email: email,
          metadata: {
            userId: userId
          }
        }}
      />
    </div>
  );
}
