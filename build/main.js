import { createRequire } from "node:module";
var __require = /* @__PURE__ */ createRequire(import.meta.url);

// app/main.ts
import { resolve } from "path";
import { app, BrowserWindow } from "electron";
var ROOT_DIR = process.cwd();
var APP_DIR = resolve(ROOT_DIR, "app");
var createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 1200,
    autoHideMenuBar: true
  });
  if (app.isPackaged) {
    win.loadFile(resolve(APP_DIR, "index.html"));
  } else {
    const pkg = __require(`${ROOT_DIR}/package.json`);
    const host = pkg?.env?.HOST || "127.0.0.1";
    const port = pkg?.env?.PORT || 3000;
    const url = `http://${host}:${port}`;
    win.loadURL(url);
  }
};
app.whenReady().then(() => {
  createWindow();
});
