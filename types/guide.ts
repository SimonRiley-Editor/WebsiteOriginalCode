/** A single event block on the rotation timeline. */
export interface TeamRotationEvent {
  id: string;
  characterSlot: 1 | 2 | 3;
  characterName: string;
  avatarUrl?: string;
  type: 'intro' | 'skill' | 'ultimate' | 'outro' | 'echo';
  startTime: number;   // seconds from 0
  duration: number;     // seconds
  color?: string;       // optional override for block color
  label?: string;       // optional short label displayed on block
}

/** Configuration for the full rotation timeline. */
export interface RotationConfig {
  totalDuration: number; // seconds
  events: TeamRotationEvent[];
  slotNames?: [string, string, string]; // e.g. ["Hiyuki (Main)", "Zhezhi (Sub)", "Verina (Support)"]
}

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
  rotation_timeline?: RotationConfig;
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
