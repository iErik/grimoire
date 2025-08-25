import { createRequire } from "node:module";
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __moduleCache = /* @__PURE__ */ new WeakMap;
var __toCommonJS = (from) => {
  var entry = __moduleCache.get(from), desc;
  if (entry)
    return entry;
  entry = __defProp({}, "__esModule", { value: true });
  if (from && typeof from === "object" || typeof from === "function")
    __getOwnPropNames(from).map((key) => !__hasOwnProp.call(entry, key) && __defProp(entry, key, {
      get: () => from[key],
      enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
    }));
  __moduleCache.set(from, entry);
  return entry;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
var __require = /* @__PURE__ */ createRequire(import.meta.url);

// app/reducers/notebooksReducer.js
import { find, sortBy, reject } from "underscore";
function notebooksReducer(state = initialState, { type, payload }) {
  switch (type) {
    case "CREATE_NOTEBOOK_FULFILLED":
      return {
        ...state,
        notebooks: [...state.notebooks, payload]
      };
    case "UPDATE_NOTEBOOK_FULFILLED":
      return {
        ...state,
        notebooks: [
          ...reject(state.notebooks, (notebook) => notebook._id === payload._id),
          payload
        ],
        activeNotebook: payload._id === state.activeNotebook._id ? payload : { ...state.activeNotebook }
      };
    case "DELETE_NOTEBOOK_FULFILLED":
      return {
        ...state,
        notebooks: reject(state.notebooks, ({ _id }) => _id === payload._id),
        activeNotebook: payload._id === state.activeNotebook._id ? find(sortBy(state.notebooks, (notebook) => -new Date(notebook.createdAt).getTime()), (notebook) => notebook._id !== payload._id) || {} : { ...state.activeNotebook }
      };
    case "CHANGE_ACTIVE_NOTEBOOK":
      return {
        ...state,
        activeNotebook: find(state.notebooks, ({ _id }) => _id === payload._id)
      };
    default:
      return state;
  }
}
var initialState;
var init_notebooksReducer = __esm(() => {
  initialState = {
    notebooks: [],
    activeNotebook: {}
  };
});

// app/reducers/settingsReducer.js
function settingsReducer(state = initialState2, { type, payload }) {
  switch (type) {
    case "UPDATE_SETTINGS_KEYPATH_FULFILLED":
      return payload;
    default:
      return state;
  }
}
var initialState2;
var init_settingsReducer = __esm(() => {
  initialState2 = {
    runInitialSetup: undefined,
    appTheme: undefined,
    editorFontSize: undefined,
    editorFontFamily: undefined,
    editorTheme: undefined
  };
});

// app/reducers/notesReducer.js
import { find as find2, sortBy as sortBy2, reject as reject2 } from "underscore";
function notesReducer(state = initialState3, { type, payload }) {
  switch (type) {
    case "CREATE_NOTE_FULFILLED":
      return {
        ...state,
        notes: [...state.notes, payload]
      };
    case "UPDATE_NOTE_FULFILLED":
      return {
        ...state,
        notes: [
          ...reject2(state.notes, (note) => note._id === payload._id),
          payload
        ],
        selectedNote: payload._id === state.selectedNote._id ? payload : { ...state.selectedNote }
      };
    case "DELETE_NOTE_FULFILLED":
      return {
        ...state,
        notes: reject2(state.notes, (note) => note._id === payload._id),
        selectedNote: payload._id === state.selectedNote._id ? find2(sortBy2(state.notes, (note) => -new Date(note.createdAt).getTime()), (note) => note.notebookId === payload.notebookId && note._id !== payload._id) || {} : { ...state.selectedNote }
      };
    case "CHANGE_SELECTED_NOTE":
      return {
        ...state,
        selectedNote: find2(state.notes, (note) => note._id === payload._id) || {}
      };
    case "CHANGE_ACTIVE_NOTEBOOK":
      return {
        ...state,
        selectedNote: find2(sortBy2(state.notes, (note) => -new Date(note.createdAt).getTime()), (note) => note.notebookId === payload._id) || {}
      };
    default:
      return state;
  }
}
var initialState3;
var init_notesReducer = __esm(() => {
  initialState3 = {
    notes: [],
    selectedNote: undefined
  };
});

// app/reducers/index.js
var exports_reducers = {};
__export(exports_reducers, {
  default: () => createRootReducer
});
import { innerReducer as initialStateReducer } from "redux-async-initial-state";
import { routerReducer } from "react-router-redux";
import { reducer as uiReducer } from "redux-ui";
import { combineReducers } from "redux";
function createRootReducer(scope = "main") {
  return scope === "main" ? combineReducers({
    initialState: initialStateReducer,
    notebooks: notebooksReducer,
    settings: settingsReducer,
    notes: notesReducer
  }) : combineReducers({
    initialState: initialStateReducer,
    notebooks: notebooksReducer,
    settings: settingsReducer,
    routing: routerReducer,
    notes: notesReducer,
    ui: uiReducer
  });
}
var init_reducers = __esm(() => {
  init_notebooksReducer();
  init_settingsReducer();
  init_notesReducer();
});

// app/main.dev.js
import { app as app3, BrowserWindow, ipcMain, Menu } from "electron";
import settings from "electron-settings";
// app/config/settings.json
var settings_default = {
  runInitialSetup: true,
  appTheme: "aurora",
  editorFontSize: 14,
  editorTheme: {
    light: {
      name: "kuroir",
      label: "Kuroir"
    },
    dark: {
      name: "tomorrow_night_eighties",
      label: "Tomorrow Night 80s"
    }
  }
};

// app/database/seeds/index.js
import { omit, pick, map, each } from "underscore";

// app/database/collections/notebooks.js
import path from "path";
import Datastore from "nedb";
import electron from "electron";
import { promisify, promisifyAll } from "bluebird";
var app = electron.remote ? electron.remote.app : electron.app;
var dbPath = path.join(app.getPath("userData"), "storage/notebooks.db");
var Notebooks = new Datastore({
  filename: dbPath,
  timestampData: true,
  autoload: true
});
Notebooks.updateAsync = promisify(Notebooks.update, {
  multiArgs: true,
  context: Notebooks
});
var notebooks_default = promisifyAll(Notebooks, { filter: (name) => name !== "update" });

// app/database/collections/notes.js
import path2 from "path";
import Datastore2 from "nedb";
import electron2 from "electron";
import { promisify as promisify2, promisifyAll as promisifyAll2 } from "bluebird";
var app2 = electron2.remote ? electron2.remote.app : electron2.app;
var dbPath2 = path2.join(app2.getPath("userData"), "storage/notes.db");
var Notes = new Datastore2({
  filename: dbPath2,
  timestampData: true,
  autoload: true
});
Notes.updateAsync = promisify2(Notes.update, {
  multiArgs: true,
  context: Notes
});
var notes_default = promisifyAll2(Notes, { filter: (name) => name !== "update" });

// app/database/seeds/notebooks.json
var notebooks_default2 = [
  {
    name: "First Notebook",
    _id: "9Ek6lhtzcd5r4H2B"
  }
];

// app/database/seeds/notes.json
var notes_default2 = [
  {
    title: "Second Note",
    contents: "",
    notebookId: "9Ek6lhtzcd5r4H2B"
  },
  {
    title: "First Note",
    contents: "",
    notebookId: "9Ek6lhtzcd5r4H2B"
  }
];

// app/database/seeds/index.js
async function runSeeders() {
  await notebooksSeeder(notebooks_default2);
  await notesSeeder(notes_default2);
}
async function notebooksSeeder(notebooks) {
  await notebooks_default.removeAsync.call(notebooks_default, {});
  await notebooks_default.insertAsync.call(notebooks_default, notebooks);
}
async function notesSeeder(notes) {
  await notes_default.removeAsync.call(notes_default, {});
  await notes_default.insertAsync.call(notes_default, notes);
}

// app/main.dev.js
import { fileURLToPath } from "url";
import { dirname } from "path";
var __filename2 = fileURLToPath(import.meta.url);
var __dirname2 = dirname(__filename2);
var mainWindow = null;
if (false) {}
if (true) {
  __require("electron-debug")();
  const path3 = __require("path");
  const modulesPath = path3.join(__dirname2, "..", "app", "node_modules");
  __require("module").globalPaths.push(modulesPath);
}
var installExtensions = async () => {
  if (true) {
    const installer = __require("electron-devtools-installer");
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = [
      "REACT_DEVELOPER_TOOLS",
      "REDUX_DEVTOOLS"
    ];
    return Promise.all(extensions.map((name) => installer.default(installer[name], forceDownload))).catch(console.log);
  }
};
var initialSetup = async () => {
  settings.defaults(settings_default);
  if (await settings.get("runInitialSetup")) {
    await runSeeders();
    await settings.set("runInitialSetup", false);
  }
};
async function openMainWindow() {
  await installExtensions();
  await initialSetup();
  const entryFile = `file://${__dirname2}/app.dev.html`;
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 660,
    minWidth: 960,
    minHeight: 260,
    show: false,
    frame: false,
    hasShadow: true
  });
  mainWindow.loadURL(entryFile);
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.show();
    mainWindow.focus();
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  ipcMain.on("renderer-reload", (ev, action) => {
    delete __require.cache[__require.resolve("/mnt/BigBish/Code/Git/JavaScript/grimoire/app/reducers/index.js")];
    store.replaceReducer((init_reducers(), __toCommonJS(exports_reducers)));
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
