const MONTH_THEMES = [
  {
    monthIndex: 0,
    name: 'January',
    season: 'Winter / reset',
    accent: '#5477ff',
    accentSoft: '#dce5ff',
    accentStrong: '#2841d9',
    paper: '#f8fbff',
    paperStrong: '#edf4ff',
    ink: '#13213d',
    muted: '#61708a',
    surface: '#ffffff',
    border: '#d8e2f1',
    glow: 'rgba(84, 119, 255, 0.18)',
    mood: 'Crisp blue light and quiet momentum.'
  },
  {
    monthIndex: 1,
    name: 'February',
    season: 'Late winter / bloom',
    accent: '#d85c7d',
    accentSoft: '#ffe1ea',
    accentStrong: '#b53c61',
    paper: '#fff8fb',
    paperStrong: '#fae8ef',
    ink: '#31131f',
    muted: '#76525f',
    surface: '#fffdfd',
    border: '#efd8df',
    glow: 'rgba(216, 92, 125, 0.18)',
    mood: 'Warm blush tones with a quiet, romantic edge.'
  },
  {
    monthIndex: 2,
    name: 'March',
    season: 'Early spring / lift',
    accent: '#4ea989',
    accentSoft: '#dbf3ea',
    accentStrong: '#26795c',
    paper: '#f8fffc',
    paperStrong: '#e8f8f2',
    ink: '#10261f',
    muted: '#5a746a',
    surface: '#fbfffd',
    border: '#d7ebe2',
    glow: 'rgba(78, 169, 137, 0.18)',
    mood: 'Fresh green watercolors and a little momentum.'
  },
  {
    monthIndex: 3,
    name: 'April',
    season: 'Spring / renewal',
    accent: '#4f8cff',
    accentSoft: '#dce9ff',
    accentStrong: '#2568e7',
    paper: '#f9fbff',
    paperStrong: '#eaf1ff',
    ink: '#112042',
    muted: '#5c6e8a',
    surface: '#ffffff',
    border: '#d6e2f4',
    glow: 'rgba(79, 140, 255, 0.18)',
    mood: 'Open sky blues with soft petals and clear planning.'
  },
  {
    monthIndex: 4,
    name: 'May',
    season: 'Spring / peak bloom',
    accent: '#8e6cf8',
    accentSoft: '#e9e0ff',
    accentStrong: '#6d47e8',
    paper: '#fbfaff',
    paperStrong: '#f0ebff',
    ink: '#1f1738',
    muted: '#6d6591',
    surface: '#ffffff',
    border: '#e1dbf3',
    glow: 'rgba(142, 108, 248, 0.18)',
    mood: 'Elegant violet light with a softer editorial feel.'
  },
  {
    monthIndex: 5,
    name: 'June',
    season: 'Early summer / coast',
    accent: '#1b9db2',
    accentSoft: '#d9f3f7',
    accentStrong: '#127384',
    paper: '#f7fefe',
    paperStrong: '#e5f8fb',
    ink: '#10262d',
    muted: '#56707a',
    surface: '#ffffff',
    border: '#d4eaef',
    glow: 'rgba(27, 157, 178, 0.18)',
    mood: 'Cool water and sea-glass notes for long days.'
  },
  {
    monthIndex: 6,
    name: 'July',
    season: 'Summer / heat',
    accent: '#f06b4f',
    accentSoft: '#ffe1d7',
    accentStrong: '#d34f33',
    paper: '#fffaf8',
    paperStrong: '#ffece5',
    ink: '#33150e',
    muted: '#81584f',
    surface: '#fffdfc',
    border: '#f0d8d0',
    glow: 'rgba(240, 107, 79, 0.18)',
    mood: 'Sunset reds and warm paper texture.'
  },
  {
    monthIndex: 7,
    name: 'August',
    season: 'Late summer / meadow',
    accent: '#d2a637',
    accentSoft: '#f4e5bf',
    accentStrong: '#aa7f19',
    paper: '#fffdf6',
    paperStrong: '#f8efd4',
    ink: '#2e230e',
    muted: '#72613b',
    surface: '#fffdfa',
    border: '#e8dbc0',
    glow: 'rgba(210, 166, 55, 0.18)',
    mood: 'Golden fields and a slightly slower pace.'
  },
  {
    monthIndex: 8,
    name: 'September',
    season: 'Transition / amber',
    accent: '#cb6d3b',
    accentSoft: '#f6dfcf',
    accentStrong: '#a04f22',
    paper: '#fffaf8',
    paperStrong: '#f8e8dd',
    ink: '#2c160c',
    muted: '#7d5f53',
    surface: '#fffdfd',
    border: '#ecd4c7',
    glow: 'rgba(203, 109, 59, 0.18)',
    mood: 'Warm terraces, baked clay, and sharper focus.'
  },
  {
    monthIndex: 9,
    name: 'October',
    season: 'Autumn / harvest',
    accent: '#a75e2b',
    accentSoft: '#f4dfc9',
    accentStrong: '#7d4317',
    paper: '#fffaf6',
    paperStrong: '#f7e5d3',
    ink: '#2b180d',
    muted: '#775c4b',
    surface: '#fffdfb',
    border: '#e8d2bf',
    glow: 'rgba(167, 94, 43, 0.18)',
    mood: 'Harvest tones with a refined, editorial contrast.'
  },
  {
    monthIndex: 10,
    name: 'November',
    season: 'Late autumn / dusk',
    accent: '#6a7ca8',
    accentSoft: '#dee5f4',
    accentStrong: '#42598b',
    paper: '#f8fbff',
    paperStrong: '#e8eef7',
    ink: '#141d30',
    muted: '#5d6983',
    surface: '#ffffff',
    border: '#d9e0eb',
    glow: 'rgba(106, 124, 168, 0.18)',
    mood: 'Muted blue-gray tones with a calm, crisp edge.'
  },
  {
    monthIndex: 11,
    name: 'December',
    season: 'Winter / glow',
    accent: '#1f8bbd',
    accentSoft: '#d9f0fb',
    accentStrong: '#15658b',
    paper: '#f7fdff',
    paperStrong: '#e2f4fd',
    ink: '#0f2233',
    muted: '#557085',
    surface: '#ffffff',
    border: '#d6e7f1',
    glow: 'rgba(31, 139, 189, 0.18)',
    mood: 'Frosted blue light with a softly festive glow.'
  }
];

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function buildHeroArt(theme) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1200" role="img" aria-label="${escapeXml(theme.name)} abstract artwork">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${theme.accentStrong}" />
          <stop offset="50%" stop-color="${theme.accent}" />
          <stop offset="100%" stop-color="${theme.paper}" />
        </linearGradient>
        <radialGradient id="orb" cx="50%" cy="30%" r="65%">
          <stop offset="0%" stop-color="${theme.paper}" stop-opacity="0.85" />
          <stop offset="55%" stop-color="${theme.paper}" stop-opacity="0.15" />
          <stop offset="100%" stop-color="${theme.paper}" stop-opacity="0" />
        </radialGradient>
        <filter id="blur"><feGaussianBlur stdDeviation="22" /></filter>
      </defs>
      <rect width="1600" height="1200" fill="url(#bg)" />
      <rect width="1600" height="1200" fill="${theme.ink}" opacity="0.06" />
      <circle cx="200" cy="140" r="260" fill="url(#orb)" filter="url(#blur)" />
      <circle cx="1300" cy="280" r="300" fill="${theme.paper}" opacity="0.18" filter="url(#blur)" />
      <circle cx="1100" cy="900" r="280" fill="${theme.paper}" opacity="0.14" filter="url(#blur)" />
      <path d="M-80 880C240 720 380 560 540 460s400-140 580-50 260 260 430 310 300 10 400-80v480H-80Z" fill="${theme.paper}" opacity="0.14" />
      <path d="M-60 700C200 600 400 440 560 340s360-130 520-60 280 230 460 280 320 15 410-50v410H-60Z" fill="${theme.paper}" opacity="0.1" />
      <g opacity="0.18">
        <circle cx="280" cy="860" r="90" fill="${theme.paper}" />
        <circle cx="1040" cy="720" r="150" fill="${theme.paper}" />
        <circle cx="620" cy="320" r="120" fill="${theme.paper}" />
      </g>
      <g fill="none" stroke="${theme.paper}" stroke-opacity="0.15" stroke-width="3">
        <path d="M140 180c130 40 200 110 260 220" />
        <path d="M1100 150c80 100 120 190 130 300" />
      </g>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export const MONTH_THEME_MAP = MONTH_THEMES.map((theme) => ({
  ...theme,
  heroArt: buildHeroArt(theme)
}));

export function getMonthTheme(monthIndex) {
  return MONTH_THEME_MAP[monthIndex % 12];
}
