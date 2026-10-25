# CLAUDE.md

Grimoire is a Markdown note editor built with Electron, React 16, Redux, and
redux-saga, with notes stored in nedb. The code dates from 2017–2018 and the
toolchain is deliberately old: **webpack 3 and Babel 6**. Don't add Babel 7
(`@babel/*`) plugins or webpack 4+ loaders unless you're doing a full toolchain
upgrade.

## Environment & commands

The dev environment is a Nix flake (Node 22 + pnpm 10). Run
`nix develop`, or use direnv with `.envrc`.

```bash
pnpm install          # also installs app/ deps via postinstall
pnpm build            # webpack → app/main.js, app/app.html, app/assets/
pnpm dev              # express + HMR dev server on :5050, then spawns Electron
PORT=6000 pnpm dev    # override the dev server port
pnpm build:pack       # build + electron-builder → release/
pnpm build:pack:{mac,linux,win,multi}
pnpm lint             # ESLint (JS/JSX) and Stylelint (SCSS)
pnpm lint:fix         # both, with autofix
pnpm test             # Vitest, runs once (vitest.config.mjs)
pnpm test:watch       # Vitest in watch mode
```

Packaging uses electron-builder 26 with publishing off (`build.publish: null`).
The Linux rpm target needs `rpmbuild`. The dev shell provides it on Linux
(nixpkgs `rpm`). On macOS, nixpkgs' `rpmbuild` crashes, so the shell leaves it
out, and `build:pack:linux` builds the AppImage and deb, then fails at the rpm
unless the host has a working `rpmbuild`.

### Tests

Vitest is only the test runner. It has its own config,
`vitest.config.mjs`, and doesn't touch the webpack/Babel build.

- Tests sit next to the code they test as `<name>.test.js`, under `app/`.
  They import `describe`, `it`, `expect` and `vi` from `vitest`; globals
  are off. They run in Vitest's `node` environment and must pass
  `pnpm lint`.
- `vitest.config.mjs` repeats the import aliases of
  `build/webpack.base.config.js`. Keep both lists in sync: same names,
  same targets.
- `vitest.setup.js` mocks `electron` for every test (`app.getPath`,
  `remote.app.getPath` and `BrowserWindow` are stubs). No test may touch
  real Electron APIs or the filesystem.
- Mock the nedb collection modules and `electron-settings` with
  `vi.mock(path, factory)`, returning plain objects with stubbed methods.
  Don't automock them: that evaluates the real module, which opens an
  nedb file on disk.
- Vitest turns watch mode off in CI, without a TTY, or when it detects
  an AI agent, so `pnpm test:watch` then runs once and exits.

`pnpm install` installs a husky pre-commit hook (via `prepare`) that runs
`eslint --fix` on staged JS/JSX/CJS/MJS files and `stylelint --fix`
on staged SCSS files through lint-staged, re-stages the fixes, and blocks the commit if errors remain. It calls
`pnpm`, so commit from inside the nix/direnv shell. It runs lint-staged
with `--no-stash`, because the stash stack is shared by every worktree.
`pnpm build` and `pnpm dev` don't lint.

Formatting-only commits are listed in `.git-blame-ignore-revs`. GitHub
uses it automatically; locally, run
`git config blame.ignoreRevsFile .git-blame-ignore-revs`.

## Layout

- **Two-package structure** (electron-builder): the root `package.json` holds build
  and dev tooling, and `app/package.json` holds the app's **runtime** dependencies.
  Each has its own `pnpm-lock.yaml` and `.npmrc`. Add runtime libs with
  `pnpm --dir app add <pkg>` and tooling with `pnpm add -D <pkg>` at the root.
- `app/main.dev.js`: Electron main process (window, settings, DB seeding).
  In dev it's started through `app/bootstrap.dev.cjs`, which loads
  babel-register first. `app/app.js`: renderer entry.
- `app/actions`, `app/reducers`, `app/sagas`, `app/store`: Redux.
  `app/database/collections` and `seeds`: nedb.
- `app/layouts`, `app/pages`, `app/components`: React UI. Each component is a
  folder: `Name/Name.jsx`, `Name/Name.scss`, `Name/index.js`. A page's private
  components live under `pages/<Page>/components/`.
- `app/styles`: global SCSS (foundation-sites, helpers/mixins, themes). The
  themes come from `app/config/themes.json` via node-sass-json-importer.
- `build/`: webpack configs (`base`, `dev`, `prod`, `electron` for main),
  `dev-server.js`, `build.js`. `config/`: dev/prod env and port.
- Import aliases (`components`, `pages`, `layouts`, `store`, `actions`,
  `styles`, `utils`, …) are defined in `build/webpack.base.config.js`. SCSS
  files import helpers with `@import '~styles/helpers/_module'`.

## Gotchas

- `node_modules` uses `node-linker=hoisted` (`.npmrc`) because Electron and
  the `module.globalPaths` hack in `main.dev.js` expect a flat layout.
  `auto-install-peers=false` keeps the unused `node-sass` peer out.
- pnpm 10 blocks install scripts. Only `electron` is allowed, via
  `pnpm.onlyBuiltDependencies` in the root `package.json`.
- webpack 3 needs `--openssl-legacy-provider` on Node ≥17. It's passed on the
  `node` command line in the `build`/`dev` scripts, **not** via `NODE_OPTIONS`,
  because Electron rejects that flag in `NODE_OPTIONS`.
- SCSS compiles with dart-sass (`sass`) through sass-loader 7's `implementation`
  option. Loader options that hold functions or objects need a unique `ident`,
  or webpack 3 tries to JSON-serialize them into the request string.
  `jsonImporter()` is a factory: call it.
- **Electron 37 with an Electron 1.x-era app (compat mode).** The renderer
  uses Node directly (nedb, electron-settings, `process.env`) and `remote`:
  - Every `BrowserWindow` must pass `webPreferences` from
    `app/config/windowPreferences.js` (`nodeIntegration: true`,
    `contextIsolation: false`). The main window and the editor window
    (`app/sagas/notesSaga.js`) both do.
  - `remote` comes from `@electron/remote`. The main process initializes it and
    enables it for every window (`browser-window-created` in `main.dev.js`).
    `app/utils/electronRemoteShim.js`, the first import in `app/app.js`,
    assigns it to `require('electron').remote` so the old
    `electron.remote` call sites in the app and its deps keep working.
  - `redux-electron-store@0.4.1` is patched (`app/patches/`, registered in
    `app/pnpm-workspace.yaml`) to replace removed `webContents` APIs.
  - Dev entry: Electron's Node loads a `.js` file containing `import` syntax as
    native ESM, which bypasses babel-register. `bootstrap.dev.cjs` avoids that.
  - Frameless windows: Electron applies `-webkit-app-region` rects in document
    order, so a later `drag` region overrides an earlier overlapping `no-drag`
    one and swallows its clicks. Put `no-drag` controls after any `.draggable`
    element that overlaps them. Controls *inside* `.draggable` are opted out
    by `app/styles/layout/_modifiers.scss`.
  - An uncaught exception in the main process shows a modal error dialog that
    freezes the main process: no IPC, no timers. If the app hangs, look for
    that dialog.

## Style

ESLint enforces the formatting; every rule is an error.

- No semicolons. Keep a leading `;` where ASI needs one (a line
  starting with `(`, `[` or a template literal).
- Single quotes (double quotes in JSX attributes), 2-space indentation,
  comma-last literals, and ES module imports.
- Lines are at most 70 characters (only lines containing a URL are
  exempt). Aim for about 61 where possible.
- The parser is `@typescript-eslint/parser`, without type information,
  because espree can't parse the legacy `@ui({...})` decorators. Don't
  rewrite the decorators to suit the linter.

Stylelint (`stylelint.config.mjs`, `postcss-scss` syntax) lints SCSS
with only these rules, every one an error, and extends no preset:

- Formatting (`@stylistic/stylelint-plugin`): `indentation` 2,
  `string-quotes` single (with `avoidEscape`),
  `declaration-block-trailing-semicolon` always, and
  `max-line-length` 70. The 70/61 line-length rule above applies to
  SCSS too; `url()` arguments aren't counted.
- Correctness: `block-no-empty`,
  `declaration-block-no-duplicate-properties`, `property-no-unknown`,
  `unit-no-unknown`, `color-no-invalid-hex`, and
  `scss/at-rule-no-unknown` (from `stylelint-scss`; core
  `at-rule-no-unknown` stays off).
- `app/styles/vendors/**` (foundation's settings) is ignored, along
  with `node_modules` and build output. normalize.css is linted.
- Disables need a rule and a reason; needless ones are errors. Use
  `/* stylelint-disable-next-line <rule> -- <reason> */`.
- `postcss-scss` needs postcss 8, but the hoisted layout puts the
  webpack loaders' postcss 5 at the top, so a `pnpm.packageExtensions`
  entry gives it its own copy.

## Agent skills

### Issue tracker

Issues are Linear tickets in the Grimoire team (`GRM`), managed through the Linear MCP. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
