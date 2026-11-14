import { CoterieTypeInfo } from '../types/coterie';

export const COTERIE_TYPES: CoterieTypeInfo[] = [
  {
    id: 'blood_brotherhood',
    name: 'Blood Brotherhood',
    tagline: 'Bound by vitae and sacred oath beyond mortal kinship.',
    description: 'Members of a Blood Brotherhood are bound to one another through repeated Vinculum or shared feeding rituals. They fight as one unit, sharing resources and pain with unnatural synchronization.',
    favoredDisciplines: ['Blood Sorcery', 'Potence', 'Fortitude'],
    standardAdvantages: [
      'Shared Haven (Security 2)',
      'Blood Sympathy (Sense coterie injury)',
      'Bond Resistance (Mutual support against third-party Dominate)'
    ],
    havenRecommendations: ['Communal Crypt', 'Warded Underground Cellar', 'Blood Vault'],
    domainRole: 'Internal stability, blood rituals, and mutual defense.'
  },
  {
    id: 'cerberus',
    name: 'Cerberus',
    tagline: 'Guardians of ancient relics, torpid elders, and sacred gates.',
    description: 'A Cerberus coterie exists to guard a specific location, person, or artifact of critical importance to an elder, Prince, or sect. They rarely leave their post and maintain brutal defensive doctrines.',
    favoredDisciplines: ['Fortitude', 'Auspex', 'Obfuscate'],
    standardAdvantages: [
      'Fortified Haven (Portillon +2)',
      'Keeper of the Elysium or Vault status',
      'Advanced Security Surveillance'
    ],
    havenRecommendations: ['Subterranean Vault', 'Bank Safe Deposit Facility', 'Historic Mausoleum'],
    domainRole: 'Territory fortification and static perimeter defense.'
  },
  {
    id: 'champions',
    name: 'Champions',
    tagline: 'Defenders of the mortal herd and righteous crusaders.',
    description: 'Often Anarchs or high-Humanity Kindred, Champions dedicate themselves to safeguarding a mortal community, subculture, or neighborhood against predatory kindred and corrupt mortal syndicates.',
    favoredDisciplines: ['Potence', 'Presence', 'Fortitude'],
    standardAdvantages: [
      'Lien (Mortal Community Support +2)',
      'Allies (Local street gangs or community organizers)',
      'Humanity Maintenance (+1 dice to remorse tests)'
    ],
    havenRecommendations: ['Community Center Basement', 'Barricaded Church Hall', 'Firehouse'],
    domainRole: 'Mortal protection, community relations, and moral resistance.'
  },
  {
    id: 'commando',
    name: 'Commando',
    tagline: 'Sect strike team built for swift, lethal kinetic operations.',
    description: 'A tactical military cell organized to eliminate threats before they manifest. Whether conducting raids against Second Inquisition safehouses or purging Lupines, the Commando moves with military precision.',
    favoredDisciplines: ['Celerity', 'Potence', 'Obfuscate'],
    standardAdvantages: [
      'Armory (Mil-spec weaponry and incendiary ammunition)',
      'Hidden Escape Tunnels',
      'Vehicle Fleet (Blacked-out tactical SUVs)'
    ],
    havenRecommendations: ['Industrial Warehouse', 'Decommissioned Bunker', 'Shipping Container Yard'],
    domainRole: 'Assault operations, extraction, and targeted assassinations.'
  },
  {
    id: 'day_watch',
    name: 'Day Watch',
    tagline: 'The sunlight wardens who control mortals while the masters slumber.',
    description: 'Composed of kindred with Thin-Blood daylight traits or kindred heavily reliant on skilled mortal ghouls and mercenaries, the Day Watch manages business, police, and defense during high noon.',
    favoredDisciplines: ['Dominate', 'Presence', 'Thin-Blood Alchemy'],
    standardAdvantages: [
      'Retainers (Daytime mortal ghouls +3)',
      'Police & Municipal Influence',
      'Daylight Surveillance Suite'
    ],
    havenRecommendations: ['Corporate Office Tower', 'Security Firm Headquarters', 'Law Firm Suite'],
    domainRole: 'Daytime operations, Masquerade coverups, and municipal logistics.'
  },
  {
    id: 'envoys',
    name: 'Envoys',
    tagline: 'Diplomats, ambassadors, and brokers between hostile courts.',
    description: 'Tasked with carrying treaties and terms between Camarilla, Anarchs, Ashirra, or independent bloodlines. Envoys possess high social grace and immunities granted by ancient hospitality traditions.',
    favoredDisciplines: ['Presence', 'Dominate', 'Auspex'],
    standardAdvantages: [
      'Elysium Privileges & High Status',
      'Linguistics & Diplomatic Immunity',
      'High Society Contacts'
    ],
    havenRecommendations: ['Boutique Luxury Hotel Penthouse', 'Consulate Building', 'Private Club Suite'],
    domainRole: 'Diplomacy, treaty enforcement, and interstate mediation.'
  },
  {
    id: 'fang_gang',
    name: 'Fang Gang',
    tagline: 'Criminal syndicates and street extortionists operating in the shadows.',
    description: 'Operating like a ruthless mafia crew or organized street syndicate, Fang Gangs profit from racketeering, narcotics, arms trafficking, and illegal gambling, using mortal criminal networks as camouflage.',
    favoredDisciplines: ['Potence', 'Celerity', 'Dominate'],
    standardAdvantages: [
      'Streetwise Network (+2)',
      'Criminal Front (Laundromat, chop shop, club)',
      'Black Market Arms Contacts'
    ],
    havenRecommendations: ['Nightclub Basement', 'Auto-Body Chop Shop', 'Abandoned Warehouse'],
    domainRole: 'Financial extortion, contraband supply, and street enforcement.'
  },
  {
    id: 'hunting_pack',
    name: 'Hunting Pack',
    tagline: 'Apex predators stalking designated feeding grounds.',
    description: 'Formed specifically to secure and optimize a communal feeding territory (The Rack). Members work in concert to corner rare blood resonances, protect herd quality, and suppress masquerade breaches.',
    favoredDisciplines: ['Animalism', 'Obfuscate', 'Auspex'],
    standardAdvantages: [
      'Chasse (+2 to hunting ground quality)',
      'Communal Herd (Curated mortals with specific resonances)',
      'Feeding Sanctuary'
    ],
    havenRecommendations: ['Hospital Morgue Adjacent', 'University District Brownstone', 'Underground Rave Club'],
    domainRole: 'Feeding optimization, herd stewardship, and blood curation.'
  },
  {
    id: 'marotte',
    name: 'Marotte',
    tagline: 'Court jesters, satirical agitators, and social saboteurs.',
    description: 'Specializing in tearing down pompous elders through public mockery, cutting satire, and street theater. While hated by stiff Primogen, savvy Princes use them as a safety valve for kindred dissent.',
    favoredDisciplines: ['Presence', 'Obfuscate', 'Dementation / Dominate'],
    standardAdvantages: [
      'Underground Media Channels (Podcasts, Pirate Radio)',
      'Court License to Jest without execution',
      'Rumor Mill Influence'
    ],
    havenRecommendations: ['Bohemian Artist Loft', 'Independent Theater Basement', 'Pirate Radio Station'],
    domainRole: 'Social warfare, counter-propaganda, and court intrigue.'
  },
  {
    id: 'nomad_pack',
    name: 'Nomad Pack',
    tagline: 'Drifters and highway phantoms bound to no mortal city.',
    description: 'Prowling the interstate highways and forgotten rural roads in convoy campers and muscle cars. They rarely stay in any city for more than a moon, avoiding sect bureaucracy entirely.',
    favoredDisciplines: ['Animalism', 'Survival / Protean', 'Celerity'],
    standardAdvantages: [
      'Mobile Havens (Armored RVs with blackout curtains)',
      'Lupine Avoidance Protocol',
      'Dead Drop Network across state lines'
    ],
    havenRecommendations: ['Modified Tour Bus', 'Abandoned Highway Motel', 'Desert Cargo Container'],
    domainRole: 'Courier work, wilderness scouting, and border crossing.'
  },
  {
    id: 'plumaire',
    name: 'Plumaire',
    tagline: 'Arbiter of elegance, high fashion, and aesthetic decadence.',
    description: 'A coterie centered around the grand art salons, haute couture, and immortal aesthetic perfection. They dictate who is in favor at Court and who is ostracized as a tasteless pariah.',
    favoredDisciplines: ['Presence', 'Auspex', 'Dominate'],
    standardAdvantages: [
      'Luxury Haven (Opulence 3)',
      'Toreador Primogen Patronage',
      'High Fashion & Media Sway'
    ],
    havenRecommendations: ['Gold Coast Gallery Penthouse', 'Fashion Design Studio', 'Private Opera Box'],
    domainRole: 'Cultural dominance, prestige manufacturing, and court trendsetting.'
  },
  {
    id: 'questing',
    name: 'Questing',
    tagline: 'Seekers of lost Noddist lore, Golconda, and occult secrets.',
    description: 'Bound by scholarly obsession or mystical revelation, Questing coteries scour ancient tombs, decipher forgotten Grimoires, and investigate strange geomantic anomalies across the globe.',
    favoredDisciplines: ['Blood Sorcery', 'Auspex', 'Oblivion'],
    standardAdvantages: [
      'Occult Library (+2 to occult research)',
      'Ancient Relic or Artifact',
      'Scholarly Academic Contacts'
    ],
    havenRecommendations: ['Antiquarian Bookstore Basement', 'University Rare Manuscripts Archive', 'Sanctum Chantry'],
    domainRole: 'Esoteric investigation, anti-demonology, and relic recovery.'
  },
  {
    id: 'sabbat_pack',
    name: 'Sabbat Pack',
    tagline: 'Fanatical shock troops in the Gehenna War.',
    description: 'Bound by the fiery rite of the Vaulderie, Sabbat Packs view themselves as holy crusaders destined to cleanse the Antediluvian progenitors. They strike with terrifying frenzy and cruelty.',
    favoredDisciplines: ['Protean', 'Potence', 'Oblivion'],
    standardAdvantages: [
      'Vaulderie Vinculum (Immunity to standard blood bonds)',
      'Pack Tactics Combat Feats',
      'Desensitized to Torture / Terror'
    ],
    havenRecommendations: ['Abandoned Slaughterhouse', 'Flooded Subway Tunnels', 'Squatters Compound'],
    domainRole: 'Asymmetric warfare, elder assassination, and holy terror.'
  },
  {
    id: 'vehme',
    name: 'Vehme',
    tagline: 'Secret court judges enforcing the Masquerade with absolute finality.',
    description: 'The secret judicial arm of the Camarilla or Prince. The Vehme investigates hidden treasons, Masquerade breaches, and diablerie rumors, authorized to execute final death without trial.',
    favoredDisciplines: ['Dominate', 'Auspex', 'Fortitude'],
    standardAdvantages: [
      'Execution Warrant from the Inner Circle',
      'Warded Interrogation Cell',
      'Sheriff & Scourge Authority'
    ],
    havenRecommendations: ['Police Precinct Holding Cell Basement', 'Old Courthouse Vault', 'Private Crematorium'],
    domainRole: 'Counter-intelligence, inquisitorial trials, and silent purges.'
  },
  {
    id: 'watchtower',
    name: 'Watchtower',
    tagline: 'Sentinels perched atop the city observing all that moves.',
    description: 'Specialists in communication, citywide surveillance, wiretapping, and signal interception. The Watchtower knows who enters the city limits before the Scourge or Sheriff ever hear a whisper.',
    favoredDisciplines: ['Auspex', 'Oblivion', 'Technology / Dominate'],
    standardAdvantages: [
      'Citywide CCTV & Traffic Feed Access',
      'Radio & Digital Intercept Tower',
      'Extensive Street Informant Ring'
    ],
    havenRecommendations: ['Radio Station Transmitter Tower', 'Telecom Server Vault', 'High-rise Rooftop Suite'],
    domainRole: 'Signals intelligence, early warning, and perimeter telemetry.'
  }
];

export const HAVEN_TRAIT_OPTIONS = [
  { id: 'armory', name: 'Armory', description: 'Stockpiles of firearms, ammunition, melee weapons, and body armor.' },
  { id: 'escape_tunnels', name: 'Hidden Escape Tunnels', description: 'Concealed subterranean routes leading beyond police cordons.' },
  { id: 'laboratory', name: 'Laboratory', description: 'Equipped for chemical analysis, blood alchemy, and toxic distillation.' },
  { id: 'occult_library', name: 'Occult Library', description: 'Rare grimoires, Noddist tablets, and ritual components.' },
  { id: 'medical_clinic', name: 'Medical Clinic', description: 'Surgical table, blood refrigeration, sterile supplies, and medical tools.' },
  { id: 'warded', name: 'Warded Perimeter', description: 'Blood Sorcery warding runes against spirits, Lupines, and unauthorized Kindred.' },
  { id: 'holding_cells', name: 'Reinforced Holding Cells', description: 'Heavy steel doors and soundproofing for holding prisoners or test subjects.' },
  { id: 'luxury', name: 'Opulent Luxury', description: 'Bespoke marble, fine vintage wines for mortal guests, and master acoustic styling.' },
  { id: 'watchmen', name: 'Ghoul Security Detail', description: 'Armed blood-bound sentinels patrolling 24/7 during day and night cycles.' },
  { id: 'sun_baffle', name: 'Double Air-Lock Sun Baffles', description: 'Triple-sealed light seals preventing any stray ray of dawn from penetrating.' }
];
