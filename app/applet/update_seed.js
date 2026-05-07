const fs = require('fs');

let data = fs.readFileSync('lib/seed-data.ts', 'utf8');

const kitData = `kit: {
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
        description: "Deal Glacio DMG.\\nCasting this skill enhances the next Basic Attack - Present Self Stage 3, which now restores 100 points of Dedication when cast.\\nSwitching to another Resonator ends this effect.\\n\\n※ Frostblight: Jade Cleave\\nWhile on the ground, press Resonance Skill to pull in nearby targets and deal Glacio DMG, removing the targets' Frostbind.\\n\\n※ Frostblight: Petalfall\\nIn the air, press Resonance Skill to plunge attack, dealing Glacio DMG, removing the targets' Frostbind.",
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
    },`;

// Replace `combatMechanics: [` with `kit:...`
data = data.replace('combatMechanics: [', kitData + '\\n    combatMechanics: [');
fs.writeFileSync('lib/seed-data.ts', data);
console.log('Seed data updated');
