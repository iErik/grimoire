import { watch } from 'fs'
import { resolve } from 'path'
import { spawn } from 'child_process'

import { createServer } from 'vite'
import electron from 'electron'



const ROOT_DIR = process.cwd()
const APP_DIR = resolve(ROOT_DIR, 'app')
const OUT_DIR = resolve(ROOT_DIR, 'dist')

const BACKEND_ENTRY = resolve(APP_DIR, 'main.dev.js')
const PRELOAD_ENTRY = resolve(APP_DIR, 'preload.ts')


const buildBackend = () => Bun.build({
  entrypoints: [ BACKEND_ENTRY ],
  target: 'node',
  packages: 'external',
  format: 'esm',
  outdir: OUT_DIR
})


const buildFrontend = () => createServer({
  configFile: `${ROOT_DIR}/vite.config.js`
})


const runElectron = (viteServer) => {
  let electronProcess = null
  let building = false

  const triggerBuildAndRun = async() => {
    if (building) return

    building = true
    await Promise.all([
      buildBackend(),
    ])

    if (electronProcess)
      electronProcess.kill()

    electronProcess = spawn(electron, [
      resolve(OUT_DIR, 'main.dev.js')
    ])

    viteServer.ws.send({ type: 'full-reload' })
    building = false
  }

  triggerBuildAndRun()

  watch(
    BACKEND_ENTRY,
    { recursive: false },
    triggerBuildAndRun
  )
}


const runDevServer = async () => {
  const viteServer = await buildFrontend()

  await viteServer.listen()
  console.log('Vite server running i guess')
  runElectron(viteServer)
  console.log('electron running i guess')
}

runDevServer()
