export interface ThreatStatBlock {
  id: string;
  name: string;
  category: 'mortal' | 'ghoul' | 'inquisition' | 'werewolf' | 'vampire';
  threatLevel: 'Low' | 'Medium' | 'High' | 'Lethal';
  health: number;
  willpower: number;
  generalPool: number;
  primaryPool: { name: string; pool: number };
  secondaryPool: { name: string; pool: number };
  gearOrPowers: string[];
  tactics: string;
}

export const THREAT_STAT_BLOCKS: ThreatStatBlock[] = [
  // Second Inquisition
  {
    id: 'si_tactical_operator',
    name: 'SAD Tactical Strike Operator (FIRSTLIGHT)',
    category: 'inquisition',
    threatLevel: 'High',
    health: 7,
    willpower: 6,
    generalPool: 5,
    primaryPool: { name: 'Firearms & Breaching Tactics', pool: 8 },
    secondaryPool: { name: 'Athletics & Suppression', pool: 7 },
    gearOrPowers: [
      'Heavy Kevlar Tactical Armor (Converts Aggravated bullet wounds to Superficial)',
      'UV Spotlight Rig (Acts as localized sunlight, forcing Rötschreck checks)',
      'High-velocity Incendiary Rounds (Deals Aggravated damage to Kindred)',
      'Strobe Flashbang Grenades'
    ],
    tactics: 'Operates in fireteams of four. Blinds targets with UV floodlights while suppressing with phosphorus rounds. Never enters tight corridors alone.'
  },
  {
    id: 'si_entity_inquisitor',
    name: 'Vatican Entity Field Inquisitor',
    category: 'inquisition',
    threatLevel: 'High',
    health: 6,
    willpower: 8,
    generalPool: 5,
    primaryPool: { name: 'True Faith & Occult Lore', pool: 8 },
    secondaryPool: { name: 'Investigation & Interrogation', pool: 7 },
    gearOrPowers: [
      'True Faith (Level 2: Repels kindred through holy relics; burns on touch)',
      'Consecrated Cold-Iron Blade (Inflicts Aggravated wounds)',
      'Micro-audio jamming device'
    ],
    tactics: 'Profiles kindred networks through public utility records and surveillance. Corners lone Kindred with prayers of condemnation and holy brandings.'
  },

  // Werewolves / Lupines
  {
    id: 'garou_war_alpha',
    name: 'Lupine War-Pack Alpha (Crinos Form)',
    category: 'werewolf',
    threatLevel: 'Lethal',
    health: 12,
    willpower: 7,
    generalPool: 7,
    primaryPool: { name: 'Primal Claws & Crushing Jaws', pool: 11 },
    secondaryPool: { name: 'Tracking & Terrifying Roar', pool: 9 },
    gearOrPowers: [
      'Crinos War-Form: 9-foot towering monstrosity of muscle and fur',
      'Regeneration: Mends 1 Superficial damage per combat turn automatically',
      'Aggravated Claws: Tears clean through car doors and Kindred armor',
      'Delirium: Mortals seeing the wolf-man suffer instant hysterics or amnesia'
    ],
    tactics: 'Ambushes vehicles on desolate highways or city outskirts. Strikes in a whirlwind of razor talons, aiming directly to sever the head.'
  },

  // Ghouls
  {
    id: 'ghoul_enforcer',
    name: 'Blood-Bound Enforcer Ghoul',
    category: 'ghoul',
    threatLevel: 'Medium',
    health: 6,
    willpower: 5,
    generalPool: 4,
    primaryPool: { name: 'Brawl & Shotguns', pool: 6 },
    secondaryPool: { name: 'Intimidation & Bodyguarding', pool: 5 },
    gearOrPowers: [
      'Potence 1 (Lethal Body: punch through drywall and fracture skulls)',
      'Fortitude 1 (Resilience: extra health box)',
      'Heavy Street Pistol & Brass Knuckles',
      'Blood Bond (Level 3): Fanatically devoted to their vampire regnant'
    ],
    tactics: 'Blocks entrances to their master\'s haven during daytime hours, willing to die rather than allow intruders past.'
  },

  // Mortals
  {
    id: 'mortal_detective',
    name: 'Homicide Detective (On the Trail)',
    category: 'mortal',
    threatLevel: 'Low',
    health: 5,
    willpower: 6,
    generalPool: 4,
    primaryPool: { name: 'Investigation & Forensics', pool: 7 },
    secondaryPool: { name: 'Firearms & Interrogation', pool: 5 },
    gearOrPowers: [
      'Glock 19 Service Pistol',
      'Police Radio & Departmental Database Access',
      'Suspicious Notes on unsolved midnight exsanguinations'
    ],
    tactics: 'Follows blood trail patterns, interviews ER doctors, and pulls security cam footage near midnight clubs. Threat is legal and Masquerade exposure.'
  },

  // Vampires / Antagonists
  {
    id: 'kindred_sabbat_priest',
    name: 'Sabbat Pack Priest',
    category: 'vampire',
    threatLevel: 'High',
    health: 8,
    willpower: 7,
    generalPool: 6,
    primaryPool: { name: 'Blood Sorcery & Rituals', pool: 8 },
    secondaryPool: { name: 'Melee & Fanatic Leadership', pool: 7 },
    gearOrPowers: [
      'Blood Sorcery 3 (Cauldron of Blood, Theft of Vitae)',
      'Oblivion 2 (Arms of Ahriman)',
      'Celerity 2 (Fleetness)',
      'Serrated Sacrificial Kukri Knife'
    ],
    tactics: 'Conducts Vaulderie blood rites with their pack. Uses dark magic from concealment while directing frenzied pack fledglings into melee.'
  }
];
