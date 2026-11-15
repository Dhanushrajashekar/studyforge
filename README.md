# StudyForge

Free open-source JavaScript practice with 30 challenges, five topic-based learning paths, hints, browser-based tests, and local progress export/import.

Website: https://dhanushrajashekar.github.io/studyforge/

## Develop

Node.js 20+ is required; no package installations are needed.

```sh
npm test
npm run build
python3 -m http.server 8000 -d dist
```

Visit http://localhost:8000/.

## Structure

- `src/challenges.js`: original 30 challenges and scoring
- `src/runner.js`: sandboxed iframe code runner
- `src/app.js`: UI and local persistence
- `src/styles.css`: responsive design
- `scripts/build.mjs`: dependency-free build
- `tests/challenges.test.js`: schema and smoke checks
- `demo.html`: preserved historical standalone demo

## GitHub Pages

The workflow tests and builds on PRs and publishes `dist/` on each push to `main`. If Pages cannot be automatically activated, go to **Settings → Pages → Build and deployment → Source: GitHub Actions** and rerun the workflow. The public repository needs no paid plan.

## Privacy

Progress and drafts remain in browser localStorage; exported JSON contains code drafts. The runner is a sandboxed iframe, **not** a hardened isolation boundary. Never paste secrets or run untrusted code.

See [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md), [ROADMAP.md](ROADMAP.md) and [LICENSE](LICENSE).
