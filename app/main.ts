import { resolve } from 'path'
import { app, BrowserWindow } from 'electron'

const ROOT_DIR = process.cwd()
const APP_DIR = resolve(ROOT_DIR, 'app')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 1200,
    autoHideMenuBar: true,
  })

  if (app.isPackaged) {
    win.loadFile(resolve(APP_DIR, 'index.html'))
  } else {
    const pkg = require(`${ROOT_DIR}/package.json`)
    const host = pkg?.env?.HOST || '127.0.0.1'
    const port = pkg?.env?.PORT || 3000
    const url = `http://${host}:${port}`

    win.loadURL(url)
  }
}


app.whenReady().then(() => {
  createWindow()
})
