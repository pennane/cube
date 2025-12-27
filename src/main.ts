import { cubeTriangles } from './cube'
import './main.css'
import { teapotFaces } from './teapot'
import {
  add,
  cross,
  dot,
  length,
  normalize,
  PointS,
  PointW,
  rotateX,
  rotateY,
  scale,
  sub
} from './vec'
const app = document.getElementById('app')!
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')!
const CANVAS_SIZE = 500

canvas.width = CANVAS_SIZE
canvas.height = CANVAS_SIZE
app.appendChild(canvas)

const shape = (ps: PointS[]) => {
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

let camera = { x: 0, y: 0, z: -10 }
let cameraRotation = { x: 0, y: 0, z: 0 }

const worldToScreen = (point: PointW) => {
  let p = {
    x: point.x - camera.x,
    y: point.y - camera.y,
    z: point.z - camera.z
  }

  p = rotateY(-cameraRotation.y)(p)
  p = rotateX(-cameraRotation.x)(p)

  const f = 2 / p.z
  return {
    x: ((p.x * f + 1) * CANVAS_SIZE) / 2,
    y: ((1 - p.y * f) * CANVAS_SIZE) / 2
  }
}

const facesCamera = (shape: PointW[]): boolean => {
  const [a, b, c] = shape

  const ab = sub(b, a)
  const ac = sub(c, a)
  const normal = cross(ab, ac)

  const viewDir = sub(a, camera)

  return dot(normal, viewDir) < 0
}

const cubes = [
  {
    shape: cubeTriangles,
    position: { x: -2.5, y: 0, z: 0 }
  },
  {
    shape: cubeTriangles,
    position: { x: 2.5, y: 0, z: 0 }
  },
  {
    shape: cubeTriangles,
    position: { x: 0, y: 2.5, z: 0 }
  },
  {
    shape: cubeTriangles,
    position: { x: 0, y: -2.5, z: 0 }
  }
]
const teapots = [
  {
    shape: teapotFaces.map((vs) => vs.map(scale(0.5))),
    position: { x: 0, y: -0.5, z: 0 }
  }
]

let angle = 0
let lastTime: number | null = null

const draw = (time: number) => {
  if (lastTime === null) lastTime = time

  const deltaTime = time - lastTime

  lastTime = time
  angle = (angle + deltaTime / 1000) % (Math.PI * 2)

  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
  camera = rotateY(0.01)(camera)

  const toOrigin = normalize({
    x: -camera.x,
    y: -camera.y,
    z: -camera.z
  })

  cameraRotation.y = Math.atan2(toOrigin.x, toOrigin.z)
  cameraRotation.x = Math.asin(toOrigin.y)
  cameraRotation.z = 0

  const screenCubes = cubes.map((sh, i) =>
    sh.shape
      .map((s) => {
        return s
          .map(rotateX(angle + i))
          .map(rotateY(angle + i))
          .map((p) => add(sh.position, p))
      })
      .filter(facesCamera)
  )
  const screenTeapots = teapots.map((tp) =>
    tp.shape
      .map((s) => s.map((y) => add(tp.position, y)).map(rotateX(angle)))
      .filter(facesCamera)
  )
  ;[...screenCubes, ...screenTeapots]
    .flat()
    .toSorted((a, b) => length(sub(camera, b[0])) - length(sub(camera, a[0])))
    .map((x) => shape(x.map(worldToScreen)))

  requestAnimationFrame(draw)
}

requestAnimationFrame(draw)
