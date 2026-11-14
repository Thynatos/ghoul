import { MeritFlaw } from '../types/vtm';

export const ADVANTAGES_DATABASE: MeritFlaw[] = [
  // Backgrounds & Social
  { id: 'allies_1', name: 'Allies (Local)', type: 'merit', category: 'background', dots: 1, details: 'Mortal associates who can do minor favors or provide tips.' },
  { id: 'allies_3', name: 'Allies (City Syndicate)', type: 'merit', category: 'background', dots: 3, details: 'Armed enforcers, corrupt detectives, or city officials.' },
  { id: 'contacts_1', name: 'Contacts (Street Level)', type: 'merit', category: 'background', dots: 1, details: 'Informants in clubs, cab companies, or ER wards.' },
  { id: 'contacts_3', name: 'Contacts (High Bureaucracy)', type: 'merit', category: 'background', dots: 3, details: 'State prosecutors, bank managers, or airport customs chiefs.' },
  { id: 'fame_1', name: 'Fame (Local Celebrity)', type: 'merit', category: 'background', dots: 1, details: 'Recognized by music fans, local politics, or art circles.' },
  { id: 'fame_3', name: 'Fame (National Figure)', type: 'merit', category: 'background', dots: 3, details: 'Household name, rock star, or famous politician.' },
  { id: 'haven_1', name: 'Haven (Small Safehouse)', type: 'merit', category: 'haven', dots: 1, details: 'Basement studio, reinforced storage unit, or hidden attic.' },
  { id: 'haven_3', name: 'Haven (Fortified Compound)', type: 'merit', category: 'haven', dots: 3, details: 'Reinforced bunker, steel storm shutters, electronic surveillance, guard dogs.' },
  { id: 'haven_hidden', name: 'Haven (Hidden Armory)', type: 'merit', category: 'haven', dots: 2, details: 'Firearms, melee weapons, and armor stored in secure safes.' },
  { id: 'herd_1', name: 'Herd (A few reliable vessels)', type: 'merit', category: 'background', dots: 1, details: 'A handful of mortals you can feed from safely each week.' },
  { id: 'herd_3', name: 'Herd (Devoted Commune)', type: 'merit', category: 'background', dots: 3, details: 'A dozen or more vessels who willingly offer their blood.' },
  { id: 'mask_1', name: 'Mask (Fake Driver License)', type: 'merit', category: 'background', dots: 1, details: 'A clean civilian identity with valid driver ID and debit card.' },
  { id: 'mask_2', name: 'Mask (Full Digital History)', type: 'merit', category: 'background', dots: 2, details: 'Tax records, credit history, biometric passport, clean background check.' },
  { id: 'resources_1', name: 'Resources (Working Class)', type: 'merit', category: 'background', dots: 1, details: 'Modest cash reserves, modest car, modest apartment rent.' },
  { id: 'resources_3', name: 'Resources (Wealthy)', type: 'merit', category: 'background', dots: 3, details: 'Substantial investment portfolios, luxury condo, luxury vehicles.' },
  { id: 'resources_5', name: 'Resources (Billionaire)', type: 'merit', category: 'background', dots: 5, details: 'Private jets, corporate empires, global properties, unlimited liquidity.' },
  { id: 'retainers_1', name: 'Retainer (Faithful Mortal)', type: 'merit', category: 'background', dots: 1, details: 'A loyal mortal assistant, driver, or bodyguard.' },
  { id: 'retainers_2', name: 'Retainer (Ghoul Servant)', type: 'merit', category: 'background', dots: 2, details: 'A blood-bound ghoul imbued with supernatural stamina and loyalty.' },
  { id: 'status_1', name: 'Status (Acknowledged Neonate)', type: 'merit', category: 'background', dots: 1, details: 'Recognized citizen of the local Camarilla or Anarch movement.' },
  { id: 'status_3', name: 'Status (Respected Ancilla / Primogen)', type: 'merit', category: 'background', dots: 3, details: 'Influential elder, whip, or baron in local kindred politics.' },

  // Physical & Supernatural Merits
  { id: 'iron_gullet', name: 'Iron Gullet', type: 'merit', category: 'physical', dots: 3, details: 'Able to feed on cold, coagulated, rancid, or packaged blood without penalty.' },
  { id: 'beautiful', name: 'Beautiful', type: 'merit', category: 'social', dots: 2, details: '+1 die to all Social dice pools involving physical allure or seduction.' },
  { id: 'stunning', name: 'Stunning', type: 'merit', category: 'social', dots: 4, details: '+2 dice to all Social dice pools involving allure; mortals are captivated.' },
  { id: 'bloodhound', name: 'Bloodhound', type: 'merit', category: 'physical', dots: 1, details: 'Can smell the resonance and presence of blood from hundreds of yards away.' },
  { id: 'eat_food', name: 'Eat Food', type: 'merit', category: 'physical', dots: 2, details: 'Can swallow mortal food and drinks without immediately vomiting it up.' },

  // Flaws
  { id: 'enemy_1', name: 'Enemy (Rival Hunter/Gangster)', type: 'flaw', category: 'social', dots: 1, details: 'A persistent mortal or fledgling who actively works to ruin your night.' },
  { id: 'enemy_2', name: 'Enemy (Kindred Sheriff / Inquisitor)', type: 'flaw', category: 'social', dots: 2, details: 'A powerful hunter or rival elder determined to see you staked or executed.' },
  { id: 'dark_secret_1', name: 'Dark Secret (Masquerade Breach)', type: 'flaw', category: 'social', dots: 1, details: 'Left evidence or a surviving witness that could expose you to the Prince.' },
  { id: 'dark_secret_2', name: 'Dark Secret (Diablerie / Sabbat Past)', type: 'flaw', category: 'social', dots: 2, details: 'Guilty of eating kindred souls or serving the Black Hand.' },
  { id: 'infamy_1', name: 'Infamy (Known Troublemaker)', type: 'flaw', category: 'social', dots: 1, details: 'Distrusted across Elysium; gossip hounds watch your every move.' },
  { id: 'addiction_1', name: 'Addiction (Alcohol / Narcotics in Blood)', type: 'flaw', category: 'physical', dots: 1, details: 'Must feed from intoxicated or high vessels to satisfy chemical cravings.' },
  { id: 'archaic', name: 'Archaic', type: 'flaw', category: 'mental', dots: 2, details: 'Completely incapable of using smartphones, computers, or modern tech.' },
  { id: 'haunted_1', name: 'Haunted (Poltergeist)', type: 'flaw', category: 'mental', dots: 1, details: 'The restless spirit of a former victim follows you, knocking items over.' }
];
