// app/main.dev.js
import { app as app3, BrowserWindow, ipcMain, Menu } from "electron";
import settings from "electron-settings";
// app/database/seeds/index.js
import { omit, pick, map, each } from "underscore";

// app/database/collections/notebooks.js
import path from "path";
import Datastore from "nedb";
import electron from "electron";
import Bluebird from "bluebird";
var app = electron.remote ? electron.remote.app : electron.app;
var dbPath = path.join(app.getPath("userData"), "storage/notebooks.db");
var Notebooks = new Datastore({
  filename: dbPath,
  timestampData: true,
  autoload: true
});
Notebooks.updateAsync = Bluebird.promisify(Notebooks.update, {
  multiArgs: true,
  context: Notebooks
});
var notebooks_default = Bluebird.promisifyAll(Notebooks, { filter: (name) => name !== "update" });

// app/database/collections/notes.js
import path2 from "path";
import Datastore2 from "nedb";
import electron2 from "electron";
import Bluebird2 from "bluebird";
var app2 = electron2.remote ? electron2.remote.app : electron2.app;
var dbPath2 = path2.join(app2.getPath("userData"), "storage/notes.db");
var Notes = new Datastore2({
  filename: dbPath2,
  timestampData: true,
  autoload: true
});
Notes.updateAsync = Bluebird2.promisify(Notes.update, {
  multiArgs: true,
  context: Notes
});
var notes_default = Bluebird2.promisifyAll(Notes, { filter: (name) => name !== "update" });
// app/main.dev.js
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createRequire } from "module";
// package.json
var package_default = {
  name: "grimoire",
  productName: "Grimoire",
  repository: "iErik/grimoire",
  version: "1.0.0-beta.1",
  license: "GPL-2.0-only",
  type: "module",
  author: {
    name: "Erik Isidore",
    email: "ericssonico@protonmail.ch",
    url: "https://github.com/ierik"
  },
  bugs: {
    url: "https://gitlab.com/Isidore/Grimoire/issues"
  },
  env: {
    PORT: 3000,
    WS: 3001,
    HOST: "127.0.0.1"
  },
  scripts: {
    build: "node -r babel-register build/build.js",
    dev: "node scripts/dev-server.js",
    "start-dev": "cross-env NODE_ENV=development electron -r babel-register -r babel-polyfill ./app/main.dev",
    "build:pack": "npm run build && node_modules/.bin/electron-builder",
    "build:pack:multi": "npm run build && node_modules/.bin/electron-builder -mlw --x64",
    "build:pack:mac": "npm run build && node_modules/.bin/electron-builder --mac --x64",
    "build:pack:win": "npm run build && node_modules/.bin/electron-builder --win --x64",
    "build:pack:linux": "npm run build && node_modules/.bin/electron-builder --linux --x64"
  },
  build: {
    productName: "Grimoire",
    artifactName: "${productName} Beta.${ext}",
    appId: "org.isidore.Grimoire",
    directories: {
      buildResources: "resources",
      output: "release",
      app: "app"
    },
    files: [
      "assets/",
      "app.html",
      "main.js",
      "package.json",
      "yarn.lock"
    ],
    mac: {
      category: "public.app-category.productivity",
      target: "zip"
    },
    linux: {
      category: "TextEditor",
      target: [
        {
          target: "AppImage",
          arch: [
            "x64"
          ]
        },
        {
          target: "deb",
          arch: [
            "x64"
          ]
        },
        {
          target: "rpm",
          arch: [
            "x64"
          ]
        }
      ]
    },
    win: {
      target: "portable"
    }
  },
  devDependencies: {
    "@vitejs/plugin-react": "^5.0.1",
    "cross-env": "5.1.3",
    devtron: "^1.4.0",
    electron: "^37.3.1",
    "electron-builder": "^26.0.12",
    "electron-debug": "^4.1.0",
    "electron-devtools-installer": "^4.0.0",
    ora: "^1.1.0",
    "redux-logger": "^2.8.1",
    "sass-embedded": "^1.90.0",
    shelljs: "0.8.0",
    vite: "^7.1.3",
    "vite-plugin-externalize-dependencies": "^1.0.1"
  },
  dependencies: {
    bluebird: "^3.4.7",
    brace: "0.11.0",
    classnames: "^2.2.5",
    "electron-settings": "~4.0.4",
    "foundation-sites": "~6.3.0",
    history: "^4.7.2",
    "markdown-it": "^8.3.1",
    moment: "^2.17.1",
    nedb: "^1.8.0",
    "prop-types": "^15.6.0",
    react: "16.2.0",
    "react-ace": "5.9.0",
    "react-dom": "16.2.0",
    "react-redux": "^5.0.2",
    "react-router-dom": "^4.2.2",
    "react-router-redux": "^5.0.0-alpha.9",
    redux: "^3.6.0",
    "redux-async-initial-state": "^0.3.0",
    "redux-electron-store": "0.4.1",
    "redux-saga": "0.16.0",
    "redux-ui": "0.1.1",
    "source-map-support": "0.5.2",
    "to-markdown": "^3.0.3",
    underscore: "^1.8.3"
  }
};

// app/main.dev.js
var __filename2 = fileURLToPath(import.meta.url);
var __dirname2 = dirname(__filename2);
var require2 = createRequire(import.meta.url);
var mainWindow = null;
if (false) {}
async function openMainWindow() {
  console.log("doing something weird");
  const entryFile = `file://${__dirname2}/app.dev.html`;
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 660,
    minWidth: 960,
    minHeight: 260,
    frame: false,
    hasShadow: true
  });
  if (app3.isPackaged) {
    win.loadFile(resolve(ROOT_DIR, "index.html"));
    console.log("app is packaged");
  } else {
    console.log({ pkg: package_default });
    const host = package_default?.env?.HOST || "127.0.0.1";
    const port = package_default?.env?.PORT || 3000;
    const url = `http://${host}:${port}`;
    win.loadURL(url);
  }
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.show();
    mainWindow.focus();
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  ipcMain.on("renderer-reload", (ev, action) => {
    delete require2.cache[require2.resolve("./reducers")];
    store.replaceReducer(require2("./reducers"));
    ev.returnValue = true;
  });
  if (true) {
    mainWindow.webContents.on("context-menu", (e, props) => {
      const { x, y } = props;
      Menu.buildFromTemplate([{
        label: "Inspect element",
        click: function() {
          mainWindow.inspectElement(x, y);
        }
      }]).popup(mainWindow);
    });
  }
}
app3.whenReady().then(openMainWindow);
app3.on("activate", () => {
  if (mainWindow === null)
    openMainWindow();
});
app3.on("window-all-closed", () => {
  if (process.platform !== "darwin")
    app3.quit();
});
