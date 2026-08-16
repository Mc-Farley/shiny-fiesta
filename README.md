# DeepSeek — Interactive Desktop Pet

An interactive web desktop pet built directly from the supplied character image.

## Run locally

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`, then click, double-click, drag, or use the mood buttons to interact with DeepSeek. Dragging begins after roughly 2 mm of pointer movement so ordinary clicks and double-clicks do not start the drag animation.

## Image preparation

The 512×512 frames are Base64-encoded in `pet-frames.js` and reconstructed by the browser at runtime. Every frame receives the same edge-matte cleanup so exported black backgrounds and dark anti-aliased fringes do not produce inconsistent fuzzy outlines. Identical frames are deduplicated: the idle blink uses two unique images, and the `blush_shy` and `clicked_react` sequences use deduplicated stages. `Dragged_squirm` uses its complete 12-frame animation. On each page entry, the transparent `greet_wave` sequence plays forward and backward as one seamless loop until the character is clicked or five seconds pass. The click reactions return smoothly to idle, while `Dragged_squirm` loops for as long as the character is held.

## Animation system

DeepSeek uses lightweight Live2D-inspired motion: an on-entry greeting, breathing, frame-based automatic blinking as her default idle behavior, and randomly selected `clicked_react` or `blush_shy` responses with matching dialogue whenever she is clicked. The third mood button also plays `clicked_react`. After two minutes without interaction—or immediately from the fourth mood button—the dedicated sleep frames loop until a click wakes her with `clicked_react`. Ten clicks within two seconds trigger the dedicated `pout_tap` animation and dialogue instead of a normal click reaction. While pouting, character, keyboard, drag, and mood interactions are locked until the final animation frame completes. She also supports a held-and-dragged `Dragged_squirm` sequence, squash and stretch, drag tilt, bounce, surprise, affection, particles, speech, and selectable moods. The greeting, sleep, drag, and pout frames are cleaned in the browser by making only their edge-connected black export backgrounds transparent, preserving the character's dark details. The animation honors the operating system's reduced-motion preference.
