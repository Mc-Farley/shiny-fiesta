# Mira — Interactive Desktop Pet

An interactive web desktop pet built directly from the supplied character image.

## Run locally

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`, then click, double-click, or drag Mira to interact with her.

## Image preparation

The original 194×260 reference was enlarged four times to 776×1040 and its connected white background was removed. For compatibility with text-only patch systems, the transparent PNG is Base64-encoded in `pet-image.js` and reconstructed by the browser at runtime.
