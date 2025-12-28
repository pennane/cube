import { Vec3 } from '../types'

const cubeVertices: Vec3[] = [
  { x: -0.25, y: -0.25, z: -0.25 },
  { x: 0.25, y: -0.25, z: -0.25 },
  { x: 0.25, y: 0.25, z: -0.25 },
  { x: -0.25, y: 0.25, z: -0.25 },
  { x: -0.25, y: -0.25, z: 0.25 },
  { x: 0.25, y: -0.25, z: 0.25 },
  { x: 0.25, y: 0.25, z: 0.25 },
  { x: -0.25, y: 0.25, z: 0.25 }
]

const cubeFaces = [
  [4, 5, 6, 7],
  [1, 0, 3, 2],
  [3, 7, 6, 2],
  [0, 1, 5, 4],
  [1, 2, 6, 5],
  [0, 4, 7, 3]
]

export const cubeTriangles: Vec3[][] = cubeFaces.flatMap(([a, b, c, d]) => [
  [cubeVertices[a], cubeVertices[b], cubeVertices[c]],
  [cubeVertices[a], cubeVertices[c], cubeVertices[d]]
])
