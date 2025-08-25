import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { app, BrowserWindow, ipcMain, Menu } from 'electron'


let mainWindow = null

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log({__dirname})
async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 660,
    minWidth: 960,
    minHeight: 260,

    frame: false,
    hasShadow: true
  })

  mainWindow.loadURL(`file://${__dirname}/app.test.html`)

  /*
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show()
    mainWindow.focus()
  })
  */

  mainWindow.on('closed', () => {
    mainWindow = null
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

app.whenReady().then(createWindow)

app.on('activate', () => {
  if (mainWindow === null)
    createWindow();
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin')
    app.quit()
})
