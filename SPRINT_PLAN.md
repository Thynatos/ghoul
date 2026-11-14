# GHOUL: Gothic Tabletop Digital Suite
## Master Architectural Blueprint & Sprint Implementation Plan

---

### Executive Vision & Core Philosophy

**GHOUL** is a high-fidelity digital tabletop suite and Storyteller operational environment engineered specifically for **Vampire: The Masquerade** (5th Edition & 20th Anniversary Edition). 

#### Direct Critique Addressed:
1. **"The style looks messy, nothing it looks everywhere"**:
   - The UI previously lacked a unified design system, resulting in disparate styling accents, inconsistent modal headers, mismatched paddings, and crowded utility items.
   - **Remedy**: Implementation of the **Gothic Noir Design System (GNDS)**—a strict, tokenized UI architecture built around deep obsidian foundations (`#050508`), velvet card surfaces (`#0c0c12`), coagulated crimson borders (`#7f1d1d`), antique gold accents (`#d97706`), and a disciplined typographic hierarchy (Cinzel for monumental gothic titles, Playfair Display for dramatic narrative headers, and Geist Mono for bureaucratic data and rolls).
2. **"It doesn't have the same functions, especially for a Storyteller"**:
   - A Storyteller running a live table needs split-second access to scene pacing, hunting difficulty calculations, dyscrasia lookups, SPC quick-tactics, hidden dice rolls, player vs. GM visibility separation, and automated chronicle book-keeping (XP ledgers, remorse rolls, and territory disputes).
   - **Remedy**: Full integration of the **Storyteller Session Cockpit**, featuring dual-screen broadcasting (Player Screen vs. GM Secrets), automated Resonance & Dyscrasia generation, Second Inquisition escalation trackers, WebRTC peer-to-peer table sync, and custom city maps with interactive Fog of War.

---

## High-Level Sprint Roadmap

```
+---------------------------------------------------------------------------------------+
| SPRINT 1: Gothic Noir Design System & Master Storyteller Workspace Overhaul           |
| -> Tokenized UI, Unified Component Library, Storyteller Scene Pacing Cockpit         |
+-------------------------------------------+-------------------------------------------+
                                            |
                                            v
+---------------------------------------------------------------------------------------+
| SPRINT 2: Live P2P Multiplayer & Storyteller Dual-Screen Broadcast (WebRTC)          |
| -> Room Codes, Secret GM Whispers, Synchronized Combat Ladder, External Player View    |
+-------------------------------------------+-------------------------------------------+
                                            |
                                            v
+---------------------------------------------------------------------------------------+
| SPRINT 3: Interactive City Turf, Custom Map Engine & Fog of War Canvas               |
| -> Raster Map Uploads, Canvas Fog of War Brush, District Influence & Domain Contests  |
+-------------------------------------------+-------------------------------------------+
                                            |
                                            v
+---------------------------------------------------------------------------------------+
| SPRINT 4: Advanced Storyteller Tabletop Subsystems (Feeding, SPCs, Remorse & XP)      |
| -> Dyscrasia Engine, Instant SPC Builder, V5/V20 XP Audit Ledger, End-of-Night Remorse |
+-------------------------------------------+-------------------------------------------+
                                            |
                                            v
+---------------------------------------------------------------------------------------+
| SPRINT 5: Authentic Gothic Vector PDF Dossiers & High-Res Print Engine                |
| -> Canonical 2-Page/4-Page Fillable VTM PDF Export, Ink-Saver Mode, Dossier Bundler   |
+-------------------------------------------+-------------------------------------------+
                                            |
                                            v
+---------------------------------------------------------------------------------------+
| SPRINT 6: Homebrew Bloodline Studio & Modular Compendium Community Extender           |
| -> Custom Discipline Builder, Amalgam Logic, Lore-sheet Designer, JSON Module Packs    |
+---------------------------------------------------------------------------------------+
```

---

## Detailed Sprint Specifications

---

### SPRINT 1: Gothic Noir Design System (GNDS) & Master Storyteller Workspace Overhaul

#### 1. Objective & Scope
Eliminate visual discordance across the application by establishing a strict, reusable design system. Re-architect the navigation and central layouts into an authoritative Storyteller command station with zero clutter, standardized cards, unified modal shells, and a dynamic Scene Pacing Cockpit.

#### 2. Target File Architecture
```
src/
├── styles/
│   ├── gothicTheme.ts               # Core tokens (colors, shadows, borders, transitions)
│   └── typography.css               # Font scales, drop caps, and redaction styles
├── components/
│   ├── ui/                          # Reusable Gothic Noir Component Primitives
│   │   ├── GothicCard.tsx           # Standardized velvet/obsidian card with blood/gold headers
│   │   ├── GothicModal.tsx          # Accessible modal dialog with ornate gothic border accents
│   │   ├── GothicDrawer.tsx         # Slide-out drawer with sound trigger and backdrop blur
│   │   ├── GothicButton.tsx         # Primary (Blood), Secondary (Slate), Threat (Aggravated)
│   │   ├── GothicBadge.tsx          # Pill tags for clans, resonance, disciplines, status
│   │   ├── StatPipMatrix.tsx        # High-precision diamond/pip counters (Normal, Hunger, Damage)
│   │   └── RedactedText.tsx         # Spoiler redaction with click-to-reveal for ST vs Player
│   └── storyteller/
│       ├── StorytellerCockpit.tsx   # Master multi-tab command station
│       ├── ScenePacingTracker.tsx   # Scene type, tension clock, active NPCs, environmental traits
│       └── ThreatMatrixBar.tsx      # Consolidated Masquerade Breach & SI tracker header
```

#### 3. Core Data Contracts (`src/types/story.ts`)
```typescript
export type SceneType = 'elysium' | 'investigation' | 'social_intrigue' | 'hunting' | 'combat' | 'haven_downtime';
export type TensionLevel = 1 | 2 | 3 | 4 | 5; // 1 = Calm shadows, 5 = Active Masquerade collapse

export interface SceneBeat {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  hiddenStorytellerNotes: string;
  associatedNpcIds: string[];
  clueNodeIds?: string[];
}

export interface ActiveScene {
  id: string;
  chronicleId: string;
  title: string;
  location: string;
  sceneType: SceneType;
  tension: TensionLevel;
  resonance: 'choleric' | 'melancholic' | 'phlegmatic' | 'sanguine' | 'empty';
  resonanceIntensity: 'fleeting' | 'intense' | 'dyscrasia';
  presentCharacterIds: string[];
  presentNpcIds: string[];
  beats: SceneBeat[];
  environmentalModifiers: {
    darkness: boolean;
    heavyRainOrFog: boolean;
    surveillancePresent: boolean;
    crowdedRoom: boolean;
    fireHazard: boolean;
  };
  startedAt: string;
}
```

#### 4. Design System Tokens (`src/styles/gothicTheme.ts`)
```typescript
export const GOTHIC_THEME = {
  colors: {
    void: '#030305',
    obsidian: '#08080c',
    charcoal: '#111116',
    surface: '#16161f',
    surfaceElevated: '#1f1f2b',
    borderMuted: '#2a2a38',
    borderCrimson: '#7f1d1d',
    borderGold: '#854d0e',
    blood: {
      fresh: '#e11d48',
      coagulated: '#991b1b',
      deep: '#450a0a',
    },
    accent: {
      gold: '#f59e0b',
      goldMuted: '#b45309',
      willpower: '#2563eb',
      humanity: '#059669',
      torpor: '#7c3aed',
    },
    text: {
      parchment: '#f3f4f6',
      ash: '#9ca3af',
      redacted: '#4b5563',
    }
  },
  typography: {
    familyTitle: 'Cinzel, Georgia, serif',
    familyBody: 'Inter, system-ui, sans-serif',
    familyNarrative: '"Playfair Display", serif',
    familyMono: '"Geist Mono", monospace',
  },
  borders: {
    card: '1px solid rgba(127, 29, 29, 0.25)',
    cardHover: '1px solid rgba(225, 29, 72, 0.45)',
    goldDivider: '1px solid rgba(180, 83, 9, 0.3)',
  },
  shadows: {
    bloodGlow: '0 0 20px -3px rgba(225, 29, 72, 0.25)',
    goldGlow: '0 0 20px -3px rgba(245, 158, 11, 0.2)',
    vignette: 'inset 0 0 40px rgba(0, 0, 0, 0.8)',
  }
};
```

#### 5. Acceptance Criteria
- [ ] Every view (`sheet`, `coterie`, `combat`, `mystery`, `storyteller`) uses standardized `GothicCard` and `GothicModal` containers.
- [ ] Navigation header scales responsively without line breaks down to 1024px; utility buttons collapse into an intuitive quick-access bar.
- [ ] Storytellers can activate and manage the `ScenePacingTracker`, advancing scene beats and auto-calculating environmental dice penalties.

---

### SPRINT 2: Live Peer-to-Peer Multiplayer & Storyteller Dual-Screen Broadcast

#### 1. Objective & Scope
Enable seamless tabletop sessions without requiring costly backend server infrastructure. By utilizing **WebRTC DataChannels** with public STUN signaling (PeerJS / WebRTC mesh), players and Storytellers can link their laptops, tablets, or phones into a single synchronized room. The Storyteller can pop open a dedicated **Player Display Window** (for TVs or projectors) that automatically redacts secrets while streaming public rolls, active turn orders, and atmosphere art in real time.

#### 2. Target File Architecture
```
src/
├── types/
│   └── network.ts                   # Network packets, room states, peer events
├── services/
│   ├── peerService.ts               # WebRTC connection coordinator & message router
│   └── syncEngine.ts                # Optimistic state reconciliation for HP, Hunger, and Rolls
├── components/
│   ├── network/
│   │   ├── RoomLobbyModal.tsx       # Create/Join room with 6-letter gothic room codes & QR codes
│   │   ├── ConnectedPeersBadge.tsx  # Indicator showing active connected players and ping
│   │   └── SecretWhisperDrawer.tsx  # Private ST-to-Player whispers & hidden dice rolls
│   └── broadcast/
│       ├── PlayerScreenView.tsx     # Fullscreen clean projector view (auto-syncing)
│       └── LiveDiceBanner.tsx       # Cinematic screen-wide 3D dice result banner
```

#### 3. Core Data Contracts (`src/types/network.ts`)
```typescript
export type PeerRole = 'storyteller' | 'co_storyteller' | 'player' | 'spectator';

export interface RoomParticipant {
  peerId: string;
  characterId?: string;
  playerName: string;
  role: PeerRole;
  isReady: boolean;
  pingMs: number;
}

export type NetworkMessageType = 
  | 'SYNC_CHARACTER_STATE'
  | 'DICE_ROLL_BROADCAST'
  | 'COMBAT_INITIATIVE_UPDATE'
  | 'STORYTELLER_WHISPER'
  | 'MASQUERADE_LEVEL_CHANGED'
  | 'MYSTERY_NODE_REVEALED';

export interface NetworkEnvelope<T = any> {
  id: string;
  type: NetworkMessageType;
  senderPeerId: string;
  senderName: string;
  targetPeerId?: string; // If undefined, broadcast to entire room
  timestamp: number;
  payload: T;
}

export interface DiceBroadcastPayload {
  rollerName: string;
  characterName: string;
  poolLabel: string;
  poolSize: number;
  hungerDice: number;
  results: number[];
  hungerResults: number[];
  successes: number;
  margin: number;
  isMessyCritical: boolean;
  isBestialFailure: boolean;
  isSecretRoll: boolean; // Only visible to Storyteller
}
```

#### 4. Storyteller vs. Player Separation Rules
- **Player Screen View**:
  - Hides all NPC stat blocks, hidden beat notes, unrevealed investigation pins, and secret ST rolls.
  - Automatically activates when the Storyteller clicks "Launch External Display".
  - Broadcasts public combat turn indicators, damage alerts, and gothic environmental backgrounds based on the active scene type.
- **Secret Whispers**:
  - Storytellers can right-click any connected player to send private telepathic messages (Auspex, Dominate) or request secret rolls directly without tipping off the rest of the coterie.

#### 5. Acceptance Criteria
- [ ] Storyteller can generate a 6-letter room code (e.g. `SANG-4X`); up to 8 players can connect via WebRTC.
- [ ] Any character sheet edit (Hunger increase, Health damage, Willpower spend) propagates to the Storyteller's console in < 150ms.
- [ ] Secret dice rolls remain strictly visible to the Storyteller while public rolls trigger shared audio and 3D dice animations on all clients.

---

### SPRINT 3: Interactive City Turf, Custom Map Engine & Fog of War Canvas

#### 1. Objective & Scope
Vampire chronicles thrive on urban territory control: Elysiums, hunting domains, rack districts, Lupine borders, and Anarch baronies. This sprint replaces static map interfaces with a high-performance **HTML5 Canvas / Leaflet Hybrid Map Engine** supporting custom cartography uploads, interactive turf boundaries, dynamic Chasse/Lien influence contests, and a Storyteller **Fog of War** brush.

#### 2. Target File Architecture
```
src/
├── types/
│   └── map.ts                       # Turf, layers, pins, Fog of War state
├── services/
│   ├── mapEngine.ts                 # Canvas rendering pipeline, polygon clipping, distance math
│   └── territoryEngine.ts           # Chasse, Lien, Portillon contest calculation algorithms
├── components/
│   ├── map/
│   │   ├── InteractiveCityMap.tsx   # Core viewport with pan/zoom and layer toggle
│   │   ├── MapUploadModal.tsx       # Custom map import (Chicago, London, custom city PNG/JPG/SVG)
│   │   ├── FogOfWarToolbar.tsx      # Brush tool, reveal tool, reset fog, player vision toggle
│   │   ├── DistrictInspector.tsx    # Domain details (Ruling Coterie, Chasse 1-5, Rack quality)
│   │   └── TerritoryContestModal.tsx # Automated domain war/influence test resolver
```

#### 3. Core Data Contracts (`src/types/map.ts`)
```typescript
export type DomainSect = 'camarilla' | 'anarch' | 'sabbat' | 'autarkis' | 'second_inquisition' | 'lupine';

export interface TerritoryZone {
  id: string;
  name: string;
  sect: DomainSect;
  rulerCoterieId?: string;
  rulerNpcId?: string;
  chasseLevel: number; // 0 to 5 (hunting ease)
  lienLevel: number;   // 0 to 5 (human connections)
  portillonLevel: number; // 0 to 5 (security & haven defense)
  dangerLevel: number; // Second Inquisition presence (0-5)
  color: string;
  polygonCoordinates: [number, number][]; // Relative percentage coordinates [x%, y%]
  notes: string;
  isDisputed: boolean;
}

export interface MapPin {
  id: string;
  label: string;
  category: 'haven' | 'elysium' | 'feeding_ground' | 'crime_scene' | 'inquisition_base' | 'landmark';
  coordinates: [number, number];
  associatedCoterieId?: string;
  associatedCharacterId?: string;
  isSecret: boolean; // Visible only to Storyteller
  description: string;
}

export interface CustomMapConfig {
  id: string;
  name: string;
  imageUrl: string;
  width: number;
  height: number;
  scaleMilesPer1000Px: number;
  fogOfWarMaskBase64?: string; // Rasterized black/transparent alpha mask
  zones: TerritoryZone[];
  pins: MapPin[];
}
```

#### 4. Storyteller Fog of War Mechanics
- **Fog Rendering**: A 2D canvas overlay over the map. Unexplored city blocks are cloaked in atmospheric gothic mist and obsidian fog.
- **Brush Modes**:
  - `Reveal (Soft Edge)`: Reveals neighborhood streets with a gothic smoky radial gradient.
  - `Cloak`: Re-covers areas compromised by Second Inquisition patrols or Camarilla lockdowns.
  - `Sync to Players`: Storyteller controls precisely which districts players see on their devices.

#### 5. Acceptance Criteria
- [ ] Users can upload high-resolution city map images (PNG/JPG up to 10MB) or choose default maps (Chicago by Night, New York, London).
- [ ] Storytellers can draw custom territory polygons, adjust Chasse/Lien/Portillon ratings, and resolve territorial influence contests.
- [ ] Fog of War mask renders smoothly at 60 FPS during pan/zoom with zero memory leaks.

---

### SPRINT 4: Advanced Storyteller Tabletop Subsystems (Feeding, SPCs, Remorse & XP Engine)

#### 1. Objective & Scope
Vampire: The Masquerade involves intricate nightly book-keeping that slows down narrative momentum if calculated manually. This sprint builds four automated mathematical engines:
1. **Feeding & Resonance Engine**: Roll hunting dice based on Predator Type and hunting ground, determining Blood Resonance and Dyscrasia boons.
2. **Instant SPC & Threat Spawner**: Generate balanced mortals, ghouls, fledglings, ancillae, and elders with complete dice pools and agendas in under 2 seconds.
3. **End-of-Night Remorse & Degeneration Resolver**: Automatically calculate Humanity tests based on Stains and unmarked boxes.
4. **XP Ledger & Cost Calculator**: Track earned and spent Experience with strict V5 & V20 rule verification.

#### 2. Target File Architecture
```
src/
├── types/
│   ├── feeding.ts                   # Hunting rolls, dyscrasia mechanics, temperaments
│   ├── spc.ts                       # Storyteller Character stat blocks & archetypes
│   └── progression.ts               # XP ledger entries, remorse tests, humanity logs
├── services/
│   ├── feedingEngine.ts             # Hunting resolution by predator type & domain
│   ├── spcGenerator.ts              # Procedural vampire/mortal stat block synthesis
│   ├── remorseEngine.ts             # V5 Remorse & V20 Degeneration mechanics
│   └── xpEngine.ts                  # XP spend validation (attributes, skills, disciplines)
├── components/
│   ├── storyteller/
│   │   ├── FeedingSimulatorModal.tsx # Interactive hunt resolver with blood dyscrasia cards
│   │   ├── QuickSpcGeneratorModal.tsx # One-click antagonist creation with export to combat
│   │   ├── RemorseResolutionModal.tsx # End-of-night dramatic stain contest
│   │   └── CharacterXpLedgerModal.tsx # Detailed transaction history for character growth
```

#### 3. Core Mechanics & Algorithmic Rules

##### A. V5 Remorse Roll Algorithm (`src/services/remorseEngine.ts`)
```typescript
/**
 * V5 Remorse Test Rules:
 * - Unmarked boxes = 10 - Humanity - Stains
 * - Remorse dice pool = max(1, Unmarked boxes)
 * - Roll pool:
 *   - If at least ONE success is rolled: Humanity holds! Clear all Stains.
 *   - If ZERO successes rolled: The Beast gnaws the soul. Lose 1 Humanity dot, then clear Stains.
 */
export function resolveV5Remorse(humanity: number, stains: number): {
  unmarkedBoxes: number;
  dicePool: number;
  rollResults: number[];
  successes: number;
  humanityLost: boolean;
  newHumanity: number;
  logMessage: string;
} {
  const unmarkedBoxes = Math.max(0, 10 - humanity - stains);
  const dicePool = Math.max(1, unmarkedBoxes);
  
  // Simulated D10 rolls (success on 6+)
  const rollResults = Array.from({ length: dicePool }, () => Math.floor(Math.random() * 10) + 1);
  const successes = rollResults.filter(die => die >= 6).length;
  const humanityLost = successes === 0;
  const newHumanity = humanityLost ? Math.max(0, humanity - 1) : humanity;
  
  return {
    unmarkedBoxes,
    dicePool,
    rollResults,
    successes,
    humanityLost,
    newHumanity,
    logMessage: humanityLost 
      ? `Remorse failed (0 successes on ${dicePool} dice). Humanity fell from ${humanity} to ${newHumanity}!`
      : `Remorse succeeded (${successes} successes on ${dicePool} dice). Humanity remains at ${humanity}. All stains cleansed.`
  };
}
```

##### B. V5 Experience Cost Progression (`src/services/xpEngine.ts`)
```typescript
export const V5_XP_COSTS = {
  attribute: (newDot: number) => newDot * 5,
  skill: (newDot: number) => newDot * 3,
  specialty: () => 3,
  clanDiscipline: (newDot: number) => newDot * 5,
  otherDiscipline: (newDot: number) => newDot * 7,
  caitiffDiscipline: (newDot: number) => newDot * 6,
  bloodAlchemy: (newDot: number) => newDot * 5,
  ritualOrCeremony: (level: number) => level * 3,
  advantage: (dots: number) => dots * 3,
  bloodPotency: (newDot: number) => newDot * 10,
};
```

#### 4. Acceptance Criteria
- [ ] Storytellers can trigger a mass end-of-session Remorse check for all player characters with automated stain purging.
- [ ] Hunting simulator calculates Rouse checks, slaked Hunger (1-5), and awards temporary Dyscrasia bonuses (e.g. Melancholic Dyscrasia: +2 dice to Obfuscate/Fortitude).
- [ ] XP Ledger prevents illegal spends and displays exact transaction logs with timestamped Storyteller approvals.

---

### SPRINT 5: Authentic Gothic Vector PDF Dossiers & High-Res Print Engine

#### 1. Objective & Scope
Many tabletop players prefer physical sheets at the table or keep archival PDF dossiers on tablets. This sprint develops a **pure vector PDF and print-ready rendering engine** that produces tournament-grade, publication-quality 2-page and 4-page character sheets and coterie dossiers matching the authentic White Wolf / Onyx Path aesthetic.

#### 2. Target File Architecture
```
src/
├── services/
│   ├── pdf/
│   │   ├── pdfBuilder.ts            # Client-side PDF generation pipeline
│   │   ├── v5SheetLayout.ts         # Canonical V5 2-page vector layout
│   │   ├── v20SheetLayout.ts        # Canonical V20 classic parchment layout
│   │   └── coterieDossierLayout.ts  # Communal coterie & haven print template
├── components/
│   └── sheet/
│       ├── ExportPdfModal.tsx       # Export configuration (Parchment, Ink-Saver, V5/V20)
│       └── PrintableSheetPreview.tsx # Live browser print preview with CSS page breaks
```

#### 3. Key Technical Specifications
- **Client-Side Generation**: Zero server dependencies; executed locally in the browser via clean HTML-to-Canvas / Vector SVG coordinate mapping.
- **Visual Styles**:
  1. *Velvet Obsidian (Screen Optimized)*: Deep black background with vibrant red blood pips.
  2. *Antique Parchment (Classic Gothic)*: Weathered tea-stained parchment texture with serif typography.
  3. *Ink-Saver Monochrome (Physical Printer Friendly)*: Crisp white background, solid black borders, and hollow outline pips for minimum toner usage.
- **Content Coverage**:
  - Page 1: Attributes, Skills, Disciplines, Health tracker, Willpower tracker, Humanity & Hunger tracker, Blood Potency details.
  - Page 2: Chronicle Tenets, Convictions & Touchstones, Merits & Flaws, Haven traits, Biography, True Age, and Bloodline notes.
  - Page 3-4 (Extended Dossier): Active Blood Bonds, Diablerie history, Coterie ties, and Equipment inventory.

#### 4. Acceptance Criteria
- [ ] Single-click generation produces a crisp, scalable 300 DPI PDF ready for US Letter and A4 printing.
- [ ] Health and Willpower boxes display accurate Superficial (`/`) and Aggravated (`X`) damage markings.
- [ ] Ink-Saver mode passes high-contrast accessibility tests with zero dark background fills.

---

### SPRINT 6: Homebrew Bloodline Studio & Modular Compendium Extender

#### 1. Objective & Scope
Empower Storytellers to build custom content for their chronicles: create unique Bloodlines, custom Discipline powers with Amalgam prerequisites, custom Predator Types, Clan Curses, and Lore-sheets, with full JSON import/export capabilities.

#### 2. Target File Architecture
```
src/
├── types/
│   └── homebrew.ts                  # Schema for custom clans, disciplines, powers, lore-sheets
├── services/
│   └── homebrewService.ts           # Storage, validation, and compendium injection
├── components/
│   └── homebrew/
│       ├── HomebrewStudioView.tsx   # Hub for custom content creation
│       ├── CustomPowerBuilderModal.tsx # Discipline power wizard (Rouse cost, pool, amalgam)
│       ├── CustomClanBuilderModal.tsx  # Clan bane, compulsion, and discipline selection
│       ├── CommunityPackManager.tsx # Import/Export JSON chronicle packs
```

#### 3. Core Data Contracts (`src/types/homebrew.ts`)
```typescript
export interface CustomDisciplinePower {
  id: string;
  name: string;
  disciplineId: string;
  level: number; // 1 to 5
  rouseCost: number; // 0 = Free, 1 = 1 Rouse Check, 2 = 2 Checks
  dicePoolFormula: string; // e.g. "Strength + Brawl vs Stamina + Fortitude"
  summary: string;
  systemDescription: string;
  duration: string;
  amalgamPrerequisite?: {
    disciplineId: string;
    level: number;
  };
  author: string;
  edition: 'v5' | 'v20' | 'both';
}

export interface CustomClan {
  id: string;
  name: string;
  tagline: string;
  clanCurseName: string;
  clanCurseDescription: string;
  compulsionName: string;
  compulsionDescription: string;
  disciplines: string[];
  favoredPredatorTypes?: string[];
  loreSnippet: string;
}
```

#### 4. Acceptance Criteria
- [ ] Custom discipline powers seamlessly appear in the Character Builder, Character Sheet dropdowns, and Compendium Wiki.
- [ ] Amalgam power prerequisites are validated by the Character Builder (e.g., verifying Obfuscate 2 before granting a power requiring Obfuscate 2 + Protean 1).
- [ ] Homebrew packs can be exported to a single `.ghoulpack.json` file and shared with other Storytellers.

---

## Detailed Sprint Execution Schedule & Dependencies

| Sprint | Focus Area | Complexity | Dependencies | Primary Target Audience |
| :--- | :--- | :---: | :--- | :--- |
| **Sprint 1** | Gothic Noir Design System & ST Cockpit | **High** | None (Foundation) | Storytellers & Players |
| **Sprint 2** | Live P2P WebRTC & Dual-Screen Broadcast | **High** | Sprint 1 (Design tokens) | Tabletop Groups |
| **Sprint 3** | Interactive City Turf & Fog of War | **Medium** | Sprint 1 (Theme) | Storytellers & Strategists |
| **Sprint 4** | Feeding, SPCs, Remorse & XP Engine | **Medium** | Sprint 1 (UI primitives) | Storytellers (Prep & Table) |
| **Sprint 5** | Vector PDF Dossiers & Print Engine | **Medium** | Sprint 1 (Styles) | In-person Players & STs |
| **Sprint 6** | Homebrew Bloodline Studio | **Low** | Sprint 4 (Engines) | World Builders & Hackers |

---

## Immediate Next Steps & Recommended Path

To address the immediate user feedback regarding style consistency and Storyteller utility, **Sprint 1** should be prioritized:
1. Establish `src/styles/gothicTheme.ts` with standardized dark obsidian and blood crimson color tokens.
2. Build standardized `GothicCard` and `GothicModal` UI primitives to unify all existing views.
3. Replace fragmented modals with the unified **Storyteller Cockpit** tab, integrating the Scene Pacing Tracker and instant hazards.
