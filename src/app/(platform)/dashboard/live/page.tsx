"use client";

import Link from "next/link";
import { ArrowRight, Video } from "lucide-react";

export default function LiveSessionsPage() {
  return (
    <div className="max-w-2xl mx-auto py-24 px-4 animate-in fade-in duration-700 text-center">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-accent/10 border border-accent/20 rounded-full text-accent">
          <Video className="w-8 h-8" />
        </div>
      </div>
      <h1 className="text-3xl font-display font-bold uppercase tracking-tight text-text-primary mb-4">
        Live Sessions — Coming Soon
      </h1>
      <p className="text-text-secondary text-sm leading-relaxed mb-8 max-w-lg mx-auto">
        Live group sessions, interactive order flow breakdowns, and real-time market walkthroughs are currently in development. In the meantime, you can view and register for scheduled webinars and educational calendar events in our events center.
      </p>
      <Link 
        href="/dashboard/events"
        className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-background-primary text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity rounded-lg"
      >
        Go to Events <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
