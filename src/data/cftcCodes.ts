export interface CFTCContract { code: string; name: string; category: "forex" | "commodity"; }
export const CFTC_CODES: Record<string, CFTCContract> = {
  EURUSD: { code:"099741", name:"EURO FX",       category:"forex"     },
  GBPUSD: { code:"096742", name:"BRITISH POUND", category:"forex"     },
  USDJPY: { code:"097741", name:"JAPANESE YEN",  category:"forex"     },
  GBPJPY: { code:"096742", name:"BRITISH POUND", category:"forex"     },
  XAGUSD: { code:"084691", name:"SILVER",        category:"commodity" },
};
