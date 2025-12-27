import { multiply, translationMatrix, rotateXYZ, Vec3, scale } from '../math'

import { cubeTriangles } from './cube'
import { parseObjModelFile } from './obj'

export type Model = {
  type: 'cube' | 'teapot'
  triangles: Vec3[][]
  matrix: Float32Array
}

const createShape = (
  type: 'cube' | 'teapot',
  triangles: Vec3[][],
  position: Vec3,
  initialRotation: Vec3 = { x: 0, y: 0, z: 0 }
): Model => {
  return {
    type,
    triangles,
    matrix: multiply(translationMatrix(position), rotateXYZ(initialRotation))
  }
}

const loadTeapot = () =>
  fetch('/teapot.obj')
    .then((res) => res.text())
    .then(parseObjModelFile)

export const getModels = async (): Promise<Model[]> => {
  const teapotFaces = await loadTeapot()

  return [
    createShape('cube', cubeTriangles, { x: -2.5, y: 0, z: 0 }),
    createShape('cube', cubeTriangles, { x: 2.5, y: 0, z: 0 }),
    createShape('cube', cubeTriangles, { x: 0, y: 2.5, z: 0 }),
    createShape('cube', cubeTriangles, { x: 0, y: -2.5, z: 0 }),
    createShape(
      'teapot',
      teapotFaces.map((vs) => vs.map(scale(0.5))),
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 }
    )
  ]
}
