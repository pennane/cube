import { PointW } from './vec'

const cubeVertices: PointW[] = [
  { x: -0.25, y: -0.25, z: -0.25 }, // 0
  { x: 0.25, y: -0.25, z: -0.25 }, // 1
  { x: 0.25, y: 0.25, z: -0.25 }, // 2
  { x: -0.25, y: 0.25, z: -0.25 }, // 3
  { x: -0.25, y: -0.25, z: 0.25 }, // 4
  { x: 0.25, y: -0.25, z: 0.25 }, // 5
  { x: 0.25, y: 0.25, z: 0.25 }, // 6
  { x: -0.25, y: 0.25, z: 0.25 } // 7
]

const cubeFaces = [
  // +Z
  [4, 5, 6, 7],
  // -Z
  [1, 0, 3, 2],
  // +Y
  [3, 7, 6, 2],
  // -Y
  [0, 1, 5, 4],
  // +X
  [1, 2, 6, 5],
  // -X
  [0, 4, 7, 3]
]

export const cubeTriangles: PointW[][] = cubeFaces.flatMap(([a, b, c, d]) => [
  [cubeVertices[a], cubeVertices[b], cubeVertices[c]],
  [cubeVertices[a], cubeVertices[c], cubeVertices[d]]
])
