import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EmotionState, EmotionAnalyzer } from '../logic/EmotionAnalyzer';
import { Wind, Zap, Sun, Info, CheckCircle2, Heart, PartyPopper, AlertCircle } from 'lucide-react';

interface InterventionPanelProps {
  state: EmotionState;
}

const InterventionPanel: React.FC<InterventionPanelProps> = ({ state }) => {
  if (state === 'neutral') return null;

  const explanation = EmotionAnalyzer.getExplanation(state);
  const actions = EmotionAnalyzer.getActionSteps(state);
  const benefit = EmotionAnalyzer.getBenefit(state);

  const getTheme = () => {
    switch (state) {
      case 'joyful':
        return {
          bg: 'bg-pink-950/90',
          accent: 'text-pink-400',
          icon: <PartyPopper className="w-6 h-6 text-pink-400" />,
          title: 'JOYFUL',
          border: 'border-pink-500/30'
        };
      case 'low-mood':
        return {
          bg: 'bg-blue-950/90',
          accent: 'text-blue-400',
          icon: <Heart className="w-6 h-6 text-blue-400" />,
          title: 'LOW MOOD',
          border: 'border-blue-500/30'
        };
      case 'unsettled':
        return {
          bg: 'bg-purple-950/90',
          accent: 'text-purple-400',
          icon: <AlertCircle className="w-6 h-6 text-purple-400" />,
          title: 'UNSETTLED',
          border: 'border-purple-500/30'
        };
      case 'stressed':
        return {
          bg: 'bg-indigo-950/90',
          accent: 'text-indigo-400',
          icon: <Wind className="w-6 h-6 text-indigo-400" />,
          title: 'STRESSED',
          border: 'border-indigo-500/30'
        };
      case 'tired':
        return {
          bg: 'bg-amber-950/90',
          accent: 'text-amber-400',
          icon: <Zap className="w-6 h-6 text-amber-400" />,
          title: 'TIRED',
          border: 'border-amber-500/30'
        };
      case 'calm':
        return {
          bg: 'bg-emerald-950/90',
          accent: 'text-emerald-400',
          icon: <Sun className="w-6 h-6 text-emerald-400" />,
          title: 'CALM',
          border: 'border-emerald-500/30'
        };
      default:
        return {
          bg: 'bg-neutral-900/90',
          accent: 'text-white',
          icon: <Info className="w-6 h-6" />,
          title: 'SCANNING',
          border: 'border-white/10'
        };
    }
  };

  const theme = getTheme();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className={`w-full max-w-md mx-auto mt-8 p-6 rounded-3xl ${theme.bg} backdrop-blur-xl border ${theme.border} shadow-2xl text-white`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-white/10`}>
              {theme.icon}
            </div>
            <div>
              <h2 className={`text-xs font-mono tracking-[0.2em] opacity-60`}>STATE DETECTED</h2>
              <p className={`text-xl font-bold tracking-tight ${theme.accent}`}>{theme.title}</p>
            </div>
          </div>
          {state === 'stressed' && (
             <motion.div 
               animate={{ scale: [1, 1.2, 1] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="w-12 h-12 rounded-full border-2 border-indigo-400/30 flex items-center justify-center"
             >
               <div className="w-4 h-4 rounded-full bg-indigo-400/50" />
             </motion.div>
          )}
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2 flex items-center gap-2">
              <Info className="w-3 h-3" /> Analysis
            </h3>
            <p className="text-sm leading-relaxed text-white/90">
              {explanation}
            </p>
          </section>

          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-3 h-3" /> Action Steps
            </h3>
            <ul className="space-y-3">
              {actions.map((action, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-3 text-sm"
                >
                  <span className={`flex-shrink-0 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold ${theme.accent}`}>
                    {i + 1}
                  </span>
                  <span className="text-white/80">{action}</span>
                </motion.li>
              ))}
            </ul>
          </section>

          <div className="pt-4 border-t border-white/10">
            <p className="text-[11px] italic text-white/50 leading-snug">
              <span className="font-bold not-italic opacity-100 mr-1">Why it helps:</span>
              {benefit}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InterventionPanel;
