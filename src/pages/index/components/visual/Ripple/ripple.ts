// see: https://luma.gl/#/examples/core-examples/instancing
/// 按需引入 luma.gl ///
import { AnimationLoop, setParameters, readPixelsToArray } from 'luma.gl'
import { Timeline } from '@luma.gl/addons'
import { Matrix4, radians } from 'math.gl'

import Cube, { SIDE } from './cube'

// Make a cube with 65K instances and attributes to control
//  offset and color of each instance
function pickInstance(
  gl: any,
  pickX: any,
  pickY: any,
  model: any,
  framebuffer: any
) {
  framebuffer.clear({ color: true, depth: true })
  // Render picking colors
  // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
  model.setUniforms({ picking_uActive: 1 })
  model.draw({ framebuffer })
  // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
  model.setUniforms({ picking_uActive: 0 })

  const color = readPixelsToArray(framebuffer, {
    sourceX: pickX,
    sourceY: pickY,
    sourceWidth: 1,
    sourceHeight: 1,
    sourceFormat: gl.RGBA,
    sourceType: gl.UNSIGNED_BYTE,
  })

  if (color[0] + color[1] + color[2] > 0) {
    model.updateModuleSettings({
      pickingSelectedColor: color,
    })
  } else {
    model.updateModuleSettings({
      pickingSelectedColor: null,
    })
  }
}

class Ripple extends AnimationLoop {
  private cube: any

  constructor() {
    super({ createFramebuffer: true })
  }

  protected onInitialize(o: any) {
    const { gl, _animationLoop } = o

    setParameters(gl, {
      clearColor: [0, 0, 0, 0],
      clearDepth: 1,
      depthTest: true,
      depthFunc: gl.LEQUAL,
    })

    this.attachTimeline(new Timeline())
    this.timeline.play()

    const timeChannel = this.timeline.addChannel({
      rate: 0.01,
    })

    const eyeXChannel = this.timeline.addChannel({
      rate: 0.0003,
    })

    const eyeYChannel = this.timeline.addChannel({
      rate: 0.0004,
    })

    const eyeZChannel = this.timeline.addChannel({
      rate: 0.0002,
    })

    this.cube = new Cube(gl, {
      _animationLoop,
      // inject: {
      //   'fs:#main-end': 'gl_FragColor = picking_filterColor(gl_FragColor)'
      // },
      uniforms: {
        uTime: () => this.timeline.getTime(timeChannel),
        // Basic projection matrix
        uProjection: (a: any) =>
          new Matrix4().perspective({
            fov: radians(60),
            aspect: a.aspect,
            near: 1,
            far: 2048.0,
          }),
        // Move the eye around the plane
        uView: () =>
          new Matrix4().lookAt({
            center: [0, 0, 0],
            eye: [
              (Math.cos(this.timeline.getTime(eyeXChannel)) * SIDE) / 2,
              (Math.sin(this.timeline.getTime(eyeYChannel)) * SIDE) / 2,
              ((Math.sin(this.timeline.getTime(eyeZChannel)) + 1) * SIDE) / 4 +
                32,
            ],
          }),
        // Rotate all the individual cubes
        uModel: (a: any) =>
          new Matrix4().rotateX(a.tick * 0.01).rotateY(a.tick * 0.013),
      },
    })
  }

  protected onRender(animationProps: any) {
    const { gl } = animationProps

    const { framebuffer, useDevicePixels, _mousePosition } = animationProps

    if (_mousePosition) {
      const dpr = useDevicePixels ? window.devicePixelRatio || 1 : 1

      const pickX = _mousePosition[0] * dpr
      const pickY = gl.canvas.height - _mousePosition[1] * dpr

      pickInstance(gl, pickX, pickY, this.cube, framebuffer)
    }

    // Draw the cubes
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    this.cube.draw()
  }

  protected onFinalize() {
    this.cube.delete()
  }
}

export default Ripple
