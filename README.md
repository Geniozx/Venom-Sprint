# 🐍 Venom-Sprint 2.0

### Slither. Survive. Dominate.

![Venom-Sprint Game Preview](./assets/images/Venom-Sprint.png)

**Venom-Sprint 2.0** is a modern, arcade-inspired Snake game built entirely with **vanilla JavaScript, HTML5, and CSS3**.

Featuring a neon-inspired interface, responsive game board, dynamic difficulty, and interactive player controls, Venom-Sprint brings a fresh visual experience to the classic Snake game.

The project is being developed as a portfolio-ready browser game, with an emphasis on clean architecture, responsive design, accessibility, and maintainable JavaScript.

---

## 🎮 Features

### 🐍 Classic Snake Gameplay

- Control the snake using the arrow keys.
- Collect food to increase your score.
- Grow longer each time food is collected.
- Avoid collisions with walls and the snake's body.
- Experience progressively faster gameplay as your score increases.

### ⚡ Dynamic Difficulty

- The game begins at a manageable speed.
- Movement speed increases as food is collected.
- The speed increase introduces progressively greater challenges.

### 🏆 Scoring System

Venom-Sprint 2.0 features a movement-based scoring system that rewards both survival and food collection.

- **+1 point** for every successful movement.
- **+10 bonus points** for collecting food.
- Collecting food awards **11 points total** for that movement.
- No points are awarded for movements that result in a collision.
- Real-time score tracking throughout gameplay.
- High-score tracking using browser local storage.
- High scores persist between browser sessions.

High scores are stored using the `venomSprint_v2_highScore` local storage key.

### 🎛️ Interactive Game Controls

- **Restart:** Begin a new game.
- **Pause / Resume:** Temporarily stop or continue gameplay.
- **End:** Stop the current game.
- **Help:** Open an instructional modal explaining gameplay and controls.

### 🎨 Neon Arcade Interface

Venom-Sprint 2.0 introduces a redesigned visual experience featuring:

- Dark arcade-inspired backgrounds.
- Neon green and purple accent colors.
- Glowing game-board borders.
- Redesigned scoreboard.
- Modern interactive buttons.
- Styled instructional modal.
- Updated Venom-Sprint branding.

### 📱 Responsive Design

- Responsive game board that adapts to available screen space.
- Viewport-aware sizing for desktop and laptop displays.
- Responsive button layouts.
- Mobile-friendly scoreboard adjustments.
- Layout improvements that reduce unnecessary vertical scrolling.

### ♿ Accessibility Improvements

- Semantic HTML structure.
- Explicit button types.
- Descriptive canvas labeling.
- Canvas fallback text.
- Visible keyboard focus indicators.
- Support for reduced-motion preferences.

Additional gameplay and modal accessibility improvements are planned.

---

## 🕹️ How to Play

1. Open Venom-Sprint in your browser.
2. Press **Space** to begin playing.
3. Use the arrow keys to control the snake.
4. Collect food to earn points and grow longer.
5. Avoid colliding with the walls or your own body.
6. Survive as long as possible and attempt to beat your high score.

### Keyboard Controls

| Key | Action |
|---|---|
| ↑ | Move up |
| ↓ | Move down |
| ← | Move left |
| → | Move right |
| Space | Start the game |
| Space (during gameplay) | Pause the game |
| Space (while paused) | Resume the game |

Holding Space does not repeatedly toggle the pause state.

The game can also be started or restarted using the **Restart** button.

### Interface Controls

| Button | Action |
|---|---|
| Restart | Start a new game |
| Pause / Resume | Pause or resume gameplay |
| End | End the current game |
| Help | Display gameplay instructions |

---

## 🛠️ Technology Stack

Venom-Sprint is intentionally built without JavaScript frameworks.

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and game canvas |
| CSS3 | Styling, animations, and responsive layouts |
| JavaScript | Gameplay logic and user interactions |
| Canvas API | Rendering the snake, food, and game board |
| Local Storage API | Saving high scores |
| Git | Version control |
| GitHub | Source code hosting |

---

## 📁 Project Structure

```text
Venom-Sprint/
│
├── assets/
│   └── images/
│       └── Venom-Sprint.png
│
├── css/
│   └── style.css
│
├── js/
│   ├── app.js
│   ├── config.js
│   ├── controls.js
│   ├── food.js
│   ├── game.js
│   ├── main.js
│   ├── renderer.js
│   ├── snake.js
│   └── storage.js
│
├── index.html
│
└── README.md
```

### JavaScript Architecture

Venom-Sprint 2.0 uses native JavaScript ES modules to separate application responsibilities and improve maintainability.

| Module | Responsibility |
|---|---|
| `main.js` | Application entry point |
| `app.js` | Coordinates gameplay events and browser interface updates |
| `config.js` | Centralizes grid dimensions and speed configuration |
| `controls.js` | Manages keyboard input, game buttons, and Help modal interactions |
| `food.js` | Generates food in unoccupied grid cells |
| `game.js` | Manages game state, scoring, timers, and lifecycle |
| `renderer.js` | Renders the snake and food using HTML5 Canvas |
| `snake.js` | Handles snake initialization, movement, growth, and collision detection |
| `storage.js` | Manages persistent high-score storage |

### Architecture Overview

```text
index.html
    │
    ▼
  main.js
    │
    ▼
  app.js
    │
    ├── controls.js
    │
    ├── game.js
    │     ├── snake.js
    │     ├── food.js
    │     └── config.js
    │
    ├── renderer.js
    │
    └── storage.js
```

The application coordinator connects user input, gameplay logic, rendering, and persistent storage.

The game engine communicates gameplay events through callbacks, allowing rendering and interface updates to remain separate from core game rules.

### Directory Overview

**`assets/images/`**
Contains game images and branding assets.

**`css/`**
Contains the arcade design system, responsive layout, and component styling.

**`js/`**
Contains the modular JavaScript application.

**`index.html`**
Provides the main application structure, game canvas, controls, and Help modal.

**`README.md`**
Documents the project, features, setup instructions, architecture, and development roadmap.

---

## 🚀 Getting Started

### Prerequisites

You need:

- A modern web browser.
- Python 3 or another local HTTP server.
- Git, if you want to clone the repository.
- A code editor such as Visual Studio Code (optional).

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Geniozx/Venom-Sprint.git
```

**2. Navigate into the project**

```bash
cd Venom-Sprint
```

**3. Start a local development server**

Using Python 3:

```bash
python3 -m http.server 5500
```

**4. Open the application**

Visit:

`http://localhost:5500`

**5. Start playing**

Press **Space** or click **Restart** to begin.

### Development Notes

Venom-Sprint uses native JavaScript ES modules.

The application should be served over HTTP rather than opened directly using the `file://` protocol.

No npm installation, JavaScript framework, or build process is required.

---

## 🎨 Design System

Venom-Sprint 2.0 uses a centralized CSS design system.

### Primary Colors

| Color | Hex | Purpose |
|---|---|---|
| Dark Background | `#080b12` | Primary background |
| Surface | `#141a26` | UI containers |
| Neon Green | `#39ff88` | Primary accent |
| Neon Purple | `#a855f7` | Secondary accent |
| Neon Red | `#ff4d6d` | Danger actions |
| Primary Text | `#f1f5f9` | Main typography |
| Secondary Text | `#94a3b8` | Supporting typography |

The stylesheet also defines reusable variables for borders, glow effects, border radii, and transitions.

---

## 🗺️ Development Roadmap

### ✅ Phase 1 — Project Foundation & Arcade UI

**Status: Complete**

- Reorganized project directories.
- Introduced the Venom-Sprint 2.0 branding.
- Created a centralized CSS design system.
- Modernized the HTML structure.
- Redesigned the game board.
- Redesigned the scoreboard.
- Redesigned the control buttons.
- Redesigned the Help modal.
- Implemented viewport-responsive sizing.
- Improved narrow-screen layouts.
- Added initial accessibility enhancements.
- Verified existing gameplay functionality.

### ✅ Phase 2 — JavaScript Architecture

**Status: Complete**

Refactored Venom-Sprint into a modular JavaScript application using native ES modules.

#### Architecture Improvements

- Introduced nine dedicated JavaScript modules.
- Established `main.js` as the application entry point.
- Centralized game configuration.
- Centralized gameplay state and lifecycle management.
- Separated snake movement and collision detection.
- Isolated food generation.
- Separated Canvas rendering from gameplay logic.
- Centralized keyboard and button controls.
- Extracted persistent high-score management.
- Introduced callback-based communication between gameplay logic and the application interface.

#### Gameplay Improvements

- Implemented movement-based scoring.
- Added a 10-point food collection bonus.
- Prevented food from spawning inside the snake.
- Improved timer management to prevent duplicate intervals.
- Implemented Space Bar start, pause, and resume controls.
- Prevented repeated Space Bar events from rapidly toggling pause.
- Fixed Restart behavior before the initial game starts.
- Synchronized the Pause/Resume button with gameplay state.
- Improved game-over lifecycle cleanup.
- Preserved high scores between browser sessions.

#### Testing and Verification

- Completed module-by-module functionality testing.
- Verified gameplay state transitions.
- Verified scoring and collision behavior.
- Verified timer creation and cleanup.
- Verified pause/resume behavior.
- Verified module loading through browser DevTools.
- Completed 20 final gameplay regression checks.
- Verified responsive layout and browser console behavior.

**Result:** Phase 2 established a maintainable foundation for future gameplay enhancements without introducing JavaScript frameworks.

### ⏳ Phase 3 — Gameplay Improvements

**Status: Planned**

Phase 3 focuses on gameplay reliability, player feedback, and additional mechanics.

Planned improvements include:

- Implement direction locking to prevent multiple direction changes within a single movement tick.
- Strengthen self-collision handling and movement edge cases.
- Implement a victory condition when the snake fills the entire board.
- Improve game-over feedback with a dedicated interface.
- Introduce clearer gameplay status indicators.
- Evaluate additional difficulty and gameplay enhancements.

The existing scoring system, food generation, timer management, and pause/resume functionality were completed during Phase 2.

### ⏳ Future Enhancements

Potential additions include:

- Dedicated game-over interface.
- Game start and pause overlays.
- Sound effects and audio controls.
- Improved keyboard and modal accessibility.
- Additional visual effects.
- Mobile touch controls.
- Expanded scoring features.
- Additional game modes.

These features are planned or under consideration and are not part of the current implementation.

---

## ⚠️ Known Limitations

Venom-Sprint 2.0 remains under active development.

The following improvements are planned:

- Rapid direction changes within a single movement tick can bypass the current reversal protection.
- A full-board victory condition has not yet been implemented.
- The Help modal needs additional keyboard accessibility improvements.
- Mobile touch controls are not yet available.
- Game-over feedback currently uses a browser alert.
- Snake and food rendering currently use basic Canvas shapes.
- Additional automated testing and accessibility verification are planned.

These limitations do not prevent the current game from functioning, but they will guide future development phases.
