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
```

There are no tests or linters.

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

- The webpack configs use comma-first object and array literals. Match that.
- JS/JSX uses 2-space indentation, single quotes, and ES module imports.
