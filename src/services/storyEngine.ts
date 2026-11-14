import { 
  ActiveScene, 
  SceneBeat, 
  SceneType, 
  TensionLevel, 
  EnvironmentalModifiers, 
  EnvironmentalPenaltySummary, 
  ThreatMatrixState 
} from '../types/story';
import { storageService } from './storage';

export const storyEngine = {
  /**
   * Calculate environmental dice modifiers & tactical hazard penalties
   */
  calculateEnvironmentalModifiers(modifiers: EnvironmentalModifiers): EnvironmentalPenaltySummary {
    let perceptionPenalty = 0;
    let stealthModifier = 0;
    let frenzyDifficultyModifier = 0;
    let masqueradeRiskModifier = 0;
    let damagePerTurn = 0;
    let damageType: 'superficial' | 'aggravated' | undefined = undefined;
    const descriptions: string[] = [];

    if (modifiers.darkness) {
      perceptionPenalty -= 2;
      stealthModifier += 1;
      descriptions.push('Pitch Black / Shadow: -2 to visual Perception tests, +1 to Stealth pools.');
    }

    if (modifiers.heavyRainOrFog) {
      perceptionPenalty -= 1;
      stealthModifier += 1;
      descriptions.push('Freezing Rain & Heavy Mist: -1 to visual/auditory Perception & Firearms ranges.');
    }

    if (modifiers.surveillancePresent) {
      masqueradeRiskModifier += 2;
      descriptions.push('Active Surveillance (CCTV / Phone telemetry): +2 Masquerade risk; supernatural disciplines trigger immediate alert.');
    }

    if (modifiers.crowdedRoom) {
      stealthModifier += 1;
      masqueradeRiskModifier += 1;
      descriptions.push('Crowded Chamber / Mortal Throng: +1 to blend in social crowds; feeding without cover risks instant Masquerade breach.');
    }

    if (modifiers.fireHazard) {
      frenzyDifficultyModifier += 2;
      damagePerTurn += 2;
      damageType = 'aggravated';
      descriptions.push('Roaring Fire Hazard: Inflicts 2 Aggravated damage/turn; triggers Diff 3 Rötschreck (Terror Frenzy).');
    }

    if (modifiers.daylightExposure) {
      damagePerTurn += 3;
      damageType = 'aggravated';
      frenzyDifficultyModifier += 3;
      descriptions.push('Lethal Sunlight: Inflicts 3 Aggravated wounds/turn; blind panic Rötschreck Diff 4+.');
    }

    return {
      perceptionPenalty,
      stealthModifier,
      frenzyDifficultyModifier,
      masqueradeRiskModifier,
      damagePerTurn,
      damageType,
      descriptions
    };
  },

  /**
   * Retrieve active scene from storage or generate default
   */
  getActiveScene(): ActiveScene {
    return storageService.getActiveScene();
  },

  /**
   * Save active scene
   */
  saveActiveScene(scene: ActiveScene): void {
    storageService.saveActiveScene(scene);
  },

  /**
   * Toggle completion state of a scene beat
   */
  toggleSceneBeat(beatId: string): ActiveScene {
    const scene = this.getActiveScene();
    const updatedBeats = scene.beats.map(beat => {
      if (beat.id === beatId) {
        return { ...beat, isCompleted: !beat.isCompleted };
      }
      return beat;
    });
    const updated = { ...scene, beats: updatedBeats };
    this.saveActiveScene(updated);
    return updated;
  },

  /**
   * Update tension level with boundary clamping (1 to 5)
   */
  setTension(tension: TensionLevel): ActiveScene {
    const clamped = Math.max(1, Math.min(5, tension)) as TensionLevel;
    const scene = this.getActiveScene();
    const updated = { ...scene, tension: clamped };
    this.saveActiveScene(updated);
    return updated;
  },

  /**
   * Advance or reduce tension level by delta
   */
  advanceTension(delta: number): ActiveScene {
    const scene = this.getActiveScene();
    const next = Math.max(1, Math.min(5, scene.tension + delta)) as TensionLevel;
    const updated = { ...scene, tension: next };
    this.saveActiveScene(updated);
    return updated;
  },

  /**
   * Update scene type
   */
  setSceneType(sceneType: SceneType): ActiveScene {
    const scene = this.getActiveScene();
    const updated = { ...scene, sceneType };
    this.saveActiveScene(updated);
    return updated;
  },

  /**
   * Toggle a specific environmental modifier
   */
  toggleEnvironmentalModifier(key: keyof EnvironmentalModifiers): ActiveScene {
    const scene = this.getActiveScene();
    const currentVal = !!scene.environmentalModifiers[key];
    const updated = {
      ...scene,
      environmentalModifiers: {
        ...scene.environmentalModifiers,
        [key]: !currentVal
      }
    };
    this.saveActiveScene(updated);
    return updated;
  },

  /**
   * Add a new beat to current scene
   */
  addSceneBeat(beat: Omit<SceneBeat, 'id'>): ActiveScene {
    const scene = this.getActiveScene();
    const newBeat: SceneBeat = {
      ...beat,
      id: 'beat_' + Date.now() + '_' + Math.floor(Math.random() * 1000)
    };
    const updated = {
      ...scene,
      beats: [...scene.beats, newBeat]
    };
    this.saveActiveScene(updated);
    return updated;
  },

  /**
   * Remove a beat from current scene
   */
  removeSceneBeat(beatId: string): ActiveScene {
    const scene = this.getActiveScene();
    const updated = {
      ...scene,
      beats: scene.beats.filter(b => b.id !== beatId)
    };
    this.saveActiveScene(updated);
    return updated;
  },

  /**
   * Retrieve threat matrix state
   */
  getThreatMatrix(): ThreatMatrixState {
    return storageService.getThreatMatrix();
  },

  /**
   * Save threat matrix state
   */
  saveThreatMatrix(matrix: ThreatMatrixState): void {
    storageService.saveThreatMatrix(matrix);
  },

  /**
   * Set Masquerade exposure level (0 to 5)
   */
  setMasqueradeExposure(level: number): ThreatMatrixState {
    const matrix = this.getThreatMatrix();
    const clamped = Math.max(0, Math.min(5, level));
    const updated = { ...matrix, masqueradeExposure: clamped };
    this.saveThreatMatrix(updated);
    return updated;
  },

  /**
   * Set Second Inquisition FIRSTLIGHT alert level (0 to 5)
   */
  setSecondInquisitionAlert(level: number): ThreatMatrixState {
    const matrix = this.getThreatMatrix();
    const clamped = Math.max(0, Math.min(5, level));
    const updated = { ...matrix, secondInquisitionAlert: clamped };
    this.saveThreatMatrix(updated);
    return updated;
  }
};
