# StudyForge

**A free, independent open-source JavaScript practice platform.** Work through short coding challenges, run tests in the browser, and track learning progress without signing up.

## Features

- **30 JavaScript challenges** spanning beginner, intermediate, and advanced difficulty.
- **Learning paths** organised by topic: strings, arrays, maths, logic, and objects.
- Built-in starter code, examples, optional hints, and per-test feedback.
- Progress and code drafts saved locally in the current browser.
- Export or import a JSON progress backup (including code drafts).
- Responsive interface and keyboard shortcut **Ctrl/Cmd + Enter** to run tests.
- No login or backend required.

## Run locally

Requires Node.js 20+ and npm. No external packages or account are required.

```bash
npm run build
# Open dist/index.html directly in your browser
```

Open the local URL shown by Vite. To verify or build:

```bash
npm test
npm run build

```

## Deploy to GitHub Pages

1. Create a **public** repository and upload the contents of this directory to its root.
2. Commit on the `main` branch, (the package has no external dependencies).
3. In **Settings → Pages → Build and deployment**, select **GitHub Actions**.
4. The `Deploy to GitHub Pages` workflow builds and publishes the site after pushes to `main`.
5. The project's site URL is generally `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/` once GitHub confirms deployment.

Publishing requires access to your own GitHub account; the project is not uploaded by this download.

## Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md), [ROADMAP.md](ROADMAP.md), and the issue templates. New challenges must include a prompt, example, hint, starter function, and at least three tests. Contributions are reviewed by the repository maintainers.

## Limitations and privacy

Only **JavaScript** is executed in this release; Python and SQL are future ideas, not implemented languages. The runtime uses a sandboxed iframe with a restrictive CSP, **not** a hardened hostile-code isolation system. Do not run untrusted code or paste secrets. No progress is sent to a StudyForge server; local browser storage can be cleared by the user or browser. Exported backups include drafts.

See [SECURITY.md](SECURITY.md). Licensed under the [MIT License](LICENSE). No affiliation with any coding-assistant provider.
