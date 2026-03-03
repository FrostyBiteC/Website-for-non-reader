# EDULIFT - Website for Non-Reader Documentation

## 1. Project Overview

### 1.1 Description
EDULIFT is an educational web application designed specifically for non-readers, particularly children and beginners who are learning fundamental literacy and numeracy skills. The platform employs a "learning through play" approach, combining interactive games, visual learning, and audio feedback to create an engaging educational experience.

### 1.2 Target Audience
- **Primary:** Children ages 4-8 learning to read and count
- **Secondary:** Adult non-readers seeking basic literacy skills
- **Tertiary:** Educators and parents supporting early childhood education

### 1.3 Value Proposition
- **Gamified Learning:** Educational content disguised as fun games to maintain engagement
- **Multi-Modal Approach:** Visual (emoji/icons), textual, and audio (TTS) learning support
- **Progressive Difficulty:** Levels increase in complexity as learners improve
- **Self-Paced:** Users learn at their own speed with hints and replay options
- **Accessibility:** Simple UI with large touch targets and clear visual feedback

### 1.4 Educational Purpose
The application helps non-readers develop:
1. **Letter Recognition** - Alphabet module with A-Z cards
2. **Numeracy Skills** - Counting numbers 1-10+
3. **Reading Comprehension** - Interactive stories with read-aloud
4. **General Knowledge** - Facts about animals, nature, space, etc.
5. **Problem Solving** - Memory matching games and Tetris

---

## 2. Architecture Summary

### 2.1 Application Structure
```
EDULIFT/
├── index.html              # Landing page with auth check
├── script.js               # Main site interactivity
├── styles.css              # Global styles
├── basic.html              # Simple category toggle demo
├── simple.html             # Event listener test page
├── temp.html               # Backup/copy of index
│
├── alphabet/               # Alphabet learning module
├── categories/             # Category selection hub
├── counting/               # Number learning module
├── knowing/                # Knowledge/facts module
├── login_signup/           # Authentication module
├── play/                   # Word matching game
├── reading/                # Interactive stories
├── tetris/                 # Tetris educational game
└── pics/                   # Image assets
```

### 2.2 Navigation Flow
1. **Landing Page** (index.html) - Entry point with animated hero section
2. **Authentication Check** - Clicking "Play" verifies login status
3. **Login/Signup** (login_signup/) - Firebase-based authentication
4. **Categories Hub** (categories/index.html) - 5 learning paths
5. **Learning Modules** - Individual educational games

### 2.3 Technology Stack
| Component | Technology |
|-----------|------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Styling | CSS Grid, Flexbox, CSS Animations |
| Backend/Auth | Firebase Authentication (v12.9.0/12.10.0) |
| Database | Firebase Realtime Database |
| Analytics | Firebase Analytics |
| Fonts | Google Fonts (Poppins, Nunito) |
| Icons | Unicode Emoji |

### 2.4 Data Flow
1. **Authentication Flow:**
   - User submits login/signup form
   - Credentials validated via Firebase Auth
   - User data stored in Realtime Database (/users/{uid})
   - Session stored in localStorage
   - Auth state checked on page load via checkAuth()

2. **Game State Flow:**
   - Welcome Screen → Game Board (on start)
   - Game Board tracks: level, score, lives, hints, matchedPairs
   - Progress saved per session
   - Game over/complete triggers screen transitions

3. **Audio Feedback Flow:**
   - Browser SpeechSynthesis API for TTS
   - Triggered on button clicks, word highlights
   - Configurable rate (0.8-1.2) and pitch

---

## 3. Module Breakdown

### 3.1 Root Level Core Files

#### index.html
**Purpose:** Main landing page and entry point
**Key Features:**
- Hero section with animated clouds
- Services showcase (6 learning categories)
- About section
- Contact form
- Footer with category links
- Firebase auth integration (inline module)
- Play button access control (requires login)

**Dependencies:**
- styles.css - Global styles
- script.js - Interactivity
- Firebase SDK (v12.9.0) - Auth & Database

#### script.js
**Purpose:** Main JavaScript for landing page
**Key Features:**
- Mobile hamburger menu toggle
- Active nav link highlighting on scroll
- Header background change on scroll
- Smooth scrolling for anchor links
- Contact form submission handling
- Notification system (showNotification())
- Intersection Observer for fade-in animations
- Parallax effect on hero section
- Play button category toggle functionality

**Key Functions:**
- showNotification(message, type) - Toast notifications
- validateInput(input) - Form validation
- animateCounter(element, target, duration) - Number animation

#### styles.css
**Purpose:** Global stylesheet for landing page
**Key Components:**
- CSS Reset & base styles
- Header/Navigation styles
- Hero section with floating cloud animations
- Services grid (responsive)
- About section
- Contact form styling
- Footer layout
- Animations: fadeInUp, float, bounce, flap, scroll
- Responsive breakpoints (768px, 480px)

### 3.2 Feature Modules

#### login_signup Module
**Files:** index.html, login.html, script.js, styles.css

**Purpose:** User authentication (Sign Up & Login)

**Key Features:**
- Sign Up: Username, password, confirm password, terms checkbox
- Login: Username, password, remember me
- Real-time form validation
- Firebase Auth integration (email created as {username}@edulift.com)
- User data stored in Realtime Database
- Toast notifications for success/error

**Key Functions:**
- validateSignupForm() - Sign up validation
- validateLoginForm() - Login validation
- submitSignupForm() - Firebase signup
- submitLoginForm() - Firebase login
- showNotification(message, type) - Toast system

**Validation Rules:**
- Username: 3-20 chars, alphanumeric + underscore only
- Password: Minimum 8 characters
- Passwords must match
- Terms must be accepted

#### categories Module
**Files:** index.html

**Purpose:** Category selection hub after authentication

**Key Features:**
- 5 category cards in responsive grid:
  - Counting → ../counting/index.html
  - Alphabet → ../alphabet/index.html
  - Reading → ../reading/index.html
  - Knowing → ../knowing/index.html
  - Play (Tetris) → ../tetris/index.html
- Hover animations with scale and shadow
- Back button to main menu
- Responsive grid (1 column on mobile, 2-3 on desktop)

#### alphabet Module
**Files:** index.html, script.js, styles.css

**Purpose:** Interactive alphabet learning

**Key Features:**
- **Simple View (index.html):** A-Z grid with words (A=Apple, B=Ball, etc.)
  - 26 letter cards with unique colors
  - Click feedback animation
  - Sound placeholder for future audio
- **Game View (script.js/styles.css):** Memory matching game
  - Flip cards to match letters
  - Score, lives (❤️), hints tracking
  - Progress bar
  - Level progression
  - Welcome, Complete, Game Over screens

**Game State Variables:**
```javascript
gameState: 'welcome' | 'playing' | 'paused' | 'complete' | 'gameover'
level: number (starts at 1)
score: number
lives: number (starts at 3)
hints: number (starts at 3)
matchedPairs: number
cardPairs: number
```

**Key Functions:**
- startGame() - Initialize game
- flipCard(card) - Handle card flip
- checkMatch(card1, card2) - Compare letters
- levelComplete() - Level completion
- gameOver() - Game over handler
- useHint() - Reveal random card

#### counting Module
**Files:** index.html, script.js, styles.css

**Purpose:** Number recognition and counting

**Key Features:**
- Memory matching game for numbers 1-4 (Level 1)
- Identical game structure to alphabet module
- Number cards with emoji (1️⃣, 2️⃣, 3️⃣, 4️⃣)
- Flip animation with 3D transform
- Lives system (lose life on mismatch)
- Hint system (3 hints per level)

**Key Functions:**
- startGame()
- flipCard(card)
- checkMatch(card1, card2)

#### knowing Module
**Files:** index.html, script.js, styles.css

**Purpose:** General knowledge exploration

**Key Features:**
- **Info View (index.html):** 6 knowledge categories:
  - Animals
  - Nature
  - Space
  - Science
  - History
  - Countries
- Click category to open modal with 4 facts
- Quick Facts section with static fun facts
- Back button to main menu

**Modal Content Structure:**
```javascript
infoContent = {
    animals: { title: 'Amazing Animals', facts: [...] },
    nature: { title: 'Wonderful Nature', facts: [...] },
    space: { title: 'Space Exploration', facts: [...] },
    science: { title: 'Amazing Science', facts: [...] },
    history: { title: 'Historical Highlights', facts: [...] },
    countries: { title: 'Around the World', facts: [...] }
}
```

**Game View:** Shape matching game (same pattern as other modules)

#### reading Module
**Files:** index.html, script.js, styles.css

**Purpose:** Interactive story reading

**Key Features:**
- Story: "The Animal Friends Adventure"
- Character cards (Bunny, Fox, Bear)
- Highlighted vocabulary words
- **Read Aloud Button:** Uses Web Speech API (SpeechSynthesisUtterance)
  - Rate: 0.9, Pitch: 1.1
  - Reads entire story content
- **Clickable Words:** Individual word pronunciation
  - Click word to highlight and speak
  - Visual feedback on selection

**Speech Synthesis Implementation:**
```javascript
const utterance = new SpeechSynthesisUtterance(storyText);
utterance.lang = 'en-US';
utterance.rate = 0.9;
utterance.pitch = 1.1;
speechSynthesis.speak(utterance);
```

**Game View:** Word matching game (same pattern as other modules)

#### play Module
**Files:** index.html, script.js, styles.css

**Purpose:** Word-to-picture matching game

**Key Features:**
- Welcome screen with instructions
- Game board with 4 word cards (apple, banana, orange, grapes)
- Cards flip to reveal word + emoji
- Match identical words
- Score, lives, hints tracking
- Pause/Resume functionality
- Keyboard shortcuts (Escape, Space)

**Key Functions:**
- initGame() - Initialize game state
- showScreen(screen) - Screen navigation
- flipCard(card) - Card flip logic
- checkMatch() - Match validation
- loseLife() - Life management

#### tetris Module
**Files:** index.html, script.js, styles.css

**Purpose:** Classic Tetris game for motor skills and problem-solving

**Key Features:**
- Full Tetris implementation with 7 pieces (I, O, T, S, Z, J, L)
- Piece rotation system with wall kick
- Line clearing with scoring
- Next piece preview
- Level progression (speed increases)
- Score, lines, level tracking
- Pause/Resume
- Game over detection
- Controls display

**Tetromino Definitions:**
```javascript
TETROMINOS = {
    I: { shape: [...], color: '#00ffff' },
    O: { shape: [...], color: '#ffff00' },
    T: { shape: [...], color: '#a020f0' },
    S: { shape: [...], color: '#00ff00' },
    Z: { shape: [...], color: '#ff0000' },
    J: { shape: [...], color: '#0000ff' },
    L: { shape: [...], color: '#ffa500' }
}
```

**Key Functions:**
- initGame() - Initialize grid and pieces
- createPiece() - Random piece generation
- drawGame() - Render game state
- checkCollision(piece, offsetX, offsetY) - Collision detection
- lockPiece() - Lock piece to grid
- clearLines() - Line clearing logic
- rotate() - Piece rotation with wall kick
- hardDrop() - Instant drop

**Controls:**
- Arrow Left/Right: Move
- Arrow Down: Soft drop
- Arrow Up: Rotate
- Space: Hard drop
- P: Pause

**Scoring:**
- 1 line: 40 × level
- 2 lines: 100 × level
- 3 lines: 300 × level
- 4 lines: 1200 × level

---

## 4. Key Functions/Components

### 4.1 Authentication System

#### checkAuth() (in index.html Firebase module)
**Purpose:** Check authentication state and update UI accordingly
**Logic:**
- Reads localStorage for user object
- If logged in: Enable play button, show Logout
- If not logged in: Disable play button, show auth modal on click

#### submitSignupForm()
**Purpose:** Handle user registration
**Inputs:** Username, password from form
**Process:**
1. Validate form inputs
2. Create email from username ({username}@edulift.com)
3. Call createUserWithEmailAndPassword()
4. Store user data in Realtime Database
5. Save to localStorage
6. Redirect to home

#### submitLoginForm()
**Purpose:** Handle user login
**Inputs:** Username, password
**Process:**
1. Validate form inputs
2. Create email from username
3. Call signInWithEmailAndPassword()
4. Fetch user data from Database
5. Save to localStorage
6. Redirect to home

### 4.2 Game State Management

**Universal Game Variables:**
```javascript
let gameState = 'welcome'; // welcome, playing, paused, complete, gameover
let level = 1;
let score = 0;
let lives = 3;
let hints = 3;
let currentCard = null;
let gameTimer = null;
let startTime = null;
let levelTime = 0;
let cardPairs = 0;
let matchedPairs = 0;
```

#### startGame() / initGame()
**Purpose:** Initialize game state and start session
**Actions:**
- Reset all game variables
- Update UI stats display
- Reset card states
- Show game board
- Start timer

#### flipCard(card)
**Purpose:** Handle card flip interaction
**Logic:**
- Check game state is 'playing'
- Prevent flipping already flipped/matched cards
- Add 'flipped' class for CSS animation
- Store first card, check match on second card

#### checkMatch(card1, card2)
**Purpose:** Compare two flipped cards
**Logic:**
- Compare dataset attributes (letter/number/shape/word)
- If match: Add 'matched' class, increment score, check level complete
- If no match: Add 'incorrect' class, decrement lives, flip back after 1s
- Update stats display

#### levelComplete()
**Purpose:** Handle level completion
**Actions:**
- Set gameState to 'complete'
- Stop timer
- Show complete screen with score/stars

#### gameOver()
**Purpose:** Handle game over state
**Actions:**
- Set gameState to 'gameover'
- Stop timer
- Show game over screen

### 4.3 UI Components

#### showNotification(message, type)
**Purpose:** Display toast notification
**Parameters:**
- message: String to display
- type: 'success' (green) or 'error' (red)
**Features:**
- Fixed position top-right
- Auto-dismiss after 4 seconds
- Slide-in animation
- Removes existing notifications

#### showScreen(screen)
**Purpose:** Navigate between game screens
**Parameters:**
- screen: 'welcome' | 'playing' | 'paused' | 'complete' | 'gameover'
**Actions:**
- Hide all screen elements
- Show selected screen
- Start/pause timer as needed

### 4.4 Audio System

**Speech Synthesis (reading/index.html)**
**Implementation:**
```javascript
const utterance = new SpeechSynthesisUtterance(text);
utterance.lang = 'en-US';
utterance.rate = 0.9;
utterance.pitch = 1.1;
utterance.onend = callback;
speechSynthesis.speak(utterance);
```
**Usage:**
- Read Aloud button: Reads entire story
- Word click: Reads individual word with highlighting

### 4.5 Tetris Game Engine

#### checkCollision(piece, offsetX, offsetY)
**Purpose:** Detect collision with grid boundaries or locked pieces
**Parameters:**
- piece: Current tetromino object
- offsetX, offsetY: Proposed movement
**Returns:** Boolean (true if collision)

#### lockPiece()
**Purpose:** Lock piece to grid when it can't move down
**Actions:**
- Copy piece color to grid array
- Call clearLines()
- Spawn next piece
- Check game over

#### clearLines()
**Purpose:** Remove completed lines and update score
**Algorithm:**
1. Iterate rows from bottom to top
2. Check if all cells in row are filled
3. Remove filled rows
4. Add empty rows at top
5. Calculate score based on lines cleared
6. Update level every 10 lines

### 4.6 Form Validation

#### validateSignupForm()
**Rules:**
- Username: 3-20 chars, alphanumeric + underscore
- Password: Minimum 8 chars
- Passwords must match
- Terms checkbox required

#### validateLoginForm()
**Rules:**
- Username: 3-20 chars
- Password: Minimum 8 chars

#### showError(fieldId, message)
**Purpose:** Display validation error
**Actions:**
- Creates/appends error div to field parent
- Adds 'error' class to input
- Removes 'success' class

#### removeError(fieldId)
**Purpose:** Clear validation error
**Actions:**
- Hides error message
- Removes 'error' class
- Adds 'success' class (green border)

---

## 5. File Dependencies Map

```
Root Level:
  index.html → styles.css, script.js, Firebase SDK
  script.js → DOM elements in index.html
  styles.css → Standalone

Feature Modules:
  login_signup/index.html → styles.css, script.js, Firebase SDK
  login_signup/login.html → styles.css, script.js, Firebase SDK
  
  categories/index.html → Standalone (inline styles)
  
  alphabet/index.html → Standalone OR script.js + styles.css
  counting/index.html → ../styles.css, styles.css, ../script.js, script.js
  knowing/index.html → Standalone (inline)
  reading/index.html → Standalone (inline)
  play/index.html → styles.css, script.js
  tetris/index.html → styles.css, script.js
```

---

## 6. Firebase Configuration

### Project 1 (Main Site - index.html)
```javascript
{
    apiKey: "AIzaSyDNJxNpr4a4GP2E-hDyuBpyPYtM2Ue4auc",
    authDomain: "edulift-2a722.firebaseapp.com",
    databaseURL: "https://edulift-2a722-default-rtdb.firebaseio.com/",
    projectId: "edulift-2a722",
    // ...
}
```

### Project 2 (Auth Pages - login_signup/)
```javascript
{
    apiKey: "AIzaSyDNgIWKNESwLeL8unyI1Pgr_oqgtFy2c0s",
    authDomain: "edulift-dac4d.firebaseapp.com",
    databaseURL: "https://edulift-dac4d-default-rtdb.firebaseio.com",
    projectId: "edulift-dac4d",
    // ...
}
```

**Note:** Two separate Firebase projects are configured, which may cause auth state inconsistency.

---

## 7. Browser APIs Used

| API | Usage |
|-----|-------|
| localStorage | User session persistence |
| SpeechSynthesis | Text-to-speech in reading module |
| IntersectionObserver | Scroll animations |
| requestAnimationFrame | Tetris game loop |
| Canvas 2D Context | Tetris rendering |
| Firebase Auth | Authentication |
| Firebase Database | User data storage |

---

## 8. Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| > 1200px | Full desktop layout |
| 768px - 1200px | Tablet adjustments |
| < 768px | Mobile: Single column, hamburger menu |
| < 480px | Small mobile: Reduced padding, smaller fonts |

---

## 9. Known Patterns & Conventions

1. **Game Module Pattern:** All game modules share identical structure:
   - gameState variable tracking screen state
   - startGame(), flipCard(), checkMatch() functions
   - Welcome/Game/Complete/GameOver screens
   - Score, lives, hints tracking

2. **CSS Naming:** BEM-like naming with kebab-case

3. **Event Delegation:** Used for dynamic elements

4. **Firebase Auth:** Username converted to fake email for Firebase Auth compatibility

5. **Module Isolation:** Each module is self-contained (can run independently)

---

*Documentation generated for EDULIFT - Website for Non-Reader*
*Date: 2026-03-03*
