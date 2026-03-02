/**
 * EmotionAnalyzer.ts
 * Logic Layer: Processes facial expression probabilities into actionable states.
 */

export type EmotionState = 'calm' | 'stressed' | 'tired' | 'joyful' | 'unsettled' | 'low-mood' | 'neutral';

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
   */
  static analyze(expressions: EmotionData): EmotionState {
    const { neutral, happy, sad, angry, fearful, disgusted, surprised } = expressions;

    // High intensity Joy
    if (happy > 0.8) return 'joyful';
    
    // High intensity Sadness
    if (sad > 0.6) return 'low-mood';

    // High intensity Surprise/Shock
    if (surprised > 0.6) return 'unsettled';

    // Stress Score: Weighted combination of high-arousal negative emotions
    const stressScore = (angry * 1.5) + (fearful * 1.2) + (disgusted * 1.0);
    
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
      case 'joyful':
        return "The system detected a high level of positive energy and joy in your expression.";
      case 'low-mood':
        return "The system observed signs of sadness or emotional heaviness in your facial features.";
      case 'unsettled':
        return "The system detected signs of surprise or sudden cognitive shift, which can feel unsettling.";
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
      case 'joyful':
        return [
          "Take a mental snapshot of this feeling.",
          "Share this positive energy with someone today.",
          "Write down one thing that contributed to this joy.",
          "Keep this momentum going for your next task."
        ];
      case 'low-mood':
        return [
          "Place a hand over your heart and feel its rhythm.",
          "Tell yourself: 'It's okay to feel this way right now.'",
          "Think of a small comfort you can treat yourself to.",
          "Gentle movement: Roll your shoulders slowly."
        ];
      case 'unsettled':
        return [
          "5-4-3-2-1 Grounding: Name 5 things you can see.",
          "Touch something cold or textured near you.",
          "Take one deep, audible sigh.",
          "Remind yourself that you are safe in this moment."
        ];
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
      case 'joyful':
        return "Savoring positive emotions builds psychological capital and broadens your creative thinking.";
      case 'low-mood':
        return "Self-compassion reduces the 'second arrow' of suffering—the judgment we feel for feeling bad.";
      case 'unsettled':
        return "Grounding techniques pull your brain out of 'startle mode' and back into the present reality.";
      case 'stressed':
        return "Controlled breathing activates the parasympathetic nervous system, lowering your heart rate.";
      case 'tired':
        return "Physical breaks reduce digital eye strain and re-oxygenate your blood flow.";
      case 'calm':
        return "Mindful appreciation strengthens neural pathways associated with resilience.";
      default:
        return "";
    }
  }
}
