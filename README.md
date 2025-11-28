# Consent Quest AR

A mobile-first web app for digital literacy and safety.

## Features
- **QR-Activated Quests**: Scan a QR code to start a scenario.
- **Interactive Scenarios**: Branching narratives with instant feedback.
- **Survivor & Ally Tracks**: Learn how to protect yourself and support others.
- **WebAR Integration**: Placeholder for AR intro scenes.
- **Help Now**: Persistent access to safety checklists and resources.
- **Badges & XP**: Gamified learning progress.

## Tech Stack
- React + TypeScript
- Vite
- Framer Motion (Animations)
- Lucide React (Icons)
- CSS Modules / Vanilla CSS

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Open the app (usually http://localhost:5173).

## Development Notes
- **QR Scanning**: The `/scan` page currently simulates scanning by listing available quests. In a real deployment, this would use a camera feed.
- **AR Content**: The `/ar/:questId` page contains a placeholder for MindAR or other WebAR frameworks.
- **Data**: Quests are stored in `src/data/quests.json`.
