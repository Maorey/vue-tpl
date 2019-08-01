<!--
 * @Description: 二人转
 * @Author: 作者
 * @Date: 2019-08-01 13:16:20
 -->
<template>
  <canvas />
</template>

<script lang="ts">
// see: https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from 'vue-property-decorator'

/// 按需引入Zdog (参考 ~zdog/js/index.js) ///
import Zdog from 'zdog/js/boilerplate' // 核心
import CanvasRenderer from 'zdog/js/canvas-renderer' // canvas 渲染
import Illustration from 'zdog/js/illustration'
import Shape from 'zdog/js/shape'
import Group from 'zdog/js/group'
import Anchor from 'zdog/js/anchor'
import Ellipse from 'zdog/js/ellipse'

Zdog.CanvasRenderer = CanvasRenderer // 设置渲染器

// see: https://codepen.io/desandro/pen/RQeYYp

const BokehShape = Shape.subclass({
  bokehSize: 5,
  bokehLimit: 64,
})

const BokehShapeProto = BokehShape.prototype

BokehShapeProto.updateBokeh = function() {
  // bokeh 0 -> 1
  this.bokeh = Math.abs(this.sortValue) / this.bokehLimit
  this.bokeh = Math.max(0, Math.min(1, this.bokeh))
  return this.bokeh
}

BokehShapeProto.getLineWidth = function() {
  return this.stroke + this.bokehSize * this.bokeh * this.bokeh
}

BokehShapeProto.getBokehAlpha = function() {
  const alpha = 1 - this.bokeh
  return alpha * alpha * 0.8 + 0.2
}

BokehShapeProto.renderCanvasDot = function(ctx: CanvasRenderingContext2D) {
  this.updateBokeh()
  ctx.globalAlpha = this.getBokehAlpha() // set opacity
  Shape.prototype.renderCanvasDot.apply(this, arguments)
  ctx.globalAlpha = 1 // reset
}

BokehShapeProto.renderPath = function(
  ctx: CanvasRenderingContext2D,
  renderer: any
) {
  this.updateBokeh()
  // set opacity
  if (renderer.isCanvas) {
    ctx.globalAlpha = this.getBokehAlpha()
  }
  Shape.prototype.renderPath.apply(this, arguments)
  // reset opacity
  if (renderer.isCanvas) {
    ctx.globalAlpha = 1
  }
}

const TAU = Zdog.TAU // 2*Math.PI
let empty: any

function makeMadeline(isGood: boolean, colors: any, options: any) {
  const rotor = new Anchor(options)

  const body = new Group({
    addTo: rotor,
    rotate: { x: -TAU / 8 },
    translate: { z: -48 },
    updateSort: true,
  })

  const head = new Anchor({
    addTo: body,
    translate: { y: -11, z: -2 },
    rotate: { x: TAU / 8 },
  })

  // face
  const face = new Ellipse({
    diameter: 6,
    addTo: head,
    translate: { z: 4 },
    stroke: 8,
    color: colors.skin,
  })

  const eyeGroup = new Group({
    addTo: face,
    translate: { z: face.stroke / 2 - 0.5 },
  })

    // eyes
  ;[-1, 1].forEach(function(xSide) {
    // cheek blush
    isGood &&
      new Ellipse({
        width: 2,
        height: 1.3,
        addTo: eyeGroup,
        translate: { x: 4.5 * xSide, y: 3, z: -1 },
        rotate: { y: (-TAU / 16) * xSide },
        stroke: 1,
        color: '#FA8',
        fill: true,
      })

    const eyeX = 3.5 * xSide

    // eye
    empty = new Ellipse({
      width: 0.75,
      height: 1.5,
      addTo: eyeGroup,
      color: colors.eye,
      translate: { x: eyeX },
      stroke: 2,
      fill: true,
    })

    // eye brow
    empty = new Ellipse({
      addTo: eyeGroup,
      height: 3,
      width: 1.2,
      quarters: 2,
      translate: { x: eyeX, y: -3 },
      rotate: { z: -TAU / 4 + 0.15 * xSide * (isGood ? 1 : -1) },
      color: colors.hair,
      stroke: 1,
      fill: false,
      closed: true,
    })
  })

  // hair ball
  empty = new Shape({
    path: [{ x: -1 }, { x: 1 }, { z: -4 }],
    addTo: head,
    translate: { y: -4, z: -1 },
    stroke: 18,
    color: colors.hair,
  })

  const bang = new Shape({
    path: [{}, { arc: [{ z: 4, y: 4 }, { z: 0, y: 8 }] }],
    addTo: head,
    translate: { x: 2, y: -7.5, z: 6 },
    rotate: { x: 0.5, z: -0.5 },
    stroke: 4,
    color: colors.hair,
    closed: false,
  })
  bang.copy({
    translate: { x: 5, y: -6, z: 5 },
    rotate: { x: -0.3, z: -0.5 },
  })
  bang.copy({
    translate: { x: 5, y: -6, z: 3 },
    rotate: { y: -0.7, z: -1 },
  })

  // left side
  bang.copy({
    translate: { x: -2, y: -7.5, z: 6 },
    rotate: { x: 0, z: (TAU / 16) * 6 },
  })
  bang.copy({
    translate: { x: -5, y: -6, z: 5 },
    rotate: { x: 0, z: TAU / 4 },
  })
  bang.copy({
    translate: { x: -5, y: -6, z: 3 },
    rotate: { y: 0.7, z: 1 },
  })

  // hair cover
  empty = new Shape({
    path: [{ x: -3 }, { x: 3 }],
    addTo: head,
    stroke: 7,
    translate: { y: -8, z: 5 },
    color: colors.hair,
  })

  // trail locks

  const trailLock = new Shape({
    path: [
      { y: -4, z: 0 },
      { bezier: [{ y: -10, z: -14 }, { y: 0, z: -16 }, { y: 0, z: -26 }] },
    ],
    addTo: head,
    translate: { z: -4, y: 0 },
    stroke: 10,
    color: colors.hair,
    closed: false,
  })

  trailLock.copy({
    translate: { x: -3, z: -4 },
    rotate: { z: -TAU / 8 },
    stroke: 8,
  })
  trailLock.copy({
    translate: { x: 3, z: -4 },
    rotate: { z: TAU / 8 },
    stroke: 8,
  })
  trailLock.copy({
    translate: { y: 2 },
    // rotate: { z: TAU/2 },
    scale: { y: 0.5 },
    stroke: 8,
  })

  // ----- torso ----- //

  // 2nd rib
  const torsoRib = new Ellipse({
    width: 12,
    height: 10,
    addTo: body,
    rotate: { x: -TAU / 4 },
    translate: { y: -1 },
    stroke: 6,
    color: colors.parkaLight,
    fill: true,
  })
  // neck rib
  torsoRib.copy({
    width: 6,
    height: 6,
    translate: { y: -5 },
  })
  // 3rd rib
  torsoRib.copy({
    translate: { y: 3 },
  })
  // 4th rib
  torsoRib.copy({
    translate: { y: 7 },
    color: colors.parkaDark,
  })
  // waist
  empty = new Ellipse({
    width: 10,
    height: 8,
    addTo: body,
    rotate: { x: -TAU / 4 },
    translate: { y: 11 },
    stroke: 4,
    color: colors.tight,
    fill: true,
  })

  // arms
  ;[-1, 1].forEach(function(xSide) {
    const isLeft = xSide === 1
    // shoulder ball
    empty = new Shape({
      addTo: body,
      stroke: 6,
      translate: { x: 6 * xSide, y: -5, z: -1 },
      color: colors.parkaLight,
    })

    const shoulderJoint = new Anchor({
      addTo: body,
      translate: { x: 9 * xSide, y: -3, z: -2 },
      rotate: isLeft
        ? { x: (TAU / 8) * 3, z: -TAU / 32 }
        : { z: (TAU / 16) * 2, x: (-TAU / 16) * 2 },
    })

    // top shoulder rib
    const armRib = new Ellipse({
      diameter: 2,
      rotate: { x: -TAU / 4 },
      addTo: shoulderJoint,
      translate: { x: 0 * xSide },
      stroke: 6,
      color: colors.parkaLight,
      fill: true,
    })
    armRib.copy({
      translate: { y: 4 },
    })

    const elbowJoint = new Anchor({
      addTo: shoulderJoint,
      translate: { y: 8 },
      rotate: isLeft ? {} : { z: TAU / 8 },
    })

    armRib.copy({
      addTo: elbowJoint,
      translate: { x: 0, y: 0 },
    })
    armRib.copy({
      addTo: elbowJoint,
      translate: { y: 4 },
      color: colors.parkaDark,
    })

    // hand
    empty = new Shape({
      addTo: elbowJoint,
      translate: { y: 9, z: -1 },
      stroke: 8,
      color: colors.skin,
    })

    // ----- legs ----- //
    const knee = { y: 7 }
    const thigh = new Shape({
      path: [{ y: 0 }, knee],
      addTo: body,
      translate: { x: 4 * xSide, y: 13 },
      rotate: isLeft ? {} : { x: (TAU / 16) * 3, z: TAU / 16 },
      stroke: 8,
      color: colors.tight,
    })

    const shin = new Shape({
      path: [{ y: 0 }, { y: 8 }],
      addTo: thigh,
      stroke: 6,
      translate: knee,
      rotate: isLeft ? {} : { x: (-TAU / 16) * 5 },
      color: colors.tight,
    })
  })

  // butt
  empty = new Shape({
    path: [{ x: -3 }, { x: 3 }],
    visible: false,
    addTo: body,
    translate: { y: 11, z: -2 },
    stroke: 8,
    color: colors.tight,
  })
}

function makeBird(options: any) {
  const spin = options.spin || 0

  const arrow = new Anchor({
    addTo: options.addTo,
    scale: 2 / 3,
    rotate: { z: spin },
  })

  const bird = new Group({
    addTo: arrow,
    translate: { x: 87 },
    rotate: { x: -spin },
  })

  // bird body
  empty = new Shape({
    path: [
      { x: -3, y: 0 },
      { arc: [{ x: -2, y: 1.5 }, { x: 0, y: 1.5 }] },
      { arc: [{ x: 2, y: 1.5 }, { x: 2, y: 0 }] },
    ],
    addTo: bird,
    translate: { x: 0.5 },
    stroke: 3,
    color: options.color,
    fill: true,
  })

  // bird head
  empty = new Shape({
    translate: { x: 4, y: -1 },
    addTo: bird,
    stroke: 4,
    color: options.color,
  })

  // beak
  empty = new Shape({
    path: [{ x: 0, y: -1 }, { x: 3, y: 0 }, { x: 0, y: 1 }],
    addTo: bird,
    translate: { x: 5, y: -1 },
    stroke: 1,
    color: options.color,
    fill: true,
  })

  // tail feather
  empty = new Shape({
    path: [{ x: -3, z: -2 }, { x: 0, z: 0 }, { x: -3, z: 2 }],
    addTo: bird,
    translate: { x: -4, y: 0 },
    stroke: 2,
    color: options.color,
    fill: true,
  })

  const wing = new Shape({
    path: [
      { x: 3, y: 0 },
      { x: -1, y: -9 },
      { arc: [{ x: -5, y: -4 }, { x: -3, y: 0 }] },
    ],
    addTo: bird,
    translate: { z: -1.5 },
    rotate: { x: TAU / 8 },
    stroke: 1,
    color: options.color,
    fill: true,
  })

  wing.copy({
    translate: { z: 1.5 },
    scale: { z: -1 },
    rotate: { x: -TAU / 8 },
  })
}

/// name,components,directives,filters,extends,mixins ///
@Component
export default class extends Vue {
  /// model (@Model) ///
  /// props (@Prop) ///
  /// data (private name: string = '响应式属性' // 除了undefined都会响应式) ///
  /// private instance attributes (private name?: string // 非响应式属性) ///
  /// computed (get name() { return this.name } set name()... ///
  /// watch (@Watch) ///
  /// LifeCycle (beforeCreate/created/.../destroyed) ///
  private mounted() {
    const canvas = this.$el as HTMLCanvasElement
    const context = canvas.getContext('2d')
    const width = (canvas.width = canvas.clientWidth)
    const height = (canvas.height = canvas.clientHeight)

    let isSpinning: boolean = true

    const illo = new Illustration({
      element: canvas,
      rotate: { y: -TAU / 4 },
      dragRotate: true,
      onDragStart() {
        isSpinning = false
      },
    })

    const madColor = {
      skin: '#FD9',
      hair: '#D53',
      parkaLight: '#67F',
      parkaDark: '#35D',
      tight: '#742',
      eye: '#333',
    }
    const badColor = {
      skin: '#EBC',
      hair: '#D4B',
      parkaLight: '#85A',
      parkaDark: '#527',
      tight: '#412',
      eye: '#D02',
    }

    const glow = 'hsla(60, 100%, 80%, 0.3)'
    const featherGold = '#FE5'

    /// illustration shapes ///
    makeMadeline(true, madColor, {
      addTo: illo,
    })
    makeMadeline(false, badColor, {
      addTo: illo,
      rotate: { y: TAU / 2 },
    })

    /// feather ///
    const feather = new Group({
      addTo: illo,
      rotate: { y: -TAU / 4 },
    })

    const featherPartCount = 8
    const radius = 12
    const angleX = TAU / featherPartCount / 2
    const sector = (TAU * radius) / 2 / featherPartCount

    for (let i = 0; i < featherPartCount; i++) {
      const curve = Math.cos(
        ((i / featherPartCount) * TAU * 3) / 4 + (TAU * 1) / 4
      )
      const x = 4 - curve * 2
      const y0 = sector / 2
      // const y2 = -sector/2;
      const isLast = i === featherPartCount - 1
      const y3 = isLast ? sector * -1 : -y0
      const z1 = -radius + 2 + curve * -1.5
      const z2 = isLast ? -radius : -radius
      const barb = new Shape({
        path: [
          { x: 0, y: y0, z: -radius },
          { x: x, y: -sector / 2, z: z1 },
          { x: x, y: (-sector * 3) / 4, z: z1 },
          { x: 0, y: y3, z: z2 },
        ],
        addTo: feather,
        rotate: { x: angleX * -i + TAU / 8 },
        stroke: 1,
        color: featherGold,
        fill: true,
      })
      barb.copy({
        scale: { x: -1 },
      })
    }

    // rachis
    const rachis = new Ellipse({
      addTo: feather,
      diameter: radius * 2,
      quarters: 2,
      rotate: { y: -TAU / 4 },
      stroke: 2,
      color: featherGold,
    })
    rachis.copy({
      stroke: 8,
      color: glow,
      rotate: { y: -TAU / 4, x: -0.5 },
    })

    /// rods ///
    const rodCount = 14
    for (let i = 0; i < rodCount; i++) {
      const zRotor = new Anchor({
        addTo: illo,
        rotate: { z: (TAU / rodCount) * i },
      })

      const y0 = 32
      const y1 = y0 + 2 + Math.random() * 24
      empty = new BokehShape({
        path: [{ y: y0 }, { y: y1 }],
        addTo: zRotor,
        rotate: { x: ((Math.random() * 2 - 1) * TAU) / 8 },
        color: madColor.skin,
        stroke: 1,
        bokehSize: 6,
        bokehLimit: 70,
      })
    }
    // dots
    const dotCount = 64

    for (let i = 0; i < dotCount; i++) {
      const yRotor = new Anchor({
        addTo: illo,
        rotate: { y: (TAU / dotCount) * i },
      })

      empty = new BokehShape({
        path: [{ z: 40 * (1 - Math.random() * Math.random()) + 32 }],
        addTo: yRotor,
        rotate: { x: ((Math.random() * 2 - 1) * TAU * 3) / 16 },
        color: badColor.skin,
        stroke: 1 + Math.random(),
        bokehSize: 6,
        bokehLimit: 74,
      })
    }

    /// birds ///

    const birdRotor = new Anchor({
      addTo: illo,
      rotate: { y: (TAU * -1) / 8 },
    })

    makeBird({
      addTo: birdRotor,
      color: madColor.parkaLight,
      spin: TAU / 2,
    })

    makeBird({
      addTo: birdRotor,
      color: featherGold,
      spin: (-TAU * 3) / 8,
    })

    makeBird({
      addTo: birdRotor,
      color: 'white',
      spin: -TAU / 4,
    })

    makeBird({
      addTo: birdRotor,
      color: madColor.hair,
      spin: -TAU / 8,
    })

    makeBird({
      addTo: birdRotor,
      color: madColor.parkaDark,
      spin: TAU / 8,
    })

    /// animate ///
    const rotateSpeed = -TAU / 60
    let xClock = 0
    let then = Date.now() - 1 / 60

    function update() {
      const now = Date.now()
      const delta = now - then
      // auto rotate
      if (isSpinning) {
        const theta = (rotateSpeed / 60) * delta * -1
        illo.rotate.y += theta
        xClock += theta / 4
        illo.rotate.x = (Math.sin(xClock) * TAU) / 12
      }

      illo.updateGraph()

      then = now
    }

    function animate() {
      update()
      illo.renderGraph()
      requestAnimationFrame(animate)
    }

    animate()
  }
  /// methods (private/public) ///
  /// render ///
}
</script>
