import { shape } from './canvas'
import './main.css'
import {
  multiply,
  rotateXYZ,
  rotateY,
  toVec4,
  transformVec4,
  transformVec3,
  translationMatrix,
  facesPoint,
  Vec2,
  Vec3,
  perspectiveDivide,
  project
} from './math'
import { getModels, Model } from './models/models'
import { createPerformanceMonitor } from './performance'

const CANVAS_SIZE = 500
const CAMERA_DISTANCE = 10
const FOCAL_LENGTH = 3
const WORLD_SIZE: Vec2 = { x: CANVAS_SIZE, y: CANVAS_SIZE }

const app = document.getElementById('app')!
const perfMonitor = createPerformanceMonitor(app, { enabled: false })
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')!

canvas.width = WORLD_SIZE.x
canvas.height = WORLD_SIZE.y
app.appendChild(canvas)

let camera: Float32Array = translationMatrix({
  x: 0,
  y: 0,
  z: -CAMERA_DISTANCE
})

let shapes: Model[] = []

const toWorldSpace = (shapes: Model[]): Vec3[][] =>
  shapes.flatMap((shape) =>
    shape.triangles.map((triangle) =>
      triangle.map((vertex) => transformVec3(shape.matrix, vertex))
    )
  )

const toCameraSpace = (triangles: Vec3[][], camera: Float32Array): Vec3[][] =>
  triangles.map((vertices) =>
    vertices.map((vertex) =>
      perspectiveDivide(transformVec4(camera, toVec4(vertex)))
    )
  )

const cullBackfaces = (triangles: Vec3[][]): Vec3[][] => {
  // In camera space, camera is at origin
  const facesCamera = facesPoint({ x: 0, y: 0, z: 0 })
  return triangles.filter((triangle) => facesCamera(triangle))
}

const sortByDepth = (triangles: Vec3[][]): Vec3[][] => {
  return triangles.toSorted((a, b) => {
    const avgZA = (a[0].z + a[1].z + a[2].z) / 3
    const avgZB = (b[0].z + b[1].z + b[2].z) / 3
    return avgZA - avgZB
  })
}

const projectToScreen = (
  triangles: Vec3[][],
  worldSize: Vec2,
  focalLength: number
): Vec2[][] =>
  triangles.map((triangle) =>
    triangle.map((vertex) => project(worldSize, vertex, focalLength))
  )

const toScreenSpace = (
  cameraSpace: Vec3[][],
  worldSize: Vec2,
  focalLength: number
): Vec2[][] => {
  const visible = cullBackfaces(cameraSpace)
  const sorted = sortByDepth(visible)
  return projectToScreen(sorted, worldSize, focalLength)
}

const render = (triangles: Vec2[][]) => {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
  for (const triangle of triangles) {
    shape(ctx, triangle)
  }
}

const updateAnimations = (deltaMs: number) => {
  const angle = deltaMs / 1000
  const cubeRotation = rotateXYZ({ x: angle, y: angle, z: 0 })
  const teapotRotation = rotateXYZ({ x: -angle, y: angle, z: angle })

  shapes.forEach((s) => {
    s.matrix = multiply(
      s.type === 'cube' ? cubeRotation : teapotRotation,
      s.matrix
    )
  })
}

const updateCamera = (deltaMs: number) => {
  const angle = deltaMs / 1000
  camera = multiply(rotateY(angle), camera)
}

const frame = (deltaMs: number) => {
  updateAnimations(deltaMs)
  updateCamera(deltaMs)

  const worldSpace = toWorldSpace(shapes)
  const cameraSpace = toCameraSpace(worldSpace, camera)
  const screenSpace = toScreenSpace(cameraSpace, WORLD_SIZE, FOCAL_LENGTH)
  render(screenSpace)
}

let lastTime: number | null = null
const loop = (time: number) => {
  if (lastTime === null) lastTime = time

  const deltaMs = time - lastTime
  lastTime = time

  const frameStart = performance.now()
  frame(deltaMs)
  const frameEnd = performance.now()
  perfMonitor.recordFrame(frameEnd - frameStart)

  requestAnimationFrame(loop)
}

getModels().then((loadedShapes) => {
  shapes = loadedShapes
  requestAnimationFrame(loop)
})
