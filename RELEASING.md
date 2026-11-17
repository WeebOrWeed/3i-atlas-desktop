# Releasing the desktop app

The release workflow is `.github/workflows/release.yml`:

- tag `v*` → creates a GitHub Release and builds macOS (.dmg arm64 + x64) and
  Windows (.exe) installers, uploading them to that release;
- manual `workflow_dispatch` → builds workflow artifacts only.

Builds are **unsigned** until an Apple Developer ID / Windows code-signing
certificate is configured. Users approve the app manually on first launch:

- macOS: right-click app → Open (or Privacy & Security → Open Anyway);
- Windows: SmartScreen → More info → Run anyway.

## One-time GitHub setup

The workflow file must be pushed by an account/token with the `workflow` scope:

```bash
gh auth refresh -h github.com -s workflow
git add -f .github/workflows/release.yml
git commit -m "ci: desktop release workflow"
git push origin main
```

Then cut a release:

```bash
git tag v0.1.1
git push origin v0.1.1
```

The marketing `/download` page reads the latest GitHub release and wires the
Apple/Windows buttons to the `.dmg`/`.exe` assets automatically.
