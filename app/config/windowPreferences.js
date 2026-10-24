// The renderer is written against Electron 1.x semantics: it uses Node APIs
// directly and reaches the main process through `remote`, so every window
// needs Node integration and a shared JS context.
export default {
  nodeIntegration: true,
  contextIsolation: false
};
