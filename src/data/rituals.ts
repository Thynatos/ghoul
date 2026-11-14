export interface RitualCeremonyInfo {
  id: string;
  name: string;
  level: number;
  type: 'ritual' | 'ceremony'; // ritual = Blood Sorcery, ceremony = Oblivion
  ingredients: string;
  castingTime: string;
  dicePool: string;
  system: string;
}

export const RITUALS_CEREMONIES_DATA: RitualCeremonyInfo[] = [
  // Blood Sorcery Rituals
  {
    id: 'rit_blood_walk',
    name: 'A Taste for Blood / Blood Walk',
    level: 1,
    type: 'ritual',
    ingredients: 'A small cup of copper or silver and a drop of subject vitae.',
    castingTime: '5 minutes',
    dicePool: 'Intelligence + Blood Sorcery',
    system: 'Traces the ancestral lineage of a kindred whose blood is tasted, revealing the identity and clan of their sire, grandsire, and approximate generation.'
  },
  {
    id: 'rit_craft_bloodstone',
    name: 'Craft Bloodstone',
    level: 1,
    type: 'ritual',
    ingredients: 'A small pebble or gemstone soaked in the sorcerer’s blood for three nights.',
    castingTime: '1 hour',
    dicePool: 'Resolve + Blood Sorcery',
    system: 'Attunes the stone to the caster’s blood. The caster always senses the exact directional heading and distance of the stone anywhere in the city.'
  },
  {
    id: 'rit_wake_freshness',
    name: 'Wake with Evening\'s Freshness',
    level: 1,
    type: 'ritual',
    ingredients: 'Ash from feathers of a burned rooster mixed with pure water.',
    castingTime: '10 minutes before dawn',
    dicePool: 'Resolve + Blood Sorcery',
    system: 'The kindred awakens instantly at the very moment the sun dips below the horizon, fully alert and without the customary sluggishness of waking.'
  },
  {
    id: 'rit_clinging_insect',
    name: 'Clinging of the Insect',
    level: 1,
    type: 'ritual',
    ingredients: 'A living spider dipped in vitae and consumed.',
    castingTime: '5 minutes',
    dicePool: 'Strength + Blood Sorcery',
    system: 'Allows the caster to climb walls and ceilings as easily as walking on pavement, with hands and shoes clinging effortlessly to brick, glass, or steel.'
  },
  {
    id: 'rit_ishtar_touch',
    name: 'Ishtar\'s Touch',
    level: 2,
    type: 'ritual',
    ingredients: 'A silk cord soaked in holy water and kindred tears.',
    castingTime: '15 minutes',
    dicePool: 'Manipulation + Blood Sorcery',
    system: 'Infuses an item or beverage with intoxicating euphoria. Anyone drinking or touching it becomes docile and susceptible to hypnotic persuasion.'
  },
  {
    id: 'rit_ward_ghouls',
    name: 'Ward Against Ghouls',
    level: 2,
    type: 'ritual',
    ingredients: 'A glyph traced in blood infused with wolfsbane upon an entrance or object.',
    castingTime: '1 hour',
    dicePool: 'Intelligence + Blood Sorcery',
    system: 'Ghouls touching the warded threshold suffer 3 points of Aggravated health damage and are repelled backward in agonizing pain.'
  },
  {
    id: 'rit_eyes_night_hawk',
    name: 'Eyes of the Night Hawk',
    level: 2,
    type: 'ritual',
    ingredients: 'A bird of prey fed a drop of the caster’s vitae.',
    castingTime: '30 minutes',
    dicePool: 'Wits + Blood Sorcery',
    system: 'Allows the caster to see and hear through the senses of the bird as it soars across the metropolis, guiding its flight telepathically.'
  },
  {
    id: 'rit_scry_hearth',
    name: 'Scry the Hearth',
    level: 3,
    type: 'ritual',
    ingredients: 'A mirror rubbed with sulfur and cold fireplace soot.',
    castingTime: '30 minutes',
    dicePool: 'Resolve + Blood Sorcery',
    system: 'Reveals the physical interior of any haven or residence the caster has personally visited before, observing current occupants and conversations.'
  },
  {
    id: 'rit_ward_kindred',
    name: 'Ward Against Kindred',
    level: 3,
    type: 'ritual',
    ingredients: 'A silver needle dipped in kindred vitae tracing an ancient sigil.',
    castingTime: '2 hours',
    dicePool: 'Intelligence + Blood Sorcery',
    system: 'Any vampire touching the warded doorway, window, or boundary suffers 3 points of Aggravated damage and cannot enter without spending Willpower.'
  },
  {
    id: 'rit_defense_haven',
    name: 'Defense of the Sacred Haven',
    level: 4,
    type: 'ritual',
    ingredients: 'A circle of braided willow and cold-iron shavings drawn around the haven perimeter.',
    castingTime: '2 hours',
    dicePool: 'Resolve + Blood Sorcery',
    system: 'Darkens sunlight completely inside the warded chamber. Sunlight passing through windows is reduced to harmless dim twilight that cannot burn kindred flesh.'
  },
  {
    id: 'rit_shaft_dissolution',
    name: 'Shaft of Belated Dissolution',
    level: 4,
    type: 'ritual',
    ingredients: 'A wooden stake carved from rowan wood, soaked in consecrated oil and blood.',
    castingTime: '3 hours',
    dicePool: 'Strength + Blood Sorcery',
    system: 'When driven through a kindred’s heart, the stake tips break off inside the heart and slowly rot the victim from within, causing Aggravated wounds daily.'
  },
  {
    id: 'rit_escape_friend',
    name: 'Escape to a True Friend',
    level: 5,
    type: 'ritual',
    ingredients: 'A yard of white linen circle and a token given freely by an ally.',
    castingTime: 'Full scene preparation',
    dicePool: 'Resolve + Blood Sorcery',
    system: 'In direst mortal peril, the caster steps into the circle and teleports instantaneously across the city directly into the presence of their bonded ally.'
  },

  // Oblivion Ceremonies
  {
    id: 'cer_shadow_twin',
    name: 'The Shadow Twin',
    level: 1,
    type: 'ceremony',
    ingredients: 'A human skull filled with graveyard earth and lamp oil.',
    castingTime: '15 minutes',
    dicePool: 'Resolve + Oblivion',
    system: 'Detaches the kindred’s shadow, which becomes an autonomous shadowy scout capable of slipping under doors and reporting observations telepathically.'
  },
  {
    id: 'cer_spectral_steed',
    name: 'Compel the Spectral Steed',
    level: 2,
    type: 'ceremony',
    ingredients: 'Horseshoes buried for a century or automotive keys of a fatal crash victim.',
    castingTime: '30 minutes',
    dicePool: 'Manipulation + Oblivion',
    system: 'Summons a phantom mount or spectral vehicle that glides soundlessly through physical barriers and across water, moving at supernatural velocity.'
  },
  {
    id: 'cer_host_spirit',
    name: 'Host Spirit',
    level: 3,
    type: 'ceremony',
    ingredients: 'The severed finger bone of a murder victim.',
    castingTime: '45 minutes',
    dicePool: 'Composure + Oblivion',
    system: 'Binds a restless ghost into a corpse or willing vessel, allowing the spirit to speak clearly, reveal the identity of its killer, and answer queries.'
  },
  {
    id: 'cer_shambling_horde',
    name: 'Shambling Hordes',
    level: 4,
    type: 'ceremony',
    ingredients: 'Fresh blood poured into the mouths of three or more fresh corpses.',
    castingTime: '1 hour',
    dicePool: 'Strength + Oblivion',
    system: 'Animates multiple corpses into mindless, fearless zombies that march under the necromancer’s command, tearing apart obstacles and enemies.'
  },
  {
    id: 'cer_ex_nihilo',
    name: 'Ex Nihilo',
    level: 5,
    type: 'ceremony',
    ingredients: 'A shroud taken from a freshly dug grave and a doorway draped in black velvet.',
    castingTime: '1 hour',
    dicePool: 'Resolve + Oblivion',
    system: 'Tears open the Veil between the living world and the Shadowlands (Underworld), allowing physical passage into the realm of ghosts and Oblivion.'
  }
];
