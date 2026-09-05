# Contributing

Contributions are always welcome, no matter how large or small!

We want this community to be friendly and respectful to each other. Please follow it in all your interactions with the project. Before contributing, please read the [code of conduct](./CODE_OF_CONDUCT.md).

## Development workflow

This project uses [bun](https://bun.sh) as its package manager. Install dependencies from the root directory:

```sh
bun install
```

There is no separate example app in this repository. The library is a thin, fetch-backed SDK over the Ola Maps and Mappls REST APIs, plus React Native components that wrap `@maplibre/maplibre-react-native`. Unit tests cover the endpoint construction, response normalization, error handling, and component rendering. To verify your changes locally, run the checks below or wire the library into your own app with a file dependency (for example `bun add ./react-native-india-maps`).

### Scripts

The `package.json` file contains the scripts for common tasks:

- `bun install`: set up the project by installing dependencies.
- `bun run typecheck`: type-check files with TypeScript.
- `bun run lint`: lint files with ESLint and Prettier.
- `bun run test`: run unit tests with Jest.
- `bun run build`: build the library with `react-native-builder-bob` (also runs via `prepare`).

Before opening a pull request, make sure everything passes:

```sh
bun run typecheck
bun run lint
bun run test
bun run build
```

To fix formatting errors automatically:

```sh
bun run lint --fix
```

### Commit message convention

We follow the [conventional commits specification](https://www.conventionalcommits.org/en) for our commit messages:

- `fix`: bug fixes, e.g. fix crash due to deprecated method.
- `feat`: new features, e.g. add new method to the module.
- `refactor`: code refactor, e.g. migrate from class components to hooks.
- `docs`: changes into documentation, e.g. add usage example for the module.
- `test`: adding or updating tests, e.g. add integration tests using detox.
- `chore`: tooling changes, e.g. change CI config.

Our pre-commit hooks verify that your commit message matches this format when committing (via commitlint).

### Linting and tests

We use [TypeScript](https://www.typescriptlang.org/) for type checking, [ESLint](https://eslint.org/) with [Prettier](https://prettier.io/) for linting and formatting the code, and [Jest](https://jestjs.io/) for testing.

Our pre-commit hooks (via [lefthook](https://lefthook.dev)) lint staged files and verify the commit message format when committing.

### Publishing to npm

We use [release-it](https://github.com/release-it/release-it) to make it easier to publish new versions. It handles common tasks like bumping version based on semver, creating tags and releases etc.

To publish new versions, run the following:

```sh
bun run release
```

### Sending a pull request

> **Working on your first pull request?** You can learn how from this _free_ series: [How to Contribute to an Open Source Project on GitHub](https://app.egghead.io/playlists/how-to-contribute-to-an-open-source-project-on-github).

When you're sending a pull request:

- Prefer small pull requests focused on one change.
- Verify that linters and tests are passing.
- Review the documentation to make sure it looks good.
- Follow the pull request template when opening a pull request.
- For pull requests that change the public API, discuss with maintainers first by opening an issue.
