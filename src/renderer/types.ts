export type Vec2 = { x: number; y: number }
export type Vec3 = { x: number; y: number; z: number }
export type Vec4 = { x: number; y: number; z: number; w: number }
export type Mat4 = Float32Array

export type Model = {
  vertices: Float32Array
}

export type Object3D = {
  model: Model
  transform: Mat4
}

export type FrameBuffers = {
  world: Float32Array
  camera: Float32Array
  screen: Float32Array
  triangleIndices: Uint16Array
  initialTriangleIndices: Uint16Array
}

export type Context = {
  view: Mat4
  renderingContext: CanvasRenderingContext2D
  objects: Object3D[]
  frameBuffers: FrameBuffers
}
