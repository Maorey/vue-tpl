/// 按需引入 luma.gl ///
import {
  ModelNode,
  picking,
  dirlight,
  Buffer,
  CubeGeometry,
  createShaderHook,
  createModuleInjection,
} from 'luma.gl'

const SIDE = 256

createShaderHook('vs:MY_SHADER_HOOK_pickColor(inout vec4 color)')
createShaderHook('fs:MY_SHADER_HOOK_fragmentColor(inout vec4 color)')

createModuleInjection('picking', {
  hook: 'vs:MY_SHADER_HOOK_pickColor',
  injection: 'picking_setPickingColor(color.rgb);',
})
createModuleInjection('dirlight', {
  hook: 'fs:MY_SHADER_HOOK_fragmentColor',
  injection: 'color = dirlight_filterColor(color);',
})
createModuleInjection('picking', {
  hook: 'fs:MY_SHADER_HOOK_fragmentColor',
  injection: 'color = picking_filterColor(color);',
  order: Number.POSITIVE_INFINITY,
})

class Cube extends ModelNode {
  constructor(gl: any, props: any) {
    let offsets: any = []
    for (let i = 0; i < SIDE; i++) {
      const x = ((-SIDE + 1) * 3) / 2 + i * 3
      for (let j = 0; j < SIDE; j++) {
        const y = ((-SIDE + 1) * 3) / 2 + j * 3
        offsets.push(x, y)
      }
    }
    offsets = new Float32Array(offsets)

    const pickingColors = new Uint8ClampedArray(SIDE * SIDE * 2)
    for (let i = 0; i < SIDE; i++) {
      for (let j = 0; j < SIDE; j++) {
        pickingColors[(i * SIDE + j) * 2 + 0] = i
        pickingColors[(i * SIDE + j) * 2 + 1] = j
      }
    }

    const colors = new Float32Array(SIDE * SIDE * 3).map(
      () => Math.random() * 0.75 + 0.25
    )

    const vs = `attribute float instanceSizes;
attribute vec3 positions;
attribute vec3 normals;
attribute vec2 instanceOffsets;
attribute vec3 instanceColors;
attribute vec2 instancePickingColors;
uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
uniform float uTime;
varying vec3 color;
void main(void) {
  vec3 normal = vec3(uModel * vec4(normals, 1.0));
  color = instanceColors;
  project_setNormal(normal);
  vec4 pickColor = vec4(0., instancePickingColors, 1.0);
  MY_SHADER_HOOK_pickColor(pickColor);
  float delta = length(instanceOffsets);
  vec4 offset = vec4(instanceOffsets, sin((uTime + delta) * 0.1) * 16.0, 0);
  gl_Position = uProjection * uView * (uModel * vec4(positions * instanceSizes, 1.0) + offset);
}`
    const fs = `precision highp float;
varying vec3 color;
void main(void) {
  gl_FragColor = vec4(color, 1.);
  MY_SHADER_HOOK_fragmentColor(gl_FragColor);
}`

    const offsetsBuffer = new Buffer(gl, offsets)
    const colorsBuffer = new Buffer(gl, colors)
    const pickingColorsBuffer = new Buffer(gl, pickingColors)

    super(
      gl,
      Object.assign({}, props, {
        vs,
        fs,
        modules: [dirlight, picking],
        isInstanced: 1,
        instanceCount: SIDE * SIDE,
        geometry: new CubeGeometry(),
        attributes: {
          instanceSizes: new Float32Array([1]), // Constant attribute
          instanceOffsets: [offsetsBuffer, { divisor: 1 }],
          instanceColors: [colorsBuffer, { divisor: 1 }],
          instancePickingColors: [pickingColorsBuffer, { divisor: 1 }],
        },
      })
    )
  }
}

export { Cube as default, SIDE }
