import { Vec3 } from '../math'

export const parseObjModelFile = (file: string): Vec3[][] => {
  const lines = file.split('\n').map((l) => l.trim())

  const vertices = lines
    .filter((l) => l.startsWith('v '))
    .map((l) => l.split(' ').slice(1).map(Number))
    .map(([x, y, z]) => ({ x, y, z }))

  return lines
    .filter((l) => l.startsWith('f '))
    .map((l) =>
      l
        .split(' ')
        .slice(1)
        .map((c) => parseInt(c, 10) - 1)
    )
    .map(([a, b, c]) => [vertices[a], vertices[b], vertices[c]])
}
