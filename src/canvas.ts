import { Vec2 } from './math'

export const shape = (ctx: CanvasRenderingContext2D, ps: Vec2[]) => {
  ctx.beginPath()
  ctx.moveTo(ps[0].x, ps[0].y)
  for (let i = 0; i < ps.length; i++) {
    const p = ps[(i + 1) % ps.length]
    ctx.lineTo(p.x, p.y)
  }
  ctx.closePath()
  ctx.fillStyle = 'rgba(255, 255, 0, 1)'
  ctx.fill()

  ctx.strokeStyle = 'red'
  ctx.stroke()
}
