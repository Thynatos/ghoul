import { 
  AttackResolutionParams, 
  AttackResolutionResult, 
  CalledShotOption, 
  Combatant, 
  DamageType 
} from '../types/combat';

export const CALLED_SHOT_OPTIONS: CalledShotOption[] = [
  {
    id: 'stake_heart',
    name: 'Stake the Heart',
    penalty: 2,
    requiredMargin: 3,
    description: 'Aiming a wooden stake directly through the ribcage into the dormant heart.',
    effect: 'Paralyzes Kindred instantly on 3+ margin. Target falls into rigid torpid stasis until stake is removed.'
  },
  {
    id: 'headshot',
    name: 'Headshot / Decapitation Strike',
    penalty: 2,
    requiredMargin: 1,
    description: 'Targeting the skull or neck for maximum trauma.',
    effect: '+2 bonus damage. If dealing Aggravated damage with a blade, severs head on 5+ margin (Final Death).'
  },
  {
    id: 'disarm',
    name: 'Disarm Weapon',
    penalty: 2,
    requiredMargin: 1,
    description: 'Striking the opponent\'s wrist, firearm, or weapon hilt to send it flying.',
    effect: 'Disarms defender. Their weapon lands 3 meters away and cannot be used this turn.'
  },
  {
    id: 'cripple_limb',
    name: 'Cripple Limb',
    penalty: 2,
    requiredMargin: 2,
    description: 'Shattering knee, elbow, or tendons to immobilize.',
    effect: 'Inflicts Stunned status. Target suffers -2 dice to all Physical actions for 2 rounds.'
  },
  {
    id: 'throat_bite',
    name: 'Fanged Bite to Throat',
    penalty: 2,
    requiredMargin: 2,
    description: 'Lunging directly for the jugular or carotid artery to drink during combat.',
    effect: 'Deals 2 Aggravated damage, inflicts Grappled status, and allows attacker to slake 1 Hunger immediately.'
  }
];

export const combatEngine = {
  /**
   * Calculate initiative from Wits + Awareness, with Celerity bonus dots or tie-breaker
   */
  calculateInitiative(wits: number, awareness: number, celerity: number = 0): number {
    const base = (wits || 1) + (awareness || 0) + (celerity * 2);
    // Add small random tie-breaker between 0.1 and 0.9
    const tieBreaker = Math.floor(Math.random() * 9 + 1) / 10;
    return base + tieBreaker;
  },

  /**
   * Roll a dice pool following standard V5 rules:
   * 6-10 is a success. Pairs of 10s form criticals (adding 2 extra bonus successes).
   */
  rollPool(poolSize: number): { dice: number[]; successes: number; tens: number } {
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

    // Every pair of tens adds +2 bonus successes
    const critPairs = Math.floor(tens / 2);
    const totalSuccesses = successes + (critPairs * 2);

    return { dice, successes: totalSuccesses, tens };
  },

  /**
   * Resolves combat attack contest:
   * Attacker Pool vs Defender Pool
   * Computes margin, damage conversion, superficial vs aggravated, called shots, and armor.
   */
  resolveAttack(params: AttackResolutionParams): AttackResolutionResult {
    const {
      attackerName,
      defenderName,
      attackerPool,
      defenderPool,
      attackType,
      weaponBonusDamage = 0,
      isDefenderVampire = true,
      isAttackerPotence = false,
      potenceBonus = 0,
      calledShot = null,
      targetArmor = 0,
      forceRolls
    } = params;

    // Apply called shot penalty to attacker's pool
    const effectiveAttackerPool = Math.max(1, attackerPool - (calledShot ? calledShot.penalty : 0));
    
    // Roll or use forced rolls
    let attackerRoll: number[] = [];
    let defenderRoll: number[] = [];
    let attackerSuccesses = 0;
    let defenderSuccesses = 0;

    if (forceRolls?.attackerSuccesses !== undefined) {
      attackerSuccesses = forceRolls.attackerSuccesses;
      attackerRoll = [attackerSuccesses];
    } else {
      const aRoll = this.rollPool(effectiveAttackerPool);
      attackerRoll = aRoll.dice;
      attackerSuccesses = aRoll.successes;
    }

    if (forceRolls?.defenderSuccesses !== undefined) {
      defenderSuccesses = forceRolls.defenderSuccesses;
      defenderRoll = [defenderSuccesses];
    } else {
      const dRoll = this.rollPool(defenderPool);
      defenderRoll = dRoll.dice;
      defenderSuccesses = dRoll.successes;
    }

    const margin = attackerSuccesses - defenderSuccesses;
    const hit = margin > 0;

    if (!hit) {
      return {
        attackerRoll,
        defenderRoll,
        attackerSuccesses,
        defenderSuccesses,
        margin,
        hit: false,
        rawDamage: 0,
        effectiveDamage: 0,
        damageType: 'superficial',
        calledShotSucceeded: false,
        summary: `${attackerName} missed or was deflected by ${defenderName} (Margin: ${margin}).`
      };
    }

    // Hit calculation
    let rawDamage = margin + weaponBonusDamage + (isAttackerPotence ? potenceBonus : 0);

    // Headshot bonus
    if (calledShot?.id === 'headshot') {
      rawDamage += 2;
    }

    // Determine damage type
    let damageType: 'superficial' | 'aggravated' = 'superficial';
    if (attackType === 'fire' || attackType === 'sunlight') {
      damageType = 'aggravated';
    } else if (attackType === 'bite') {
      damageType = 'aggravated';
    } else if (!isDefenderVampire && (attackType === 'slashing' || attackType === 'firearms' || attackType === 'melee')) {
      // Mortals take Aggravated damage from lethal weapons
      damageType = 'aggravated';
    } else if (isAttackerPotence && attackType === 'unarmed') {
      // Potence Lethal Body allows converting superficial to aggravated if desired
      damageType = 'superficial';
    }

    // Armor absorption
    let postArmorDamage = Math.max(1, rawDamage - targetArmor);

    // Vampire Superficial Damage Halving:
    // In V5, vampires divide Superficial damage in half (rounded up) unless caused by fire, sunlight, or supernatural claws.
    let effectiveDamage = postArmorDamage;
    if (isDefenderVampire && damageType === 'superficial') {
      effectiveDamage = Math.ceil(postArmorDamage / 2);
    }

    // Called shot condition verification
    let calledShotSucceeded = false;
    let calledShotEffect: string | undefined = undefined;

    if (calledShot) {
      if (margin >= calledShot.requiredMargin) {
        calledShotSucceeded = true;
        calledShotEffect = calledShot.effect;
      } else {
        calledShotEffect = `Hit struck, but margin (${margin}) was insufficient for called shot threshold (${calledShot.requiredMargin}). Standard damage dealt.`;
      }
    }

    const summary = hit
      ? `${attackerName} struck ${defenderName} for ${effectiveDamage} ${damageType.toUpperCase()} damage (Margin: +${margin}${calledShotSucceeded ? ` | CALLED SHOT SUCCESS: ${calledShot?.name}` : ''}).`
      : `${attackerName} failed to penetrate ${defenderName}'s defense.`;

    return {
      attackerRoll,
      defenderRoll,
      attackerSuccesses,
      defenderSuccesses,
      margin,
      hit: true,
      rawDamage,
      effectiveDamage,
      damageType,
      calledShotSucceeded,
      calledShotEffect,
      summary
    };
  },

  /**
   * Apply damage to combatant health track
   * Superficial fills empty boxes with 'superficial'.
   * Aggravated overrides 'none' or upgrades 'superficial' to 'aggravated'.
   */
  applyDamage(
    healthDamage: DamageType[],
    amount: number,
    type: 'superficial' | 'aggravated'
  ): { updatedTrack: DamageType[]; isTorpid: boolean } {
    const track = [...healthDamage];
    let remaining = amount;

    if (type === 'aggravated') {
      // Aggravated first converts 'none' to 'aggravated'
      for (let i = 0; i < track.length && remaining > 0; i++) {
        if (track[i] === 'none') {
          track[i] = 'aggravated';
          remaining--;
        }
      }
      // If still remaining, upgrades 'superficial' to 'aggravated'
      for (let i = 0; i < track.length && remaining > 0; i++) {
        if (track[i] === 'superficial') {
          track[i] = 'aggravated';
          remaining--;
        }
      }
    } else {
      // Superficial fills 'none'
      for (let i = 0; i < track.length && remaining > 0; i++) {
        if (track[i] === 'none') {
          track[i] = 'superficial';
          remaining--;
        }
      }
      // If track is full of superficial, overflow upgrades superficial to aggravated!
      for (let i = 0; i < track.length && remaining > 0; i++) {
        if (track[i] === 'superficial') {
          track[i] = 'aggravated';
          remaining--;
        }
      }
    }

    const isTorpid = track.every(box => box === 'aggravated');
    return { updatedTrack: track, isTorpid };
  },

  /**
   * Heal damage from track
   */
  healDamage(healthDamage: DamageType[], amount: number): DamageType[] {
    const track = [...healthDamage];
    let remaining = amount;

    // First heal superficial
    for (let i = track.length - 1; i >= 0 && remaining > 0; i--) {
      if (track[i] === 'superficial') {
        track[i] = 'none';
        remaining--;
      }
    }

    // Then heal aggravated
    for (let i = track.length - 1; i >= 0 && remaining > 0; i--) {
      if (track[i] === 'aggravated') {
        track[i] = 'none';
        remaining--;
      }
    }

    return track;
  }
};
