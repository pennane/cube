import './main.css'
import {
  getPosition,
  multiply,
  multiplyN,
  rotateXYZ,
  rotateY,
  toVec4,
  transformPoint,
  transformPointInto,
  translationMatrix
} from './matrix'
import { getShapes } from './shapes/shapes'
import { facesPoint, length, sub, Vec2, Vec3 } from './vec'
const app = document.getElementById('app')!
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')!
const CANVAS_SIZE = 500

canvas.width = CANVAS_SIZE
canvas.height = CANVAS_SIZE
app.appendChild(canvas)

const shape = (ps: Vec2[]) => {
  ctx.beginPath()
  ctx.moveTo(ps[0].x, ps[0].y)
  for (let i = 0; i < ps.length; i++) {
    const p = ps[(i + 1) % ps.length]
    ctx.lineTo(p.x, p.y)
  }
  ctx.closePath()
  ctx.fillStyle = 'rgba(255, 255, 0, 1)'
  ctx.fill()

  ctx.strokeStyle = 'red'
  ctx.stroke()
}

let camera: Float32Array = translationMatrix({ x: 0, y: 0, z: -10 })

const worldToScreen = (point: Vec3, camera: Float32Array) => {
  let { x, y, z, w } = transformPoint(camera, toVec4(point))

  x /= w
  y /= w
  z /= w

  const f = 2 / z
  return {
    x: ((x * f + 1) * CANVAS_SIZE) / 2,
    y: ((1 - y * f) * CANVAS_SIZE) / 2
  }
}

let lastTime: number | null = null

const shapes = getShapes()
const modelMatrices: Float32Array[] = shapes.map((shape) =>
  multiplyN(rotateXYZ(shape.rotation), translationMatrix(shape.position))
)

const transformedTriangles = shapes.flatMap((shape, shapeIndex) =>
  shape.triangles.map((tri, triIndex) => ({
    shapeIndex,
    triIndex,
    vertices: [{ ...tri[0] }, { ...tri[1] }, { ...tri[2] }]
  }))
)

const draw = (deltaMs: number) => {
  const angle = deltaMs / 1000

  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

  shapes.forEach((s, i) => {
    if (s.type === 'cube') {
      modelMatrices[i] = multiply(
        rotateXYZ({ x: angle, y: angle, z: 0 }),
        modelMatrices[i]
      )
    } else if (s.type === 'teapot') {
      modelMatrices[i] = multiply(
        rotateXYZ({ x: -angle, y: angle, z: angle }),
        modelMatrices[i]
      )
    }
  })

  const camPos = getPosition(camera)
  camera = multiply(rotateY(angle), camera)

  transformedTriangles.forEach((t) => {
    const m = modelMatrices[t.shapeIndex]
    const orig = shapes[t.shapeIndex].triangles[t.triIndex]
    for (let i = 0; i < 3; i++) {
      transformPointInto(orig[i], m, t.vertices[i])
    }
  })

  transformedTriangles.sort((a, b) => {
    const da = length(sub(camPos, a.vertices[0]))
    const db = length(sub(camPos, b.vertices[0]))
    return db - da // far to near
  })

  transformedTriangles.forEach((t) => {
    if (facesPoint(camPos)(t.vertices)) {
      shape(t.vertices.map((v) => worldToScreen(v, camera)))
    }
  })
}

const loop = (time: number) => {
  if (lastTime === null) lastTime = time
  const deltaMs = time - lastTime
  lastTime = time
  draw(deltaMs)
  requestAnimationFrame(loop)
}

requestAnimationFrame(loop)
