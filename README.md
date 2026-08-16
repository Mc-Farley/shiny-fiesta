# DeepSea Companion

An interactive, responsive web desktop pet built around the DeepSeek-inspired
blue whale maid reaction library. Praise her, tease her, offer a headpat, trigger
an alert, enable nap mode, or feed her snacks to discover her reactions.

## Run locally

```bash
npm run dev
```

The development command extracts the animated previews from the supplied
reaction-library archive, then serves the site at `http://localhost:4173`. No
package installation is required.

## Production build

```bash
npm run build
```

The dependency-free build is written to `dist/`. Direct static previews use an
inline SVG character fallback, so the companion remains visible even when the
binary reaction previews have not been extracted from the archive.
