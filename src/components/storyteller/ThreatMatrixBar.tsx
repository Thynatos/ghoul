import React from 'react';
import { ShieldAlert, Crosshair, AlertTriangle, Radio, Eye } from 'lucide-react';
import { ThreatMatrixState } from '../../types/story';
import { GothicCard } from '../ui/GothicCard';
import { GothicBadge } from '../ui/GothicBadge';
import { soundEngine } from '../../services/soundEngine';

export interface ThreatMatrixBarProps {
  threatMatrix: ThreatMatrixState;
  onUpdateThreatMatrix: (matrix: ThreatMatrixState) => void;
  onShowToast?: (title: string, desc?: string, type?: 'info' | 'blood' | 'success' | 'error') => void;
}

export const ThreatMatrixBar: React.FC<ThreatMatrixBarProps> = ({
  threatMatrix,
  onUpdateThreatMatrix,
  onShowToast
}) => {
  const masqueradeDescriptions = [
    { title: 'Absolute Shadow', effect: 'Mortal feeds clean. Civilian cameras deleted. Zero suspicion.' },
    { title: 'Faint Whispers', effect: 'CPD local blotters note odd bites. Obscure social media clip dismissed as CGI.' },
    { title: 'Active Inquiries', effect: 'Area 1 Homicide detectives investigating exsanguinated bodies. +1 Difficulty to street hunting.' },
    { title: 'Federal Surveillance', effect: 'FBI SAD Unit 4 monitoring cellular nodes. Unmarked dark sedans patrol the Loop.' },
    { title: 'Entity Infiltration', effect: 'Vatican Society of St. Leopold & military contractors active. Communications intercepted.' },
    { title: 'FIRSTLIGHT Purge', effect: 'Active martial cordon! Incendiary drone strikes authorized. Total Masquerade catastrophe!' }
  ];

  const siAlertDescriptions = [
    { title: 'Dormant Archives', effect: 'Classified Project Twilight files archived; no local taskforce deployed.' },
    { title: 'Local Law Advisory', effect: 'Chicago PD intelligence notified of "anomalous occult cartel violence".' },
    { title: 'Interagency Warning', effect: 'Department of Homeland Security / SAD cross-referencing biometric camera scans.' },
    { title: 'Tactical Reconnaissance', effect: 'Night-vision surveillance drones hovering at 5,000 ft. Thermal imaging sweeps.' },
    { title: 'Kill-Team Mobilized', effect: 'FIRSTLIGHT black-ops strike unit on standby with dragon-breath incendiary rounds.' },
    { title: 'Direct Assault Active', effect: 'Breaching charges detonating on suspected havens. Hunter strike underway!' }
  ];

  const handleSetMasquerade = (lvl: number) => {
    const clamped = Math.max(0, Math.min(5, lvl));
    const next = { ...threatMatrix, masqueradeExposure: clamped };
    onUpdateThreatMatrix(next);
    if (clamped >= 4) {
      soundEngine.playFrenzyRoar();
      if (onShowToast) onShowToast('MASQUERADE COLLAPSE RISK', masqueradeDescriptions[clamped].effect, 'error');
    } else {
      soundEngine.playDiceRoll();
      if (onShowToast) onShowToast(`Masquerade Exposure Level ${clamped}`, masqueradeDescriptions[clamped].title, 'blood');
    }
  };

  const handleSetSIAlert = (lvl: number) => {
    const clamped = Math.max(0, Math.min(5, lvl));
    const next = { ...threatMatrix, secondInquisitionAlert: clamped };
    onUpdateThreatMatrix(next);
    if (clamped >= 4) {
      soundEngine.playStakeImpact();
      if (onShowToast) onShowToast('FIRSTLIGHT ALERT ELEVATED', siAlertDescriptions[clamped].effect, 'error');
    } else {
      soundEngine.playDiceRoll();
      if (onShowToast) onShowToast(`Second Inquisition Alert ${clamped}`, siAlertDescriptions[clamped].title, 'info');
    }
  };

  const getMasqueradeBadgeVariant = (lvl: number): 'neutral' | 'amber' | 'blood' => {
    if (lvl >= 4) return 'blood';
    if (lvl >= 2) return 'amber';
    return 'neutral';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Masquerade Exposure Meter */}
      <GothicCard
        variant="raised"
        ribbon={threatMatrix.masqueradeExposure >= 4 ? 'crimson' : 'none'}
        className="border-rose-950/70"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#1c1825]">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg ${
              threatMatrix.masqueradeExposure >= 4
                ? 'bg-red-950 text-red-400 border border-red-600 animate-pulse shadow-[0_0_12px_rgba(225,29,72,0.5)]'
                : 'bg-rose-950/70 text-rose-300 border border-rose-800'
            }`}>
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className="font-cinzel text-xs font-black tracking-widest text-white uppercase block">
                MASQUERADE EXPOSURE
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                Camarilla Secrecy Protocol
              </span>
            </div>
          </div>

          <GothicBadge
            label={`TIER ${threatMatrix.masqueradeExposure} / 5`}
            variant={getMasqueradeBadgeVariant(threatMatrix.masqueradeExposure)}
            size="sm"
          />
        </div>

        {/* 6-step dark meter dials */}
        <div className="grid grid-cols-6 gap-1.5 my-3">
          {[0, 1, 2, 3, 4, 5].map(lvl => {
            const isFilled = lvl <= threatMatrix.masqueradeExposure;
            const isMax = lvl === 5;
            const isHigh = lvl >= 4;
            const isMed = lvl >= 2;

            return (
              <button
                key={lvl}
                type="button"
                onClick={() => handleSetMasquerade(lvl)}
                title={`Set Masquerade Level ${lvl}: ${masqueradeDescriptions[lvl].title}`}
                className={`
                  h-9 rounded-lg font-mono font-bold text-xs transition-all duration-150 cursor-pointer border flex flex-col items-center justify-center
                  ${isFilled
                    ? isHigh
                      ? 'bg-gradient-to-t from-red-950 to-red-800 border-red-500 text-white shadow-[0_0_12px_rgba(225,29,72,0.5)] scale-105 z-10'
                      : isMed
                      ? 'bg-gradient-to-t from-amber-950 to-amber-800 border-amber-500 text-amber-100 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                      : 'bg-gradient-to-t from-[#151522] to-slate-800 border-slate-600 text-slate-200'
                    : 'bg-[#0a0a10] border-[#1f1f2e] text-neutral-600 hover:border-neutral-500 hover:text-neutral-400'}
                `}
              >
                <span>{lvl}</span>
                {isMax && isFilled && <span className="text-[8px] tracking-tighter text-red-200">PURGE</span>}
              </button>
            );
          })}
        </div>

        {/* Active Tier Description */}
        <div className="p-3 bg-[#0a0a10] border border-[#201828] rounded-lg">
          <div className="flex items-center justify-between mb-0.5">
            <span className="font-cinzel text-xs font-bold text-white flex items-center gap-1.5">
              {threatMatrix.masqueradeExposure >= 4 && (
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              )}
              {masqueradeDescriptions[threatMatrix.masqueradeExposure].title}
            </span>
            <span className="text-[10px] font-mono text-neutral-500">
              {threatMatrix.masqueradeExposure === 0 ? 'STATUS: NOMINAL' : threatMatrix.masqueradeExposure >= 4 ? 'CRITICAL BREACH' : 'ELEVATED'}
            </span>
          </div>
          <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
            {masqueradeDescriptions[threatMatrix.masqueradeExposure].effect}
          </p>
        </div>
      </GothicCard>

      {/* Second Inquisition FIRSTLIGHT Alert Meter */}
      <GothicCard
        variant="raised"
        ribbon={threatMatrix.secondInquisitionAlert >= 4 ? 'crimson' : 'none'}
        className="border-red-950/70"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#1c1825]">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg ${
              threatMatrix.secondInquisitionAlert >= 4
                ? 'bg-red-950 text-red-400 border border-red-600 animate-pulse shadow-[0_0_12px_rgba(225,29,72,0.5)]'
                : 'bg-red-950/70 text-red-300 border border-red-800'
            }`}>
              <Crosshair className="w-4 h-4" />
            </div>
            <div>
              <span className="font-cinzel text-xs font-black tracking-widest text-white uppercase block">
                SECOND INQUISITION (FIRSTLIGHT)
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                SAD & Coalition Alert ConAP
              </span>
            </div>
          </div>

          <GothicBadge
            label={`ALERT ${threatMatrix.secondInquisitionAlert} / 5`}
            variant={getMasqueradeBadgeVariant(threatMatrix.secondInquisitionAlert)}
            size="sm"
          />
        </div>

        {/* 6-step SI dials */}
        <div className="grid grid-cols-6 gap-1.5 my-3">
          {[0, 1, 2, 3, 4, 5].map(lvl => {
            const isFilled = lvl <= threatMatrix.secondInquisitionAlert;
            const isMax = lvl === 5;
            const isHigh = lvl >= 4;
            const isMed = lvl >= 2;

            return (
              <button
                key={lvl}
                type="button"
                onClick={() => handleSetSIAlert(lvl)}
                title={`Set SI Level ${lvl}: ${siAlertDescriptions[lvl].title}`}
                className={`
                  h-9 rounded-lg font-mono font-bold text-xs transition-all duration-150 cursor-pointer border flex flex-col items-center justify-center
                  ${isFilled
                    ? isHigh
                      ? 'bg-gradient-to-t from-red-950 via-rose-950 to-red-800 border-red-500 text-white shadow-[0_0_12px_rgba(225,29,72,0.5)] scale-105 z-10'
                      : isMed
                      ? 'bg-gradient-to-t from-amber-950 to-amber-800 border-amber-500 text-amber-100 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                      : 'bg-gradient-to-t from-[#151522] to-slate-800 border-slate-600 text-slate-200'
                    : 'bg-[#0a0a10] border-[#1f1f2e] text-neutral-600 hover:border-neutral-500 hover:text-neutral-400'}
                `}
              >
                <span>{lvl}</span>
                {isMax && isFilled && <span className="text-[8px] tracking-tighter text-red-200">RAID</span>}
              </button>
            );
          })}
        </div>

        {/* Active SI Description */}
        <div className="p-3 bg-[#0a0a10] border border-[#201828] rounded-lg">
          <div className="flex items-center justify-between mb-0.5">
            <span className="font-cinzel text-xs font-bold text-white flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-red-400" />
              {siAlertDescriptions[threatMatrix.secondInquisitionAlert].title}
            </span>
            <span className="text-[10px] font-mono text-neutral-500">
              DEFCON // {5 - threatMatrix.secondInquisitionAlert}
            </span>
          </div>
          <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
            {siAlertDescriptions[threatMatrix.secondInquisitionAlert].effect}
          </p>
        </div>
      </GothicCard>
    </div>
  );
};
