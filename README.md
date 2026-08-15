# Mira — Interactive Desktop Pet

An interactive web desktop pet built directly from the supplied character image.

## Run locally

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`, then click, double-click, drag, or use the mood buttons to interact with Mira.

## Image preparation

The original reference was enlarged to 1552×2080 and its connected white background was removed. For compatibility with text-only patch systems, the transparent PNG is Base64-encoded in `pet-image.js` and reconstructed by the browser at runtime.

## Animation system

Mira uses lightweight Live2D-inspired motion: breathing, automatic blinking, squash and stretch, drag tilt, bounce, sleepy sway, surprise, affection, particles, speech, and selectable emoji moods. The animation honors the operating system's reduced-motion preference.
