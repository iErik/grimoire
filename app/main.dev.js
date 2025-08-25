import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import settings from 'electron-settings'
import defaults from './config/settings.json'

//import configureStore from './store/configureStore.js'
import runSeeders from './database/seeds/index.js'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { createRequire } from 'module'

import pkg from '../package.json'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const require = createRequire(import.meta.url)

let mainWindow = null

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support')
  sourceMapSupport.install()
}

/*
if (process.env.NODE_ENV === 'development') {
  require('electron-debug')()

  // Since we'll be loading our main script from a development server
  // using the https protocol, and Node's module system is supposed
  // to work only with the filesystem, we have to manually add our
  // locally installed modules to Electron's globalPath property.
  // By the way, Electron does a little bit of hacking with Node's
  // module system and I find that there is little information
  // about that online.

  const path = require('path')
  const modulesPath = path.join(__dirname, '..', 'app', 'node_modules')
  require('module').globalPaths.push(modulesPath)
}

const installExtensions = async () => {
  if (process.env.NODE_ENV === 'development') {
    const installer = require('electron-devtools-installer')
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS

    const extensions = [
      'REACT_DEVELOPER_TOOLS',
      'REDUX_DEVTOOLS'
    ];

    return Promise
      .all(extensions.map(
        name => installer.default(installer[name], forceDownload)))
      .catch(console.log)
  }
};
*/

const initialSetup = async () => {
  settings.defaults(defaults)

  if (await settings.get('runInitialSetup')) {
    await runSeeders()
    await settings.set('runInitialSetup', false)
  }
}

async function openMainWindow() {
  //await installExtensions()
  //await initialSetup()

  console.log('doing something weird')
  //const store = configureStore('main');
  const entryFile = process.env.NODE_ENV === 'development'
    ? `file://${__dirname}/app.dev.html`
    : `file://${__dirname}/app.html`

  mainWindow = new BrowserWindow({
    width: 1080,
    height: 660,
    minWidth: 960,
    minHeight: 260,

    //show: false,
    frame: false,
    hasShadow: true
  })


  if (app.isPackaged) {
    win.loadFile(resolve(ROOT_DIR, 'index.html'))
    console.log('app is packaged')
  } else {
    //const pkg = require(`${ROOT_DIR}/package.json`)
    console.log({ pkg })
    const host = pkg?.env?.HOST || '127.0.0.1'
    const port = pkg?.env?.PORT || 3000
    const url = `http://${host}:${port}`

    win.loadURL(url)
  }
  //mainWindow.loadURL(entryFile)

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  ipcMain.on('renderer-reload', (ev, action) => {
    delete require.cache[require.resolve('./reducers')];
    store.replaceReducer(require('./reducers'));
    ev.returnValue = true;
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.on('context-menu', (e, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([{
        label: 'Inspect element',
        click: function() {
          mainWindow.inspectElement(x, y);
        }
      }]).popup(mainWindow);
    })
  }
}

app.whenReady().then(openMainWindow)

app.on('activate', () => {
  if (mainWindow === null)
    openMainWindow();
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin')
    app.quit()
})
