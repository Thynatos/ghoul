export interface ResonanceInfo {
  id: string;
  name: string;
  element: string;
  disciplines: string[];
  emotions: string;
  huntingGrounds: string;
}

export interface DyscrasiaInfo {
  id: string;
  name: string;
  resonance: string;
  description: string;
  bonus: string;
}

export interface Vessel {
  id: string;
  archetype: string;
  location: string;
  resonance: ResonanceInfo;
  temperament: 'negligible' | 'fleeting' | 'intense' | 'acute';
  dyscrasia?: DyscrasiaInfo;
}

export const RESONANCES: ResonanceInfo[] = [
  {
    id: 'choleric',
    name: 'Choleric',
    element: 'Fire',
    disciplines: ['Celerity', 'Potence'],
    emotions: 'Rage, fury, aggression, athletic frenzy, jealousy, battle adrenaline.',
    huntingGrounds: 'Biker dive bars, boxing rings, protest riots, sports arenas.'
  },
  {
    id: 'melancholic',
    name: 'Melancholic',
    element: 'Earth',
    disciplines: ['Fortitude', 'Obfuscate'],
    emotions: 'Grief, depression, deep study, intellectual solitude, despair.',
    huntingGrounds: 'Late-night academic libraries, cemeteries, grief counselling groups, rainy bus stops.'
  },
  {
    id: 'phlegmatic',
    name: 'Phlegmatic',
    element: 'Water',
    disciplines: ['Auspex', 'Dominate'],
    emotions: 'Apathy, calm, clinical calculation, laziness, stoicism, controlling numbness.',
    huntingGrounds: 'Corporate boardrooms, hospital waiting rooms, luxury hotel lobbies, meditation retreats.'
  },
  {
    id: 'sanguine',
    name: 'Sanguine',
    element: 'Air',
    disciplines: ['Blood Sorcery', 'Presence'],
    emotions: 'Ecstasy, romantic infatuation, artistic inspiration, manic euphoria, intoxication.',
    huntingGrounds: 'Art gallery openings, underground techno clubs, VIP backstage parties, romantic restaurants.'
  },
  {
    id: 'empty',
    name: 'Empty (Cold / Void)',
    element: 'Abyss',
    disciplines: ['Oblivion'],
    emotions: 'Complete emotional numbness, clinical psychopathy, shock trauma, mourning the dead.',
    huntingGrounds: 'Hospice wards, morgues, abandoned buildings, execution chambers.'
  }
];

export const DYSCRASIAS: DyscrasiaInfo[] = [
  {
    id: 'dys_adrenaline_rush',
    name: 'Berserker\'s Rush',
    resonance: 'Choleric',
    description: 'Vessel died or bled while in primal combat panic.',
    bonus: '+2 dice on all Brawl and Athletics rolls for the rest of the night; ignore all physical pain penalties.'
  },
  {
    id: 'dys_paranoid_vigil',
    name: 'Paranoid Vigilance',
    resonance: 'Melancholic',
    description: 'Vessel was a stalked conspiracy theorist who never let their guard down.',
    bonus: '+2 dice on all Awareness and Stealth rolls; cannot be surprised by ambush.'
  },
  {
    id: 'dys_frozen_resolve',
    name: 'Glacial Detachment',
    resonance: 'Phlegmatic',
    description: 'Vessel experienced profound psychological numbness and stoic denial.',
    bonus: '+2 dice on all Composure and Resolve pools; automatic immunity to emotional Presence effects.'
  },
  {
    id: 'dys_irresistible_allure',
    name: 'Siren\'s Fire',
    resonance: 'Sanguine',
    description: 'Vessel was consumed by desperate, uninhibited lust and infatuation.',
    bonus: '+2 dice on all Persuasion and Subterfuge pools; mortals automatically treat you as their deepest desire.'
  },
  {
    id: 'dys_whispers_grave',
    name: 'Grave Miasma',
    resonance: 'Empty',
    description: 'Vessel survived clinical death before being resuscitated.',
    bonus: '+2 dice on all Oblivion and Occult pools; see wandering ghosts without rolling.'
  },
  {
    id: 'dys_creative_spark',
    name: 'Obsessive Maestro',
    resonance: 'Sanguine',
    description: 'Vessel was an artist in the middle of a transcendent breakthrough.',
    bonus: '+2 dice on all Craft and Performance pools; gain 1 free temporary Willpower point.'
  }
];

export function generateRandomVessel(): Vessel {
  const archetypes = [
    'Sweaty underground boxer wrapping bruised knuckles',
    'Exhausted doctoral student weeping over research drafts',
    'Callous corporate liquidator reading restructuring notices',
    'Ecstatic clubgoer dancing under strobe lights in VIP booth',
    'Silent coroner stitching an autopsy incision shut',
    'Street-level hustler looking over their shoulder in paranoia',
    'Grieving widow pacing outside a hospital emergency ward',
    'Charismatic political campaign aide celebrating victory poll numbers'
  ];

  const locations = [
    'South Side dockside alleyway',
    'Downtown luxury hotel lounge',
    'University science quad basement',
    'Industrial warehouse rave',
    '24-hour underground subway platform',
    'Chinatown noodle shop back booth',
    'St. Jude’s cemetery courtyard'
  ];

  // Roll d10 for Resonance
  const rDie = Math.floor(Math.random() * 10) + 1;
  let resonance = RESONANCES[0];
  if (rDie <= 3) resonance = RESONANCES[2]; // Phlegmatic
  else if (rDie <= 6) resonance = RESONANCES[1]; // Melancholic
  else if (rDie <= 8) resonance = RESONANCES[0]; // Choleric
  else if (rDie === 9) resonance = RESONANCES[3]; // Sanguine
  else resonance = RESONANCES[4]; // Empty

  // Roll d10 for Temperament
  const tDie = Math.floor(Math.random() * 10) + 1;
  let temperament: Vessel['temperament'] = 'negligible';
  let dyscrasia: DyscrasiaInfo | undefined;

  if (tDie <= 4) {
    temperament = 'negligible';
  } else if (tDie <= 7) {
    temperament = 'fleeting';
  } else if (tDie <= 9) {
    temperament = 'intense';
  } else {
    temperament = 'acute';
    const matchingDys = DYSCRASIAS.filter(d => d.resonance.toLowerCase() === resonance.name.toLowerCase());
    dyscrasia = matchingDys.length > 0 ? matchingDys[Math.floor(Math.random() * matchingDys.length)] : DYSCRASIAS[0];
  }

  return {
    id: 'vessel_' + Date.now(),
    archetype: archetypes[Math.floor(Math.random() * archetypes.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    resonance,
    temperament,
    dyscrasia
  };
}
