export type PointS = { x: number; y: number }
export type PointW = { x: number; y: number; z: number }

export const length = (v: PointW): number =>
  Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z)

export const normalize = (v: PointW): PointW => {
  const len = length(v)
  if (len === 0) return { x: 0, y: 0, z: 0 }
  return {
    x: v.x / len,
    y: v.y / len,
    z: v.z / len
  }
}

export const add = (a: PointW, b: PointW): PointW => ({
  x: a.x + b.x,
  y: a.y + b.y,
  z: a.z + b.z
})

export const sub = (a: PointW, b: PointW): PointW => ({
  x: a.x - b.x,
  y: a.y - b.y,
  z: a.z - b.z
})

export const cross = (a: PointW, b: PointW): PointW => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x
})

export const dot = (a: PointW, b: PointW): number =>
  a.x * b.x + a.y * b.y + a.z * b.z

export const rotateZ = (angle: number) => (p: PointW) => {
  const [c, s] = [Math.cos(angle), Math.sin(angle)]
  return {
    x: p.x * c - p.y * s,
    y: p.x * s + p.y * c,
    z: p.z
  }
}
export const rotateX = (angle: number) => (p: PointW) => {
  const [c, s] = [Math.cos(angle), Math.sin(angle)]
  return {
    x: p.x,
    y: p.y * c - p.z * s,
    z: p.y * s + p.z * c
  }
}

export const rotateY = (angle: number) => (p: PointW) => {
  const [c, s] = [Math.cos(angle), Math.sin(angle)]

  return {
    x: p.x * c + p.z * s,
    y: p.y,
    z: -p.x * s + p.z * c
  }
}

export const scale = (n: number) => (p: PointW) => {
  return {
    x: p.x * n,
    y: p.y * n,
    z: p.z * n
  }
}
