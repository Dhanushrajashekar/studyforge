# Contributing to StudyForge

Contributions from learners, educators, and developers are welcome.

## Good first contributions

- Improve the clarity of a problem statement or hint.
- Report test cases that are ambiguous or incorrect.
- Improve mobile layouts, keyboard navigation, or screen-reader support.
- Propose a useful exercise with real learning outcomes.

## Local setup

Run `npm test` and `npm run build` using Node.js 20+. Open `dist/index.html` in a browser to test the interface.

## Add a challenge

Edit `src/challenges.js`. Every challenge needs a unique stable `id`, `title`, `topic`, `level`, `points`, `description`, `example`, `starter`, `hint`, and at least three `tests` objects containing `args` and `expected`. The starter must declare a named `function` that can be called by the test runner. Include normal and edge cases. Never include secrets or requests for network access in challenges.

Add or adjust tests in `tests/challenges.test.js` to verify the content. Please describe the educational purpose in your pull request.

## Community expectations

Be respectful and constructive. Discuss disagreements about challenge difficulty and wording using examples and reproducible tests. Do not submit spam, fake engagement, or misleading usage claims.
