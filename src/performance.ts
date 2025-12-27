export const createPerformanceMonitor = (
  container: HTMLElement,
  opts: { enabled: boolean }
) => {
  let overlayElement: HTMLDivElement | null = null
  let fpsElement: HTMLDivElement | null = null

  let enabled = opts.enabled

  overlayElement = document.createElement('div')
  overlayElement.className = 'performance-monitor'

  fpsElement = document.createElement('div')
  overlayElement.appendChild(fpsElement)
  container.appendChild(overlayElement)

  const recordFrame = (frameTime: number) => {
    if (!enabled || !overlayElement || !fpsElement) return

    const fps = 1000 / frameTime
    const roundedFps = Math.round(fps * 10) / 10
    fpsElement.textContent = `FPS: ${roundedFps.toFixed(1)}`

    const status = fps >= 55 ? 'good' : fps >= 30 ? 'medium' : 'bad'
    overlayElement.setAttribute('data-status', status)
  }

  const toggle = () => {
    enabled = !enabled
    if (overlayElement) {
      overlayElement.style.display = enabled ? 'block' : 'none'
    }
  }

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'p' || e.key === 'P') {
      toggle()
    }
  }

  const destroy = () => {
    if (overlayElement && container) {
      container.removeChild(overlayElement)
      overlayElement = null
      fpsElement = null
    }
    document.removeEventListener('keydown', handleKeydown)
  }

  document.addEventListener('keydown', handleKeydown)

  return { recordFrame, toggle, destroy }
}
