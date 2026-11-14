import { Character, GameEdition } from '../types/vtm';
import { CLANS_DATA } from '../data/clans';
import { PREDATOR_TYPES_DATA } from '../data/predatorTypes';
import { DISCIPLINES_DATA } from '../data/disciplines';

const FIRST_NAMES = [
  'Vincent', 'Dominic', 'Julian', 'Klaus', 'Sebastian', 'Damian', 'Victor', 'Dante', 'Gabriel', 'Silas',
  'Valerie', 'Camilla', 'Cassandra', 'Vivian', 'Morgana', 'Lilith', 'Eleanor', 'Beatrix', 'Adriana', 'Selene'
];

const LAST_NAMES = [
  'Cross', 'Blackwood', 'Vane', 'Vanderbilt', 'Sinclair', 'Thorne', 'De la Rosa', 'Ravencroft', 'Mercer', 'Castellano',
  'Sterling', 'Von Bahr', 'Winter', 'Ashford', 'Lombardi', 'Morozov', 'Duval', 'Kallio', 'Rothschild', 'Belmont'
];

const CONCEPTS = [
  'Disgraced Vatican Scholar turned Blood Occultist',
  'Underground Arms Dealer with ties to the Anarchs',
  'Nightclub Impresario with an exclusive feeding salon',
  'Reluctant Camarilla Hound hunting thin-blood runaways',
  'High-stakes Art Forger laundering immortal antiquities',
  'Sewer Hacker extracting government surveillance feeds',
  'Former Special Forces Operator turned private security boss',
  'Coroner concealing exsanguinated corpses from police'
];

const MOTIVATIONS = [
  'Seeking revenge against a sire who abandoned them in torpor.',
  'Amassing mortal real estate before the property market crashes.',
  'Uncovering the true identity of the local Inquisitor cell commander.',
  'Securing a major boon from the Prince to open an Anarch club.',
  'Protecting their mortal great-granddaughter without revealing their undead nature.'
];

export function generateRandomKindred(edition: GameEdition = 'v5', targetClan?: string): Character {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const name = `${firstName} ${lastName}`;
  const concept = CONCEPTS[Math.floor(Math.random() * CONCEPTS.length)];

  const clanInfo = targetClan 
    ? CLANS_DATA.find(c => c.name.toLowerCase() === targetClan.toLowerCase()) || CLANS_DATA[0]
    : CLANS_DATA[Math.floor(Math.random() * CLANS_DATA.length)];

  const predatorTypeInfo = PREDATOR_TYPES_DATA[Math.floor(Math.random() * PREDATOR_TYPES_DATA.length)];

  const generation = Math.floor(Math.random() * 5) + 9; // 9 to 13
  const bloodPotency = generation <= 9 ? 2 : 1;

  // Attributes: standard array [4, 3, 3, 3, 2, 2, 2, 2, 1]
  const attrValues = [4, 3, 3, 3, 2, 2, 2, 2, 1].sort(() => Math.random() - 0.5);
  const attributes = {
    physical: { strength: attrValues[0], dexterity: attrValues[1], stamina: attrValues[2] },
    social: { charisma: attrValues[3], manipulation: attrValues[4], composure: attrValues[5] },
    mental: { intelligence: attrValues[6], wits: attrValues[7], resolve: attrValues[8] }
  };

  const healthMax = attributes.physical.stamina + 3;
  const willpowerMax = attributes.social.composure + attributes.mental.resolve;

  // Disciplines based on Clan
  const discAllocations = clanInfo.disciplines.slice(0, 2).map((discName, idx) => {
    const discDef = DISCIPLINES_DATA.find(d => d.name.toLowerCase() === discName.toLowerCase());
    const level = idx === 0 ? 2 : 1;
    const powers = discDef ? discDef.powers.filter(p => p.level <= level).map(p => p.name) : [];
    return {
      id: discName.toLowerCase().replace(/\s+/g, '_'),
      name: discName,
      level,
      powers
    };
  });

  return {
    id: 'char_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    edition,
    name,
    concept,
    clan: clanInfo.name,
    generation,
    predatorType: edition === 'v5' ? predatorTypeInfo.name : undefined,
    healthMax,
    healthDamage: new Array(healthMax).fill('none'),
    willpowerMax,
    willpowerDamage: new Array(willpowerMax).fill('none'),
    hunger: 1,
    humanity: 7,
    stains: 0,
    bloodPotency,
    ambition: MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)],
    desire: 'Survive until next dusk without making new enemies.',
    touchstones: [
      { id: 't_' + Date.now(), conviction: 'Never kill without dire justification.', touchstone: 'Dr. Sarah Lin (ER Doctor)' }
    ],
    attributes,
    skills: {
      physical: { athletics: 2, brawl: 2, craft: 1, drive: 1, firearms: 2, larceny: 1, melee: 2, stealth: 2, survival: 1 },
      social: { animalKen: 0, etiquette: 2, insight: 2, intimidation: 2, leadership: 1, performance: 1, persuasion: 3, streetwise: 2, subterfuge: 2 },
      mental: { academics: 1, awareness: 3, finance: 1, investigation: 2, medicine: 1, occult: 2, politics: 1, science: 0, technology: 1 }
    },
    specialties: {
      brawl: ['Dirty Fighting'],
      persuasion: ['Bargaining'],
      awareness: ['Danger Sense']
    },
    disciplines: discAllocations,
    advantages: [
      { id: 'adv_1', name: 'Contacts (City Informant)', type: 'merit', category: 'background', dots: 2 },
      { id: 'adv_2', name: 'Haven (Reinforced Basement)', type: 'merit', category: 'haven', dots: 2 }
    ],
    biography: `Embraced in the shadows of the metropolitan sprawl. Serves as a vital asset or dangerous rival in the nightly dance of blood.`,
    haven: 'Reinforced industrial lockup near the freight rail line.',
    experienceTotal: 10,
    experienceSpent: 0,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}
