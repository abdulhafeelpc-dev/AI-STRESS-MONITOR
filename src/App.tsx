import { useState, useEffect, useCallback } from 'react';
import * as faceapi from '@vladmandic/face-api';
import CameraFeed from './components/CameraFeed';
import InterventionPanel from './components/InterventionPanel';
import { EmotionAnalyzer, EmotionData, EmotionState } from './logic/EmotionAnalyzer';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Sparkles } from 'lucide-react';

type SessionPhase = 'IDLE' | 'BREATHING' | 'ANALYZING' | 'RESULT';

export default function App() {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionState>('neutral');
  const [rawEmotions, setRawEmotions] = useState<EmotionData | null>(null);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [phase, setPhase] = useState<SessionPhase>('IDLE');
  const [showIntro, setShowIntro] = useState(true);
  const [breathingStep, setBreathingStep] = useState<'IN' | 'OUT'>('IN');
  const [timer, setTimer] = useState(0);
  const [debugMode, setDebugMode] = useState(false);

  // Accumulator for emotions during breathing phase to get a better average
  const [emotionHistory, setEmotionHistory] = useState<EmotionData[]>([]);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = 'https://vladmandic.github.io/face-api/model/';
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        setIsModelLoaded(true);
      } catch (error) {
        console.error("CRITICAL: Error loading face-api models:", error);
        setModelError("Failed to load AI models. Please check your internet connection and refresh.");
      }
    };
    loadModels();
  }, []);

  // Breathing Phase Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (phase === 'BREATHING') {
      setTimer(12); // 12 second assessment
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setPhase('ANALYZING');
            return 0;
          }
          // Toggle breathing prompt every 3 seconds
          if (prev % 3 === 0) {
            setBreathingStep((s) => s === 'IN' ? 'OUT' : 'IN');
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phase]);

  // Analyzing Phase Logic
  useEffect(() => {
    if (phase === 'ANALYZING') {
      const timeout = setTimeout(() => {
        // Calculate average emotion from history
        if (emotionHistory.length > 0) {
          const avgEmotions: EmotionData = emotionHistory.reduce((acc, curr) => {
            return {
              neutral: acc.neutral + curr.neutral,
              happy: acc.happy + curr.happy,
              sad: acc.sad + curr.sad,
              angry: acc.angry + curr.angry,
              fearful: acc.fearful + curr.fearful,
              disgusted: acc.disgusted + curr.disgusted,
              surprised: acc.surprised + curr.surprised,
            };
          }, { neutral: 0, happy: 0, sad: 0, angry: 0, fearful: 0, disgusted: 0, surprised: 0 });

          const count = emotionHistory.length;
          const finalAvg: EmotionData = {
            neutral: avgEmotions.neutral / count,
            happy: avgEmotions.happy / count,
            sad: avgEmotions.sad / count,
            angry: avgEmotions.angry / count,
            fearful: avgEmotions.fearful / count,
            disgusted: avgEmotions.disgusted / count,
            surprised: avgEmotions.surprised / count,
          };

          const state = EmotionAnalyzer.analyze(finalAvg);
          setCurrentEmotion(state);
          setRawEmotions(finalAvg);
        }
        setPhase('RESULT');
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [phase, emotionHistory]);

  const handleEmotionsDetected = useCallback((emotions: EmotionData) => {
    if (phase === 'BREATHING') {
      setEmotionHistory((prev) => [...prev, emotions]);
    }
  }, [phase]);

  const startSession = () => {
    setEmotionHistory([]);
    setCurrentEmotion('neutral');
    setPhase('BREATHING');
  };

  const resetSession = () => {
    setPhase('IDLE');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-colors duration-1000 ${
          currentEmotion === 'stressed' ? 'bg-indigo-500/10' : 
          currentEmotion === 'tired' ? 'bg-amber-500/10' : 
          currentEmotion === 'joyful' ? 'bg-pink-500/10' :
          currentEmotion === 'low-mood' ? 'bg-blue-500/10' :
          currentEmotion === 'unsettled' ? 'bg-purple-500/10' :
          'bg-emerald-500/10'
        }`} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-8 md:py-12 flex flex-col items-center min-h-screen">
        {/* Header */}
        <header className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4"
          >
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-white/60">Mental Health AI</span>
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-4 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
            MoodMirror
          </h1>
          <p className="text-white/40 max-w-md mx-auto text-sm md:text-base">
            Your silent companion for emotional resilience. Center your face to begin the micro-intervention.
          </p>
        </header>

        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Camera */}
          <div className="flex flex-col items-center">
            {modelError ? (
              <div className="w-full max-w-md aspect-video bg-red-950/20 border border-red-500/30 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
                <p className="text-red-400 text-sm mb-4">{modelError}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold"
                >
                  Retry Loading
                </button>
              </div>
            ) : (
              <div className="relative w-full">
                <CameraFeed 
                  isModelLoaded={isModelLoaded} 
                  onEmotionsDetected={handleEmotionsDetected}
                  onFaceStatusChange={setIsFaceDetected}
                />
                <div className={`absolute top-4 right-4 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-tighter transition-colors ${
                  isFaceDetected ? 'bg-emerald-500 text-black' : 'bg-red-500/20 text-red-400'
                }`}>
                  {isFaceDetected ? 'Face Detected' : 'No Face'}
                </div>
                
                {/* Breathing Overlay */}
                <AnimatePresence>
                  {phase === 'BREATHING' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-6"
                    >
                      <motion.div 
                        animate={{ scale: breathingStep === 'IN' ? [1, 1.4, 1] : [1, 0.8, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className={`w-32 h-32 rounded-full border-4 ${breathingStep === 'IN' ? 'border-emerald-500/50 bg-emerald-500/20' : 'border-blue-500/50 bg-blue-500/20'} mb-8 flex items-center justify-center`}
                      >
                        <span className="text-xl font-bold tracking-widest">{breathingStep}</span>
                      </motion.div>
                      <h2 className="text-2xl font-bold mb-2">Breathe {breathingStep === 'IN' ? 'In Deeply' : 'Out Slowly'}</h2>
                      <p className="text-white/60 text-sm">Assessment in progress... {timer}s</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            
            <div className="mt-6 flex items-center gap-4 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <p className="text-[11px] text-white/50">
                Processing is 100% local. No images or data ever leave your device.
              </p>
            </div>
          </div>

          {/* Right Column: Intervention */}
          <div className="flex flex-col justify-center min-h-[400px]">
            <AnimatePresence mode="wait">
              {phase === 'IDLE' ? (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center p-8 rounded-3xl border border-white/5 bg-white/[0.02]"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Ready for your check-in?</h3>
                  <p className="text-sm text-white/40 mb-8 leading-relaxed">
                    We'll guide you through a short breathing exercise while our AI analyzes your emotional state to provide the best support.
                  </p>
                  <button 
                    disabled={!isModelLoaded || !isFaceDetected}
                    onClick={startSession}
                    className="w-full py-4 rounded-2xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-500"
                  >
                    {!isModelLoaded ? 'Loading AI...' : !isFaceDetected ? 'Position your face' : 'Start Assessment'}
                  </button>
                </motion.div>
              ) : phase === 'BREATHING' ? (
                <motion.div
                  key="breathing-info"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-4">Phase 1: Calibration</h3>
                    <p className="text-white/70 leading-relaxed">
                      Follow the visual prompt on the camera feed. Relax your facial muscles and focus on your breath.
                    </p>
                  </div>
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 opacity-40">
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Phase 2: Analysis</h3>
                    <p className="text-white/70 leading-relaxed">
                      Our AI will process your emotional indicators.
                    </p>
                  </div>
                </motion.div>
              ) : phase === 'ANALYZING' ? (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center p-8 rounded-3xl border border-dashed border-white/10"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-white/5 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Processing Results</h3>
                  <p className="text-sm text-white/40">
                    Synthesizing emotional data and preparing your personalized intervention...
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  <InterventionPanel state={currentEmotion} />
                  <button 
                    onClick={resetSession}
                    className="w-full py-3 rounded-2xl border border-white/10 text-white/40 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
                  >
                    Start New Session
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Debug Mode Toggle */}
        <div className="mt-12 flex flex-col items-center">
          <button 
            onClick={() => setDebugMode(!debugMode)}
            className="text-[10px] uppercase tracking-widest text-white/20 hover:text-white/50 transition-colors"
          >
            {debugMode ? 'Hide Debug Data' : 'Show Debug Data'}
          </button>
          
          {debugMode && rawEmotions && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 font-mono text-[10px] grid grid-cols-2 gap-x-8 gap-y-1"
            >
              {Object.entries(rawEmotions).map(([key, val]) => (
                <div key={key} className="flex justify-between gap-4">
                  <span className="opacity-40 uppercase">{key}</span>
                  <span className="text-emerald-400">{(val as number * 100).toFixed(1)}%</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-12 text-center text-white/20 text-[10px] tracking-widest uppercase">
          © 2024 MoodMirror • Privacy First • Hackathon MVP
        </footer>
      </main>

      {/* Intro Overlay */}
      <AnimatePresence>
        {phase === 'IDLE' && showIntro && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-6 text-center"
          >
            <div className="max-w-sm">
              <h2 className="text-3xl font-bold mb-4">Welcome to MoodMirror</h2>
              <p className="text-white/60 text-sm mb-8">
                This app uses your camera to detect stress or fatigue and offers instant, science-backed micro-interventions.
              </p>
              <button 
                onClick={() => setShowIntro(false)}
                className="w-full py-4 rounded-2xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors"
              >
                Start Session
              </button>
              <p className="mt-4 text-[10px] text-white/30 uppercase tracking-widest">
                Camera access required
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
