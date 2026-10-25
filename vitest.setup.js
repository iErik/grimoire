import { vi } from 'vitest'

// No test may reach the real Electron APIs. Every test gets these
// stubs in place of the 'electron' module.
vi.mock('electron', () => {
  const getPath = vi.fn(name => `/electron-stub/${name}`)

  const BrowserWindow = vi.fn(function BrowserWindow(options) {
    this.options = options
    this.loadURL = vi.fn()
    this.on = vi.fn()
    this.once = vi.fn()
    this.show = vi.fn()
    this.close = vi.fn()
  })

  const electron = {
    app: { getPath },
    remote: { app: { getPath } },
    BrowserWindow
  }

  return { ...electron, default: electron }
})
