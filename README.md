
# Consent Quest AR

### WebAR Mini-Quest Platform for Digital Safety & Anti-Abuse Training across Africa

Consent Quest AR is a prevention-first, digital-literacy platform that teaches users how to recognize, prevent, and respond to digital abuse through **interactive WebAR mini-quests**. Each quest is triggered by scanning a real-world QR poster, instantly launching a 30–90 second augmented reality scenario in the browser—no app install required.

This repository contains the codebase for the WebAR experiences, scenario library, choice engine, and supporting UI for the Consent Quest AR MVP.

---

##  Key Features

### 1. QR-Activated WebAR Entry

* Scan a printed QR code → instantly launch a quest in the mobile browser.
* Built with lightweight WebAR (WebXR / 8thWall / MindAR depending on setup).
* Marker/image tracking used for MVP.
* Caches content for low-data environments.

### 2. AR Mini-Quest Player

* Short, interactive 30–90s AR scenes.
* Overlayed dialogue, cues, object highlights, and reaction animations.
* Designed for mid-range Android performance.

### 3. Localized Scenario Library

Includes 6–8 MVP scenarios focused on real African digital harm patterns:

* Sextortion / grooming
* Account takeover & phishing
* Doxxing threats
* Deepfake / AI image abuse
* Image-based abuse
* Cyberbullying spirals
* Harassment

Each scenario follows:
**context → red flags → escalation → decision points → outcomes**

### **4. Branching Choice Engine**

* Users make decisions at key moments.
* Each choice leads to different outcomes (safer or riskier).
* Instant feedback explains consequences in plain language.

### **5. Prevention Lesson Cards**

After each quest, users receive:

* What the harm is
* How to prevent it
* Safety habits
* Non-blaming, trauma-informed explanations

### **6. “Help Now” Safety Button**

Always visible—opens:

* Immediate response steps
* Evidence protection tips
* Platform reporting walkthroughs
* Localized help resources

### **7. Region-Based Resource Directory**

* Country/region-filtered list of legal aid, psychosocial support, digital rights orgs.
* One-tap contact (call/WhatsApp/email).
* Designed to grow with partners.

### **8. Bystander / Ally Track**

Alternative versions of each quest for:

* Safe intervention
* De-escalation
* Supporting a survivor
* Responsible reporting

### **9. Gamification**

* XP for each completed quest
* Skill badges like *Deepfake Detector*, *Doxxing Defender*, *Consent Champion*
* Local storage progress

### **10. Trauma-Informed UX**

* No graphic content
* Gentle tone: “pause anytime,” “not your fault”
* Youth-safe, culturally localized language

### **11. Low-Bandwidth Design**

* Lightweight assets
* Offline-capable after caching
* Suitable for intermittent connectivity environments

---

##  **Tech Stack (MVP)**

> *Note: Adjust to match your actual implementation.*

* **WebAR Framework:** MindAR / 8thWall / Zappar WebAR (choose one)
* **Frontend:** HTML, CSS, JavaScript (or React if using componentized UI)
* **3D/AR:** A-Frame / Three.js
* **State Engine:** Custom branching logic or Zustand/Redux for React builds
* **Storage:** LocalStorage (no mandatory login)
* **Content Delivery:** QR-triggered CDN or static hosting (Netlify/Vercel)
* **Optional:** Firebase for analytics & optional user login

---

##  **Project Structure (Example)**

```
consent-quest-ar/
│
├── public/
│   ├── assets/
│   │   ├── models/
│   │   ├── icons/
│   │   └── quest_markers/
│   └── index.html
│
├── src/
│   ├── quests/
│   │   ├── sextortion/
│   │   ├── phishing/
│   │   ├── cyberbullying/
│   │   └── deepfake/
│   ├── engine/
│   │   ├── choiceSystem.js
│   │   └── stateManager.js
│   ├── components/
│   │   ├── ARScene.js
│   │   ├── DialogueBox.js
│   │   └── LessonCards.js
│   ├── helpers/
│   ├── styles/
│   └── main.js
│
├── README.md
└── package.json
```

---

## 🔧 **Installation & Setup**

### **Clone the repo**

```bash
git clone https://github.com/yourname/consent-quest-ar.git
cd consent-quest-ar
```

### **Install dependencies**

```bash
npm install
```

### **Run in development**

```bash
npm run dev
```

### **Build for production**

```bash
npm run build
```

---

## 🎯 **Roadmap**

* [ ] MVP Scenario Library (6–8 quests)
* [ ] Branching Choice Engine (v1)
* [ ] WebAR marker recognition
* [ ] Offline caching & low-bandwidth optimization
* [ ] Resource directory (regional filtering)
* [ ] Gamification system (XP + badges)
* [ ] Accessibility & trauma-informed guidelines
* [ ] Analytics dashboard for educators/partners
* [ ] Optional user accounts (opt-in)

---

##  **Contributing**

We welcome contributions in:

* Scenario writing (digital safety / youth education)
* Frontend development
* 3D/AR assets
* Localization (country-specific safety resources)
* UX and trauma-informed design

### **How to contribute**

1. Fork the repo
2. Create a feature branch
3. Submit a pull request with:

   * Clear description
   * Screenshots / demos if applicable

---

## 📄 **License**

MIT License (or whichever you prefer).

---

## 🌍 **About the Project**

Consent Quest AR is built to scale across African schools, campuses, and community hubs using low-cost printed QR packs and localized scenario bundles. The goal is to democratize digital safety education, empower youth, and reduce harm through interactive, prevention-first training.

---

