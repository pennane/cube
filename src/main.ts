import './main.css'
import { readModels } from './renderer/models/readModels'

import { createPerformanceMonitor } from './performance'

import { createRenderingContext, Matrix, nextFrame, Types } from './renderer'

const CAMERA_DISTANCE = 3.5
const CANVAS_SIZE = 500

const app = document.getElementById('app')!
const canvas = document.createElement('canvas')
app.appendChild(canvas)

const dpr = window.devicePixelRatio
const renderingContext = canvas.getContext('2d', { alpha: false })!

canvas.width = CANVAS_SIZE * dpr
canvas.height = CANVAS_SIZE * dpr

const performanceMonitor = createPerformanceMonitor(app, { enabled: false })

const models = await readModels()

const objects: Types.Object3D[] = [
  {
    model: models.cube,
    transform: Matrix.translate({ x: 2, y: 0, z: 0 })
  },
  {
    model: models.cube,
    transform: Matrix.translate({ x: -2, y: 0, z: 0 })
  },
  {
    model: models.cube,
    transform: Matrix.translate({ x: 0, y: 2, z: 0 })
  },
  {
    model: models.cube,
    transform: Matrix.translate({ x: 0, y: -2, z: 0 })
  },
  {
    model: models.teapot,
    transform: Matrix.multiply(
      Matrix.translate({ x: 0, y: 0, z: 0 }),
      Matrix.scaleUniformly(0.25),
      Matrix.rotateX(0.4)
    )
  }
]

const ctx = createRenderingContext({
  ctx: renderingContext,
  objects,
  cameraDistance: CAMERA_DISTANCE
})

let lastTime: number | null = null

const loop = (time: number) => {
  if (lastTime === null) lastTime = time

  const deltaMs = time - lastTime

  lastTime = time

  const frameStart = performance.now()
  nextFrame(ctx, deltaMs)
  performanceMonitor.recordFrame(performance.now() - frameStart)

  ctx.frameBuffers.triangleIndices.set(ctx.frameBuffers.initialTriangleIndices)
  requestAnimationFrame(loop)
}

requestAnimationFrame(loop)
