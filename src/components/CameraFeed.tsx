import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { EmotionData } from '../logic/EmotionAnalyzer';

interface CameraFeedProps {
  onEmotionsDetected: (emotions: EmotionData) => void;
  isModelLoaded: boolean;
  onFaceStatusChange?: (detected: boolean) => void;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ onEmotionsDetected, isModelLoaded, onFaceStatusChange }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startVideo = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(e => console.error("Video play failed:", e));
          };
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Camera access denied. Please enable camera permissions.");
      }
    };

    if (isModelLoaded) {
      startVideo();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isModelLoaded]);

  useEffect(() => {
    if (!isModelLoaded || !videoRef.current) return;

    const interval = setInterval(async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        try {
          // Explicitly ensure video is playing
          if (videoRef.current.paused) {
            videoRef.current.play().catch(() => {});
          }

          const detections = await faceapi
            .detectSingleFace(videoRef.current, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.4 }))
            .withFaceExpressions();

          if (detections && detections.expressions) {
            console.log("Detection heartbeat: Face found");
            onEmotionsDetected(detections.expressions as unknown as EmotionData);
            onFaceStatusChange?.(true);
          } else {
            onFaceStatusChange?.(false);
          }
        } catch (err) {
          console.error("Detection error:", err);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isModelLoaded, onEmotionsDetected]);

  return (
    <div className="relative w-full max-w-md mx-auto aspect-video bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-white bg-red-900/20">
          <p>{error}</p>
        </div>
      ) : !isModelLoaded ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-neutral-900">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-medium animate-pulse">Loading AI Models...</p>
        </div>
      ) : null}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        width="640"
        height="480"
        className="w-full h-full object-cover mirror"
        style={{ transform: 'scaleX(-1)' }}
      />
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        <span className="text-[10px] uppercase tracking-widest text-white/70 font-mono">Live Analysis</span>
      </div>
    </div>
  );
};

export default CameraFeed;
