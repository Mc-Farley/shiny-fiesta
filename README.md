# Mira — Interactive Desktop Pet

An interactive web desktop pet built directly from the supplied character image.

## Run locally

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`, then click, double-click, drag, or use the mood buttons to interact with Mira.

## Image preparation

The supplied 500×500 transparent idle frames are Base64-encoded in `pet-frames.js` and reconstructed by the browser at runtime. Identical frames are deduplicated, so the complete 14-frame timing sequence uses only the two unique open-eye and closed-eye images.

## Animation system

Mira uses lightweight Live2D-inspired motion: breathing, frame-based automatic blinking, squash and stretch, drag tilt, bounce, sleepy sway, surprise, affection, particles, speech, and selectable emoji moods. The animation honors the operating system's reduced-motion preference.
