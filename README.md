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

- Real-time score tracking.
- High-score tracking using browser local storage.
- High scores persist between browser sessions.

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
│   └── app.js
│
├── index.html
│
└── README.md
```

### Directory Overview

**assets/images/**
Contains game images and branding assets.

**css/**
Contains the arcade design system, responsive layout, and component styling.

**js/**
Contains the JavaScript gameplay logic and event handling.

**index.html**
Provides the main application structure, game canvas, controls, and Help modal.

**README.md**
Documents the project, features, setup instructions, and development roadmap.

---

## 🚀 Getting Started

### Prerequisites

You need:

- A modern web browser.
- Git, if you want to clone the repository.
- A code editor such as Visual Studio Code (optional).

### Installation

**1. Clone the repository**

```bash
git clone <repository-url>
```

Replace `<repository-url>` with the actual GitHub repository URL.

**2. Navigate into the project**

```bash
cd Venom-Sprint
```

**3. Launch the game**

Open `index.html` in a modern browser.

Alternatively, use a local development server.

No npm installation, build process, or JavaScript framework is required.

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

### ⏳ Phase 2 — JavaScript Architecture

**Status: Planned**

- Refactor the existing JavaScript into ES modules.
- Separate gameplay responsibilities into dedicated files.
- Introduce centralized game-state management.
- Improve code organization and maintainability.
- Preserve existing gameplay while refactoring.

### ⏳ Phase 3 — Gameplay Improvements

**Status: Planned**

- Improve game restart and reset behavior.
- Prevent food from spawning inside the snake.
- Strengthen movement and collision handling.
- Improve pause and resume behavior.
- Add clearer game-over feedback.
- Evaluate additional gameplay enhancements.

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

Venom-Sprint 2.0 is currently undergoing development.

The following areas are scheduled for improvement:

- Restart behavior and game-state synchronization.
- Food spawning and collision edge cases.
- Rapid direction-change handling.
- Help modal keyboard accessibility.
- More comprehensive
