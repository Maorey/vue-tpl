<!--
 * @Description: 一堆球
 * @Author: 毛瑞
 * @Date: 2019-08-01 15:55:05
 -->
<template>
  <canvas />
</template>

<script lang="ts">
// see: https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from 'vue-property-decorator'

/* eslint-disable import/no-duplicates */
/// three.js 按需引入 (摇不动啊, 几乎不能减小尺寸) ///
import {
  PerspectiveCamera,
  Scene,
  Fog,
  Clock,
  HemisphereLight,
  DirectionalLight,
  Group,
  IcosahedronBufferGeometry,
  MeshStandardMaterial,
  Mesh,
  WebGLRenderer,
  RGBAFormat,
  Vector2,
  WebGLMultisampleRenderTarget,
} from 'three'
// three.js 示例: https://threejs.org/examples/#webgl2_multisampled_renderbuffers
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader'
import { WEBGL } from 'three/examples/jsm/WebGL'

/// name,components,directives,filters,extends,mixins ///
@Component
export default class extends Vue {
  /// model (@Model) ///
  /// props (@Prop) ///
  /// data (private name: string = '响应式属性' // 除了undefined都会响应式) ///
  /// private instance attributes (private name?: string // 非响应式属性) ///
  /// computed (get name() { return this.name } set name()... ///
  /// watch (@Watch) ///
  /// LifeCycle (private beforeCreate/created/.../destroyed) ///
  /// methods (private/public) ///
  private mounted() {
    const canvas = this.$el as HTMLCanvasElement
    if (!WEBGL.isWebGLAvailable()) {
      canvas.appendChild(WEBGL.getWebGLErrorMessage())
      return
    }

    // init
    const camera: PerspectiveCamera = new PerspectiveCamera(
      45,
      (canvas.offsetWidth * 0.5) / canvas.offsetHeight,
      1,
      2000,
    )
    camera.position.z = 500
    const scene: Scene = new Scene()
    scene.background = null
    scene.fog = new Fog(0x666666, 100, 1500)
    const clock: Clock = new Clock()

    const hemiLight = new HemisphereLight(0xffffff, 0x444444)
    hemiLight.position.set(0, 1000, 0)
    scene.add(hemiLight)
    const dirLight = new DirectionalLight(0xffffff, 0.8)
    dirLight.position.set(-3000, 1000, -1000)
    scene.add(dirLight)

    const group: Group = new Group()
    const geometry = new IcosahedronBufferGeometry(10, 2)
    const material = new MeshStandardMaterial({
      color: 0xee0808,
      flatShading: true,
    })
    for (let i = 0; i < 100; i++) {
      const mesh = new Mesh(geometry, material)
      mesh.position.x = Math.random() * 500 - 250
      mesh.position.y = Math.random() * 500 - 250
      mesh.position.z = Math.random() * 500 - 250
      mesh.scale.setScalar(Math.random() * 2 + 1)
      group.add(mesh)
    }
    scene.add(group)

    const renderer: WebGLRenderer = new WebGLRenderer({
      canvas,
      context: canvas.getContext(
        WEBGL.isWebGL2Available() ? 'webgl2' : 'webgl',
        { antialias: false },
      ) as WebGLRenderingContext,
    })
    renderer.autoClear = false
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)

    const size = renderer.getDrawingBufferSize(new Vector2())
    const renderPass = new RenderPass(scene, camera)
    const copyPass = new ShaderPass(CopyShader)

    const composer1: EffectComposer = new EffectComposer(
      renderer,
      new WebGLMultisampleRenderTarget(size.width, size.height, {
        format: RGBAFormat,
        stencilBuffer: false,
      }),
    )
    composer1.addPass(renderPass)
    composer1.addPass(copyPass)

    const composer2: EffectComposer = new EffectComposer(renderer)
    composer2.addPass(renderPass)
    composer2.addPass(copyPass)

    function animate() {
      requestAnimationFrame(animate)
      const halfWidth = canvas.offsetWidth / 2
      group.rotation.y += clock.getDelta() * 0.1
      renderer.setViewport(0, 0, halfWidth, canvas.offsetHeight)
      composer1.render()
      renderer.setViewport(halfWidth, 0, halfWidth, canvas.offsetHeight)
      composer2.render()
    }
    animate()
  }
  /// render ///
}
</script>
