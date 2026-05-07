export interface GuideContent {
  quote: string;
  description: string;
  cardImage?: string;
  roleIcon?: string;
  images: {
    splash: string;
    avatar: string;
  };
  combatMechanics: {
    id: string;
    name: string;
    type: string;
    description: string;
    icon: string; // e.g., "Sword", "Snowflake"
  }[];
  weapons: {
    name: string;
    rarity: 3 | 4 | 5;
    type: string;
    description: string;
    passiveName: string;
    passiveDescription: string;
    baseAtk: number;
    secondaryStat: string;
    secondaryStatValue: string;
    bestFor?: string;
    isBis?: boolean;
    weaponType?: string;
    isSignature?: boolean;
    specialNote?: string;
  }[];
  echoes?: any;
  echoSets?: {
    name?: string;
    mainSet: string;
    mainSetDescription: string;
    erRequirement?: string;
    cost4: string[];
    cost4Name?: string;
    cost4Description?: string;
    cost3: string[];
    cost3Name?: string;
    cost1: string[];
    cost1Name?: string;
    substats?: { stat: string; priority: string }[];
  }[];
}

export interface Guide {
  id?: string;
  slug: string;
  name: string;
  element: string;
  weapon_type: string;
  rarity: number;
  role: string;
  content: GuideContent;
  created_at?: string;
  updated_at?: string;
}
