import { watch } from 'fs'
import { resolve } from 'path'
import { type ChildProcess, spawn } from 'child_process'

import { type ViteDevServer, createServer } from 'vite'
import electron from 'electron'


const ROOT_DIR = process.cwd()
const APP_DIR = resolve(ROOT_DIR, 'app')
const OUT_DIR = resolve(ROOT_DIR, 'build')

const BACKEND_ENTRY = resolve(APP_DIR, 'main.ts')
const PRELOAD_ENTRY = resolve(APP_DIR, 'preload.ts')


const buildBackend = () => Bun.build({
  entrypoints: [ BACKEND_ENTRY ],
  target: 'node',
  packages: 'external',
  outdir: OUT_DIR
})

const buildPreload = () => Bun.build({
  entrypoints: [ PRELOAD_ENTRY ],
  target: 'node',
  packages: 'external',
  naming: '[name].cjs',
  format: 'cjs',
  outdir: OUT_DIR
})

const watchBackend = async(server: ViteDevServer) => {
  let electronProcess: ChildProcess | null = null
  let building = false

  const triggerBuildAndRun = async() => {
    if (building) return

    building = true
    await Promise.all([
      buildBackend(),
      buildPreload()
    ])

    if (electronProcess)
      electronProcess.kill()

    electronProcess = spawn(electron, [
      resolve(OUT_DIR, 'main.js')
    ])

    server.ws.send({ type: 'full-reload' })
    building = false
  }

  triggerBuildAndRun()

  watch(
    BACKEND_ENTRY,
    { recursive: false },
    triggerBuildAndRun
  )
}

const runServer = async (): Promise<undefined> => {
  const server = await createServer({
    configFile: `${ROOT_DIR}/vite.config.ts`
  })

  await server.listen()
  watchBackend(server)
}

runServer()
