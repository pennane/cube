import { Vec3 } from './vec'

// Create a container for camera controls
const controls = document.createElement('div')
controls.style.position = 'absolute'
controls.style.top = '10px'
controls.style.left = '10px'
controls.style.backgroundColor = 'rgba(255,255,255,0.8)'
controls.style.padding = '10px'
controls.style.borderRadius = '8px'
controls.style.fontFamily = 'sans-serif'
controls.style.zIndex = '10'
document.body.appendChild(controls)

// Helper to create a slider
function createSlider(
  labelText: string,
  min: number,
  max: number,
  step: number,
  initial: number,
  onChange: (v: number) => void
) {
  const container = document.createElement('div')
  container.style.marginBottom = '6px'

  const label = document.createElement('label')
  label.textContent = `${labelText}: ${initial.toFixed(2)}`
  label.style.display = 'block'

  const slider = document.createElement('input')
  slider.type = 'range'
  slider.min = min.toString()
  slider.max = max.toString()
  slider.step = step.toString()
  slider.value = initial.toString()
  slider.style.width = '150px'

  slider.oninput = () => {
    const value = parseFloat(slider.value)
    label.textContent = `${labelText}: ${value.toFixed(2)}`
    onChange(value)
  }

  container.appendChild(label)
  container.appendChild(slider)
  controls.appendChild(container)
}

export const createSliders = (camera: Vec3, cameraRotation: Vec3) => {
  // Camera position sliders
  createSlider('Cam X', -5, 5, 0.01, camera.x, (v) => (camera.x = v))
  createSlider('Cam Y', -5, 5, 0.01, camera.y, (v) => (camera.y = v))
  createSlider('Cam Z', -10, 5, 0.01, camera.z, (v) => (camera.z = v))

  // Camera rotation sliders (radians)
  createSlider(
    'Rot X',
    -Math.PI,
    Math.PI,
    0.01,
    cameraRotation.x,
    (v) => (cameraRotation.x = v)
  )
  createSlider(
    'Rot Y',
    -Math.PI,
    Math.PI,
    0.01,
    cameraRotation.y,
    (v) => (cameraRotation.y = v)
  )
  createSlider(
    'Rot Z',
    -Math.PI,
    Math.PI,
    0.01,
    cameraRotation.z,
    (v) => (cameraRotation.z = v)
  )
}
