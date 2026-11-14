import { DisciplineInfo } from '../types/vtm';

export const DISCIPLINES_DATA: DisciplineInfo[] = [
  {
    id: 'animalism',
    name: 'Animalism',
    description: 'The supernatural kinship and mastery over beasts and the primal Beast within all Kindred.',
    masqueradeThreat: 'Low to Medium depending on obvious animal congregation.',
    bloodResonance: 'Animal blood, melancholic or choleric temperament.',
    powers: [
      {
        name: 'Bond Famulus',
        level: 1,
        discipline: 'Animalism',
        rouseCost: 1,
        dicePool: 'Charisma + Animal Ken',
        system: 'Forms an unbreakable mystical bond with a chosen animal. The famulus becomes loyal, shares senses, and can serve as eyes and ears for the kindred.'
      },
      {
        name: 'Sense the Beast',
        level: 1,
        discipline: 'Animalism',
        rouseCost: 0,
        dicePool: 'Resolve + Animal Ken',
        system: 'Attunes to the predatory instincts in others. Senses the presence of vampires, werewolves, ghouls, or heightened aggression in mortals.'
      },
      {
        name: 'Feral Whispers',
        level: 2,
        discipline: 'Animalism',
        rouseCost: 1,
        dicePool: 'Manipulation + Animal Ken',
        system: 'Enables two-way telepathic communication with beasts and the ability to issue commands that animals willingly obey.'
      },
      {
        name: 'Animal Succulence',
        level: 3,
        discipline: 'Animalism',
        rouseCost: 0,
        system: 'Animals slake more Hunger than usual (double normal value) and count as human blood for slaking down to Hunger 0.'
      },
      {
        name: 'Quell the Beast',
        level: 3,
        discipline: 'Animalism',
        rouseCost: 1,
        dicePool: 'Charisma + Intimidation',
        system: 'Cools the fiery rage of frenzy in a vampire or crushes mortal willpower, rendering the target docile and listless.'
      },
      {
        name: 'Subsume the Spirit',
        level: 4,
        discipline: 'Animalism',
        rouseCost: 1,
        dicePool: 'Manipulation + Animal Ken',
        system: 'Possesses the body of an animal while the vampire’s torpid physical form sleeps safely elsewhere.'
      },
      {
        name: 'Animal Horde',
        level: 5,
        discipline: 'Animalism',
        rouseCost: 2,
        dicePool: 'Charisma + Animal Ken',
        system: 'Summons and commands swarms of hundreds of rats, flocks of ravens, or packs of wild dogs to attack, harass, or destroy targets.'
      },
      {
        name: 'Drawing Out the Beast',
        level: 5,
        discipline: 'Animalism',
        rouseCost: 1,
        dicePool: 'Composure + Animal Ken',
        system: 'Transfers the kindred’s own impending frenzy directly into another vampire or mortal nearby.'
      }
    ]
  },
  {
    id: 'auspex',
    name: 'Auspex',
    description: 'Preternatural perception, telepathy, clairvoyance, and the ability to perceive spiritual auras and truths.',
    masqueradeThreat: 'Low. Senses are invisible unless displaying trance states.',
    bloodResonance: 'Phlegmatic blood, thinkers, artists, voyeurs.',
    powers: [
      {
        name: 'Heightened Senses',
        level: 1,
        discipline: 'Auspex',
        rouseCost: 0,
        dicePool: 'Wits + Awareness',
        system: 'Multiplies all sensory perception fivefold. Hear whispers through walls, see in total darkness, or track scents like a bloodhound.'
      },
      {
        name: 'Sense the Unseen',
        level: 1,
        discipline: 'Auspex',
        rouseCost: 0,
        dicePool: 'Wits + Awareness',
        system: 'Reveals beings hidden by Obfuscate, astral spirits, ghosts, and dimensional anomalies.'
      },
      {
        name: 'Premonition',
        level: 2,
        discipline: 'Auspex',
        rouseCost: 1,
        dicePool: 'Resolve + Awareness',
        system: 'Flashes of clairvoyant warning provide cryptic visions of impending ambush, danger, or pivotal events.'
      },
      {
        name: 'Scry the Soul',
        level: 3,
        discipline: 'Auspex',
        rouseCost: 1,
        dicePool: 'Intelligence + Insight',
        system: 'Reads the psychic aura around a subject, revealing emotional state, supernatural nature, recent diablerie, and health.'
      },
      {
        name: 'Share the Senses',
        level: 3,
        discipline: 'Auspex',
        rouseCost: 1,
        dicePool: 'Resolve + Awareness',
        system: 'Taps into the senses of a touched or line-of-sight target, perceiving everything they see and hear.'
      },
      {
        name: 'Spirit\'s Touch',
        level: 4,
        discipline: 'Auspex',
        rouseCost: 1,
        dicePool: 'Intelligence + Awareness',
        system: 'Psychometry: reads the spiritual resonance left on an object, replaying memories of whoever held it last.'
      },
      {
        name: 'Clairvoyance',
        level: 5,
        discipline: 'Auspex',
        rouseCost: 1,
        dicePool: 'Intelligence + Awareness',
        system: 'Projects sensory perception anywhere familiar across the city, observing unseen as an ethereal sensor.'
      },
      {
        name: 'Telepathy',
        level: 5,
        discipline: 'Auspex',
        rouseCost: 1,
        dicePool: 'Resolve + Insight',
        system: 'Reads surface thoughts, probes deep memory vaults, or transmits silent telepathic messages into minds.'
      }
    ]
  },
  {
    id: 'blood_sorcery',
    name: 'Blood Sorcery',
    description: 'Hermetic blood magic, esoteric alchemy, and manipulation of physical and mystical properties of vitae.',
    masqueradeThreat: 'Extremely High. Boiling blood and boiling runes breach the Veil.',
    bloodResonance: 'Sanguine or occult-minded researchers.',
    powers: [
      {
        name: 'Corrosive Vitae',
        level: 1,
        discipline: 'Blood Sorcery',
        rouseCost: 1,
        dicePool: 'Strength + Blood Sorcery',
        system: 'Converts spat or smeared blood into potent acid that melts metal locks, glass, or flesh on contact.'
      },
      {
        name: 'A Taste for Blood',
        level: 1,
        discipline: 'Blood Sorcery',
        rouseCost: 0,
        dicePool: 'Resolve + Blood Sorcery',
        system: 'A drop of blood reveals generation, clan, blood resonance, approximate Hunger, and supernatural traits.'
      },
      {
        name: 'Extinguish Vitae',
        level: 2,
        discipline: 'Blood Sorcery',
        rouseCost: 1,
        dicePool: 'Intelligence + Blood Sorcery',
        system: 'Starves a rival kindred by magically chilling and neutralizing the vitae in their veins, increasing their Hunger.'
      },
      {
        name: 'Blood of Potency',
        level: 3,
        discipline: 'Blood Sorcery',
        rouseCost: 1,
        dicePool: 'Resolve + Blood Sorcery',
        system: 'Temporarily thickens the vampire’s own vitae, increasing Blood Potency by 1 or more for a scene.'
      },
      {
        name: 'Scorpion\'s Touch',
        level: 3,
        discipline: 'Blood Sorcery',
        rouseCost: 1,
        dicePool: 'Strength + Blood Sorcery',
        system: 'Envenoms the vampire’s blood with lethal necrotic toxins that inflict Aggravated health damage to anyone struck.'
      },
      {
        name: 'Theft of Vitae',
        level: 4,
        discipline: 'Blood Sorcery',
        rouseCost: 1,
        dicePool: 'Wits + Blood Sorcery',
        system: 'Rips blood out through the pores and open wounds of a target from across the room, flying directly into the caster’s mouth.'
      },
      {
        name: 'Baal\'s Caress',
        level: 5,
        discipline: 'Blood Sorcery',
        rouseCost: 2,
        dicePool: 'Strength + Blood Sorcery',
        system: 'Coats blades or bullets with boiling ichor that transmutes all superficial damage into Aggravated damage against Kindred.'
      },
      {
        name: 'Cauldron of Blood',
        level: 5,
        discipline: 'Blood Sorcery',
        rouseCost: 2,
        dicePool: 'Resolve + Blood Sorcery',
        system: 'Boils the blood inside a victim’s living veins, rupturing their heart and flesh with horrific steam and burns.'
      }
    ]
  },
  {
    id: 'celerity',
    name: 'Celerity',
    description: 'Blinding supernatural speed, reflex enhancement, and temporal grace in combat.',
    masqueradeThreat: 'High. Moving faster than the human eye breaks the laws of physics.',
    bloodResonance: 'Choleric blood, adrenaline junkies, athletes.',
    powers: [
      {
        name: 'Cat\'s Grace',
        level: 1,
        discipline: 'Celerity',
        rouseCost: 0,
        system: 'Flawless balance on telephone wires, knife edges, or wet roofs. Never knocked prone and fall damage is halved.'
      },
      {
        name: 'Rapid Reflexes',
        level: 1,
        discipline: 'Celerity',
        rouseCost: 0,
        system: 'Reaction speeds beyond mortal comprehension. Take defensive actions against firearms without cover penalties.'
      },
      {
        name: 'Fleetness',
        level: 2,
        discipline: 'Celerity',
        rouseCost: 1,
        dicePool: 'Dexterity + Athletics',
        system: 'Add Celerity rating to all non-combat Dexterity checks and sprinting maneuvers.'
      },
      {
        name: 'Blink',
        level: 3,
        discipline: 'Celerity',
        rouseCost: 1,
        dicePool: 'Dexterity + Athletics',
        system: 'Move in the blink of an eye up to sprinting distance instantly, appearing as a blur across the battlefield.'
      },
      {
        name: 'Traversal',
        level: 3,
        discipline: 'Celerity',
        rouseCost: 1,
        dicePool: 'Dexterity + Athletics',
        system: 'Run up vertical skyscrapers, across water surfaces, or across fragile glass ceilings without breaking them.'
      },
      {
        name: 'Draught of Elegance',
        level: 4,
        discipline: 'Celerity',
        rouseCost: 1,
        system: 'Allows drinking mortals or ghouls to inherit temporary dots in Celerity.'
      },
      {
        name: 'Split Second',
        level: 5,
        discipline: 'Celerity',
        rouseCost: 1,
        system: 'Time stands virtually still for a few heartbeats. Retcon or interrupt an enemy attack before it lands.'
      },
      {
        name: 'Lightning Strike',
        level: 5,
        discipline: 'Celerity',
        rouseCost: 1,
        dicePool: 'Dexterity + Brawl / Melee',
        system: 'Strike with such preternatural velocity that opponents cannot react, dodge, or parry the blow.'
      }
    ]
  },
  {
    id: 'dominate',
    name: 'Dominate',
    description: 'The tyrannical subjugation of another’s mind, memories, and actions through hypnotic gaze and commands.',
    masqueradeThreat: 'Low to High if commands are performed in public.',
    bloodResonance: 'Phlegmatic blood, commanders, politicians.',
    powers: [
      {
        name: 'Cloud Memory',
        level: 1,
        discipline: 'Dominate',
        rouseCost: 0,
        dicePool: 'Charisma + Subterfuge',
        system: 'Erases the last few minutes of a mortal\'s memory, replacing the gap with vague confusion or natural rationalization.'
      },
      {
        name: 'Compel',
        level: 1,
        discipline: 'Dominate',
        rouseCost: 0,
        dicePool: 'Charisma + Dominate',
        system: 'Issues a single-word imperative ("Flee!", "Freeze!", "Sleep!", "Confess!") that the target must obey immediately.'
      },
      {
        name: 'Mesmerize',
        level: 2,
        discipline: 'Dominate',
        rouseCost: 1,
        dicePool: 'Manipulation + Dominate',
        system: 'Imposes a complex, multi-step hypnotic command or post-hypnotic suggestion that will trigger upon a condition.'
      },
      {
        name: 'Dementation',
        level: 2,
        discipline: 'Dominate',
        rouseCost: 1,
        dicePool: 'Manipulation + Dominate',
        system: 'Amalgam (Auspex 2). Infects the subject\'s mind with acute psychosis, paranoia, or blinding rage.'
      },
      {
        name: 'Forgetful Mind',
        level: 3,
        discipline: 'Dominate',
        rouseCost: 1,
        dicePool: 'Manipulation + Dominate',
        system: 'Rewrites, excises, or manufactures extensive memories in the subject’s psyche, rewriting their past.'
      },
      {
        name: 'Submerged Edict',
        level: 3,
        discipline: 'Dominate',
        rouseCost: 1,
        dicePool: 'Manipulation + Dominate',
        system: 'Buries a hypnotic suggestion so deep that even psychic interrogation cannot easily detect the sleeper agent.'
      },
      {
        name: 'Rationalize',
        level: 4,
        discipline: 'Dominate',
        rouseCost: 0,
        system: 'Targets of Dominate firmly believe all commanded actions were entirely their own voluntary decisions.'
      },
      {
        name: 'Mass Manipulation',
        level: 5,
        discipline: 'Dominate',
        rouseCost: 2,
        dicePool: 'Manipulation + Dominate',
        system: 'Commands an entire crowd or platoon simultaneously with a single thunderous imperative.'
      },
      {
        name: 'Terminal Decree',
        level: 5,
        discipline: 'Dominate',
        rouseCost: 1,
        dicePool: 'Manipulation + Dominate',
        system: 'Overcomes the biological survival instinct, forcing a victim to leap from buildings or turn weapons on themselves.'
      }
    ]
  },
  {
    id: 'fortitude',
    name: 'Fortitude',
    description: 'Preternatural physical resilience, unyielding stamina, and impenetrable defense against trauma and fire.',
    masqueradeThreat: 'Low until someone shrugging off shotgun blasts is caught on camera.',
    bloodResonance: 'Melancholic blood, survivors, laborers.',
    powers: [
      {
        name: 'Resilience',
        level: 1,
        discipline: 'Fortitude',
        rouseCost: 0,
        system: 'Add Fortitude rating to total maximum Health boxes.'
      },
      {
        name: 'Unswayable Mind',
        level: 1,
        discipline: 'Fortitude',
        rouseCost: 0,
        system: 'Add Fortitude rating to all dice pools rolled to resist supernatural mental coercion, Dominate, and Presence.'
      },
      {
        name: 'Toughness',
        level: 2,
        discipline: 'Fortitude',
        rouseCost: 1,
        system: 'Subtract Fortitude rating from all incoming Superficial damage before halving it.'
      },
      {
        name: 'Enduring Beasts',
        level: 2,
        discipline: 'Fortitude',
        rouseCost: 1,
        system: 'Amalgam (Animalism 1). Extends the vampire’s Fortitude benefits to their bonded famulus and animal minions.'
      },
      {
        name: 'Defy Bane',
        level: 3,
        discipline: 'Fortitude',
        rouseCost: 1,
        dicePool: 'Wits + Survival',
        system: 'Converts Aggravated damage from sunlight and fire into Superficial damage for a number of hits equal to Fortitude.'
      },
      {
        name: 'Draught of Endurance',
        level: 4,
        discipline: 'Fortitude',
        rouseCost: 1,
        system: 'Allows drinking mortals or ghouls to inherit temporary dots in Fortitude.'
      },
      {
        name: 'Flesh of Marble',
        level: 5,
        discipline: 'Fortitude',
        rouseCost: 2,
        system: 'The first attack or blow suffered each turn causes zero damage whatsoever, harmlessly glancing off hardened skin.'
      },
      {
        name: 'Prowess from Pain',
        level: 5,
        discipline: 'Fortitude',
        rouseCost: 1,
        system: 'Converts health damage penalties into bonus dice added to Physical attribute pools.'
      }
    ]
  },
  {
    id: 'obfuscate',
    name: 'Obfuscate',
    description: 'The supernatural power of concealment, invisibility, and mental cloaking from mortal and Kindred senses.',
    masqueradeThreat: 'Low. Vanishing prevents masquerade breaches rather than causing them.',
    bloodResonance: 'Melancholic blood, loners, spies, hermits.',
    powers: [
      {
        name: 'Cloak of Shadows',
        level: 1,
        discipline: 'Obfuscate',
        rouseCost: 0,
        system: 'The vampire becomes invisible as long as they remain stationary in shadows or dim lighting.'
      },
      {
        name: 'Silence of Death',
        level: 1,
        discipline: 'Obfuscate',
        rouseCost: 0,
        system: 'Muffles all sounds made by the vampire and their immediate equipment, walking in absolute silence.'
      },
      {
        name: 'Unseen Passage',
        level: 2,
        discipline: 'Obfuscate',
        rouseCost: 1,
        dicePool: 'Wits + Stealth',
        system: 'Move freely while remaining completely invisible to sight and normal perception, slipping past guards unseen.'
      },
      {
        name: 'Ghost in the Machine',
        level: 3,
        discipline: 'Obfuscate',
        rouseCost: 0,
        system: 'Extends Obfuscate concealment to modern cameras, security sensors, infrared lenses, and audio recordings.'
      },
      {
        name: 'Mask of a Thousand Faces',
        level: 3,
        discipline: 'Obfuscate',
        rouseCost: 1,
        dicePool: 'Manipulation + Performance',
        system: 'Projects the psychic illusion of being someone else—changing perceived height, facial features, voice, and gender.'
      },
      {
        name: 'Conceal',
        level: 4,
        discipline: 'Obfuscate',
        rouseCost: 1,
        dicePool: 'Intelligence + Stealth',
        system: 'Hides inanimate objects, cars, weapon caches, or entire rooms from perception.'
      },
      {
        name: 'Cloak the Gathering',
        level: 5,
        discipline: 'Obfuscate',
        rouseCost: 1,
        dicePool: 'Charisma + Stealth',
        system: 'Extends Unseen Passage or Cloak of Shadows to an entire coterie or group of allies moving together.'
      },
      {
        name: 'Impostor\'s Guise',
        level: 5,
        discipline: 'Obfuscate',
        rouseCost: 1,
        dicePool: 'Manipulation + Performance',
        system: 'Flawlessly replicates a specific real person, including precise fingerprint prints, retina patterns, and mannerisms.'
      }
    ]
  },
  {
    id: 'oblivion',
    name: 'Oblivion',
    description: 'Channeling the entropy of the Abyss, shadow manipulation, necromancy, and commanding spirits of the dead.',
    masqueradeThreat: 'Extremely High. Living shadows and spectral manifestations terrify onlookers.',
    bloodResonance: 'Empty, cold, or grieving mortals.',
    powers: [
      {
        name: 'Shadow Cloak',
        level: 1,
        discipline: 'Oblivion',
        rouseCost: 0,
        system: 'Wraps the kindred in living gloom, granting stealth bonuses and absorbing light around them.'
      },
      {
        name: 'Ashes to Ashes',
        level: 1,
        discipline: 'Oblivion',
        rouseCost: 0,
        system: 'Disintegrates corpses and biological evidence into fine harmless ash within moments.'
      },
      {
        name: 'Arms of Ahriman',
        level: 2,
        discipline: 'Oblivion',
        rouseCost: 1,
        dicePool: 'Wits + Oblivion',
        system: 'Summons crushing tentacular appendages from the darkness that grapple, suffocate, and tear enemies apart.'
      },
      {
        name: 'Where the Shroud Thins',
        level: 2,
        discipline: 'Oblivion',
        rouseCost: 0,
        dicePool: 'Intelligence + Occult',
        system: 'Perceives ghosts, wraiths, and the strength of the veil separating the physical world from the underworld.'
      },
      {
        name: 'Touch of Oblivion',
        level: 3,
        discipline: 'Oblivion',
        rouseCost: 1,
        dicePool: 'Strength + Oblivion',
        system: 'A chilling touch that rots living flesh or withers kindred limbs, inflicting Aggravated damage.'
      },
      {
        name: 'Shadow Perspective',
        level: 3,
        discipline: 'Oblivion',
        rouseCost: 1,
        dicePool: 'Wits + Oblivion',
        system: 'Projects vision and hearing into any shadow within line of sight, spying around corners or through vents.'
      },
      {
        name: 'Stygian Shroud',
        level: 4,
        discipline: 'Oblivion',
        rouseCost: 1,
        dicePool: 'Composure + Oblivion',
        system: 'Fills a room with suffocating, light-choking abyssal fog that blinds enemies and muffles sound.'
      },
      {
        name: 'Shadow Step',
        level: 5,
        discipline: 'Oblivion',
        rouseCost: 1,
        dicePool: 'Dexterity + Oblivion',
        system: 'Steps into one shadow and instantly emerges out of another shadow miles away across the city.'
      },
      {
        name: 'Tenebrous Avatar',
        level: 5,
        discipline: 'Oblivion',
        rouseCost: 2,
        system: 'Dissolves the physical body into a free-roaming cloud of living abyssal shadow, immune to physical weapons.'
      }
    ]
  },
  {
    id: 'potence',
    name: 'Potence',
    description: 'Devastating supernatural physical strength, shattering steel and bone with raw monstrous might.',
    masqueradeThreat: 'Medium to High. Throwing cars or punching through concrete walls is unmissable.',
    bloodResonance: 'Choleric blood, brawlers, heavy laborers.',
    powers: [
      {
        name: 'Lethal Body',
        level: 1,
        discipline: 'Potence',
        rouseCost: 0,
        system: 'Unarmed strikes can cause Aggravated damage to mortals and easily tear through wood and sheet metal.'
      },
      {
        name: 'Soaring Leap',
        level: 1,
        discipline: 'Potence',
        rouseCost: 0,
        system: 'Jump distances and vertical leaps multiply by ten, leaping onto two-story rooftops with ease.'
      },
      {
        name: 'Prowess',
        level: 2,
        discipline: 'Potence',
        rouseCost: 1,
        system: 'Add Potence rating to unarmed/melee damage value and feat-of-strength dice pools for the scene.'
      },
      {
        name: 'Brutal Feed',
        level: 3,
        discipline: 'Potence',
        rouseCost: 0,
        system: 'Slakes Hunger rapidly in combat by brutally draining victims in a single turn during a bite attack.'
      },
      {
        name: 'Spark of Rage',
        level: 3,
        discipline: 'Potence',
        rouseCost: 1,
        dicePool: 'Manipulation + Intimidation',
        system: 'Amalgam (Presence 3). Inspires uncontrollable, violent fury in a crowd or bystander.'
      },
      {
        name: 'Draught of Might',
        level: 4,
        discipline: 'Potence',
        rouseCost: 1,
        system: 'Allows drinking mortals or ghouls to inherit temporary dots in Potence.'
      },
      {
        name: 'Earthshock',
        level: 5,
        discipline: 'Potence',
        rouseCost: 1,
        dicePool: 'Strength + Brawl',
        system: 'Slams fists into the ground to trigger a localized shockwave that knocks down and stuns all nearby enemies.'
      },
      {
        name: 'Fist of Caine',
        level: 5,
        discipline: 'Potence',
        rouseCost: 1,
        system: 'Every unarmed punch or kick inflicts un-halved Aggravated damage directly against vampires.'
      }
    ]
  },
  {
    id: 'presence',
    name: 'Presence',
    description: 'The hypnotic command of emotion, charismatic attraction, majestic awe, and paralyzing terror.',
    masqueradeThreat: 'Low. Targets believe their passionate awe or terror is organic emotion.',
    bloodResonance: 'Sanguine blood, performers, lovers, demagogues.',
    powers: [
      {
        name: 'Awe',
        level: 1,
        discipline: 'Presence',
        rouseCost: 0,
        dicePool: 'Manipulation + Performance',
        system: 'Commands the undivided attention and eager goodwill of all within hearing distance.'
      },
      {
        name: 'Daunt',
        level: 1,
        discipline: 'Presence',
        rouseCost: 0,
        dicePool: 'Strength + Intimidation',
        system: 'Projects a menacing aura that makes opponents hesitate, back down, or stammer in fear.'
      },
      {
        name: 'Lingering Kiss',
        level: 2,
        discipline: 'Presence',
        rouseCost: 0,
        system: 'The Kiss becomes intensely addictive. Mortals bitten become completely addicted to being fed upon.'
      },
      {
        name: 'Dread Gaze',
        level: 3,
        discipline: 'Presence',
        rouseCost: 1,
        dicePool: 'Charisma + Intimidation',
        system: 'Strikes pure, unadulterated terror into the heart of a target, causing mortals to flee and vampires to test for Rötschreck.'
      },
      {
        name: 'Entrancement',
        level: 3,
        discipline: 'Presence',
        rouseCost: 1,
        dicePool: 'Charisma + Subterfuge',
        system: 'Binds a subject in desperate infatuation; they will do almost anything to win the kindred’s approval.'
      },
      {
        name: 'Irresistible Voice',
        level: 4,
        discipline: 'Presence',
        rouseCost: 1,
        system: 'Amalgam (Dominate 1). Dominate commands can now be transmitted over telephone, video, or without eye contact.'
      },
      {
        name: 'Majesty',
        level: 5,
        discipline: 'Presence',
        rouseCost: 2,
        dicePool: 'Charisma + Performance',
        system: 'Radiates godlike radiance. Anyone wishing to attack or speak insolently must succeed on a Willpower roll.'
      },
      {
        name: 'Star Magnetism',
        level: 5,
        discipline: 'Presence',
        rouseCost: 1,
        system: 'Amplifies personal fame or social influence to mythic proportions across entire social spheres or mass media.'
      }
    ]
  },
  {
    id: 'protean',
    name: 'Protean',
    description: 'Metamorphosis, animal transformation, predatory claws, and melding into the earth.',
    masqueradeThreat: 'High. Turning into beasts or growing razor talons exposes the vampire.',
    bloodResonance: 'Animal blood, primal survivors.',
    powers: [
      {
        name: 'Eyes of the Beast',
        level: 1,
        discipline: 'Protean',
        rouseCost: 0,
        system: 'Gives the eyes an eerie glowing red or gold shine, allowing clear sight in pitch darkness.'
      },
      {
        name: 'Weight of the Feather',
        level: 1,
        discipline: 'Protean',
        rouseCost: 0,
        system: 'Makes the vampire light as a falling feather, suffering no fall damage from any height.'
      },
      {
        name: 'Feral Weapons',
        level: 2,
        discipline: 'Protean',
        rouseCost: 1,
        system: 'Transforms fingernails into razor-sharp bestial claws or fangs that inflict Superficial damage with unhalved impact.'
      },
      {
        name: 'Vicissitude',
        level: 2,
        discipline: 'Protean',
        rouseCost: 1,
        dicePool: 'Resolve + Craft',
        system: 'Amalgam (Dominate 2). Molds flesh and bone like warm clay, altering appearance or sculpting horrific mutations.'
      },
      {
        name: 'Earth Meld',
        level: 3,
        discipline: 'Protean',
        rouseCost: 1,
        system: 'Melds seamlessly into unworked earth, soil, or stone, sleeping safe from sunlight and discovery.'
      },
      {
        name: 'Shapechange',
        level: 4,
        discipline: 'Protean',
        rouseCost: 1,
        system: 'Transforms entirely into a chosen predatory animal (e.g., great wolf, bat, panther, serpent).'
      },
      {
        name: 'Mist Form',
        level: 5,
        discipline: 'Protean',
        rouseCost: 1,
        system: 'Transmutes the body into a cloud of mist, floating through keyholes, pipes, and cracks while immune to weapons.'
      },
      {
        name: 'The Unfettered Heart',
        level: 5,
        discipline: 'Protean',
        rouseCost: 0,
        system: 'Moves the kindred’s heart to another location in the body or renders it impervious to wooden stakes.'
      }
    ]
  },
  {
    id: 'thin_blood_alchemy',
    name: 'Thin-blood Alchemy',
    description: 'Street-level chemistry, boiling blood cookery, and counterfeit disciplines brewed by the Duskborn.',
    masqueradeThreat: 'Medium. Looks like illicit narcotics or chemistry lab work.',
    bloodResonance: 'Variable based on the recipe brewed.',
    powers: [
      {
        name: 'Far Reach',
        level: 1,
        discipline: 'Thin-blood Alchemy',
        rouseCost: 1,
        system: 'Creates a telekinetic force that can push, pull, or grab small items up to ten meters away.'
      },
      {
        name: 'Haze',
        level: 1,
        discipline: 'Thin-blood Alchemy',
        rouseCost: 1,
        system: 'Exhales an oily, opaque smoke screen that blinds security cameras and blocks pursuit.'
      },
      {
        name: 'Envelop',
        level: 2,
        discipline: 'Thin-blood Alchemy',
        rouseCost: 1,
        system: 'Distills an adhesive mist that slows and entangles pursuers.'
      },
      {
        name: 'Deflection',
        level: 3,
        discipline: 'Thin-blood Alchemy',
        rouseCost: 1,
        system: 'Creates an electromagnetic or kinetic barrier that deflects oncoming low-caliber bullets.'
      },
      {
        name: 'Counterfeit Discipline',
        level: 4,
        discipline: 'Thin-blood Alchemy',
        rouseCost: 1,
        system: 'Allows the Duskborn to mimic any level 1-3 discipline power of an elder kindred whose blood was used in the brew.'
      },
      {
        name: 'Awaken the Sleeper',
        level: 5,
        discipline: 'Thin-blood Alchemy',
        rouseCost: 2,
        system: 'Brew that can revive a vampire from deep torpor or purge long-standing blood curses.'
      }
    ]
  }
];
