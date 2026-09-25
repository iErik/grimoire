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
pnpm dev              # express + HMR dev server, then spawns Electron
PORT=5050 pnpm dev    # macOS: port 5000 is taken by AirPlay Receiver
pnpm build:pack       # build + electron-builder → release/
pnpm build:pack:{mac,linux,win,multi}
```

There are no tests or linters.

## Layout

- **Two-package structure** (electron-builder): the root `package.json` holds build
  and dev tooling, and `app/package.json` holds the app's **runtime** dependencies.
  Each has its own `pnpm-lock.yaml` and `.npmrc`. Add runtime libs with
  `pnpm --dir app add <pkg>` and tooling with `pnpm add -D <pkg>` at the root.
- `app/main.dev.js`: Electron main process (window, settings, DB seeding).
  `app/app.js`: renderer entry.
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

- `node_modules` uses `node-linker=hoisted` (`.npmrc`) because Electron,
  electron-builder 19, and the `module.globalPaths` hack in `main.dev.js`
  expect a flat layout. `auto-install-peers=false` keeps the unused `node-sass`
  peer out.
- pnpm 10 blocks install scripts. Only `electron` is allowed, via
  `pnpm.onlyBuiltDependencies` in the root `package.json`.
- webpack 3 needs `--openssl-legacy-provider` on Node ≥17. It's passed on the
  `node` command line in the `build`/`dev` scripts, **not** via `NODE_OPTIONS`,
  because Electron rejects that flag in `NODE_OPTIONS`.
- SCSS compiles with dart-sass (`sass`) through sass-loader 7's `implementation`
  option. Loader options that hold functions or objects need a unique `ident`,
  or webpack 3 tries to JSON-serialize them into the request string.
  `jsonImporter()` is a factory: call it.
- Electron was bumped to 37, but the app code targets Electron 1.7. `pnpm build`
  works, but the app doesn't run yet. Electron's Node loads `app/main.dev.js`
  as ESM before babel-register can transpile it. Beyond that, expect
  `nodeIntegration`/`contextIsolation`, `remote`, and electron-settings v2
  issues.

## Style

- The webpack configs use comma-first object and array literals. Match that.
- JS/JSX uses 2-space indentation, single quotes, and ES module imports.
