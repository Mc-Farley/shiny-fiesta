# DeepSeek — Interactive Desktop Pet

An interactive web desktop pet built directly from the supplied character image.

## Run locally

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`, then click, double-click, drag, or use the mood buttons to interact with DeepSeek.

## Image preparation

The supplied 500×500 transparent frames are Base64-encoded in `pet-frames.js` and reconstructed by the browser at runtime. Identical frames are deduplicated: the idle blink uses two unique images, while the 19-frame `blush_shy` interaction uses seven unique stages.

## Animation system

DeepSeek uses lightweight Live2D-inspired motion: breathing, frame-based automatic blinking, a click-triggered `blush_shy` sequence, squash and stretch, drag tilt, bounce, sleepy sway, surprise, affection, particles, speech, and selectable moods. The animation honors the operating system's reduced-motion preference.
