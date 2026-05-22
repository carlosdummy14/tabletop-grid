# Trench Crusade AR Marker Overlay

A lightweight experimental web application designed to assist with objective and marker placement for one of the scenarios in the tabletop wargame **Trench Crusade**.

This project uses a mobile phone camera and a transparent overlay system to visually align a battlefield grid with a real tabletop surface, allowing players to place markers quickly and consistently.

---

# Purpose

This application was created as a technical and UX experiment to explore:

- Camera overlays in mobile browsers
- Manual perspective alignment
- Tactical battlefield visualization
- Randomized marker generation
- Lightweight augmented-reality style interfaces using only HTML/CSS/JavaScript

The current implementation focuses specifically on helping define valid Supply Crate Marker zones for a Trench Crusade scenario.

---

# Features

- Mobile browser camera support
- Transparent battlefield overlay
- 48\" x 48\" battlefield representation
- 36\" x 36\" playable area
- Perspective-adjustable corners
- Random marker generation
- Marker placement validation
- Coordinate display for physical measurement
- Touch support for mobile devices
- No external libraries required

---

# Battlefield Rules Implemented

The application currently supports a scenario where:

- The battlefield is 48\" x 48\"
- The playable marker zone is 36\" x 36\"
- Markers must remain within 12\" of the battlefield center
- Markers must be more than 1\" apart
- A player's second marker must be more than 12\" from their first marker

---

# Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Canvas API
- Mobile Camera API (`getUserMedia`)

---

# Project Structure

```text
project/
│
├── index.html
├── style.css
└── js/
    ├── app.js
    ├── camera.js
    ├── markers.js
    └── renderer.js
