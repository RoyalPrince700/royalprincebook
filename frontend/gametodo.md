# Game Feature Todo - English Proficiency & Speech Training for Growth Officer

## Aim of the Feature
As the Growth Officer at Accessible Publishers Limited (a leading Nigerian educational publishing company specializing in accessible formats: print, e-books, audio books, animations, Braille; founded 1996 in Ibadan, with 4000+ titles, vision to be Africa's most innovative publisher using VICAP core values), the primary goal is to dramatically improve professional articulation, confident public speaking, and presentation skills.

This will enable:
- Delivering compelling speeches and presentations
- Analyzing data, metrics, optimization reports for digital product growth and subsidiaries
- Winning partners and stakeholders through eloquent communication
- Representing the MD effectively at events, meetings, and programs
- Becoming the go-to representative for the company

The interactive **"Growth Officer Academy"** or **"Articulate Pro Game"** in the Admin panel will simulate real work scenarios in publishing/growth role through gamified segments:

### Core Game Segments:
1. **Vocabulary Mastery** - Learn and test business/publishing terms (metrics, KPIs, optimization, accessibility, engagement, conversion, analytics, stakeholder management, etc.) with definitions, usage in sentences, flashcards, quizzes.
2. **Conciseness Training** - Given verbose sentences (e.g. meeting notes, reports, emails), rewrite/shorten them professionally while retaining meaning. AI feedback on clarity, impact.
3. **Speech & Address Writing** - Practice writing short welcome addresses, keynote intros, partner pitches, quarterly reports, growth presentations. Scoring on structure, eloquence, persuasion.
4. **Presentation Simulator** - Full scenarios: delivering data-driven reports, handling Q&A, stakeholder meetings. Include timing, filler word detection (if speech-to-text implemented), confidence scoring.
5. **Progress & Leaderboard** - Daily challenges, streaks, skill levels (from "Articulate Novice" to "Royal Orator"), personalized feedback tied to company context (Accessible Publishers growth strategies, VICAP values).

### Technical Integration:
- Add "Game" nav item to Admin sidebar (protected by AdminRoute).
- Responsive, modern UI matching existing admin design (slate colors, rounded cards).
- Multiple difficulty levels, scoring system, save progress (localStorage or backend).
- Themed around company: royal/publishing motifs, educational growth theme.
- Only accessible to admin users.
- Expandable with more segments (pronunciation practice, debate simulator, etc.).

This feature directly supports personal growth as Growth Officer while demonstrating innovation in digital tools for staff development at Accessible Publishers Ltd.

**Implementation Priority:** Start with core UI + 2-3 interactive segments using React state. Future: integrate speech recognition (Web Speech API), AI feedback via backend.

Created as per game.md instructions.
