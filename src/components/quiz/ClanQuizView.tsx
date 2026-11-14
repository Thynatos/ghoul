import React, { useState } from 'react';
import { CLAN_QUIZ_QUESTIONS } from '../../data/quizQuestions';
import { CLANS_DATA } from '../../data/clans';
import { ClanInfo } from '../../types/vtm';
import { ShieldAlert, Sparkles, RefreshCw, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

interface ClanQuizViewProps {
  onSpawnCharacterWithClan: (clanName: string) => void;
}

export const ClanQuizView: React.FC<ClanQuizViewProps> = ({ onSpawnCharacterWithClan }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(CLAN_QUIZ_QUESTIONS.length).fill(-1));
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = CLAN_QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    soundEngine.playDiceRoll();
    const nextAnswers = [...selectedAnswers];
    nextAnswers[currentIndex] = optionIndex;
    setSelectedAnswers(nextAnswers);

    if (currentIndex < CLAN_QUIZ_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 200);
    } else {
      setTimeout(() => {
        setIsFinished(true);
        soundEngine.playCritical();
      }, 250);
    }
  };

  const calculateResults = () => {
    const scores: Record<string, number> = {};
    CLANS_DATA.forEach(c => { scores[c.name] = 0; });

    selectedAnswers.forEach((ansIdx, qIdx) => {
      if (ansIdx >= 0) {
        const option = CLAN_QUIZ_QUESTIONS[qIdx].options[ansIdx];
        Object.entries(option.scores).forEach(([clan, weight]) => {
          // Normalise clan name if needed
          const cleanClan = clan.replace('_', ' ');
          scores[cleanClan] = (scores[cleanClan] || 0) + weight;
        });
      }
    });

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topClanName = sorted[0]?.[0] || 'Brujah';
    const secondClanName = sorted[1]?.[0] || 'Gangrel';

    const topClan = CLANS_DATA.find(c => c.name.toLowerCase() === topClanName.toLowerCase()) || CLANS_DATA[0];
    const secondClan = CLANS_DATA.find(c => c.name.toLowerCase() === secondClanName.toLowerCase()) || CLANS_DATA[1];

    return { sorted, topClan, secondClan };
  };

  const handleRestart = () => {
    setSelectedAnswers(new Array(CLAN_QUIZ_QUESTIONS.length).fill(-1));
    setCurrentIndex(0);
    setIsFinished(false);
  };

  if (isFinished) {
    const { sorted, topClan, secondClan } = calculateResults();
    const maxScore = sorted[0]?.[1] || 1;

    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
        <div className="text-center space-y-2 pb-6 border-b border-[#20202d]">
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-rose-950 border border-rose-800 text-rose-300">
            BLOOD TEST ANALYSIS COMPLETE
          </span>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-black text-white tracking-wider">
            YOUR BLOOD BELONGS TO CLAN {topClan.name.toUpperCase()}
          </h1>
          <p className="text-sm font-serif italic text-neutral-300 max-w-xl mx-auto">
            "{topClan.quote || topClan.tagline}"
          </p>
        </div>

        {/* Primary Match Card */}
        <div className="bg-[#0b0b10] border-2 border-rose-800 rounded-2xl p-6 sm:p-8 shadow-[0_0_30px_rgba(225,29,72,0.3)] space-y-4 relative overflow-hidden">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{topClan.symbol}</span>
            <div>
              <h2 className="font-cinzel text-2xl font-bold text-white">{topClan.name}</h2>
              <p className="text-xs text-rose-400 font-cinzel font-semibold">{topClan.tagline}</p>
            </div>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed pt-2">
            {topClan.lore}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-xs border-t border-[#1c1c28]">
            <div className="bg-[#12121b] border border-[#232333] rounded-lg p-3">
              <span className="font-cinzel text-neutral-400 font-bold block mb-1">CLAN DISCIPLINES</span>
              <p className="text-neutral-200 font-mono font-medium">{topClan.disciplines.join(' • ')}</p>
            </div>
            <div className="bg-[#12121b] border border-[#232333] rounded-lg p-3">
              <span className="font-cinzel text-rose-400 font-bold block mb-1">CLAN BANE</span>
              <p className="text-neutral-300">{topClan.bane}</p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#1c1c28]">
            <button
              type="button"
              onClick={handleRestart}
              className="px-4 py-2 rounded-lg bg-[#151522] hover:bg-[#20202e] border border-[#2b2b3c] text-xs font-semibold text-neutral-300 flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retake Test
            </button>

            <button
              type="button"
              onClick={() => onSpawnCharacterWithClan(topClan.name)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-900 to-rose-700 hover:from-rose-800 hover:to-rose-600 text-white font-cinzel font-black text-xs tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(225,29,72,0.4)] transition"
            >
              <Sparkles className="w-4 h-4 text-amber-300" /> CREATE A {topClan.name.toUpperCase()} CHARACTER →
            </button>
          </div>
        </div>

        {/* Secondary Match */}
        <div className="bg-[#0e0e14] border border-[#20202e] rounded-xl p-4 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{secondClan.symbol}</span>
            <div>
              <p className="text-neutral-400 font-cinzel text-[10px]">SECONDARY AFFINITY MATCH</p>
              <h3 className="font-cinzel font-bold text-sm text-neutral-200">{secondClan.name}</h3>
              <p className="text-neutral-500">{secondClan.tagline}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSpawnCharacterWithClan(secondClan.name)}
            className="px-3 py-1.5 rounded-lg bg-[#181824] hover:bg-rose-950/50 border border-[#2c2c3e] text-xs text-neutral-300 hover:text-white transition"
          >
            Create {secondClan.name}
          </button>
        </div>

        {/* Full Clan Affinity Score Breakdown */}
        <div className="bg-[#0b0b10] border border-[#20202d] rounded-xl p-5 space-y-3">
          <h3 className="font-cinzel text-xs font-bold text-neutral-400 uppercase tracking-widest">
            Complete Affinity Breakdown
          </h3>
          <div className="space-y-2">
            {sorted.slice(0, 8).map(([clan, score]) => {
              const pct = Math.round((score / maxScore) * 100);
              return (
                <div key={clan} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-cinzel font-medium text-neutral-300">{clan}</span>
                    <span className="font-mono text-neutral-500">{score} pts ({pct}%)</span>
                  </div>
                  <div className="w-full bg-[#161622] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Active Quiz Step
  const answeredCount = selectedAnswers.filter(a => a >= 0).length;
  const progressPct = Math.round(((currentIndex) / CLAN_QUIZ_QUESTIONS.length) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 pb-4 border-b border-[#20202d]">
        <div className="flex items-center justify-center gap-2 text-rose-500 text-xs font-cinzel font-bold tracking-widest">
          <ShieldAlert className="w-4 h-4" /> THE BLOOD TEST // CLAN PERSONALITY QUESTIONNAIRE
        </div>
        <h1 className="font-cinzel text-2xl sm:text-3xl font-black text-white tracking-wider">
          DISCOVER YOUR VAMPIRE CLAN
        </h1>
        <p className="text-xs text-neutral-400 max-w-lg mx-auto">
          Answer each psychological scenario according to your truest predatory instinct.
        </p>

        {/* Progress Bar */}
        <div className="pt-3 max-w-md mx-auto space-y-1">
          <div className="flex justify-between text-[11px] font-mono text-neutral-500">
            <span>Question {currentIndex + 1} of {CLAN_QUIZ_QUESTIONS.length}</span>
            <span>{progressPct}% Completed</span>
          </div>
          <div className="w-full bg-[#181824] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-rose-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-[#0b0b10] border border-[#20202d] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
        <div>
          <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-widest block mb-1">
            SCENARIO {currentIndex + 1} • {currentQ.prompt.toUpperCase()}
          </span>
          <h2 className="font-serif text-lg sm:text-xl font-normal text-neutral-100 italic leading-relaxed">
            "{currentQ.scenario}"
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3 pt-2">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedAnswers[currentIndex] === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3.5 group ${
                  isSelected
                    ? 'bg-rose-950/80 border-rose-600 text-rose-100 shadow-[0_0_15px_rgba(225,29,72,0.3)]'
                    : 'bg-[#12121a] border-[#222230] hover:bg-[#181824] hover:border-neutral-500 text-neutral-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border shrink-0 mt-0.5 flex items-center justify-center text-[10px] font-bold ${
                  isSelected 
                    ? 'border-rose-400 bg-rose-800 text-white' 
                    : 'border-neutral-600 group-hover:border-neutral-400 text-neutral-500'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="leading-relaxed font-sans">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Nav Buttons */}
        <div className="pt-4 border-t border-[#1c1c28] flex items-center justify-between">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(currentIndex - 1)}
            className="px-4 py-2 rounded-lg bg-[#14141e] hover:bg-[#1f1f2c] border border-[#272738] text-xs font-semibold text-neutral-400 disabled:opacity-30 transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Previous
          </button>

          {selectedAnswers[currentIndex] >= 0 && currentIndex < CLAN_QUIZ_QUESTIONS.length - 1 && (
            <button
              type="button"
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="px-4 py-2 rounded-lg bg-rose-950 hover:bg-rose-900 border border-rose-800 text-xs font-cinzel font-bold text-rose-200 flex items-center gap-1.5 transition"
            >
              Next <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
