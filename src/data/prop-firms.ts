export interface PropFirm {
  id: string;
  name: string;
  slug: string;
  logo: string;
  rating: number;
  challengeFee: string;
  profitSplit: string;
  maxFunding: string;
  isRegulated: boolean;
  pros: string[];
  cons: string[];
  affiliateUrl: string;
  verdict: string;
}

export const propFirms: PropFirm[] = [
  {
    id: "ftmo",
    name: "FTMO",
    slug: "ftmo",
    logo: "/prop-firms/ftmo.svg",
    rating: 4.9,
    challengeFee: "From €155",
    profitSplit: "Up to 90%",
    maxFunding: "$200,000",
    isRegulated: false,
    pros: ["Longest track record in the industry", "Very reliable payouts", "Excellent proprietary apps"],
    cons: ["Strict daily drawdown rules", "Higher challenge fees than competitors"],
    affiliateUrl: "/go/ftmo",
    verdict: "The gold standard for prop trading. If you can pass here, you're the real deal."
  },
  {
    id: "the5ers",
    name: "The5%ers",
    slug: "the5ers",
    logo: "/prop-firms/the5ers.svg",
    rating: 4.8,
    challengeFee: "From $39",
    profitSplit: "Up to 100%",
    maxFunding: "$4,000,000",
    isRegulated: false,
    pros: ["Unique hyper-growth scaling plan", "Low entry cost", "Real capital allocation (not just demo)"],
    cons: ["Scaling takes time", "Initial profit splits are lower"],
    affiliateUrl: "/go/the5ers",
    verdict: "Top Pick. The best choice for disciplined traders who want to scale into millions."
  },
  {
    id: "funding-pips",
    name: "Funding Pips",
    slug: "funding-pips",
    logo: "/prop-firms/funding-pips.svg",
    rating: 4.7,
    challengeFee: "From $32",
    profitSplit: "Up to 90%",
    maxFunding: "$100,000",
    isRegulated: false,
    pros: ["Most competitive pricing", "Simple rules", "Fast payout processing"],
    cons: ["Relatively new firm", "Smaller maximum funding per account"],
    affiliateUrl: "https://fundingpips.com",
    verdict: "The price leader. Great for those starting with limited capital."
  },
  {
    id: "myfundedfx",
    name: "MyFundedFX",
    slug: "myfundedfx",
    logo: "/prop-firms/myfundedfx.svg",
    rating: 4.6,
    challengeFee: "From $50",
    profitSplit: "80/20",
    maxFunding: "$300,000",
    isRegulated: false,
    pros: ["No time limits", "TradingView integration via Match-Trader", "Active community"],
    cons: ["Max drawdown is trailing on some accounts", "Spreads can be variable"],
    affiliateUrl: "https://myfundedfx.com",
    verdict: "A solid, community-driven firm with flexible rules."
  },
  {
    id: "topstep",
    name: "Topstep",
    slug: "topstep",
    logo: "/prop-firms/topstep.svg",
    rating: 4.8,
    challengeFee: "From $49/mo",
    profitSplit: "90/10",
    maxFunding: "$150,000",
    isRegulated: false,
    pros: ["Best for Futures traders", "Highly reputable", "Excellent education and community"],
    cons: ["Monthly subscription model", "Strict consistency rules"],
    affiliateUrl: "https://www.topstep.com",
    verdict: "The only choice for serious futures traders."
  },
  {
    id: "apex-trader-funding",
    name: "Apex Trader Funding",
    slug: "apex-trader-funding",
    logo: "/prop-firms/apex.svg",
    rating: 4.5,
    challengeFee: "From $147/mo",
    profitSplit: "90/10",
    maxFunding: "$300,000",
    isRegulated: false,
    pros: ["Incredible scaling for high volume", "Simple rules", "Often run massive sales (80-90% off)"],
    cons: ["Trailing drawdown in real-time", "Website is very legacy"],
    affiliateUrl: "https://apextraderfunding.com",
    verdict: "The volume king. Ideal for traders who want to manage multiple accounts."
  }
];
