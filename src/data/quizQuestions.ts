import { QuizQuestion } from '../types/vtm';

export const CLAN_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    prompt: 'The Call of Eternity',
    scenario: 'You are granted eternal life, unaging flesh, and a hunger that never dies. What is your paramount ambition for this immortal existence?',
    options: [
      {
        text: 'Build an enduring empire, amass wealth, and command lesser mortals from the summit of power.',
        scores: { Ventrue: 3, Lasombra: 2, Toreador: 1 }
      },
      {
        text: 'Tear down corrupt hierarchies and fight for the oppressed against tyrannical rulers.',
        scores: { Brujah: 3, Gangrel: 1, Caitiff: 2 }
      },
      {
        text: 'Unravel the deepest occult secrets, esoteric truths, and master the arcane architecture of the universe.',
        scores: { Tremere: 3, 'Banu Haqim': 1, Hecata: 2 }
      },
      {
        text: 'Immerse myself in passionate art, romantic beauty, and sensory ecstasy that transcends mortal limits.',
        scores: { Toreador: 3, 'The Ministry': 2, Malkavian: 1 }
      },
      {
        text: 'Live free from society’s cages, hunting under the open stars where raw instinct reigns supreme.',
        scores: { Gangrel: 3, Ravnos: 2, Caitiff: 1 }
      }
    ]
  },
  {
    id: 2,
    prompt: 'The Feast',
    scenario: 'Hunger gnaws at your gut like a furnace. You corner a lone human in a rain-slicked alleyway. How do you take your sustenance?',
    options: [
      {
        text: 'Seduce them with gentle whispers, drawing them close until the bite feels like a transcendent lover’s embrace.',
        scores: { Toreador: 3, 'The Ministry': 2, Ventrue: 1 }
      },
      {
        text: 'Strike from the silent dark, feed in clinical silence, wipe their memory, and vanish without a trace.',
        scores: { Nosferatu: 3, 'Banu Haqim': 2, Lasombra: 1 }
      },
      {
        text: 'Tackle them to the pavement, pinning them down with bestial savagery before drinking deep.',
        scores: { Brujah: 2, Gangrel: 3, Tzimisce: 1 }
      },
      {
        text: 'I only feed from those who have sinned or broken sacred oaths; they shall pay their tithe to justice.',
        scores: { 'Banu Haqim': 3, Salubri: 2, Ventrue: 1 }
      },
      {
        text: 'Measure their pulse and examine the resonant quality of their vitae before harvesting precisely what is needed.',
        scores: { Tremere: 3, Hecata: 2, Tzimisce: 1 }
      }
    ]
  },
  {
    id: 3,
    prompt: 'Confronting Authority',
    scenario: 'The local Prince demands you swear absolute fealty and surrender half of your personal territory to their enforcers. How do you respond?',
    options: [
      {
        text: 'Spit at their feet, raise your voice, and rally every malcontent in the city to burn their palace to the ground.',
        scores: { Brujah: 3, Caitiff: 2, Gangrel: 1 }
      },
      {
        text: 'Bow with impeccable courtly grace while quietly scheming behind closed doors to orchestrate their downfall.',
        scores: { Ventrue: 2, Lasombra: 3, Toreador: 2 }
      },
      {
        text: 'Shrug, pack your bag, and leave the city limits. No self-important parasite commands your freedom.',
        scores: { Gangrel: 3, Ravnos: 3, Caitiff: 2 }
      },
      {
        text: 'Already have blackmail on their worst scandals; whisper a single name in their ear and watch them rescind the order.',
        scores: { Nosferatu: 3, Tremere: 2, Malkavian: 1 }
      },
      {
        text: 'Smile eerily as the shadows in the room stretch; remind them that flesh and thrones are temporary, but the abyss is forever.',
        scores: { Lasombra: 3, Hecata: 2, Tzimisce: 2 }
      }
    ]
  },
  {
    id: 4,
    prompt: 'The Mirror and the Beast',
    scenario: 'You look into a mirror late at night and notice your eyes reflect a monstrous, otherworldly hunger. What emotion stirs within you?',
    options: [
      {
        text: 'Grief for the mortal life and human warmth that is fading from my cold hands.',
        scores: { Salubri: 3, Toreador: 2, Caitiff: 1 }
      },
      {
        text: 'Exhilaration. The illusion of civilized weakness is finally stripped away; I am a god of the night.',
        scores: { Lasombra: 3, Tzimisce: 3, Ventrue: 1 }
      },
      {
        text: 'Pragmatic acceptance. The Beast is a tool to be disciplined, calculated, and channeled toward my goals.',
        scores: { Tremere: 3, 'Banu Haqim': 2, Ventrue: 2 }
      },
      {
        text: 'Curiosity. The reflections are whispering secrets about the people who stood in this room a century ago.',
        scores: { Malkavian: 3, Hecata: 2, Nosferatu: 1 }
      },
      {
        text: 'Spite. If the world thinks I am a monster, I will show them how terrifying that monster can be.',
        scores: { Brujah: 2, Nosferatu: 3, Gangrel: 1 }
      }
    ]
  },
  {
    id: 5,
    prompt: 'Knowledge and Power',
    scenario: 'An ancient, forbidden grimoire detailing blood magic and dangerous curses falls into your possession. What do you do with it?',
    options: [
      {
        text: 'Study its formulas obsessively, unlocking its rituals to expand my supernatural dominion.',
        scores: { Tremere: 3, 'Banu Haqim': 2, Hecata: 1 }
      },
      {
        text: 'Trade it to the highest bidder in Elysium in exchange for political favors, territory, or boons.',
        scores: { Ventrue: 3, Toreador: 2, Ravnos: 2 }
      },
      {
        text: 'Hide it deep in a secret vault where neither rivals nor inquisitors can ever unearth its peril.',
        scores: { Nosferatu: 3, Salubri: 2, Tremere: 1 }
      },
      {
        text: 'Use its blasphemies to shatter the fragile sanity of my enemies and expose the lies of this world.',
        scores: { Malkavian: 3, 'The Ministry': 3, Lasombra: 1 }
      },
      {
        text: 'Burn it. True power comes from muscle, claw, and blood—not dead ink on dried parchment.',
        scores: { Gangrel: 3, Brujah: 2, Caitiff: 1 }
      }
    ]
  },
  {
    id: 6,
    prompt: 'The Ideal Haven',
    scenario: 'Where do you feel safest resting your physical body while the lethal sun walks the sky?',
    options: [
      {
        text: 'A high-rise penthouse behind biometric airlocks, private security guards, and steel storm shutters.',
        scores: { Ventrue: 3, Lasombra: 2, Toreador: 1 }
      },
      {
        text: 'A hidden subterranean chamber deep in the sewer catacombs or abandoned subway tunnels.',
        scores: { Nosferatu: 3, Hecata: 2, Malkavian: 1 }
      },
      {
        text: 'An ancestral manor filled with centuries of collected art, antiquities, and secret passageways.',
        scores: { Tzimisce: 3, Toreador: 3, Hecata: 1 }
      },
      {
        text: 'Buried deep within the damp forest soil or inside a cavern, cradled by the earth itself.',
        scores: { Gangrel: 3, Ravnos: 2, Salubri: 1 }
      },
      {
        text: 'A converted industrial warehouse or basement punk club where music and loyal comrades protect the doors.',
        scores: { Brujah: 3, 'The Ministry': 2, Caitiff: 2 }
      }
    ]
  },
  {
    id: 7,
    prompt: 'Mortal Ties',
    scenario: 'A mortal you loved dearly in your human life is in grave danger of being killed by local mobsters. How do you intervene?',
    options: [
      {
        text: 'Eradicate the mobsters violently overnight, leaving their broken bodies as a grisly warning.',
        scores: { Brujah: 3, Gangrel: 2, 'Banu Haqim': 2 }
      },
      {
        text: 'Subjugate the mob boss\'s mind through hypnotic command; make him their devoted guardian.',
        scores: { Ventrue: 2, Lasombra: 3, Tremere: 2 }
      },
      {
        text: 'Watch over them from the shadows, ensuring their safety while remaining an unseen guardian angel.',
        scores: { Nosferatu: 3, Salubri: 3, Malkavian: 2 }
      },
      {
        text: 'Stage a dazzling deception where the mobsters turn on each other in paranoia and greed.',
        scores: { Ravnos: 3, 'The Ministry': 3, Toreador: 1 }
      },
      {
        text: 'Offer your beloved the blood of the ghoul or the Embrace; immortality is the only true salvation.',
        scores: { Tzimisce: 3, Toreador: 2, Hecata: 2 }
      }
    ]
  },
  {
    id: 8,
    prompt: 'Social Dynamics',
    scenario: 'You enter a lavish Elysium gala packed with Kindred society. What role do you instinctively gravitate toward?',
    options: [
      {
        text: 'Holding court near the fireplace, sipping vintage wine, critiquing art and holding everyone\'s adoration.',
        scores: { Toreador: 3, Ventrue: 2 }
      },
      {
        text: 'Whispering to insecure fledglings in the corner, offering them illicit favors and sowing seeds of doubt.',
        scores: { 'The Ministry': 3, Ravnos: 2, Malkavian: 2 }
      },
      {
        text: 'Standing stoically by the exit doors, sizing up physical exits, security blind spots, and weapons.',
        scores: { 'Banu Haqim': 3, Gangrel: 2, Brujah: 2 }
      },
      {
        text: 'Lurking unseen near the ventilation ducts, eavesdropping on private primogen negotiations.',
        scores: { Nosferatu: 3, Lasombra: 2 }
      },
      {
        text: 'Debating ancient genealogies and blood covenants with the Chantry archivists.',
        scores: { Tremere: 3, Hecata: 3, Salubri: 1 }
      }
    ]
  },
  {
    id: 9,
    prompt: 'The Nature of Truth',
    scenario: 'What is the fundamental flaw of mortal society?',
    options: [
      {
        text: 'Their hypocrisy and moral prudishness; they deny their deepest desires and call pleasure evil.',
        scores: { 'The Ministry': 3, Toreador: 2, Brujah: 1 }
      },
      {
        text: 'Their blind obedience to arbitrary laws and corrupt rulers who exploit their sweat.',
        scores: { Brujah: 3, Caitiff: 2, Gangrel: 1 }
      },
      {
        text: 'Their weakness, lack of discipline, and refusal to let the capable rule over the incompetent.',
        scores: { Ventrue: 3, Lasombra: 3, Tzimisce: 2 }
      },
      {
        text: 'Their delusion that what their two eyes see is all that exists; they are blind to the unseen world.',
        scores: { Malkavian: 3, Hecata: 2, Tremere: 2 }
      },
      {
        text: 'Their cruelty and abandonment of the sick, the lonely, and the suffering.',
        scores: { Salubri: 3, Nosferatu: 2, Caitiff: 2 }
      }
    ]
  },
  {
    id: 10,
    prompt: 'The Final Gift',
    scenario: 'Centuries from now, when kindred speak your name in the dark of night, what do you want them to whisper?',
    options: [
      {
        text: '"They were an iron sovereign who forged an empire that outlasted mortal nations."',
        scores: { Ventrue: 3, Lasombra: 3, Tzimisce: 1 }
      },
      {
        text: '"They broke the chains of tyranny and taught the elders that even gods can bleed."',
        scores: { Brujah: 3, Caitiff: 2, Gangrel: 2 }
      },
      {
        text: '"They unraveled the deepest secrets of creation and transcended the limits of blood itself."',
        scores: { Tremere: 3, 'Banu Haqim': 2, Hecata: 2 }
      },
      {
        text: '"Their beauty, passion, and elegance brought light into an eternity of darkness."',
        scores: { Toreador: 3, Salubri: 2, 'The Ministry': 1 }
      },
      {
        text: '"They walked through shadows unseen, knew every secret, and never bowed their head."',
        scores: { Nosferatu: 3, Ravnos: 3, Malkavian: 2 }
      }
    ]
  }
];
