import { Vec3 } from './types'

export const scale = (s: { x: number; y: number; z: number }): Float32Array =>
  // prettier-ignore
  new Float32Array([
    s.x, 0,   0,   0,
    0,   s.y, 0,   0,
    0,   0,   s.z, 0,
    0,   0,   0,   1
  ])

export const identity = (): Float32Array => {
  // prettier-ignore
  return new Float32Array([
    1, 0, 0, 0, 
    0, 1, 0, 0, 
    0, 0, 1, 0, 
    0, 0, 0, 1
  ])
}

export const translate = ({ x, y, z }: Vec3) => {
  // prettier-ignore
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1
  ])
}

export const scaleUniformly = (s: number) => {
  return scale({ x: s, y: s, z: s })
}

export const rotateX = (rad: number): Float32Array => {
  const c = Math.cos(rad)
  const s = Math.sin(rad)

  // prettier-ignore
  return new Float32Array([
    1, 0, 0, 0,
    0, c, s, 0,
    0, -s, c, 0,
    0, 0, 0, 1
  ])
}

export const rotateY = (rad: number): Float32Array => {
  const c = Math.cos(rad)
  const s = Math.sin(rad)

  // prettier-ignore
  return new Float32Array([
    c, 0, -s, 0,
    0, 1, 0, 0,
    s, 0, c, 0,
    0, 0, 0, 1
  ])
}

export const rotateZ = (rad: number): Float32Array => {
  const c = Math.cos(rad)
  const s = Math.sin(rad)

  // prettier-ignore
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
