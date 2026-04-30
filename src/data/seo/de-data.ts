export const BEST_OF_PAGES_DE = [
  {
    slug: "forex-broker-deutschland",
    eyebrow: "TRADING GATEWAYS // DEUTSCHLAND",
    title: "Beste Forex-Broker in Deutschland 2026",
    metaDescription: "Vergleichen Sie die besten BaFin-regulierten Forex-Broker in Deutschland. Expertenbewertungen von IG, Interactive Brokers und XTB.",
    lastUpdated: "APRIL 2026",
    introduction: "Deutsche Trader genießen den Schutz der BaFin und ESMA-Richtlinien. Die Wahl eines regulierten Brokers ist entscheidend für die Sicherheit Ihrer Einlagen.",
    methodology: "Wir haben Broker nach BaFin-Regulierung, Einlagensicherung und Supportqualität in deutscher Sprache bewertet.",
    comparisonTable: [
      { rank: 1, name: "IG Deutschland", bestFor: "Gesamtpaket", keyStat: "BaFin Reguliert", rating: 4.9, link: "/go/ig-markets" },
      { rank: 2, name: "Interactive Brokers", bestFor: "Profis", keyStat: "Niedrige Kosten", rating: 4.8, link: "https://ibkr.de" },
      { rank: 3, name: "XTB", bestFor: "Bildung", keyStat: "0% Kommission", rating: 4.7, link: "/go/xtb" },
    ],
    reviews: [
      {
        name: "IG Deutschland",
        description: "IG ist einer der traditionsreichsten Broker am deutschen Markt mit einer starken Präsenz in Frankfurt.",
        pros: ["BaFin Reguliert", "Hervorragende Plattform", "Große Auswahl", "Deutscher Support"],
        cons: ["Höhere Spreads bei manchen Paaren"],
        bestFor: "ERFAHRENE TRADER",
        ctaLink: "/go/ig-markets"
      }
    ],
    faqs: [
      { question: "Ist Forex-Trading in Deutschland legal?", answer: "Ja, es ist legal und wird durch die BaFin und ESMA-Richtlinien reguliert." }
    ]
  }
];

export const HOW_TO_PAGES_DE = [
  {
    slug: "trading-starten-deutschland",
    eyebrow: "ERSTE SCHRITTE // DEUTSCHLAND",
    title: "Wie man 2026 in Deutschland mit dem Trading beginnt",
    metaDescription: "Schritt-für-Schritt-Anleitung für den Start an den Finanzmärkten in Deutschland. BaFin-Regeln und Steuern erklärt.",
    lastUpdated: "APRIL 2026",
    introduction: "Der Start in Deutschland erfordert ein Verständnis der regulatorischen Rahmenbedingungen und der steuerlichen Behandlung von Kapitalerträgen.",
    steps: [
      { title: "Broker-Wahl", content: "Wählen Sie einen Broker mit BaFin-Regulierung oder einer EU-weiten Lizenz gemäß MiFID II." },
      { title: "Abgeltungssteuer verstehen", content: "In Deutschland wird auf Gewinne eine Abgeltungssteuer von 25% plus Solidaritätszuschlag fällig." },
      { title: "Risikomanagement", content: "Nutzen Sie Stop-Loss-Orders, um Ihr Kapital gemäß den ESMA-Vorgaben zu schützen." },
    ],
    faqs: [
      { question: "Muss ich meine Gewinne versteuern?", answer: "Ja, Trading-Gewinne unterliegen in Deutschland der Kapitalertragsteuer." }
    ]
  }
];

export const COMPARE_PAGES_DE = [
  {
    slug: "ig-vs-xtb",
    eyebrow: "BROKER DUELL // DEUTSCHLAND",
    title: "IG vs XTB: Welcher Broker ist besser?",
    metaDescription: "Ein direkter Vergleich der zwei größten Broker in Deutschland. Wir vergleichen Plattformen, Gebühren und Support.",
    lastUpdated: "APRIL 2026",
    introduction: "IG und XTB sind führende Anbieter am deutschen Markt. Während IG durch Tiefe überzeugt, punktet XTB durch einfache Bedienung.",
    comparisonMatrix: [
      { feature: "Regulierung", b1: "BaFin / FCA", b2: "BaFin / KNF" },
      { feature: "Deutschsprachiger Support", b1: "Exzellent", b2: "Gut" },
      { feature: "Mobil-App", b1: "Weltklasse", b2: "Sehr intuitiv" },
    ],
    verdict: "IG ist die bessere Wahl für Profis. XTB eignet sich hervorragend für Einsteiger, die eine kostenlose Depotführung suchen."
  }
];

export const DE_CITIES = [
  "berlin", "frankfurt", "muenchen", "hamburg", "koeln", "stuttgart", "duesseldorf"
];

export const DE_TOPICS = [
  "forex-trading", "aktien-trading", "optionen-trading", "day-trading"
];

export const CITY_CONTEXT_DE: Record<string, string> = {
  frankfurt: "Frankfurt ist das Finanzzentrum Deutschlands. Hier fordern Trader höchste Ausführungsgeschwindigkeiten.",
  berlin: "Die Berliner Trading-Szene ist geprägt von Innovation und einem starken Fokus auf Technologie.",
};

export const TOPIC_DISPLAY_DE: Record<string, string> = {
  "forex-trading": "Forex-Trading",
  "aktien-trading": "Aktien-Trading",
  "optionen-trading": "Optionen-Trading",
  "day-trading": "Day-Trading",
};
