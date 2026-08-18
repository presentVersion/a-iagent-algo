# ScrollIQ: Smart Tech Discovery & Social-Media Learning Platform

> **"Make scrolling more useful, not stopped."**

ScrollIQ is an AI-powered short-form tech media platform designed to transform passive social media scrolling into active technology discovery and computer science learning. By monitoring behavioral micro-signals (watch progress, likes, saves, skips, replays) and mapping content to a multi-stage Latent Interest Graph, ScrollIQ bypasses shallow keyword-only filters and guides scrollers toward computer science concepts, career roadmaps, and programming fundamentals.

---

## 1. Problem & Social Good Alignment (25%)
- **The Core Challenge**: Students spend 1.5 to 3+ hours daily consuming short-form vertical video clips. Traditional algorithms prioritize viral outrage, echo chambers, and clickbait.
- **Our Philosophy**: We do **not** shame students or attempt to block social habits. Instead, we **redirect existing scrolling energy** into active tech discovery.
- **Positive Social Impact Dashboard**: ScrollIQ includes a live Impact Dashboard tracking quantifiable metrics:
  - **Useful Tech Discovered**: Count of substantive programming concepts encountered.
  - **Topics Explored**: Breadth of subdomains (DSA, AI/ML, Cloud, Cybersecurity, Career Growth).
  - **Simulated Learning Minutes Converted**: Active scrolling minutes converted into educational gains.

---

## 2. Innovation & Latent Interest Architecture (25%)
- **Multi-Stage Latent Interest Graph & Semantic Clustering**: Rejects naive single-keyword matching. Content is mapped into multidimensional latent clusters with exponential recency decay ($0.95^n$).
- **The Trap Scenario Demonstration**:
  - *Naive Keyword Algorithm*: User views a Java NPE meme $\rightarrow$ Algorithm bombards user with 20 repetitive Java memes.
  - *ScrollIQ Latent Inference*: User views `Java NPE` + `SWE Lifestyle` + `Whiteboard Interview Joke` + `MacBook Review` $\rightarrow$ Infers latent core domain **Software Engineering** $\rightarrow$ Recommends **System Design Basics**, **Big-O Analysis**, or **Cloud Infrastructure**.
- **Anti-Clickbait Quality & Hype Filter**: Evaluates content hype scores (`hypeScore > 0.8`). Clickbait claims are penalized in real-time while substantive tutorials receive rank boosts.

---

## 3. Google Technology Integration & Architecture (40%)
- **Google Gemini API (`@google/genai`)**:
  - Executes typed structured prompts to generate real-time AI explainability traces ("Why did AI recommend this?").
  - Provides conversational query resolution via the *Ask ScrollIQ* assistant.
  - Features robust offline/mock fallback heuristics when environment keys (`VITE_GEMINI_API_KEY`) are omitted.
- **Firebase SDK**: Persistent user session authentication, cloud interaction synchronization, and real-time state persistence (`saveInteractionsFirebase`, `fetchInteractionsFirebase`).
- **Google Fonts & Lucide Typography Standards**: Clean typography using Inter font, semantic contrast tokens, and Lucide icons.
- **Code Quality & Architecture**: Modular component structure, clean TypeScript interfaces, zero `any` types, and explicit error boundaries.

---

## 4. User Experience & Accessibility Standards (10%)
- **Responsive Dark & Light Theme Switcher**: Features an accessible theme toggle button with Sun and Moon icons, adapting text, contrast, and layout elements seamlessly.
- **Accessibility & Semantic HTML Compliance**: Built with standard HTML5 semantic elements (`<header>`, `<main>`, `<section>`, `<nav>`, `<article>`, `<button>`) and strict `aria-label` attributes for full screen-reader accessibility.
- **Interactive Network Interest Graph & Radar Chart**: Real-time interactive node visualization (styled after network graphs with dashed linkages and glowing badges) and 5-axis Radar Chart (`SWE`, `AI & ML`, `DevOps`, `Cyber`, `Career`).

---

## 5. Local Setup & Test Verification Instructions

### Prerequisites
- Node.js (v18+) & npm

### Installation & Execution
```bash
# 1. Install dependencies
npm install

# 2. Run Vitest automated test suite (100% passing compliance)
npm run test

# 3. Compile production bundle (0 TypeScript errors)
npm run build

# 4. Launch local development server
npm run dev
```

---

## 6. 90-Second Jury Demo Walkthrough Guide

1. **[00:00 - 00:15] Theme Switcher & Dashboard Intro**:
   - Toggle the **Sun/Moon** icon in the header to switch between Dark and Light mode. Observe high-contrast font legibility.
2. **[00:15 - 00:35] Interactive Phone Feed & Signal Capture**:
   - Scroll through reels in the **Phone Simulator**. Click **Like**, **Save**, or **Skip** to send real-time behavioral signals to the engine.
3. **[00:35 - 00:55] Latent Interest Graph & Radar Chart**:
   - Switch to **Scroll Insights**. Inspect the **Latent Interest Map** and **Interest Graph Network** showing connected skill nodes. Watch the 5-axis **Radar Chart** shift dynamically based on interactions.
4. **[00:55 - 01:15] The Trap Test Demonstration**:
   - Click **Trigger Tech Sandbox** in the top bar. Observe how ScrollIQ bridges cross-domain signals (Java meme + hardware review) to infer latent **Software Engineering** interest instead of looping single memes.
5. **[01:15 - 01:30] Impact Dashboard & AI Explainability**:
   - Check the **Impact Dashboard** tracking converted learning minutes and click **"Why AI recommended this"** on any card to view Gemini explainability traces.
