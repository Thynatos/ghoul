import { Character } from '../types/vtm';
import { 
  BloodBondRelation, 
  BloodBondStageInfo, 
  DiablerieResult, 
  FrenzyCheckResult, 
  FrenzyScenario, 
  FrenzyTriggerType 
} from '../types/taboo';

export const BLOOD_BOND_STAGES: Record<number, BloodBondStageInfo> = {
  1: {
    stage: 1,
    name: 'First Drink: Infatuation & Fascination',
    title: 'The Sweetest Venom',
    emotionalState: 'The thrall experiences recurring daydreams of the regnant. When near them, they feel an intense magnetism, warmth, and desire to impress.',
    mechanicalEffect: 'The thrall suffers a -1 penalty to social or mental actions taken against the regnant. They rationalize any bizarre behavior from the regnant.',
    breakRequirement: 'Fades naturally after 1 month without tasting the regnant’s blood or seeing them.'
  },
  2: {
    stage: 2,
    name: 'Second Drink: Obsessive Loyalty',
    title: 'The Heavy Chain',
    emotionalState: 'The thrall views the regnant as their dearest confidant, lover, or supreme mentor. Displeasing the regnant causes acute emotional distress.',
    mechanicalEffect: 'The thrall suffers a -2 penalty to resist Dominate or Presence powers cast by the regnant. Disobeying a direct request requires spending 1 Willpower point.',
    breakRequirement: 'Fades after 2-3 months of complete separation and zero contact.'
  },
  3: {
    stage: 3,
    name: 'Third Drink: Complete Blood Bond & Vassalage',
    title: 'Full Enslavement to the Vitae',
    emotionalState: 'Total unconditional submission. The thrall considers the regnant the singular most important being in existence, more beloved than family, mortal lover, or god.',
    mechanicalEffect: 'The thrall cannot intentionally harm or betray the regnant. Defying a direct command demands a difficult Contest of Will (Resolve + Composure vs Regnant Manipulation + Intimidation) and burns 1 Willpower per round of resistance.',
    breakRequirement: 'Requires 12 consecutive months of complete absence, or the Final Death of the regnant.'
  }
};

export const FRENZY_SCENARIOS: FrenzyScenario[] = [
  {
    id: 'fury_insult',
    type: 'fury',
    title: 'Public Humiliation at Elysium',
    stimulus: 'A pompous elder or rival openly mocks your lineage and spits on your honor before the court.',
    difficulty: 2,
    poolDescription: 'Resolve + Composure',
    beastCompulsion: 'Fury Frenzy: The Beast demands immediate physical retribution. You lash out to violently tear apart the offender.'
  },
  {
    id: 'fury_betrayal',
    type: 'fury',
    title: 'Treacherous Ambush',
    stimulus: 'You realize your closest mortal ally was turned into a spy and led you into an execution trap.',
    difficulty: 3,
    poolDescription: 'Resolve + Composure',
    beastCompulsion: 'Berserk Rampage: Strike down everything between you and the traitor until the room is painted red.'
  },
  {
    id: 'hunger_starvation',
    type: 'hunger',
    title: 'Scent of Mortal Blood at Hunger 4+',
    stimulus: 'A warm mortal cuts their wrist in front of you. Rich arterial blood spurts onto the floor.',
    difficulty: 3,
    poolDescription: 'Resolve + Composure',
    beastCompulsion: 'Hunger Frenzy: You tackle the nearest warm vessel and drain them dry until slaked, disregarding Masquerade.'
  },
  {
    id: 'terror_open_flame',
    type: 'terror',
    title: 'Blazing Fire / Molotov Cocktail',
    stimulus: 'A petrol bomb explodes directly before you, engulfing the doorway in roaring flames.',
    difficulty: 2,
    poolDescription: 'Resolve + Composure',
    beastCompulsion: 'Rötschreck (Red Fear): Pure animal terror. You turn and flee at maximum speed, trampling anything in your path.'
  },
  {
    id: 'terror_sunlight',
    type: 'terror',
    title: 'Piercing Shaft of Sunlight',
    stimulus: 'A window shutter is torn open, revealing the blistering radiance of the morning sun.',
    difficulty: 4,
    poolDescription: 'Resolve + Composure',
    beastCompulsion: 'Rötschreck: Blind panic to burrow into the darkest subterranean hole available.'
  }
];

export const tabooEngine = {
  /**
   * Calculates exact torpor duration based on Humanity rating (V5 Core Book p. 223)
   */
  calculateTorporDuration(humanity: number): { duration: string; months: number; description: string } {
    switch (Math.max(0, Math.min(10, humanity))) {
      case 10:
        return { duration: '1 day', months: 0.03, description: 'Nearly saintly vitae cleanses injuries within 24 hours.' };
      case 9:
        return { duration: '3 days', months: 0.1, description: 'Very high Humanity mends spiritual and physical trauma swiftly.' };
      case 8:
        return { duration: '1 week', months: 0.25, description: 'The slumber lasts seven days and nights.' };
      case 7:
        return { duration: '2 weeks', months: 0.5, description: 'Fourteen days of deathly stillness.' };
      case 6:
        return { duration: '1 month', months: 1, description: 'One full lunar cycle in the cold earth.' };
      case 5:
        return { duration: '1 year', months: 12, description: 'Four seasons pass while the kindred lies dormant.' };
      case 4:
        return { duration: '1 decade (10 years)', months: 120, description: 'A decade of mortal history passes unnoticed.' };
      case 3:
        return { duration: '5 decades (50 years)', months: 600, description: 'Half a century in torpid slumber.' };
      case 2:
        return { duration: '1 century (100 years)', months: 1200, description: 'A hundred years of darkness; cities change beyond recognition.' };
      case 1:
        return { duration: '5 centuries (500 years)', months: 6000, description: 'Five hundred years. Civilizations rise and crumble around your crypt.' };
      case 0:
      default:
        return { duration: 'Permanent Torpor or Wight', months: 999999, description: 'The soul is completely forfeit to the Beast. Slumber is eternal or until awakened as a mindless monster.' };
    }
  },

  /**
   * Calculates Blood Bond Stage from drink count
   */
  calculateBloodBondStage(drinkCount: number): BloodBondStageInfo {
    if (drinkCount <= 1) {
      return BLOOD_BOND_STAGES[1];
    } else if (drinkCount === 2) {
      return BLOOD_BOND_STAGES[2];
    } else {
      return BLOOD_BOND_STAGES[3];
    }
  },

  /**
   * Resolves the forbidden taboo of Diablerie (The Amaranth)
   * Step 1: Contest of Will (Strength + Resolve vs Stamina + Resolve)
   * Step 2: Generation absorption test
   * Step 3: Humanity loss & Stains test
   * Step 4: Grants victim discipline powers and applies black veins in aura
   */
  resolveDiablerie(diablerist: Character, victim: Character): DiablerieResult {
    const log: string[] = [];
    log.push(`[INITIATION] ${diablerist.name} plunges fangs deep into ${victim.name}'s desiccated heart to drain the soul...`);

    // Step 1: Contest of Will
    // Diablerist: Strength + Resolve
    const diableristPool = (diablerist.attributes.physical.strength || 1) + (diablerist.attributes.mental.resolve || 1);
    // Victim: Stamina + Resolve
    const victimPool = (victim.attributes.physical.stamina || 1) + (victim.attributes.mental.resolve || 1);

    // Roll pools
    const dRoll = this.rollPool(diableristPool);
    const vRoll = this.rollPool(victimPool);

    log.push(`[STEP 1: CONTEST OF WILL] Diablerist pool (${diableristPool}) rolled ${dRoll.successes} successes.`);
    log.push(`[STEP 1: CONTEST OF WILL] Victim soul resistance pool (${victimPool}) rolled ${vRoll.successes} successes.`);

    const margin = dRoll.successes - vRoll.successes;
    const soulConsumed = margin >= 0;

    if (!soulConsumed) {
      log.push(`[FAILURE] The victim's soul resisted absorption! ${victim.name}'s will overwhelmed ${diablerist.name}, forcing the predator to vomit back the coagulated vitae.`);
      return {
        success: false,
        diableristId: diablerist.id,
        diableristName: diablerist.name,
        victimId: victim.id,
        victimName: victim.name,
        victimGeneration: victim.generation,
        diableristOldGeneration: diablerist.generation,
        diableristNewGeneration: diablerist.generation,
        generationLowered: false,
        contestWillSuccessesDiablerist: dRoll.successes,
        contestWillSuccessesVictim: vRoll.successes,
        margin,
        humanityLoss: 0,
        stainsGained: 3, // Still gains stains for attempted heinous crime
        blackVeinsDurationMonths: 3,
        absorbedDisciplinePowers: [],
        stealsExpAmount: 0,
        soulConsumed: false,
        wightCheckRequired: false,
        log
      };
    }

    log.push(`[SOUL CONSUMED] With a shuddering psychic scream, ${victim.name}'s immortal consciousness is torn from their shell and devoured into ${diablerist.name}'s bloodstream.`);

    // Step 2: Generation Absorption
    // If victim is of lower generation, diablerist drops generation by 1 (or more on legendary margin)
    let newGen = diablerist.generation;
    let generationLowered = false;

    if (victim.generation < diablerist.generation) {
      // Automatic 1 step drop
      let drop = 1;
      // Exceptional margin (5+) drops an extra generation if victim is far lower
      if (margin >= 5 && (diablerist.generation - victim.generation) > 1) {
        drop = 2;
      }
      newGen = Math.max(victim.generation, diablerist.generation - drop);
      generationLowered = true;
      log.push(`[STEP 2: GENERATION DROP] Potent elder vitae elevates ${diablerist.name}'s blood! Generation drops from ${diablerist.generation}th to ${newGen}th!`);
    } else {
      log.push(`[STEP 2: GENERATION UNCHANGED] Victim was equal or higher generation (${victim.generation}th vs ${diablerist.generation}th). Generation remains ${diablerist.generation}th.`);
    }

    // Step 3: Humanity loss & Stains
    // Consuming a soul automatically costs 1 full dot of Humanity in V5, plus 5 Stains!
    const humanityLoss = 1;
    const stainsGained = 5;
    const currentHumanity = diablerist.humanity || 7;
    const remainingHumanity = Math.max(0, currentHumanity - humanityLoss);
    const wightCheckRequired = remainingHumanity <= 0;

    log.push(`[STEP 3: THE COST OF AMARANTH] The Beast rejoices in butchery. Automatic loss of 1 Humanity dot (Now ${remainingHumanity}/10) and +5 Stains accrued.`);
    if (wightCheckRequired) {
      log.push(`[CRITICAL WARNING] Humanity has plunged to 0! ${diablerist.name} has fallen completely to the Beast and transformed into a Wight!`);
    }

    // Step 4: Discipline Powers & Black Veins
    // Black veins in aura persist for 1 year per generation difference (min 12 months)
    const genDiff = Math.max(1, diablerist.generation - victim.generation);
    const blackVeinsDurationMonths = genDiff * 12;

    log.push(`[STEP 4: BLACK VEINS] Thick, undulating pitch-black veins now course through ${diablerist.name}'s aura, plainly visible to Auspex for ${blackVeinsDurationMonths} months.`);

    // Harvest victim discipline powers
    const absorbedPowers: string[] = [];
    if (victim.disciplines && victim.disciplines.length > 0) {
      victim.disciplines.forEach(disc => {
        if (disc.powers && disc.powers.length > 0) {
          // Grab up to 2 distinct powers
          const power = disc.powers[Math.floor(Math.random() * disc.powers.length)];
          if (power && !absorbedPowers.includes(`${disc.name}: ${power}`)) {
            absorbedPowers.push(`${disc.name}: ${power}`);
          }
        }
      });
    }

    if (absorbedPowers.length > 0) {
      log.push(`[DISCIPLINES HARVESTED] Diablerist assimilated the victim's psychic memory: [${absorbedPowers.join(', ')}].`);
    }

    const stealsExpAmount = 10;
    log.push(`[EXPERIENCE REWARD] ${diablerist.name} gains +${stealsExpAmount} unspent Experience from the stolen soul memories.`);

    return {
      success: true,
      diableristId: diablerist.id,
      diableristName: diablerist.name,
      victimId: victim.id,
      victimName: victim.name,
      victimGeneration: victim.generation,
      diableristOldGeneration: diablerist.generation,
      diableristNewGeneration: newGen,
      generationLowered,
      contestWillSuccessesDiablerist: dRoll.successes,
      contestWillSuccessesVictim: vRoll.successes,
      margin,
      humanityLoss,
      stainsGained,
      blackVeinsDurationMonths,
      absorbedDisciplinePowers: absorbedPowers,
      stealsExpAmount,
      soulConsumed: true,
      wightCheckRequired,
      log
    };
  },

  /**
   * Resolves a Frenzy check against the Beast
   */
  resolveFrenzyCheck(
    characterName: string,
    scenario: FrenzyScenario,
    customPool?: number
  ): FrenzyCheckResult {
    const poolSize = customPool !== undefined ? customPool : 5; // Default Resolve + Composure
    const roll = this.rollPool(poolSize);
    const passed = roll.successes >= scenario.difficulty;
    const margin = roll.successes - scenario.difficulty;

    const outcomeText = passed
      ? `${characterName} mastered their inner Beast, retaining composure with ${roll.successes} successes against difficulty ${scenario.difficulty}.`
      : `${characterName} lost control to the Beast! (${roll.successes}/${scenario.difficulty} successes). The Beast takes full dominion!`;

    return {
      id: 'frenzy_' + Date.now(),
      timestamp: Date.now(),
      characterName,
      type: scenario.type,
      difficulty: scenario.difficulty,
      poolSize,
      diceRolled: roll.dice,
      successes: roll.successes,
      passed,
      margin,
      outcomeText,
      compulsion: passed ? 'None (Controlled)' : scenario.beastCompulsion
    };
  },

  /**
   * Internal pool roller
   */
  rollPool(poolSize: number): { dice: number[]; successes: number } {
    const size = Math.max(1, poolSize);
    const dice: number[] = [];
    let successes = 0;
    let tens = 0;

    for (let i = 0; i < size; i++) {
      const val = Math.floor(Math.random() * 10) + 1;
      dice.push(val);
      if (val >= 6) successes++;
      if (val === 10) tens++;
    }

    const critBonus = Math.floor(tens / 2) * 2;
    return { dice, successes: successes + critBonus };
  }
};
