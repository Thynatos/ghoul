# 🩸 GHOUL // Vampire: The Masquerade V5 & V20 Suite

A high-performance, dark gothic digital character builder, interactive sheet manager, and Storyteller campaign suite built for **Vampire: The Masquerade (V5 & V20)**.

Designed specifically for **personal tabletop play, solo chronicles, and Storytellers**, GHOUL replicates and vastly improves upon GhoulApp with **100% offline, local-first persistence**, a **built-in procedural atmospheric soundboard**, **Leaflet-powered city territory mapping**, an **interactive canvas relationship web**, and a **universal dice probability engine**.

---

## 🌟 Key Features & Improvements for Personal Use

### 1. 🩸 Complete V5 & V20 Character Sheets
* **Interactive Rolling**: Click any Attribute + Skill, or Discipline power right on your sheet to automatically compose and prime rolls in the dice tray.
* **Trackers**:
  * Health & Willpower boxes supporting **Empty `[ ]`**, **Superficial `[/]`**, and **Aggravated `[X]`** damage with automatic impairment warning calculations.
  * **V5 Trackers**: Hunger pips (0–5), Humanity rating with Stains tracking, Blood Potency (0–10) with one-click **Rouse Check** and **Blood Surge (+2 Dice)** buttons.
  * **V20 Trackers**: Blood Pool with one-click spend button, Virtues (Conscience, Self-Control, Courage), and Paths of Enlightenment.
* **Customization**: Edit all traits, specialties, havens, touchstones, convictions, ambitions, desires, and notes.
* **Print / PDF**: Clean, print-ready CSS layout for printing physical sheets directly from the browser.
* **Instant Character Cloning**: Duplicate any character to test different XP progressions or variations.

### 2. 🎲 Universal 3D-Styled Dice Roller
* **V5 Engine**: Rolls standard black d10s alongside blood-red Hunger d10s. Automatically calculates successes (6–9), Critical Pairs (pairs of 10s = 4 successes), **Messy Criticals** (Hunger 10 + crit), and **Bestial Failures** (failure with Hunger 1).
* **Willpower Reroll**: Click up to 3 non-10 regular dice directly in the tray to reroll them.
* **V20 Engine**: Pools vs Target Difficulty (default 6), Rule of 1s (1s cancel successes), optional **Specialty Exploding 10s**, and **Botch** detection.
* **Tactile Audio**: Synthesized bone/plastic dice rattle, triumphant gothic choir on criticals, and ominous rumble on bestial failures.
* **Celebration FX**: Confetti burst on Critical Wins and Exceptional Successes!

### 3. 🗺️ City Map & Territory Workbench
* **Leaflet Dark Map**: Interactive dark mode map powered by CartoDB Dark Matter tiles.
* **Territory Overlays**: Color-coded faction turf boundaries (Camarilla, Anarch, Sabbat) with influence percentages.
* **Custom Kindred Landmarks**: Plant pins anywhere on the map for Havens, Elysiums, Racks (Feeding grounds), Tremere Chantries, Anarch dive bars, Lupine zones, and SI safehouses.
* **Filter by Sect**: Instantly toggle between Camarilla, Anarch, and Independent control.

### 4. 🕸️ Interactive Kindred Relationship Web
* **Draggable Canvas Graph**: Visual node graph of PCs, NPCs, Touchstones, and Factions. Drag and reposition nodes across the canvas.
* **Typed Kindred Bonds**: Connect figures with color-coded bonds:
  * Blood Bond (Stages 1, 2, 3)
  * Sire & Childe
  * Allies & Mentors
  * Rivals & Blood Feuds
  * Boons Owed & Love / Devotion

### 5. 📜 Harpy Boons Ledger & Social Debt
* Track social currency in Kindred society across **Trivial**, **Minor**, **Major**, and **Life Boons**.
* Inscribe debtor, creditor, date created, and details.
* Filter active vs repaid boons.

### 6. 🔊 Procedural Atmospheric Soundboard & Ambience Mixer
* Pure **Web Audio API** synthesized soundscapes—zero external audio dependencies, works 100% offline:
  * 🌧️ **Rain & Rolling Storm**
  * ⛪ **Cathedral / Chantry Drone** (resonant deep organ & choir harmonics)
  * 🍸 **Underground Nightclub Pulse** (muffled 120BPM sub-bass kick)
  * 💓 **Kindred Heartbeat** (realistic rhythmic lub-dub)
  * 💨 **Whispering Shadows** (ethereal bandpass sweeps)
  * 🔥 **Haven Fireplace** (warm crackling hearth)
* Independent volume sliders, master mute toggle, and quick mood presets (*"Rain on Haven"*, *"Chantry Ritual"*, *"Succubus Club VIP"*).

### 7. 🧪 "The Blood Test" - Clan Quiz
* Immersive 10-question psychological questionnaire posing evocative moral dilemmas and predatory scenarios.
* Calculates real-time affinity weighting across all 16+ Vampire clans.
* Displays primary clan match and runner-up with full clan lore, banes, compulsions, and a 1-click **"Spawn Character"** launcher.

### 8. ⚡ Fast Build // Instant NPC & Archetype Generator
* Generates completely balanced, ready-to-play Kindred in one click.
* Tailor by Clan or randomize across Fledglings, Neonates, and Ancillae.

### 9. 📖 VTM Compendium & Lore Wiki
* **16+ Canonical Clans**: Brujah, Gangrel, Malkavian, Nosferatu, Toreador, Tremere, Ventrue, Banu Haqim, Hecata, Lasombra, The Ministry, Ravnos, Salubri, Tzimisce, Caitiff, and Thin-Blood.
* **13 Disciplines**: Animalism, Auspex, Blood Sorcery, Celerity, Dominate, Fortitude, Obfuscate, Oblivion, Potence, Presence, Protean, Thin-blood Alchemy, with full Level 1–5 powers, Rouse costs, and dice pools.
* **11 Predator Types**: Complete mechanics for Alleycat, Bagger, Blood Leech, Cleaver, Consensualist, Farmer, Osiris, Sandman, Scene Queen, Siren, and Trapdoor.
* **Merits & Flaws Database**: Categorized Physical, Social, Mental, Haven, and Background traits.

### 10. 💾 100% Local-First & Zero Friction
* No accounts, logins, or cloud subscriptions required.
* Automatically saves all data to local storage.
* Full **JSON Backup Export & Import** for seamless archiving and transfer.
* **Command Palette (`Ctrl+K`)**: Rapidly search and navigate between characters, clans, disciplines, and tools.

---

## 🚀 Quickstart

```bash
# Clone or navigate to the directory
cd c:/Users/badir/Documents/ghoul

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173/` in your browser.

To build for production:
```bash
npm run build
```

---

## ⌨️ Keyboard Shortcuts

* `Ctrl + K` / `Cmd + K`: Open Command Palette search
* `Esc`: Close open modal / drawer
