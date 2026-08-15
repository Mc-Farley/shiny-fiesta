# DeepSeek — Interactive Desktop Pet

An interactive web desktop pet built directly from the supplied character image.

## Run locally

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`, then click, double-click, drag, or use the mood buttons to interact with DeepSeek.

## Image preparation

The cleaned 512×512 transparent frames are Base64-encoded in `pet-frames.js` and reconstructed by the browser at runtime. Identical frames are deduplicated: the idle blink uses two unique images, and the cleaned `blush_shy` and `clicked_react` sequences use deduplicated stages. `Dragged_squirm` uses its complete 12-frame animation. The first visit also plays a one-time `greet_wave` sequence. The click reactions return smoothly to idle, while `Dragged_squirm` loops for as long as the character is held.

## Animation system

DeepSeek uses lightweight Live2D-inspired motion: a persistent first-visit greeting, breathing, frame-based automatic blinking as her default idle behavior, and randomly selected `clicked_react` or `blush_shy` responses with matching dialogue whenever she is clicked. She also supports a held-and-dragged `Dragged_squirm` sequence, squash and stretch, drag tilt, bounce, sleepy sway, surprise, affection, particles, speech, and selectable moods. The animation honors the operating system's reduced-motion preference.
