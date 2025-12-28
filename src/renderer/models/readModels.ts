import { Model, Vec3 } from '../types'

import { cubeTriangles } from './cube'
import { parseObjModelFile } from './parseObjModelFile'

const fetchObjModel = (path: string) =>
  fetch(path)
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
  const [cessna, pyramid, shuttle, teapot, trumpet] = await Promise.all(
    [
      '/cessna.obj',
      '/pyramid.obj',
      '/shuttle.obj',
      '/teapot.obj',
      '/trumpet.obj'
    ].map(fetchObjModel)
  )

  return {
    cube: modelToBuffer(cubeTriangles),
    cessna: modelToBuffer(cessna),
    pyramid: modelToBuffer(pyramid),
    shuttle: modelToBuffer(shuttle),
    teapot: modelToBuffer(teapot),
    trumpet: modelToBuffer(trumpet)
  }
}
