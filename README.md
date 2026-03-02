# MoodMirror – Camera-Based Mental Health Micro-Intervention System

MoodMirror is a frictionless mental health application designed for high-stress environments. It uses real-time facial expression analysis to detect emotional states and provides immediate, actionable micro-interventions to reduce stress and fatigue.

## 🚀 Project Overview

MoodMirror addresses the "friction of self-care." Often, when we are most stressed or tired, we are least likely to seek help or even recognize our state. MoodMirror automates this recognition and provides instant relief without requiring any user input.

## 🛠 System Structure

### 1. TRIGGER (State Capture)
The application automatically activates the user's camera upon launch. Using `face-api.js`, it performs real-time face detection and expression probability mapping. It captures indicators like brow furrowing (stress), eye closure duration (fatigue), and mouth curvature (calm/neutral).

### 2. LOGIC LAYER (Emotion Processing)
The `EmotionAnalyzer.ts` module processes raw expression data. It uses a weighted scoring algorithm to classify the user's state into:
- **STRESSED**: High arousal negative indicators (angry, fearful, surprised).
- **TIRED**: Low arousal negative indicators (sad, neutral) combined with low positive scores.
- **CALM**: High positive or stable neutral indicators.

### 3. INTERVENTION (Immediate Support)
Based on the detected state, the UI transforms instantly:
- **STRESSED**: Triggers a deep-breathing guide with visual pulse animations.
- **TIRED**: Activates a "Dim Mode" and provides eye-relaxation exercises (20-20-20 rule).
- **CALM**: Displays positive affirmations and gratitude prompts to reinforce the state.

### 4. RESULT & ACTIONABLE GUIDANCE
The app provides a detailed breakdown of:
- **What was detected**: Specific signs observed by the AI.
- **What to do**: Step-by-step physical actions.
- **Why it works**: The biological or psychological reasoning behind the intervention (e.g., "activating the parasympathetic nervous system").

## 📊 Detailed Results Section

| State | What Users See | Actions Taken | How it Reduces Stress |
| :--- | :--- | :--- | :--- |
| **STRESSED** | Indigo theme, breathing pulse | 4-4-6 Box Breathing | Lowers heart rate and cortisol levels. |
| **TIRED** | Amber theme, dim overlay | Eye blinking & stretching | Reduces digital eye strain and re-oxygenates blood. |
| **CALM** | Emerald theme, soft glow | Gratitude & Mindful Presence | Strengthens neural pathways for resilience. |

## 🧪 How to Test

1. **Calm**: Look at the camera with a relaxed or slightly smiling face.
2. **Stressed**: Furrow your brows, open your eyes wide, or show signs of tension.
3. **Tired**: Look down, squint slightly, or maintain a very flat, "low-energy" expression.

## 💻 Installation & Local Run

### Prerequisites
- Node.js (v18+)
- npm

### Steps to Run Locally

1. **Clone the repository** (or download the source):
   ```bash
   git clone <your-repo-url>
   cd moodmirror
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   Navigate to `http://localhost:3000` (or the port shown in your terminal).

## 📤 Uploading to GitHub

1. Create a new repository on GitHub.
2. Initialize your local folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: MoodMirror MVP"
   ```
3. Link to GitHub and push:
   ```bash
   git remote add origin https://github.com/yourusername/moodmirror.git
   git branch -M main
   git push -u origin main
   ```

---
*Built for the Mental Health AI Hackathon.*
