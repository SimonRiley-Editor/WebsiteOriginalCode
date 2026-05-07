export const hiyukiSeedData = {
  slug: "hiyuki",
  name: "Hiyuki",
  element: "Glacio",
  weapon_type: "Sword",
  rarity: 5,
  role: "Main DPS",
  content: {
    quote: "The frost does not bite; it preserves. It is the world that is too fragile.",
    description: "An elite Glacio executioner who dictates the tempo of battle. Hiyuki shatters enemy lines with absolute zero precision, overwhelming them with a relentless cascade of deep-freeze strikes and tactical lock-downs. To be caught in her frost is to be erased.",
    cardImage: "https://res.cloudinary.com/ds6dwbk37/image/upload/v1775460610/Hiyuki_Card_cmwra3.webp",
    images: {
      splash: "https://res.cloudinary.com/ds6dwbk37/image/upload/v1775476358/Rover_Countdown_2026-02-03_lwyhwl.webp",
      avatar: "https://res.cloudinary.com/ds6dwbk37/image/upload/v1775476358/Rover_Countdown_2026-02-03_lwyhwl.webp"
    },
    spine: {
      skelUrl: "https://res.cloudinary.com/ds6dwbk37/raw/upload/v1777173287/Portraits_Feixue_kekcf3.skel",
      atlasUrl: "https://res.cloudinary.com/ds6dwbk37/raw/upload/v1777173287/Portraits_Feixue_iltaii.atlas",
      textures: [
        { name: "Portraits_Feixue.webp", url: "https://res.cloudinary.com/ds6dwbk37/image/upload/v1777173288/Portraits_Feixue_ihwgwn.webp" },
        { name: "Portraits_Feixue_2.webp", url: "https://res.cloudinary.com/ds6dwbk37/image/upload/v1777190831/Portraits_Feixue_2_q8dke1.png" }
      ],
      offset: {
        x: 0,
        y: 0,
        scale: 1.1
      }
    },
    kit: {
      basicAttack: {
        name: "Frostblade Dance",
        icon: "",
        description: "Perform up to 4 consecutive strikes, dealing Glacio DMG. The 4th strike applies 1 Frost Stack to the enemy.",
        video: "",
        skillInfo: [
          { label: "Skill Type", value: "Basic Attack" },
          { label: "DMG Type", value: "Basic Attack DMG" }
        ],
        levelScaling: [
          { label: "Stage 1 DMG", value: "45.2%" },
          { label: "Stage 2 DMG", value: "52.1%" },
          { label: "Stage 3 DMG", value: "68.5%" },
          { label: "Stage 4 DMG", value: "85.3%" }
        ],
        upgradePriority: 2,
        quickTip: "Use basic attacks as filler while waiting for your Resonance Skill cooldown."
      },
      resonanceSkill: {
        name: "Frostblight",
        icon: "",
        description: "Deal Glacio DMG.\nCasting this skill enhances the next Basic Attack - Present Self Stage 3, which now restores 100 points of Dedication when cast.\nSwitching to another Resonator ends this effect.\n\n※ Frostblight: Jade Cleave\nWhile on the ground, press Resonance Skill to pull in nearby targets and deal Glacio DMG, removing the targets' Frostbind.\n\n※ Frostblight: Petalfall\nIn the air, press Resonance Skill to plunge attack, dealing Glacio DMG, removing the targets' Frostbind.",
        video: "",
        videoStart: "0",
        videoEnd: "5",
        skillInfo: [
          { label: "Skill Type", value: "Resonance Skill" },
          { label: "Element", value: "Glacio" },
          { label: "DMG Type", value: "Skill DMG" },
          { label: "Forte Energy Regen", value: "20" },
          { label: "Cooldown", value: "12s" }
        ],
        levelScaling: [
          { label: "Skill DMG", value: "288.00%" },
          { label: "Jade Cleave DMG", value: "352.00%" },
          { label: "Petalfall DMG", value: "242.00%" },
          { label: "Forte Energy Regen", value: "20" },
          { label: "Cooldown", value: "12s" }
        ],
        upgradePriority: 5,
        quickTip: "Resonance Skills are key to dealing heavy damage and generating Forte Energy."
      },
      forteCircuit: {
        name: "Glacial Chafe",
        icon: "",
        description: "When Forte Energy is full, Heavy Attack consumes all Forte Energy to enter 'Absolute Zero' state.",
        video: "",
        skillInfo: [
          { label: "Skill Type", value: "Forte Circuit" },
          { label: "DMG Type", value: "Heavy Attack DMG" }
        ],
        levelScaling: [
          { label: "Absolute Zero DMG", value: "455.00%" }
        ],
        upgradePriority: 5,
        quickTip: "Manage your Forte Energy carefully to unleash your strongest combo."
      },
      resonanceLiberation: {
        name: "Absolute Zero Strike",
        icon: "",
        description: "Unleash a massive frost explosion dealing AoE Glacio DMG.",
        video: "",
        skillInfo: [
          { label: "Skill Type", value: "Resonance Liberation" },
          { label: "Energy Cost", value: "125" },
          { label: "Cooldown", value: "25s" }
        ],
        levelScaling: [
          { label: "Explosion DMG", value: "850.00%" }
        ],
        upgradePriority: 4,
        quickTip: "Use this when enemies are grouped up."
      },
      introSkill: {
        name: "Icebreaker",
        icon: "",
        description: "Deals Glacio DMG on entering the field.",
        video: "",
        skillInfo: [
          { label: "Skill Type", value: "Intro Skill" }
        ],
        levelScaling: [
          { label: "Intro DMG", value: "120.00%" }
        ],
        upgradePriority: 1,
        quickTip: "Basic entry."
      },
      outroSkill: {
        name: "Permafrost",
        icon: "",
        description: "Increases the next character's Glacio DMG by 20%.",
        video: "",
        skillInfo: [
          { label: "Skill Type", value: "Outro Skill" }
        ],
        levelScaling: [],
        upgradePriority: 1,
        quickTip: "Swap to another Glacio DPS if possible."
      }
    },
    combatMechanics: [
      {
        id: "basic",
        name: "Frostblade Dance",
        type: "Basic Attack",
        description: "Perform up to 4 consecutive strikes, dealing Glacio DMG. The 4th strike applies 1 Frost Stack to the enemy.",
        icon: "Sword"
      },
      {
        id: "skill",
        name: "Glacial Pierce",
        type: "Resonance Skill",
        description: "Dash forward and pierce enemies, dealing Glacio DMG. If the enemy has Frost Stacks, consume them to deal bonus damage and heal Hiyuki.",
        icon: "Snowflake"
      }
    ],
    weapons: [
      {
        name: "Emerald of Genesis",
        rarity: 5,
        type: "Sword",
        description: "A standard 5-star weapon often considered best-in-slot or second-best-in-slot for many sword users due to its high base attack and crit rate.",
        passiveName: "FRIGID BLADE",
        passiveDescription: "Increases Energy Regen. When the Resonance Skill is released, it increases ATK, which can be stacked up to 2 times.",
        baseAtk: 587,
        secondaryStat: "CRIT RATE",
        secondaryStatValue: "24.3%",
        isBis: true
      },
      {
        name: "Commando of Conviction",
        rarity: 4,
        type: "Sword",
        description: "A 4-star weapon designed to commemorate the Midnight Rangers' courage. It is a strong F2P-friendly, or 'budget' option.",
        passiveName: "UNYIELDING",
        passiveDescription: "When the Intro Skill is cast, it increases ATK by 15% (up to 30% at rank 5) for 15 seconds.",
        baseAtk: 412,
        secondaryStat: "ATK%",
        secondaryStatValue: "30.3%",
        bestFor: "Characters who rely on frequent character switching."
      }
    ],
    echoSets: [{
      name: "Standard Best",
      mainSet: "Freezing Frost",
      mainSetDescription: "2-Pc: Glacio DMG +10%. 4-Pc: Basic Attack or Heavy Attack DMG +10% for 15s after using Resonance Skill.",
      pattern: "4-3-3-1-1",
      cost4Name: "Lampylumen Myriad",
      cost4Description: "Transforms into a Lampylumen Myriad. Performs up to 3 consecutive attacks. The first two strikes deal Glacio DMG, and the final strike deals massive Glacio DMG, freezing enemies briefly. \n\nUseful for crowd control and bursting down tough encounters quickly.",
      cost4: ["Crit Rate", "Crit DMG"],
      cost3Name: "Glacio Predator / Autume Aiken",
      cost3: ["Glacio DMG", "Energy Regen %"],
      cost1Name: "Various",
      cost1: ["ATK %"],
      substats: [
        { stat: "Crit Rate / Crit DMG", priority: "high" },
        { stat: "Energy Regen", priority: "high" },
        { stat: "ATK%", priority: "medium" },
        { stat: "Basic Attack DMG", priority: "low" }
      ],
      erRequirement: "At least 120% Energy Regen is ideal."
    }],
    skillPriority: [
      {
        name: "Forte Circuit",
        description: "GLACIO CHAFE"
      },
      {
        name: "Resonance Liberation",
        description: "ULTIMATE"
      },
      {
        name: "Resonance Skill",
        description: "ACTIVE ABILITY"
      },
      {
        name: "Basic Attack",
        description: "NORMAL COMBOS"
      },
      {
        name: "Intro Skill",
        description: "SWITCH IN"
      }
    ],
    teams: [
      {
        name: "STANDARD TEAM",
        version: "CURRENT META",
        characters: [
          {
            name: "HIYUKI",
            role: "MAIN DPS",
            imageUrl: "https://res.cloudinary.com/ds6dwbk37/image/upload/v1775460610/Hiyuki_Card_cmwra3.webp"
          },
          {
            name: "CHISA",
            role: "CHAFE BUILDER",
            imageUrl: "https://res.cloudinary.com/ds6dwbk37/image/upload/v1775476358/Rover_Countdown_2026-02-03_lwyhwl.webp"
          },
          {
            name: "SHOREKEEPER",
            role: "BUFFER / HEALER",
            imageUrl: "https://res.cloudinary.com/ds6dwbk37/image/upload/v1775476358/Rover_Countdown_2026-02-03_lwyhwl.webp"
          }
        ]
      },
      {
        name: "OPTIMAL FUTURE TEAM",
        version: "VERSION 3.4+",
        characters: [
          {
            name: "HIYUKI",
            role: "MAIN DPS",
            imageUrl: "https://res.cloudinary.com/ds6dwbk37/image/upload/v1775460610/Hiyuki_Card_cmwra3.webp"
          },
          {
            name: "LUCILLA",
            role: "CONDENSATION SUB-DPS",
            imageUrl: ""
          },
          {
            name: "HEALER",
            role: "FLEX SUPPORT",
            imageUrl: ""
          }
        ]
      }
    ]
  }
};
