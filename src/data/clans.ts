import { ClanInfo } from '../types/vtm';

export const CLANS_DATA: ClanInfo[] = [
  {
    name: 'Brujah',
    tagline: 'Revolution requires passion and strength.',
    quote: 'Think for yourself, or someone else will do it for you.',
    symbol: '⚡',
    disciplines: ['Celerity', 'Potence', 'Presence'],
    bane: 'Violent Temper: Subtract dice equal to Bane Severity from pools to resist frenzy (fury or terror).',
    compulsion: {
      name: 'Rebellion',
      description: 'The vampire takes a stand against whatever or whoever represents authority or restraint. They suffer a -2 penalty to all actions not directly challenging that authority until they force a concession or the scene ends.'
    },
    archetypes: ['Punk Activist', 'Warrior Scholar', 'Biker Outlaw', 'Union Leader', 'Underground Agitator'],
    lore: 'The Brujah were once philosopher-kings in ancient Carthage, but today they are known as the Rabble—rebels, iconoclasts, and firebrands who rail against any hierarchy that seeks to bind them. Driven by potent passion, they move with supernatural speed and strike with devastating force.',
    v20Disciplines: ['Celerity', 'Potence', 'Presence'],
    v20Weakness: 'Difficulties of rolls to resist frenzy are two higher than normal, to a maximum of 10.'
  },
  {
    name: 'Gangrel',
    tagline: 'Ferocity is the path to authenticity and wisdom.',
    quote: 'The city is just a concrete cage. Out here, the wolves still know their place.',
    symbol: '🐺',
    disciplines: ['Animalism', 'Fortitude', 'Protean'],
    bane: 'Bestial Features: In frenzy, the vampire takes on temporary animal features (claws, feathers, slit pupils). Each feature reduces one Social attribute pool by 1 dot per Bane Severity until they fade.',
    compulsion: {
      name: 'Feral Impulses',
      description: 'Returning to an animal state of mind, speech becomes difficult and human social etiquette impossible. Suffer a -3 penalty to all Mental and Social rolls except Intimidation and Animal Ken.'
    },
    archetypes: ['Wilderness Survivalist', 'Bounty Hunter', 'Eco-Terrorist', 'Nomad Drifter', 'Apex Predator'],
    lore: 'Close to the Beast within, the Gangrel are the masters of shape-shifting and survival. They prefer open territory, forests, and desolate outskirts to crowded salons. Tough as granite and attuned to creatures of the night, they can melt into the earth when the sun threatens.',
    v20Disciplines: ['Animalism', 'Fortitude', 'Protean'],
    v20Weakness: 'Every frenzy inflicts a temporary or permanent animalistic feature, reducing Social attributes over time.'
  },
  {
    name: 'Malkavian',
    tagline: 'Madness is a perspective that cuts through the fog of reality.',
    quote: 'We see the strings dancing in the dark. Would you like us to cut yours?',
    symbol: '👁️',
    disciplines: ['Auspex', 'Dominate', 'Obfuscate'],
    bane: 'Fractured Mind: Afflicted by permanent mental disturbance or derangement. When suffering a Bestial Failure or Compulsion, their derangement flares into acute crisis.',
    compulsion: {
      name: 'Delusion',
      description: 'Their preternatural senses over-interpret omens and hidden truths. The vampire suffers a -2 penalty to Resolve and Composure rolls as hallucinations and whispers drown out mundane reality.'
    },
    archetypes: ['Broken Prophet', 'Unlicensed Psychoanalyst', 'Cryptic Hacker', 'Gothic Artist', 'Street Oracle'],
    lore: 'Linked together by the enigmatic Cobweb—a psychic sub-conscious network spanning all members of the clan—the Lunatics see beyond the veil of mundane logic. Their fractured perceptions often grant miraculous insight into secrets others would kill to hide.',
    v20Disciplines: ['Auspex', 'Dementation', 'Obfuscate'],
    v20Weakness: 'Incurable derangement acquired upon the Embrace that cannot be overcome with Willpower.'
  },
  {
    name: 'Nosferatu',
    tagline: 'Truth can come only through those who can\'t hide it.',
    quote: 'You fear the shadows. You forget that I live in them.',
    symbol: '🐀',
    disciplines: ['Animalism', 'Obfuscate', 'Potence'],
    bane: 'Repulsive Visage: Horrifically disfigured by the Embrace. Any attempt to blend into mortal crowds or seduce without disguise automatically fails, and masquerade breaches loom if unmasked.',
    compulsion: {
      name: 'Cryptophilia',
      description: 'A ravenous craving for forbidden secrets and hidden vulnerabilities. Suffer a -2 penalty to actions until discovering a compromising secret about another kindred or influential mortal.'
    },
    archetypes: ['Subterranean Broker', 'Dark Web Architect', 'Sewer King', 'Reluctant Informant', 'Gutter Ghoulmaster'],
    lore: 'Cursed with grotesque physical degradation, the Sewer Rats retreat into subterranean warrens, sewers, and catacombs. In compensation, they command Legions of vermin and deal in the most valuable currency in Kindred society: information.',
    v20Disciplines: ['Animalism', 'Obfuscate', 'Potence'],
    v20Weakness: 'Appearance rating is permanently 0 and cannot be increased by any means.'
  },
  {
    name: 'Toreador',
    tagline: 'Beauty is eternal, as is our appetite for it.',
    quote: 'Art is the only lie that tells the eternal truth.',
    symbol: '🌹',
    disciplines: ['Auspex', 'Celerity', 'Presence'],
    bane: 'Aesthetic Fixation: The vampire is overwhelmed by transcendent beauty or art. In less than exquisite surroundings, they suffer a penalty equal to Bane Severity to all discipline pools.',
    compulsion: {
      name: 'Enthralled',
      description: 'Enraptured by a person, object, performance, or sensory wonder. The vampire is rooted in place and can take no action without spending Willpower to break free from the obsession.'
    },
    archetypes: ['Haute Couture Designer', 'Socialite Influencer', 'Classical Virtuoso', 'Art Collector', 'Glamour Nightclub Owner'],
    lore: 'The Divas are the arbiters of culture, passion, and high society. Mingling seamlessly among mortal high society, artists, and celebrities, they feel sensory joys with a hunger more acute than any beast, weaponizing elegance into lethal political supremacy.',
    v20Disciplines: ['Auspex', 'Celerity', 'Presence'],
    v20Weakness: 'Must roll Self-Control when encountering something of breathtaking beauty or be entranced for the scene.'
  },
  {
    name: 'Tremere',
    tagline: 'Knowledge is power; blood is the catalyst.',
    quote: 'Magic is not a mystery to be admired. It is an equation to be solved.',
    symbol: '🔮',
    disciplines: ['Auspex', 'Blood Sorcery', 'Dominate'],
    bane: 'Deficient Blood: Since the destruction of the Prime Chantry in Vienna, the Tremere can no longer fully Blood Bond other Kindred without immense effort, and their blood is brittle and resistant to binding others.',
    compulsion: {
      name: 'Perfectionism',
      description: 'Obsessed with precise execution and occult theory. Suffer a -2 penalty to all subsequent actions after any failure until a task is completed with flawless excellence.'
    },
    archetypes: ['Occult Academic', 'Corporate Alchemist', 'Strict Hermeticist', 'Forbidden Grimoire Hunter', 'Chantry Archivist'],
    lore: 'Usurpers who stole vampiric immortality through hermetic alchemy, the Warlocks wield Blood Sorcery—a terrifying discipline of rituals, curses, and alchemical formulas. Though their strict hierarchical pyramid fractured, their sorcerous lethality remains unchallenged.',
    v20Disciplines: ['Auspex', 'Dominate', 'Thaumaturgy'],
    v20Weakness: 'Strict clan hierarchy requires drinking from the blood of the seven elders upon Embrace, making them one step closer to the blood bond.'
  },
  {
    name: 'Ventrue',
    tagline: 'To rule is both our birthright and greatest burden.',
    quote: 'Someone has to lead. You may kneel whenever you are ready.',
    symbol: '👑',
    disciplines: ['Dominate', 'Fortitude', 'Presence'],
    bane: 'Rarefied Taste: The Blue Blood can only feed from mortals of a specific, exclusive demographic (e.g., blue-eyed blondes, CEOs, heroin addicts, virgins, clergy). All other blood is vomited up as ash.',
    compulsion: {
      name: 'Arrogance',
      description: 'Driven to assert unquestioned dominion over all present. Suffer a -2 penalty to actions unless giving orders or actively commanding others to obey your decree.'
    },
    archetypes: ['Wall Street Tycoon', 'Old Money Patriarch', 'Political Campaign Master', 'Mafia Don', 'Ruthless Executive'],
    lore: 'The Clan of Kings believes that leadership of the Kindred is their holy and natural destiny. The architects of the Camarilla and guardians of the Masquerade, they command boardrooms, banks, and royal halls with an iron will and regal poise.',
    v20Disciplines: ['Dominate', 'Fortitude', 'Presence'],
    v20Weakness: 'Severe feeding restriction. Ventrue cannot feed on any mortal outside their chosen prey criteria.'
  },
  {
    name: 'Banu Haqim',
    tagline: 'Judgment falls upon the guilty; the blood remembers.',
    quote: 'Law without teeth is merely polite suggestion. We are the teeth.',
    symbol: '⚖️',
    disciplines: ['Blood Sorcery', 'Celerity', 'Obfuscate'],
    bane: 'Blood Addiction: Slaking hunger from Kindred blood drives the Judge into uncontrollable frenzy. Suffer hunger frenzy tests whenever tasting vampire vitae.',
    compulsion: {
      name: 'Judgment',
      description: 'Compelled to punish anyone who violates personal convictions or established law. Suffer a -2 penalty to rolls that do not pursue vengeance or justice against the transgressor.'
    },
    archetypes: ['Silent Assassin', 'Vigilante Judge', 'Forensic Investigator', 'Sharia Legalist', 'Shadow Enforcer'],
    lore: 'Known historically as the Children of Haqim or the Assamites, this clan of warrior-scholars and assassins adheres to strict codes of justice and retribution. Steeped in Middle Eastern lore and ancient alchemical blood arts, they strike from silence to purge the unworthy.',
    v20Disciplines: ['Celerity', 'Obfuscate', 'Quietus'],
    v20Weakness: 'Severe addiction to Kindred vitae; skin darkens progressively as generation and age increases.'
  },
  {
    name: 'Hecata',
    tagline: 'Death is not an ending, but an untapped estate.',
    quote: 'The living are so short-sighted. The dead have all eternity to settle scores.',
    symbol: '💀',
    disciplines: ['Auspex', 'Fortitude', 'Oblivion'],
    bane: 'Painful Kiss: The bite of a Hecata causes agonizing torment instead of euphoric ecstasy. Mortals bitten scream and fight violently, making stealthy feeding almost impossible without restraint.',
    compulsion: {
      name: 'Morbid Curiosity',
      description: 'Irresistibly drawn to decay, ghosts, corpses, and mortality. Suffer a -2 penalty on tasks not directly linked to inspecting mortal weakness, sickness, or necrotic mysteries.'
    },
    archetypes: ['Funeral Director', 'Inheritance Attorney', 'Mafia Chemist', 'Medium Necromancer', 'Forensic Pathologist'],
    lore: 'United under the Clan of Death, the Giovanni, Cappadocians, Samedi, and Harbingers fused their blood into the Hecata. Operating like an insular family syndicate, they manipulate spirits of the underworld and command the chilling ceremonies of Oblivion.',
    v20Disciplines: ['Auspex', 'Fortitude', 'Necromancy'],
    v20Weakness: 'Bite causes severe damage and agonizing pain rather than the blissful Kiss.'
  },
  {
    name: 'Lasombra',
    tagline: 'As shadows cover the world, we control it.',
    quote: 'The light flatters fools. The abyss reveals what you truly are.',
    symbol: '🌑',
    disciplines: ['Dominate', 'Oblivion', 'Potence'],
    bane: 'Ruthless Shadow: The reflection of a Lasombra is distorted, flickering, or absent in mirrors and electronic screens, and modern audio/video devices generate severe feedback or glitches in their presence.',
    compulsion: {
      name: 'Ruthlessness',
      description: 'Failure is unacceptable. The vampire cannot accept second place or compromise; any setback demands immediate, brutal escalation and dominant victory.'
    },
    archetypes: ['Shadow Cardinal', 'Ruthless Corporate Raider', 'Covert Operative', 'Darwinian Aristocrat', 'Abyssal Priest'],
    lore: 'The Magisters of shadow and darkness are ruthless social Darwinists who command the living dark through Oblivion. Rejecting the ostentatious thrones of the Ventrue, the Lasombra prefer to govern from the velvet shadows behind the throne.',
    v20Disciplines: ['Dominate', 'Obtenebration', 'Potence'],
    v20Weakness: 'Cast no reflection in mirrors or reflective surfaces, and cannot appear clearly on cameras.'
  },
  {
    name: 'The Ministry',
    tagline: 'To be truly free, you must surrender to yourself.',
    quote: 'Shame is a cage forged by hypocrites. Let me show you how sweet the key tastes.',
    symbol: '🐍',
    disciplines: ['Obfuscate', 'Presence', 'Protean'],
    bane: 'Abhorrent Sun: Sunlight burns the Ministry with ferocious fury. Suffer one extra point of Aggravated damage from any sunlight, and bright artificial light induces disorientation.',
    compulsion: {
      name: 'Transgression',
      description: 'Driven to entice or coerce another person into indulging their deepest vice or taboo. Suffer a -2 penalty to actions until breaking a societal or moral rule.'
    },
    archetypes: ['Cult Leader', 'Underground Drug Kingpin', 'Temptation Broker', 'Charismatic Preacher', 'Rebel Guru'],
    lore: 'Formerly known as the Followers of Set, the Ministry portrays the Embrace as spiritual liberation from mortal guilt and moral chains. They operate as temptresses, spiritual guides, and illicit fixers who corrode conviction and break down social taboos.',
    v20Disciplines: ['Obfuscate', 'Presence', 'Serpentis'],
    v20Weakness: 'Highly susceptible to bright light; double damage from sunlight and penalties in glaring artificial lights.'
  },
  {
    name: 'Ravnos',
    tagline: 'Nothing is real; everything is a game of smoke and mirrors.',
    quote: 'Look closely at my hands. Now look at your pockets.',
    symbol: '🎭',
    disciplines: ['Animalism', 'Obfuscate', 'Presence'],
    bane: 'Doomed Slumber: The Ravnos cannot sleep in the same location more than once in seven days without their resting place burning with necrotic phantom fire.',
    compulsion: {
      name: 'Tempting Fate',
      description: 'Compelled to perform outrageous gambles, daring heists, or dangerous bravado. Suffer a -2 penalty to all actions that do not court reckless thrill or spectacle.'
    },
    archetypes: ['Illusionist Grifter', 'Antique Smuggler', 'Fortune Teller', 'Nomadic Daredevil', 'Cyber Scammer'],
    lore: 'Survivors of the cataclysmic Week of Nightmares that wiped out their antediluvian, the modern Rogues are restless wanderers and illusionists. Master tricksters who weave phantasms out of thin air, they never stay in one haven for long.',
    v20Disciplines: ['Animalism', 'Chimerstry', 'Fortitude'],
    v20Weakness: 'Must indulge a specific vice or crime whenever the opportunity presents itself unless rolling Self-Control.'
  },
  {
    name: 'Salubri',
    tagline: 'To heal the soul, one must carry its burdens.',
    quote: 'Give me your suffering. My third eye sees the pain you dare not speak.',
    symbol: '👁️‍🗨️',
    disciplines: ['Auspex', 'Dominate', 'Fortitude'],
    bane: 'Tempting Blood: The blood of a Salubri smells overwhelmingly sweet to all other Kindred. When another vampire drinks from them, they must resist Hunger frenzy or drain the Salubri dry.',
    compulsion: {
      name: 'Empathy',
      description: 'Overwhelmed by the pain and trauma of others. The Salubri must prioritize comforting, healing, or resolving the distress of someone nearby before pursuing their own goals.'
    },
    archetypes: ['Spiritual Healer', 'Pariah Monk', 'Trauma Surgeon', 'Hermit Sage', 'Righteous Pacifist'],
    lore: 'A tiny, hunted bloodline bearing a mystical third eye in the center of their forehead. Long slandered as soul-stealers by the Tremere who stole their founder\'s blood, the Salubri possess miraculous powers of spiritual healing, soul-mending, and stoic defense.',
    v20Disciplines: ['Auspex', 'Fortitude', 'Obeah'],
    v20Weakness: 'Must be given permission before feeding on a mortal, or suffer humanity loss.'
  },
  {
    name: 'Tzimisce',
    tagline: 'Ownership is the only absolute truth in existence.',
    quote: 'Flesh is clay. Clay is meant to be sculpted by the master\'s hands.',
    symbol: '🐉',
    disciplines: ['Animalism', 'Dominate', 'Protean'],
    bane: 'Anchored Domain: The Dragon must sleep surrounded by at least two handfuls of native soil from a place of deep personal significance, or lose dice pools on all actions each day.',
    compulsion: {
      name: 'Covetousness',
      description: 'An unyielding impulse to possess, control, and protect what they consider their property or subjects. Suffer a -2 penalty to actions unless asserting absolute ownership over their domain.'
    },
    archetypes: ['Fleshcrafting Surgeon', 'Old-World Aristocrat', 'Feudal Slumlord', 'Mad Bio-Geneticist', 'Alien Collector'],
    lore: 'The Fiends are feudal lords of Eastern European legend who practice Vicissitude—the monstrous discipline of molding flesh and bone like clay. Territorial to the extreme, they treat their havens, servants, and guests with sacred, terrifying hospitality.',
    v20Disciplines: ['Animalism', 'Auspex', 'Vicissitude'],
    v20Weakness: 'Must rest in the midst of at least two handfuls of native earth from their homeland.'
  },
  {
    name: 'Caitiff',
    tagline: 'Clanless, unbound, and forged in rejection.',
    quote: 'You call me a mongrel. I call myself free.',
    symbol: '🚫',
    disciplines: ['Any 3 Disciplines'],
    bane: 'Untapped Pedigree: Shanned as pariahs and bastards by high clans. Caitiff pay extra experience points to learn disciplines and suffer automatic social stigma in Elysium.',
    compulsion: {
      name: 'Survival Instinct',
      description: 'Driven by intense paranoia that kindred society is plotting their destruction. Suffer a -2 penalty to all cooperative or trusting actions.'
    },
    archetypes: ['Street Survivor', 'Outcast Mercenary', 'Self-Taught Occultist', 'Anarch Courier', 'Lone Wolf Detective'],
    lore: 'Vampires who exhibit no physical or spiritual hallmarks of any known clan. Spurned as untouchables by Camarilla traditionalists, Caitiff have no inherited bane or compulsion, making them unpredictable wildcards in the nightly struggle for power.',
    v20Disciplines: ['Any 3 Disciplines'],
    v20Weakness: 'Social stigma; -2 penalty to social rolls with clan Kindred; higher experience costs.'
  },
  {
    name: 'Thin-Blood',
    tagline: 'The duskborn walk between sunlight and the grave.',
    quote: 'We bleed red, we can taste food, and our alchemy turns sunlight into lightning.',
    symbol: '🌅',
    disciplines: ['Thin-blood Alchemy'],
    bane: 'Weak Vitae: Incapable of creating blood bonds or siring true kindred; fragile blood potency 0 that cannot easily sustain supernatural arts without alchemical brews.',
    compulsion: {
      name: 'Existential Crisis',
      description: 'Questioning whether they are dead, mortal, or something worse. Suffer a -2 penalty to Resolve checks while wrestling with mortal memories.'
    },
    archetypes: ['Street Cook Alchemist', 'Daywalker Informant', 'Medical Student Test Subject', 'Club Bartender', 'Vampire Hunter Mole'],
    lore: 'Kindred of the 14th, 15th, and 16th generations whose vitae is too diluted to bear full vampiric majesty. Yet the Duskborn retain human traits: they can walk briefly in daylight, eat food, and distill volatile supernatural powers through Thin-blood Alchemy.',
    v20Disciplines: ['None / Variable'],
    v20Weakness: 'Vitae is too dilute to reliably sustain traditional discipline ratings beyond level 1.'
  }
];
