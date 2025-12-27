import { cross, normalize, sub, Vec3, Vec4 } from './vec'

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
  return multiplyN(rotateY(y), rotateX(x), rotateZ(z))
}

export const multiply = (a: Float32Array, b: Float32Array): Float32Array => {
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

export const multiplyN = (
  a: Float32Array,
  b: Float32Array,
  ...rest: Float32Array[]
): Float32Array => {
  const ars = [a, b, ...rest]
  let out: Float32Array<ArrayBufferLike> = new Float32Array(ars.at(-1)!)
  for (let i = ars.length - 2; i >= 0; i--) {
    out = multiply(ars[i], out)
  }
  return out
}

export const transformPoint = (m: Float32Array, { x, y, z, w }: Vec4): Vec4 => {
  const tx = m[0] * x + m[4] * y + m[8] * z + m[12] * w
  const ty = m[1] * x + m[5] * y + m[9] * z + m[13] * w
  const tz = m[2] * x + m[6] * y + m[10] * z + m[14] * w
  const tw = m[3] * x + m[7] * y + m[11] * z + m[15] * w
  return { x: tx, y: ty, z: tz, w: tw }
}

export const transformPointInto = (v: Vec3, m: Float32Array, out: Vec3) => {
  const x = m[0] * v.x + m[4] * v.y + m[8] * v.z + m[12]
  const y = m[1] * v.x + m[5] * v.y + m[9] * v.z + m[13]
  const z = m[2] * v.x + m[6] * v.y + m[10] * v.z + m[14]
  const w = m[3] * v.x + m[7] * v.y + m[11] * v.z + m[15]

  out.x = x / w
  out.y = y / w
  out.z = z / w
}

export const toVec4 = (p: Vec3): Vec4 => ({ ...p, w: 1 })

export const getPosition = (view: Float32Array): Vec3 => ({
  x: view[12],
  y: view[13],
  z: view[14]
})

// prettier-ignore
export const lookAt = (eye: Vec3, target: Vec3, up: Vec3 = { x: 0, y: 1, z: 0 }): Float32Array => {
  const forward = normalize(sub(target, eye))

  const right = normalize(cross(up, forward))
  const trueUp = cross(forward, right)

  return new Float32Array([
    right.x, trueUp.x, -forward.x, 0,
    right.y, trueUp.y, -forward.y, 0,
    right.z, trueUp.z, -forward.z, 0,
    eye.x,   eye.y,    eye.z,     1
  ])
}
