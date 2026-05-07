export type Tier = 'SS' | 'S' | 'A' | 'B' | 'C';

export interface Character {
  id: string;
  name: string;
  tier: Tier;
  element: string;
  weapon: string;
  imageUrl: string;
  stars: number;
  roles: string[];
  strengths: string[];
  weaknesses: string[];
  bestWith: string[];
  bestWeapons?: string[];
  bestEchoes?: string[];
}

export const mockCharacters: Character[] = [
  {
    id: 'hiyuki',
    name: 'Hiyuki',
    tier: 'SS',
    element: 'Glacio',
    weapon: 'Sword',
    imageUrl: 'https://res.cloudinary.com/ds6dwbk37/image/upload/v1775460610/Hiyuki_Card_cmwra3.webp',
    stars: 5,
    roles: ['Main DPS', 'Burst'],
    strengths: [
      'Incredible single-target damage',
      'High burst potential',
      'Excellent scaling',
      'Strong synergy with Glacio units'
    ],
    weaknesses: [
      'Requires high investment',
      'Low AoE damage',
      'Energy hungry'
    ],
    bestWith: ['verina', 'sanhua', 'baizhi'],
    bestWeapons: ['Emerald of Genesis', 'Commando of Conviction'],
    bestEchoes: ['Freezing Frost (43311)']
  },
  {
    id: 'yinlin',
    name: 'Yinlin',
    tier: 'SS',
    element: 'Electro',
    weapon: 'Rectifier',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200&q=80',
    stars: 5,
    roles: ['Sub DPS', 'Support'],
    strengths: ['Great off-field damage', 'Buffs team Electro DMG', 'Excellent AoE'],
    weaknesses: ['Squishy', 'Long rotation time'],
    bestWith: ['calcharo', 'verina'],
    bestWeapons: ['Stringmaster', 'Augment'],
    bestEchoes: ['Void Thunder (43311)']
  },
  {
    id: 'verina',
    name: 'Verina',
    tier: 'SS',
    element: 'Spectro',
    weapon: 'Rectifier',
    imageUrl: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=200&q=80',
    stars: 5,
    roles: ['Support'],
    strengths: ['Best healer', 'Universal ATK buff', 'Cheat death mechanic'],
    weaknesses: ['Low personal damage'],
    bestWith: ['hiyuki', 'calcharo', 'jiyan', 'encore'],
    bestWeapons: ['Variation', 'Rectifier#25'],
    bestEchoes: ['Rejuvenating Glow (43311)']
  },
  {
    id: 'jiyan',
    name: 'Jiyan',
    tier: 'S',
    element: 'Aero',
    weapon: 'Broadblade',
    imageUrl: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=200&q=80',
    stars: 5,
    roles: ['Main DPS'],
    strengths: ['Massive AoE damage', 'Groups enemies', 'Easy to play'],
    weaknesses: ['Relies heavily on Ultimate'],
    bestWith: ['mortefi', 'verina'],
    bestWeapons: ['Verdant Summit', 'Autumntrace'],
    bestEchoes: ['Sierra Gale (43311)']
  },
  {
    id: 'encore',
    name: 'Encore',
    tier: 'S',
    element: 'Fusion',
    weapon: 'Rectifier',
    imageUrl: 'https://images.unsplash.com/photo-1504333638930-c8787321efa0?w=200&q=80',
    stars: 5,
    roles: ['Main DPS'],
    strengths: ['High sustained single target', 'Ranged safety', 'Burst damage'],
    weaknesses: ['Locked in place during attacks'],
    bestWith: ['sanhua', 'verina'],
    bestWeapons: ['Cosmic Ripples', 'Augment'],
    bestEchoes: ['Molten Rift (43311)']
  },
  {
    id: 'calcharo',
    name: 'Calcharo',
    tier: 'S',
    element: 'Electro',
    weapon: 'Broadblade',
    imageUrl: 'https://res.cloudinary.com/ds6dwbk37/image/upload/v1775451403/Calcharo_Card_zkgu44.webp',
    stars: 5,
    roles: ['Main DPS'],
    strengths: ['High burst potential with Ultimate', 'Fast attack speed'],
    weaknesses: ['Complex combo execution', 'Easily interrupted'],
    bestWith: ['yinlin', 'verina'],
    bestWeapons: ['Verdant Summit', 'Broadblade#41'],
    bestEchoes: ['Void Thunder (43311)']
  },
  {
    id: 'mortefi',
    name: 'Mortefi',
    tier: 'A',
    element: 'Fusion',
    weapon: 'Pistols',
    imageUrl: 'https://images.unsplash.com/photo-1508182314998-3bd49473002f?w=200&q=80',
    stars: 4,
    roles: ['Sub DPS', 'Support'],
    strengths: ['Great off-field Coord damage', 'Heavy Attack buff'],
    weaknesses: ['Requires high resonance'],
    bestWith: ['jiyan', 'verina'],
    bestWeapons: ['Static Mist', 'Novaburst'],
    bestEchoes: ['Moonlit Clouds (43311)']
  },
  {
    id: 'sanhua',
    name: 'Sanhua',
    tier: 'A',
    element: 'Glacio',
    weapon: 'Sword',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&q=80',
    stars: 4,
    roles: ['Sub DPS', 'Support'],
    strengths: ['Fast rotations', 'Basic Attack buff', 'Glacio burst'],
    weaknesses: ['Requires precise timing'],
    bestWith: ['encore', 'hiyuki', 'verina'],
    bestWeapons: ['Emerald of Genesis', 'Commando of Conviction'],
    bestEchoes: ['Moonlit Clouds (43311)']
  },
  {
    id: 'baizhi',
    name: 'Baizhi',
    tier: 'B',
    element: 'Glacio',
    weapon: 'Rectifier',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&q=80',
    stars: 4,
    roles: ['Support'],
    strengths: ['F2P healer', 'Decent buffs'],
    weaknesses: ['Slow animations', 'Outclassed by Verina'],
    bestWith: ['hiyuki', 'calcharo'],
    bestWeapons: ['Variation', 'Rectifier#25'],
    bestEchoes: ['Rejuvenating Glow (43311)']
  }
];

export const tiersConfig = [
  { id: 'SS', title: 'OVERPOWERED', desc: 'Exceptional performance. Defining the meta.', color: '#FF4D4D' },
  { id: 'S', title: 'EXCELLENT', desc: 'Very strong characters. Great in most teams.', color: '#FF7A4D' },
  { id: 'A', title: 'GOOD', desc: 'Solid picks with situational strengths.', color: '#C084FC' },
  { id: 'B', title: 'AVERAGE', desc: 'Decent in specific teams or early game content.', color: '#60A5FA' },
  { id: 'C', title: 'BELOW AVERAGE', desc: 'Limited usability. Require significant investment.', color: '#4ADE80' }
];
