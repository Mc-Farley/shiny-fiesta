# DeepSea Companion

An interactive, responsive web desktop pet built around the DeepSeek-inspired
blue whale maid reaction library. Praise her, tease her, offer a headpat, trigger
an alert, enable nap mode, or feed her snacks to discover her reactions.

## Run locally

```bash
npm run dev
```

The development command first extracts the animated previews from the supplied
reaction-library archive, then serves the site at `http://localhost:4173`. No
package installation is required.

## Production build

```bash
npm run build
```

The dependency-free build is written to `dist/`. Reaction previews are extracted
from `deepseek-desktop-pet-reaction-library.zip` during the build, avoiding
duplicate binary assets in source control.
