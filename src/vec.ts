export type Vec2 = { x: number; y: number }
export type Vec3 = { x: number; y: number; z: number }
export type Vec4 = { x: number; y: number; z: number; w: number }

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

export const rotateZ = (angle: number) => (p: Vec3) => {
  const [c, s] = [Math.cos(angle), Math.sin(angle)]
  return {
    x: p.x * c - p.y * s,
    y: p.x * s + p.y * c,
    z: p.z
  }
}
export const rotateX = (angle: number) => (p: Vec3) => {
  const [c, s] = [Math.cos(angle), Math.sin(angle)]
  return {
    x: p.x,
    y: p.y * c - p.z * s,
    z: p.y * s + p.z * c
  }
}

export const rotateY = (angle: number) => (p: Vec3) => {
  const [c, s] = [Math.cos(angle), Math.sin(angle)]

  return {
    x: p.x * c + p.z * s,
    y: p.y,
    z: -p.x * s + p.z * c
  }
}

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

export const rotationToOrigin = (from: Vec3) => {
  const toOrigin = normalize(from)

  return {
    x: Math.asin(toOrigin.y),
    y: Math.atan2(toOrigin.x, toOrigin.z),
    z: 0
  }
}
