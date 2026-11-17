# atlas-desktop-shell

Post-v3 **Atlas desktop adaptation**: an Electron shell for the Atlas cloud
console and REST API. It replaces the legacy local-first QMRE desktop runtime as
the primary desktop experience while keeping the old app in `atlas-desktop/`
for reference.

- loads the deployed console (`https://www.3i-atlas.dev/console/`)
- talks to the Atlas API (`https://atlas-api-8d8k.onrender.com`)
- no provider credentials or local engine are bundled in the binary
- external links open in the system browser; navigation is restricted to the
  configured console/API origins
- offline/error page with retry instructions
- account/session cleared from the Atlas menu

## Configure

```bash
export ATLAS_CONSOLE_URL=https://www.3i-atlas.dev/console/
export ATLAS_API_BASE=https://atlas-api-8d8k.onrender.com
```

Defaults are the production URLs. The shell never exposes Node APIs to the
renderer (`contextIsolation`, `sandbox`, no `nodeIntegration`).

## Run

```bash
cd atlas-desktop-shell
npm install
npm start
```

## Package

```bash
npm run dist          # current OS installer
npm run dist:dir      # unpacked app for testing
```

Output goes to `release/`.

## What is intentionally not included

- the legacy local QMRE engine and bundled Ollama models;
- provider API keys or Stripe secrets;
- a local-first mode. The Atlas cloud API is the source of truth; a future
  offline replay bundle can be added via `atlas-gym-sdk` local harness.
