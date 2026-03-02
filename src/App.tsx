import { useState, useEffect, useCallback } from 'react';
import * as faceapi from '@vladmandic/face-api';
import CameraFeed from './components/CameraFeed';
import InterventionPanel from './components/InterventionPanel';
import { EmotionAnalyzer, EmotionData, EmotionState } from './logic/EmotionAnalyzer';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Sparkles } from 'lucide-react';

export default function App() {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionState>('neutral');
  const [rawEmotions, setRawEmotions] = useState<EmotionData | null>(null);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = 'https://vladmandic.github.io/face-api/model/';
      try {
        // Loading more robust models
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        
        console.log("All models loaded successfully");
        setIsModelLoaded(true);
      } catch (error) {
        console.error("CRITICAL: Error loading face-api models:", error);
        setModelError("Failed to load AI models. Please check your internet connection and refresh.");
      }
    };
    loadModels();
  }, []);

  const handleEmotionsDetected = useCallback((emotions: EmotionData) => {
    setRawEmotions(emotions);
    const state = EmotionAnalyzer.analyze(emotions);
    setCurrentEmotion(state);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-colors duration-1000 ${
          currentEmotion === 'stressed' ? 'bg-indigo-500/10' : 
          currentEmotion === 'tired' ? 'bg-amber-500/10' : 
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
              {currentEmotion === 'neutral' ? (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center p-8 rounded-3xl border border-dashed border-white/10"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-white/5 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Analyzing Expressions</h3>
                  <p className="text-sm text-white/40">
                    Maintain a natural posture. The system is looking for subtle emotional cues to provide the right support.
                  </p>
                </motion.div>
              ) : (
                <InterventionPanel state={currentEmotion} />
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
        {showIntro && (
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
