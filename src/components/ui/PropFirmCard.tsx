import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { PropFirm } from "@/data/prop-firms";
import { motion } from "framer-motion";

interface PropFirmCardProps {
  firm: PropFirm;
  source?: string;
  isPetesPick?: boolean;
}

export function PropFirmCard({ firm, source = "prop_firm_card", isPetesPick }: PropFirmCardProps) {
  return (
    <motion.div 
      className="bg-white border border-neutral-100 rounded-xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-neutral-200 transition-all duration-200 relative"
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      {isPetesPick && (
        <div className="absolute -top-3 left-6 px-2.5 py-0.5 bg-black text-white text-[9px] font-bold uppercase tracking-widest rounded-full z-10 border border-neutral-850">
          Top Pick
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="w-10 h-10 flex items-center justify-center bg-neutral-50 border border-neutral-200/50 rounded-lg">
             <span className="font-sans font-bold text-neutral-900 text-base">{firm.name.substring(0, 2).toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-1 text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={cn(
                  "w-3 h-3",
                  i < Math.floor(firm.rating) ? "fill-amber-500 text-amber-500" : "text-neutral-250"
                )} 
              />
            ))}
          </div>
        </div>

        <h3 className="text-xl font-sans font-bold uppercase text-[#0A0A0A] mb-1">{firm.name}</h3>
        <p className="text-xs font-sans text-neutral-500 uppercase tracking-widest font-semibold mb-6">
          {firm.profitSplit} Profit Split // {firm.maxFunding} Max
        </p>
        
        <div className="py-3 border-y border-neutral-100 mb-6 space-y-1">
          <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Entry Fee</p>
          <p className="text-sm font-mono text-[#0A0A0A] font-bold">{firm.challengeFee}</p>
        </div>

        <ul className="space-y-2.5 mb-8">
          {firm.pros.slice(0, 3).map((pro, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-neutral-600 font-sans">
              <span className="text-green-600 font-bold">✓</span> {pro}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2 mt-2">
        <a href={`/go/${firm.slug}`}
          className="w-full bg-black hover:bg-neutral-800 text-white rounded-lg py-2.5 text-sm font-medium text-center transition-colors font-sans flex items-center justify-center gap-2"
         rel="sponsored">
          Start Challenge &rarr;
        </a>
        <a 
          href={`/prop-firms/${firm.slug}`}
          className="w-full border border-neutral-200 hover:border-neutral-900 text-neutral-600 hover:text-black rounded-lg py-2.5 text-sm font-medium text-center transition-colors font-sans flex items-center justify-center gap-2"
        >
          Read Full Review
        </a>
      </div>
    </motion.div>
  );
}
