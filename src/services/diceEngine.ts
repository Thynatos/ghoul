import { GameEdition, RollRequest, RollResult } from '../types/vtm';

export function rollD10(): number {
  return Math.floor(Math.random() * 10) + 1;
}

export function executeV5Roll(request: RollRequest): RollResult {
  const totalPool = Math.max(1, request.poolSize);
  const hunger = Math.max(0, Math.min(5, request.hungerDice ?? 0));
  const difficulty = Math.max(1, request.difficulty ?? 1);

  const hungerCount = Math.min(hunger, totalPool);
  const regularCount = Math.max(0, totalPool - hungerCount);

  const regularDice: number[] = [];
  for (let i = 0; i < regularCount; i++) {
    regularDice.push(rollD10());
  }

  const hungerDice: number[] = [];
  for (let i = 0; i < hungerCount; i++) {
    hungerDice.push(rollD10());
  }

  // Count successes: 6-9 = 1 success, 10 = 1 success (pairs of 10s add +2 bonus successes, i.e., 2 tens = 4 successes)
  let standardSuccesses = 0;
  let regularTens = 0;
  let hungerTens = 0;
  let hungerOnes = 0;

  for (const d of regularDice) {
    if (d >= 6 && d <= 9) standardSuccesses++;
    else if (d === 10) {
      standardSuccesses++;
      regularTens++;
    }
  }

  for (const d of hungerDice) {
    if (d >= 6 && d <= 9) standardSuccesses++;
    else if (d === 10) {
      standardSuccesses++;
      hungerTens++;
    } else if (d === 1) {
      hungerOnes++;
    }
  }

  const totalTens = regularTens + hungerTens;
  const critPairs = Math.floor(totalTens / 2);
  const totalSuccesses = standardSuccesses + critPairs * 2;

  const isWin = totalSuccesses >= difficulty;
  let outcome: RollResult['outcome'] = isWin ? 'success' : 'failure';
  let outcomeText = '';

  if (isWin) {
    if (critPairs > 0) {
      if (hungerTens > 0) {
        outcome = 'messy_critical';
        outcomeText = `Messy Critical! (${totalSuccesses} successes vs diff ${difficulty})`;
      } else {
        outcome = 'critical';
        outcomeText = `Critical Win! (${totalSuccesses} successes vs diff ${difficulty})`;
      }
    } else {
      outcome = 'success';
      outcomeText = `Success (${totalSuccesses} successes vs diff ${difficulty})`;
    }
  } else {
    if (hungerOnes > 0) {
      outcome = 'bestial_failure';
      outcomeText = `Bestial Failure! (${totalSuccesses} successes vs diff ${difficulty}, Hunger 1 rolled)`;
    } else {
      outcome = 'failure';
      outcomeText = `Failure (${totalSuccesses} successes vs diff ${difficulty})`;
    }
  }

  // Check if willpower reroll is possible (reroll up to 3 regular dice that are not tens)
  const canWillpowerReroll = regularDice.some(d => d < 6);

  return {
    id: 'roll_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    timestamp: Date.now(),
    label: request.label,
    edition: 'v5',
    regularDice,
    hungerDice,
    successes: totalSuccesses,
    difficulty,
    outcome,
    outcomeText,
    canWillpowerReroll,
    characterName: request.characterName
  };
}

export function executeV20Roll(request: RollRequest): RollResult {
  const pool = Math.max(1, request.poolSize);
  const difficulty = Math.max(2, Math.min(10, request.difficulty ?? 6));
  const specialty = request.specialty ?? false;

  const dice: number[] = [];
  let onesCount = 0;
  let successes = 0;

  for (let i = 0; i < pool; i++) {
    const val = rollD10();
    dice.push(val);
    if (val >= difficulty) {
      successes++;
      if (val === 10 && specialty) {
        // Specialty exploding 10s
        const extra = rollD10();
        dice.push(extra);
        if (extra >= difficulty) successes++;
      }
    } else if (val === 1) {
      onesCount++;
    }
  }

  // Rule of 1s in V20: each 1 cancels one success
  const netSuccesses = Math.max(0, successes - onesCount);
  let outcome: RollResult['outcome'] = 'failure';
  let outcomeText = '';

  if (netSuccesses > 0) {
    if (netSuccesses >= 5) {
      outcome = 'exceptional';
      outcomeText = `Exceptional Success! (${netSuccesses} net successes vs diff ${difficulty})`;
    } else {
      outcome = 'success';
      outcomeText = `Success (${netSuccesses} net successes vs diff ${difficulty})`;
    }
  } else {
    if (successes === 0 && onesCount > 0) {
      outcome = 'botch';
      outcomeText = `BOTCH! (0 successes and ${onesCount} ones rolled)`;
    } else {
      outcome = 'failure';
      outcomeText = `Failure (${netSuccesses} net successes vs diff ${difficulty})`;
    }
  }

  return {
    id: 'roll_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    timestamp: Date.now(),
    label: request.label,
    edition: 'v20',
    regularDice: dice,
    hungerDice: [],
    successes: netSuccesses,
    difficulty,
    outcome,
    outcomeText,
    characterName: request.characterName
  };
}

export function executeRouseCheck(): { success: boolean; die: number; message: string } {
  const die = rollD10();
  const success = die >= 6;
  return {
    success,
    die,
    message: success 
      ? `Rouse Check Succeeded! (${die}) - Hunger does not increase.` 
      : `Rouse Check Failed! (${die}) - Hunger increases by 1.`
  };
}

export function rerollRegularDice(roll: RollResult, indicesToReroll: number[]): RollResult {
  if (roll.edition !== 'v5') return roll;

  const newRegular = [...roll.regularDice];
  for (const idx of indicesToReroll) {
    if (idx >= 0 && idx < newRegular.length) {
      newRegular[idx] = rollD10();
    }
  }

  // Recalculate
  let standardSuccesses = 0;
  let regularTens = 0;
  let hungerTens = 0;
  let hungerOnes = 0;

  for (const d of newRegular) {
    if (d >= 6 && d <= 9) standardSuccesses++;
    else if (d === 10) {
      standardSuccesses++;
      regularTens++;
    }
  }

  for (const d of roll.hungerDice) {
    if (d >= 6 && d <= 9) standardSuccesses++;
    else if (d === 10) {
      standardSuccesses++;
      hungerTens++;
    } else if (d === 1) {
      hungerOnes++;
    }
  }

  const totalTens = regularTens + hungerTens;
  const critPairs = Math.floor(totalTens / 2);
  const totalSuccesses = standardSuccesses + critPairs * 2;
  const isWin = totalSuccesses >= roll.difficulty;

  let outcome: RollResult['outcome'] = isWin ? 'success' : 'failure';
  let outcomeText = '';

  if (isWin) {
    if (critPairs > 0) {
      outcome = hungerTens > 0 ? 'messy_critical' : 'critical';
      outcomeText = `${outcome === 'messy_critical' ? 'Messy Critical!' : 'Critical Win!'} (${totalSuccesses} successes vs diff ${roll.difficulty})`;
    } else {
      outcome = 'success';
      outcomeText = `Success (${totalSuccesses} successes vs diff ${roll.difficulty})`;
    }
  } else {
    outcome = hungerOnes > 0 ? 'bestial_failure' : 'failure';
    outcomeText = `${outcome === 'bestial_failure' ? 'Bestial Failure!' : 'Failure'} (${totalSuccesses} successes vs diff ${roll.difficulty})`;
  }

  return {
    ...roll,
    regularDice: newRegular,
    successes: totalSuccesses,
    outcome,
    outcomeText,
    canWillpowerReroll: false,
    rerolledIndices: indicesToReroll
  };
}
