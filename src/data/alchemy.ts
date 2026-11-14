export interface AlchemyRecipe {
  id: string;
  name: string;
  level: number;
  method: 'Athanor Corporis' | 'Calcinatio' | 'Fixatio' | 'Any';
  ingredients: string;
  resonanceRequired: string;
  distillationPool: string;
  effect: string;
}

export const ALCHEMY_RECIPES: AlchemyRecipe[] = [
  {
    id: 'alc_far_reach',
    name: 'Far Reach',
    level: 1,
    method: 'Athanor Corporis',
    ingredients: 'A drop of pure mercury mixed with choleric vitae.',
    resonanceRequired: 'Choleric (Athletic / Angry)',
    distillationPool: 'Stamina + Alchemy',
    effect: 'Grants subtle telekinesis, lifting, pushing, or pulling objects up to 10kg from across the room without touching them.'
  },
  {
    id: 'alc_haze',
    name: 'Haze',
    level: 1,
    method: 'Calcinatio',
    ingredients: 'Vape liquid or distilled motor oil cooked with melancholic vitae.',
    resonanceRequired: 'Melancholic (Depressed / Solitary)',
    distillationPool: 'Manipulation + Alchemy',
    effect: 'The alchemist exhales an opaque, oily fog that blinds security cameras, smothers infrared lenses, and obscures footprints.'
  },
  {
    id: 'alc_envelop',
    name: 'Envelop',
    level: 2,
    method: 'Fixatio',
    ingredients: 'Industrial adhesive and liquefied rubber boiled with phlegmatic blood.',
    resonanceRequired: 'Phlegmatic (Calm / Apathetic)',
    distillationPool: 'Intelligence + Alchemy',
    effect: 'Distills an aerosol spray that hardens rapidly upon contact with air, pinning an enemy’s feet to the pavement or sealing a doorway shut.'
  },
  {
    id: 'alc_deflection',
    name: 'Deflection',
    level: 3,
    method: 'Athanor Corporis',
    ingredients: 'Cold-pressed iron filings and adrenaline-rich blood.',
    resonanceRequired: 'Choleric (Furious / Fighting)',
    distillationPool: 'Stamina + Alchemy',
    effect: 'Generates a micro-kinetic barrier around the body that automatically deflects low-caliber pistol rounds and knife slashes.'
  },
  {
    id: 'alc_counterfeit',
    name: 'Counterfeit Discipline',
    level: 4,
    method: 'Any',
    ingredients: 'A vial of blood from a true kindred of the target clan, distilled with active resonance.',
    resonanceRequired: 'Matching the target Discipline',
    distillationPool: 'Resolve + Alchemy',
    effect: 'The Duskborn temporarily acquires any single level 1–3 power of the donor vampire’s clan discipline for an entire night.'
  },
  {
    id: 'alc_sunlight_endurance',
    name: 'Daywalker\'s Elixir',
    level: 4,
    method: 'Fixatio',
    ingredients: 'Purified zinc oxide, golden saffron, and midday mortal sweat.',
    resonanceRequired: 'Sanguine (Joyful / Euphoric)',
    distillationPool: 'Intelligence + Alchemy',
    effect: 'Allows the thin-blood to walk under direct midday sunlight for up to 4 hours without bursting into flames or taking aggravated wounds.'
  },
  {
    id: 'alc_awaken_sleeper',
    name: 'Awaken the Sleeper',
    level: 5,
    method: 'Fixatio',
    ingredients: 'Electrified vitae mixed with ground black diamond and saltpeter.',
    resonanceRequired: 'Acute Dyscrasia Vitae',
    distillationPool: 'Intelligence + Alchemy',
    effect: 'A miraculous brew that can revive an elder kindred from torpor or temporarily break a long-standing Blood Bond.'
  }
];
