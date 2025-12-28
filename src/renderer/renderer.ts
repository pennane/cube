import { multiply, rotateXYZ, rotateY, translate } from './math'
import { Context, FrameBuffers, Object3D } from './types'

const toWorldSpace = (ctx: Context) => {
  let write = 0

  for (const obj of ctx.objects) {
    const vertices = obj.model.vertices
    const m = obj.transform

    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i]
      const y = vertices[i + 1]
      const z = vertices[i + 2]

      ctx.frameBuffers.world[write++] = m[0] * x + m[4] * y + m[8] * z + m[12]
      ctx.frameBuffers.world[write++] = m[1] * x + m[5] * y + m[9] * z + m[13]
      ctx.frameBuffers.world[write++] = m[2] * x + m[6] * y + m[10] * z + m[14]
    }
  }
}

const toCameraSpace = (ctx: Context) => {
  const world = ctx.frameBuffers.world
  const camera = ctx.camera
  for (let i = 0; i < world.length; i += 3) {
    const x = world[i]
    const y = world[i + 1]
    const z = world[i + 2]
    const w = camera[3] * x + camera[7] * y + camera[11] * z + camera[15]

    ctx.frameBuffers.camera[i] =
      (camera[0] * x + camera[4] * y + camera[8] * z + camera[12]) / w
    ctx.frameBuffers.camera[i + 1] =
      (camera[1] * x + camera[5] * y + camera[9] * z + camera[13]) / w
    ctx.frameBuffers.camera[i + 2] =
      (camera[2] * x + camera[6] * y + camera[10] * z + camera[14]) / w
  }
}

const cullBackfaces = (ctx: Context): number => {
  let count = 0
  const indices = ctx.frameBuffers.triangleIndices
  const cameraBuffer = ctx.frameBuffers.camera
  const out = ctx.frameBuffers.triangleIndices

  for (let i = 0; i < indices.length; i += 3) {
    const ia = indices[i] * 3
    const ib = indices[i + 1] * 3
    const ic = indices[i + 2] * 3

    const ux = cameraBuffer[ib] - cameraBuffer[ia]
    const uy = cameraBuffer[ib + 1] - cameraBuffer[ia + 1]
    const uz = cameraBuffer[ib + 2] - cameraBuffer[ia + 2]

    const vx = cameraBuffer[ic] - cameraBuffer[ia]
    const vy = cameraBuffer[ic + 1] - cameraBuffer[ia + 1]
    const vz = cameraBuffer[ic + 2] - cameraBuffer[ia + 2]

    const nx = uy * vz - uz * vy
    const ny = uz * vx - ux * vz
    const nz = ux * vy - uy * vx
    const dot = nx * 0 + ny * 0 + nz * -1

    if (dot < 0) {
      // facing camera
      out[count++] = indices[i]
      out[count++] = indices[i + 1]
      out[count++] = indices[i + 2]
    }
  }

  return count
}

const sortByDepth = (ctx: Context, visibleCount: number) => {
  const indices = ctx.frameBuffers.triangleIndices
  const cameraBuffer = ctx.frameBuffers.camera
  const triangleCount = visibleCount / 3

  const depths = new Float32Array(triangleCount)
  for (let t = 0; t < triangleCount; t++) {
    const ia = indices[t * 3] * 3
    const ib = indices[t * 3 + 1] * 3
    const ic = indices[t * 3 + 2] * 3

    const avgZ =
      (cameraBuffer[ia + 2] + cameraBuffer[ib + 2] + cameraBuffer[ic + 2]) / 3

    depths[t] = avgZ
  }

  const order = new Uint32Array(triangleCount)
  for (let t = 0; t < triangleCount; t++) order[t] = t

  order.sort((a, b) => depths[a] - depths[b])

  const sorted = new Uint16Array(triangleCount * 3)
  for (let t = 0; t < triangleCount; t++) {
    const src = order[t] * 3
    const dst = t * 3
    sorted[dst] = indices[src]
    sorted[dst + 1] = indices[src + 1]
    sorted[dst + 2] = indices[src + 2]
  }

  return sorted
}

const toScreenSpace = (
  ctx: Context,
  visibleCount: number,
  indices: Uint16Array,
  focalLength: number
) => {
  const cameraBuffer = ctx.frameBuffers.camera
  const screenBuffer = ctx.frameBuffers.screen

  for (let i = 0; i < visibleCount; i++) {
    const vi = indices[i] * 3
    const x = cameraBuffer[vi]
    const y = cameraBuffer[vi + 1]
    const z = cameraBuffer[vi + 2]

    const px = (x / z) * focalLength
    const py = (y / z) * focalLength

    screenBuffer[vi] = (px * 0.5 + 0.5) * ctx.viewport.x
    screenBuffer[vi + 1] = (-py * 0.5 + 0.5) * ctx.viewport.y
    screenBuffer[vi + 2] = z
  }
}

const updateAnimations = (ctx: Context, deltaMs: number) => {
  const angle = deltaMs / 1000
  const teapotRotation = rotateXYZ({ x: -angle, y: angle, z: angle })

  ctx.objects.forEach((object) => {
    object.transform = multiply(teapotRotation, object.transform)
  })
}

const updateCamera = (ctx: Context, deltaMs: number) => {
  const angle = deltaMs / 1000
  ctx.camera = multiply(rotateY(angle), ctx.camera)
}

const render = (ctx: Context, visibleCount: number, indices: Uint16Array) => {
  const screen = ctx.frameBuffers.screen
  ctx.renderingContext.clearRect(0, 0, ctx.viewport.x, ctx.viewport.y)
  ctx.renderingContext.fillStyle = 'rgba(255, 255, 0, 1)'
  ctx.renderingContext.strokeStyle = 'red'

  for (let t = 0; t < visibleCount / 3; t++) {
    const i0 = indices[t * 3] * 3
    const i1 = indices[t * 3 + 1] * 3
    const i2 = indices[t * 3 + 2] * 3

    ctx.renderingContext.beginPath()
    ctx.renderingContext.moveTo(screen[i0], screen[i0 + 1])
    ctx.renderingContext.lineTo(screen[i1], screen[i1 + 1])
    ctx.renderingContext.lineTo(screen[i2], screen[i2 + 1])
    ctx.renderingContext.closePath()
    // ctx.renderingContext.fill()
    ctx.renderingContext.stroke()
  }
}

const countVertices = (objects: Object3D[]) => {
  let count = 0
  for (const obj of objects) {
    count += obj.model.vertices.length / 3
  }
  return count
}

const initTriangleIndices = (objects: Object3D[]): Uint16Array => {
  let totalVertices = 0
  for (const obj of objects) totalVertices += obj.model.vertices.length / 3

  const indices = new Uint16Array(totalVertices)
  for (let i = 0; i < totalVertices; i++) indices[i] = i

  return indices
}

const initFrameBuffers = (objects: Object3D[]): FrameBuffers => {
  const vertexCount = countVertices(objects)
  const initialTriangleIndices = initTriangleIndices(objects)

  return {
    world: new Float32Array(vertexCount * 3),
    camera: new Float32Array(vertexCount * 3),
    screen: new Float32Array(vertexCount * 3),
    initialTriangleIndices,
    triangleIndices: initialTriangleIndices.slice()
  }
}

export const createRenderingContext = ({
  objects,
  ctx,
  cameraDistance
}: {
  objects: Object3D[]
  ctx: CanvasRenderingContext2D
  cameraDistance: number
}): Context => {
  const context: Context = {
    camera: translate({
      x: 0,
      y: 0,
      z: -cameraDistance
    }),
    objects,
    renderingContext: ctx,
    viewport: { x: ctx.canvas.width, y: ctx.canvas.height },
    frameBuffers: initFrameBuffers(objects)
  }

  return context
}

export const nextFrame = (ctx: Context, deltaMs: number) => {
  updateAnimations(ctx, deltaMs)
  updateCamera(ctx, deltaMs)
  toWorldSpace(ctx)
  toCameraSpace(ctx)
  const visibleCount = ctx.frameBuffers.triangleIndices.length //cullBackfaces(ctx)
  const sorted = sortByDepth(ctx, visibleCount)
  toScreenSpace(ctx, visibleCount, sorted, 1)
  render(ctx, visibleCount, sorted)
}
