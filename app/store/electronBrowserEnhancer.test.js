import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  beforeEach,
  afterAll
} from 'vitest'
import { createRequire } from 'node:module'
import { createStore } from 'redux'
import * as electron from 'electron'

// The main-process side of redux-electron-store, with the fix from
// app/patches/redux-electron-store@0.4.1.patch.

const { ipcMain, BrowserWindow } = electron
const prefix = '__REDUX_ELECTRON_STORE__'

vi.mock('electron', () => {
  const handlers = {}
  const ipcMain = {
    handlers,
    on: vi.fn((channel, handler) => {
      handlers[channel] = handler
    })
  }
  const BrowserWindow = { fromWebContents: vi.fn() }
  const electron = { ipcMain, BrowserWindow }

  return { ...electron, default: electron }
})

const makeWindow = id => ({ id, on: vi.fn() })

const makeWebContents = (id, window) => ({
  id,
  window,
  send: vi.fn(),
  getType: () => 'window',
  isDestroyed: () => false,
  isCrashed: () => false
})

const register = webContents =>
  ipcMain.handlers[`${prefix}-register-renderer`](
    { sender: webContents },
    { filter: true, clientId: `client-${webContents.id}` }
  )

const reducer = (state = { count: 0 }, action) =>
  action.type === 'INCREMENT'
    ? { count: state.count + 1 }
    : state

const increment = store => store.dispatch({ type: 'INCREMENT' })

// The enhancer is CommonJS in node_modules, so it loads electron
// with Node's own require, which vi.mock doesn't reach. Put the
// mock in Node's module cache for the path that require resolves
// to, so the real electron module is never loaded.
const require = createRequire(import.meta.url)
const enhancerPath = require.resolve(
  'redux-electron-store/lib/electronBrowserEnhancer'
)
const electronPath = createRequire(enhancerPath).resolve('electron')

describe('electronBrowserEnhancer', () => {
  let electronBrowserEnhancer
  let store

  beforeAll(() => {
    require.cache[electronPath] = {
      id: electronPath,
      filename: electronPath,
      loaded: true,
      exports: electron
    }
    electronBrowserEnhancer = require(enhancerPath).default
  })

  afterAll(() => {
    delete require.cache[enhancerPath]
    delete require.cache[electronPath]
  })

  beforeEach(() => {
    vi.clearAllMocks()
    BrowserWindow.fromWebContents.mockImplementation(
      webContents => webContents.window
    )
    store = createStore(reducer, electronBrowserEnhancer())
  })

  it('keeps sending to a window that registers again', () => {
    const window = makeWindow(1)
    const webContents = makeWebContents(10, window)

    register(webContents)
    // A reload keeps the same webContents and registers again.
    register(webContents)
    increment(store)

    expect(webContents.send).toHaveBeenCalledTimes(1)
    expect(webContents.send).toHaveBeenCalledWith(
      `${prefix}-browser-dispatch`,
      expect.objectContaining({ sourceClientId: 'main_process' })
    )
  })

  it('replaces a window\'s old webContents with a new one', () => {
    const window = makeWindow(1)
    const oldWebContents = makeWebContents(10, window)
    const newWebContents = makeWebContents(11, window)

    register(oldWebContents)
    register(newWebContents)
    increment(store)

    expect(oldWebContents.send).not.toHaveBeenCalled()
    expect(newWebContents.send).toHaveBeenCalledTimes(1)
  })

  it('listens for a window\'s close only once', () => {
    const window = makeWindow(1)
    const webContents = makeWebContents(10, window)

    register(webContents)
    register(webContents)
    register(webContents)

    const closedCalls = window.on.mock.calls
      .filter(([event]) => event === 'closed')
    expect(closedCalls).toHaveLength(1)
  })

  it('stops sending to a window once it closes', () => {
    const window = makeWindow(1)
    const oldWebContents = makeWebContents(10, window)
    const newWebContents = makeWebContents(11, window)

    register(oldWebContents)
    register(newWebContents)
    const [, onClosed] = window.on.mock.calls
      .find(([event]) => event === 'closed')
    onClosed()
    increment(store)

    expect(newWebContents.send).not.toHaveBeenCalled()
  })
})
