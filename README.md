# 🍥 Naruto Hand Jutsu

A real-time hand-tracking web app that lets you perform iconic Naruto jutsu using your webcam. Choose a character, make hand signs, and watch chakra effects come to life — all running in the browser with zero installation.

<br>

## ✨ Features

- **🎭 Character Select** — Pick from **5 playable characters**, each with unique jutsu, colors, and particle effects:

  | Character | Poses | Signature Jutsu |
  |-----------|-------|-----------------|
  | 🍥 **Naruto** | Open · Fist · Peace | Rasengan, Fireball, Shadow Clone |
  | ⚡ **Sasuke** | Open · Fist · Point | Chidori, Fireball, Amaterasu |
  | 📖 **Kakashi** | Open · Point · Peace | Lightning Blade, Amaterasu, Shadow Clone |
  | 🌸 **Sakura** | Open · Fist · Peace | Cherry Blossom, Chakra Punch, Healing Jutsu |
  | 🌙 **Itachi** | Open · Fist · Point | Tsukuyomi, Fireball, Amaterasu |

- **🖐 4 Hand Poses** — Real-time detection of Open, Fist, Peace (✌️), and Point (☝️) gestures
- **🔥 Canvas-Drawn Jutsu Effects** — Fireball rings, shadow clone afterimages, Amaterasu dark flames
- **🎬 Video FX Overlays** — Rasengan / Chidori video effects composited with `mix-blend-mode: screen`
- **✨ Particle System** — Chakra particles spawn from fingertips, colored per character & jutsu
- **🎥 Cinematic Polish** — Vignette, letterbox bars, screen shake, flash on jutsu activation
- **📊 Live HUD** — Per-hand power bars with dynamic labels showing the active jutsu name
- **🎨 Character Theming** — Skeleton glow, UI accents, and power bar colors all match the selected character

<br>

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| [MediaPipe Hands](https://google.github.io/mediapipe/solutions/hands) | Real-time 21-landmark hand tracking |
| Canvas 2D API | Hand skeleton rendering, jutsu effects, particle system |
| HTML5 Video | Rasengan / Chidori FX overlays |
| CSS3 | Animations, backdrop-filter, radial gradients, custom properties |
| Vanilla JS | Zero dependencies — no frameworks, no build step |
| Google Fonts | Cinzel serif for the UI |

<br>

## 📁 Project Structure

```
naruto/
├── index.html              # App shell — HTML structure & script loading
├── css/
│   └── style.css           # All styles (character select, HUD, effects, etc.)
├── js/
│   ├── characters.js       # 5 character definitions (poses, jutsu, colors)
│   ├── particles.js        # Particle class, spawning & render loop
│   ├── effects.js          # Hand skeleton drawing, fireball, shadow clone, amaterasu
│   ├── handTracking.js     # Pose classification (open, fist, peace, point)
│   ├── hud.js              # Power bars & instruction updates
│   └── main.js             # Entry point — character select, game loop, MediaPipe setup
├── assets/
│   ├── naruto.mp4          # Rasengan video FX
│   └── sasuke.mp4          # Chidori video FX
└── README.md
```

<br>

## 🚀 Getting Started

### Prerequisites
- A modern browser (Chrome / Edge recommended for best MediaPipe performance)
- A webcam

### Run It
1. **Clone the repo**
   ```bash
   git clone https://github.com/gprem09/naruto.git
   cd naruto
   ```

2. **Serve locally** — open `index.html` via any local server:
   ```bash
   # Python
   python3 -m http.server 8000

   # Node
   npx serve .
   ```

3. **Open** `http://localhost:8000` in your browser

4. **Allow camera access** when prompted

> **Note:** Opening `index.html` directly via `file://` may not work due to browser security policies for camera access. Use a local server.

<br>

## 🎮 How to Play

1. **Choose your character** from the selection screen
2. **Show your hands** to the webcam — the hand skeleton will appear
3. **Make a hand sign** to activate a jutsu:

   | Gesture | Pose |
   |---------|------|
   | 🖐 All fingers open | **Open** |
   | ✊ Closed fist | **Fist** |
   | ✌️ Index + middle extended | **Peace** |
   | ☝️ Only index extended | **Point** |

4. **Hold the pose** to charge power — effects intensify as the bar fills
5. Each character only responds to their **3 assigned poses**

<br>

## 🤝 Contributing

Pull requests are welcome! Some ideas for future features:

- 🔊 Sound effects (Web Audio API)
- ⚔️ Combo system (sequential pose chains)
- 📱 Mobile optimization
- 🆚 PvP split-screen mode
- 🎥 Jutsu recording / replay

<br>

## 📄 License

This project is for educational and fan-made purposes. *Naruto* is a trademark of Masashi Kishimoto / Shueisha / Viz Media.
