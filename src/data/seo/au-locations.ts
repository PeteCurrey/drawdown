export interface AuLocation {
  slug: string;
  name: string;
  context: string;
}

export const AU_LOCATIONS: AuLocation[] = [
  {
    slug: 'sydney',
    name: 'Sydney',
    context: 'The financial heart of Australia, home to the ASX and Australia\'s major banking institutions.'
  },
  {
    slug: 'melbourne',
    name: 'Melbourne',
    context: 'Australia\'s tech and fintech hub, with a vibrant community of independent and institutional traders.'
  },
  {
    slug: 'brisbane',
    name: 'Brisbane',
    context: 'A growing trading community with a focus on commodities and regional market analysis.'
  },
  {
    slug: 'perth',
    name: 'Perth',
    context: 'The gateway to Asian market hours, Perth traders enjoy a unique time-zone advantage for global FX.'
  },
  {
    slug: 'adelaide',
    name: 'Adelaide',
    context: 'Home to a resilient and focused community of retail and professional prop traders.'
  },
  {
    slug: 'gold-coast',
    name: 'Gold Coast',
    context: 'A thriving hub for remote traders and digital nomads seeking a balanced lifestyle with institutional edge.'
  },
  {
    slug: 'canberra',
    name: 'Canberra',
    context: 'Where policy meets the markets; a unique environment for fundamental and macro analysis.'
  },
  {
    slug: 'hobart',
    name: 'Hobart',
    context: 'A focused and disciplined trading community proving that location is no barrier to global markets.'
  }
];
