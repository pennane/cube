export type Vec2 = { x: number; y: number }
export type Vec3 = { x: number; y: number; z: number }
export type Vec4 = { x: number; y: number; z: number; w: number }

const M00 = 0,
  M10 = 1,
  M20 = 2,
  M30 = 3
const M01 = 4,
  M11 = 5,
  M21 = 6,
  M31 = 7
const M02 = 8,
  M12 = 9,
  M22 = 10,
  M32 = 11
const M03 = 12,
  M13 = 13,
  M23 = 14,
  M33 = 15

// prettier-ignore
export const identityMatrix = (): Float32Array => {
  return new Float32Array([
    1, 0, 0, 0, 
    0, 1, 0, 0, 
    0, 0, 1, 0, 
    0, 0, 0, 1
  ])
}

// prettier-ignore
export const translationMatrix =({x,y,z}:Vec3) => {
 return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1
  ])
}

// prettier-ignore
export const scaleMatrix = (s: number) => {
  return new Float32Array([
    s, 0, 0, 0,
    0, s, 0, 0,
    0, 0, s, 0,
    0, 0, 0, 1
  ])
}

// prettier-ignore
export const rotateX = (rad: number): Float32Array => {
  const c = Math.cos(rad)
  const s = Math.sin(rad)
  return new Float32Array([
    1, 0, 0, 0,
    0, c, s, 0,
    0, -s, c, 0,
    0, 0, 0, 1
  ])
}

// prettier-ignore
export const rotateY = (rad: number): Float32Array => {
  const c = Math.cos(rad)
  const s = Math.sin(rad)
  return new Float32Array([
    c, 0, -s, 0,
    0, 1, 0, 0,
    s, 0, c, 0,
    0, 0, 0, 1
  ])
}

// prettier-ignore
export const rotateZ = (rad: number): Float32Array => {
  const c = Math.cos(rad)
  const s = Math.sin(rad)
  return new Float32Array([
    c, s, 0, 0,
    -s, c, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ])
}

export const rotateXYZ = ({ x, y, z }: Vec3): Float32Array => {
  return multiply(rotateY(y), rotateX(x), rotateZ(z))
}

const multiply2 = (a: Float32Array, b: Float32Array): Float32Array => {
  const out = new Float32Array(16)
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      let sum = 0
      for (let k = 0; k < 4; k++) {
        sum += a[k + r * 4] * b[c + k * 4]
      }
      out[c + r * 4] = sum
    }
  }
  return out
}

export const multiply = (
  a: Float32Array,
  b: Float32Array,
  ...rest: Float32Array[]
): Float32Array => {
  const ars = [a, b, ...rest]
  let out: Float32Array<ArrayBufferLike> = new Float32Array(ars.at(-1)!)
  for (let i = ars.length - 2; i >= 0; i--) {
    out = multiply2(ars[i], out)
  }
  return out
}

export const transformVec4 = (
  m: Float32Array,
  { x, y, z, w }: { x: number; y: number; z: number; w: number }
): Vec4 => {
  const tx = m[M00] * x + m[M01] * y + m[M02] * z + m[M03] * w
  const ty = m[M10] * x + m[M11] * y + m[M12] * z + m[M13] * w
  const tz = m[M20] * x + m[M21] * y + m[M22] * z + m[M23] * w
  const tw = m[M30] * x + m[M31] * y + m[M32] * z + m[M33] * w
  return { x: tx, y: ty, z: tz, w: tw }
}

export const transformVec3 = (m: Float32Array, v: Vec3): Vec3 => {
  return {
    x: m[M00] * v.x + m[M01] * v.y + m[M02] * v.z + m[M03],
    y: m[M10] * v.x + m[M11] * v.y + m[M12] * v.z + m[M13],
    z: m[M20] * v.x + m[M21] * v.y + m[M22] * v.z + m[M23]
  }
}

export const toVec4 = (p: Vec3): Vec4 => ({ ...p, w: 1 })

export const getPosition = (view: Float32Array): Vec3 => ({
  x: view[M03],
  y: view[M13],
  z: view[M23]
})

export const length = (v: Vec3): number =>
  Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z)

export const normalize = (v: Vec3): Vec3 => {
  const len = length(v)
  if (len === 0) return { x: 0, y: 0, z: 0 }
  return {
    x: v.x / len,
    y: v.y / len,
    z: v.z / len
  }
}

export const add = (a: Vec3, b: Vec3): Vec3 => ({
  x: a.x + b.x,
  y: a.y + b.y,
  z: a.z + b.z
})

export const sub = (a: Vec3, b: Vec3): Vec3 => ({
  x: a.x - b.x,
  y: a.y - b.y,
  z: a.z - b.z
})

export const cross = (a: Vec3, b: Vec3): Vec3 => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x
})

export const dot = (a: Vec3, b: Vec3): number =>
  a.x * b.x + a.y * b.y + a.z * b.z

export const scale = (n: number) => (p: Vec3) => {
  return {
    x: p.x * n,
    y: p.y * n,
    z: p.z * n
  }
}

export const facesPoint =
  (point: Vec3) =>
  (triangle: Vec3[]): boolean => {
    const [a, b, c] = triangle

    const ab = sub(b, a)
    const ac = sub(c, a)
    const normal = cross(ab, ac)

    const dir = sub(a, point)

    return dot(normal, dir) < 0
  }

export const perspectiveDivide = ({ x, y, z, w }: Vec4): Vec3 => ({
  x: x / w,
  y: y / w,
  z: z / w
})

export const project = (
  worldSize: Vec2,
  point: Vec3,
  focalLength: number
): Vec2 => {
  const f = focalLength / point.z
  return {
    x: ((point.x * f + 1) * worldSize.x) / 2,
    y: ((1 - point.y * f) * worldSize.y) / 2
  }
}
