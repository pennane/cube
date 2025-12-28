import { Model, Vec3 } from '../types'

import { cubeTriangles } from './cube'
import { parseObjModelFile } from './parseObjModelFile'

const loadTeapot = () =>
  fetch('/teapot.obj')
    .then((res) => res.text())
    .then(parseObjModelFile)

const modelToBuffer = (model: Vec3[][]): Model => {
  let vertexCount = 0
  for (const group of model) {
    vertexCount += group.length
  }

  const buffer = new Float32Array(vertexCount * 3)

  let i = 0
  for (const group of model) {
    for (const v of group) {
      buffer[i++] = v.x
      buffer[i++] = v.y
      buffer[i++] = v.z
    }
  }

  return { vertices: buffer }
}

export const readModels = async () => {
  const teapotFaces: Vec3[][] = await loadTeapot()

  return {
    cube: modelToBuffer(cubeTriangles),
    teapot: modelToBuffer(teapotFaces)
  }
}
