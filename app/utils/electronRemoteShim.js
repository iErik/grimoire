// `remote` was removed from Electron in v14. The app and some of its
// dependencies (redux-electron-store, electron-settings) still reach for
// `require('electron').remote`, so put @electron/remote back in its place.
// Must be imported before anything that touches `remote`.
import electron from 'electron'

if (!electron.remote)
  electron.remote = require('@electron/remote')
