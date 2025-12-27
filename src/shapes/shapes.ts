import { Vec3, Vec4, scale } from '../vec'
import { cubeTriangles } from './cube'
import { teapotFaces } from './teapot'

type Shape = {
  type: 'cube' | 'teapot'
  triangles: Vec4[][]
  position: Vec3
  rotation: Vec3
}

const shapes = [
  {
    type: 'cube',
    triangles: cubeTriangles,
    position: { x: -2.5, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }
  },
  {
    type: 'cube',
    triangles: cubeTriangles,
    position: { x: 2.5, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }
  },
  {
    type: 'cube',
    triangles: cubeTriangles,
    position: { x: 0, y: 2.5, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }
  },
  {
    type: 'cube',
    triangles: cubeTriangles,
    position: { x: 0, y: -2.5, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }
  },
  {
    type: 'teapot',
    triangles: teapotFaces.map((vs) =>
      vs.map(scale(0.5)).map((v) => ({ ...v, w: 1 }))
    ),
    position: { x: 0, y: -0.5, z: 0 },
    rotation: { x: Math.PI, y: 0, z: 0 }
  }
] satisfies Shape[]

export const getShapes = () => shapes
