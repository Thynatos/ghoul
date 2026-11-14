import { PredatorTypeInfo } from '../types/vtm';

export const PREDATOR_TYPES_DATA: PredatorTypeInfo[] = [
  {
    name: 'Alleycat',
    tagline: 'Take it by force in the dark corners of the night.',
    description: 'You stalk lonely alleyways, parking garages, and abandoned docks, ambushing your prey and taking blood through violence, intimidation, or muggings.',
    huntingPool: 'Strength + Brawl or Wits + Streetwise',
    disciplines: ['Celerity', 'Potence'],
    specialties: ['Brawl (Grappling)', 'Intimidation (Stickups)', 'Stealth (Ambushes)'],
    meritsFlaws: ['Merit: Criminal Contacts (••)', 'Flaw: Enemy (•) or Infamy (•)'],
    humanityImpact: -1,
    bloodPotencyImpact: 0
  },
  {
    name: 'Bagger',
    tagline: 'Cold blood from cold plastic bags.',
    description: 'You rarely feed from warm throats directly; instead, you steal, bribe, or forge access to hospital blood banks, morgues, or animal clinics.',
    huntingPool: 'Intelligence + Streetwise or Manipulation + Finance',
    disciplines: ['Blood Sorcery', 'Obfuscate'],
    specialties: ['Larceny (Lockpicking)', 'Streetwise (Black Market)', 'Medicine (Blood Transfusions)'],
    meritsFlaws: ['Merit: Iron Gullet (•••)', 'Flaw: Feeding Restriction (Bagged Blood)'],
    humanityImpact: 0,
    bloodPotencyImpact: 0
  },
  {
    name: 'Blood Leech',
    tagline: 'The ultimate taboo: drinking from other Kindred.',
    description: 'You hunt your own kind. Whether through ambushing rogue Thin-bloods, draining criminals, or feeding on torpid elders, you risk the wrath of the entire city.',
    huntingPool: 'Strength + Brawl or Manipulation + Subterfuge',
    disciplines: ['Celerity', 'Protean'],
    specialties: ['Brawl (Kindred)', 'Stealth (Stalking Vampires)', 'Occult (Vitae Resonances)'],
    meritsFlaws: ['Merit: High Generation Hunter', 'Flaw: Dark Secret (Diablerist/Leech) (••)', 'Flaw: Prey Exclusion (Mortals) (••)'],
    humanityImpact: -1,
    bloodPotencyImpact: 1
  },
  {
    name: 'Cleaver',
    tagline: 'Hiding in plain sight within a mortal family.',
    description: 'You maintain a mortal domestic life—often your former family, children, or adopted mortals. You feed on them secretly in their sleep while pretending to be human.',
    huntingPool: 'Manipulation + Subterfuge',
    disciplines: ['Dominate', 'Animalism'],
    specialties: ['Subterfuge (Cover Stories)', 'Persuasion (Family Gaslighting)', 'Medicine (Sedatives)'],
    meritsFlaws: ['Merit: Herd (••)', 'Flaw: Dark Secret (Cleaver) (•)', 'Flaw: Touchstone Vulnerability'],
    humanityImpact: 0,
    bloodPotencyImpact: 0
  },
  {
    name: 'Consensualist',
    tagline: 'Never take blood without explicit permission.',
    description: 'You belong to a subculture—gothic clubs, fetish rings, or open blood play—where mortals willingly offer their veins, fully informed or under romantic guise.',
    huntingPool: 'Charisma + Persuasion',
    disciplines: ['Auspex', 'Fortitude'],
    specialties: ['Medicine (Phlebotomy)', 'Persuasion (Consent)', 'Insight (Empathy)'],
    meritsFlaws: ['Merit: High Humanity Anchor', 'Flaw: Prey Exclusion (Non-consenting Mortals) (•)', 'Flaw: Masquerade Risk'],
    humanityImpact: 1,
    bloodPotencyImpact: 0
  },
  {
    name: 'Farmer',
    tagline: 'Refusing to kill human souls by feeding only on beasts.',
    description: 'You abhor taking human life and feed exclusively on livestock, shelter animals, stray dogs, or rats. Your Beast grows ravenous and frustrated on such thin fare.',
    huntingPool: 'Composure + Animal Ken',
    disciplines: ['Animalism', 'Protean'],
    specialties: ['Animal Ken (Livestock)', 'Survival (Tracking Animals)'],
    meritsFlaws: ['Flaw: Feeding Restriction (Animals Only) (••)', 'Flaw: Social Disgust among Kindred'],
    humanityImpact: 1,
    bloodPotencyImpact: 0
  },
  {
    name: 'Osiris',
    tagline: 'A god among mortals, surrounded by worshipping disciples.',
    description: 'You are the center of a cult, religion, or exclusive esoteric circle. Your acolytes consider it a holy honor to bleed for their divine shepherd.',
    huntingPool: 'Manipulation + Performance or Charisma + Occult',
    disciplines: ['Blood Sorcery', 'Presence'],
    specialties: ['Occult (Cult Rituals)', 'Performance (Sermons)', 'Leadership (Congregations)'],
    meritsFlaws: ['Merit: Herd (•••)', 'Merit: Fame (•)', 'Flaw: Mythic Enemy (Inquisition / Cult Rival) (••)'],
    humanityImpact: 0,
    bloodPotencyImpact: 0
  },
  {
    name: 'Sandman',
    tagline: 'In the dead of night, slipping through open bedroom windows.',
    description: 'You break into homes or hospital rooms while your prey sleeps deeply, feed silently without waking them, and slip away into the dark.',
    huntingPool: 'Dexterity + Stealth',
    disciplines: ['Auspex', 'Obfuscate'],
    specialties: ['Stealth (Silent Entry)', 'Larceny (Burglary)', 'Awareness (Sleep Breathing)'],
    meritsFlaws: ['Merit: Haven Security (•)', 'Merit: Resources (•)'],
    humanityImpact: 0,
    bloodPotencyImpact: 0
  },
  {
    name: 'Scene Queen',
    tagline: 'VIP booths, throbbing bass, and intoxicated partygoers.',
    description: 'You thrive in the nightlife: underground raves, exclusive art galas, or dive bars. You prey upon inebriated clubgoers who will chalk up bite marks to a hazy hangover.',
    huntingPool: 'Charisma + Streetwise or Manipulation + Performance',
    disciplines: ['Dominate', 'Potence'],
    specialties: ['Streetwise (Nightlife Gossip)', 'Etiquette (VIP Lounges)', 'Leadership (Social Cliques)'],
    meritsFlaws: ['Merit: Fame (•)', 'Merit: Contacts (••)', 'Flaw: Feeding Restriction (Exclusivity) (•)'],
    humanityImpact: 0,
    bloodPotencyImpact: 0
  },
  {
    name: 'Siren',
    tagline: 'Seduction, intimacy, and intoxicating romance.',
    description: 'You use physical beauty, charm, and sexual allure to lure prey into bedrooms, private hotel suites, or dark cars where the Kiss masquerades as passionate pleasure.',
    huntingPool: 'Charisma + Subterfuge or Manipulation + Insight',
    disciplines: ['Fortitude', 'Presence'],
    specialties: ['Persuasion (Seduction)', 'Subterfuge (Bedside Lies)', 'Performance (Flirtation)'],
    meritsFlaws: ['Merit: Beautiful (••)', 'Flaw: Enemy (Spurned Ex-Lover / Stalker) (•)'],
    humanityImpact: 0,
    bloodPotencyImpact: 0
  },
  {
    name: 'Trapdoor',
    tagline: 'The spider waiting inside its personal labyrinth.',
    description: 'You don\'t hunt in the streets; you built a trap. You run an escape room, an underground sex club, an isolated hotel, or an abandoned subway station where victims wander into your parlor.',
    huntingPool: 'Wits + Craft or Intelligence + Investigation',
    disciplines: ['Obfuscate', 'Protean'],
    specialties: ['Craft (Trap Building)', 'Investigation (Profiling Guests)', 'Stealth (Lurking)'],
    meritsFlaws: ['Merit: Haven (•••)', 'Flaw: Feeding Restriction (Only within Haven) (•)'],
    humanityImpact: 0,
    bloodPotencyImpact: 0
  }
];
