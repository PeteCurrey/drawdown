import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { WaitlistForm } from "@/components/waitlist/WaitlistForm";

export default function WaitlistPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-1 flex items-center justify-center pt-24 pb-16">
        <div className="max-w-md w-full px-6 text-center space-y-6">
          <div>
            <span className="text-[11px] font-sans font-bold text-mkt-i4 uppercase tracking-widest block mb-4">
              // CAPACITY REACHED
            </span>
            <h1 className="text-3xl md:text-4xl font-sans font-extrabold text-mkt-ink tracking-tight mb-4">
              The Floor is currently at capacity.
            </h1>
            <p className="text-sm text-mkt-i3 font-sans leading-relaxed">
              To ensure the quality of 1-to-1 mentorship, we strictly cap the number of active Floor members. Enter your details below to join the waitlist. We will notify you when a spot opens up.
            </p>
          </div>

          <div className="bg-white border border-mkt-bd rounded-xl p-8 shadow-sm">
            <WaitlistForm tier="floor" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
