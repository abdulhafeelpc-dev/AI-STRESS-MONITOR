/**
 * EmotionAnalyzer.ts
 * Logic Layer: Processes facial expression probabilities into actionable states.
 */

export type EmotionState = 'calm' | 'stressed' | 'tired' | 'neutral';

export interface EmotionData {
  neutral: number;
  happy: number;
  sad: number;
  angry: number;
  fearful: number;
  disgusted: number;
  surprised: number;
}

export class EmotionAnalyzer {
  /**
   * Analyzes raw expression probabilities and returns a classified state.
   * Logic:
   * - Stressed: High levels of angry, fearful, or disgusted.
   * - Tired: High levels of sad or neutral with low energy indicators.
   * - Calm: High levels of happy or neutral.
   */
  static analyze(expressions: EmotionData): EmotionState {
    const { neutral, happy, sad, angry, fearful, disgusted, surprised } = expressions;

    // Stress Score: Weighted combination of high-arousal negative emotions
    const stressScore = (angry * 1.5) + (fearful * 1.2) + (disgusted * 1.0) + (surprised * 0.5);
    
    // Fatigue Score: Weighted combination of low-arousal negative or flat emotions
    const fatigueScore = (sad * 1.5) + (neutral * 0.8);

    // Calm Score: Positive or stable neutral
    const calmScore = (happy * 1.5) + (neutral * 1.0);

    // Lowered thresholds for easier triggering in a demo environment
    if (stressScore > 0.4) return 'stressed';
    if (fatigueScore > 0.5 && happy < 0.2) return 'tired';
    if (calmScore > 0.4) return 'calm';

    return 'neutral';
  }

  static getExplanation(state: EmotionState): string {
    switch (state) {
      case 'stressed':
        return "The system detected signs of facial tension and high arousal, often associated with stress or anxiety.";
      case 'tired':
        return "The system observed lower facial muscle engagement and signs of fatigue or low mood.";
      case 'calm':
        return "Your expressions suggest a state of balance and positive or neutral engagement.";
      default:
        return "Scanning your emotional landscape...";
    }
  }

  static getActionSteps(state: EmotionState): string[] {
    switch (state) {
      case 'stressed':
        return [
          "Inhale slowly through your nose for 4 seconds.",
          "Hold your breath gently for 4 seconds.",
          "Exhale slowly through your mouth for 6 seconds.",
          "Repeat this cycle 3 times."
        ];
      case 'tired':
        return [
          "Look away from the screen at something 20 feet away.",
          "Blink rapidly for 10 seconds to refresh your eyes.",
          "Stretch your arms overhead and take a deep yawn.",
          "Drink a glass of water if available."
        ];
      case 'calm':
        return [
          "Acknowledge this moment of peace.",
          "Think of one thing you are grateful for today.",
          "Continue your current task with mindful presence.",
          "Smile gently to reinforce this positive state."
        ];
      default:
        return ["Keep your face centered in the frame for better detection."];
    }
  }

  static getBenefit(state: EmotionState): string {
    switch (state) {
      case 'stressed':
        return "Controlled breathing activates the parasympathetic nervous system, lowering your heart rate and cortisol levels.";
      case 'tired':
        return "The 20-20-20 rule and physical movement reduce digital eye strain and re-oxygenate your blood.";
      case 'calm':
        return "Mindful appreciation strengthens neural pathways associated with resilience and well-being.";
      default:
        return "";
    }
  }
}
