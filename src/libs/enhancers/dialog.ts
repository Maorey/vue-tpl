// 处理拖拽
import { throttle } from '@/utils/performance'

function handleDragable(this: IObject) {
  const domRoot = this.$el
  const dragable = this.dragable
  const domDrag = domRoot.querySelector('.el-dialog__header')

  if (dragable) {
    const body = document.body
    const domPos = domRoot.querySelector('.el-dialog')
    const POS = domPos.currentStyle || window.getComputedStyle(domPos, null)

    domDrag.style.cursor = 'move'
    domDrag.addEventListener(
      'mousedown',
      (this._$d = (event: MouseEvent) => {
        const orginTop = POS.top
        const orginLeft = POS.left
        const top =
          orginTop.indexOf('%') > 0
            ? body.clientHeight * (parseFloat(orginTop) / 100)
            : parseFloat(orginTop)
        const left =
          orginLeft.indexOf('%') > 0
            ? body.clientWidth * (parseFloat(orginLeft) / 100)
            : parseFloat(orginLeft)

        const dx = event.clientX - domDrag.offsetLeft
        const dy = event.clientY - domDrag.offsetTop
        const onmousemove = throttle((event: MouseEvent) => {
          domPos.style.top = event.clientY - dy + top + 'px'
          domPos.style.left = event.clientX - dx + left + 'px'
        }, 33)
        const onmouseup = () => {
          body.removeEventListener('mousemove', onmousemove)
          body.removeEventListener('mouseup', onmouseup)
        }
        body.addEventListener('mousemove', onmousemove)
        body.addEventListener('mouseup', onmouseup)

        if (this._$t === undefined) {
          this._$t = orginTop
          this._$l = orginLeft
        }
      })
    )

    if (!this._$v) {
      this._$v = 1
      const orginAfterLeave = this.afterLeave
      this.afterLeave = () => {
        if (this._$t !== undefined) {
          domPos.style.top = this._$t
          domPos.style.left = this._$l
        }
        orginAfterLeave.apply(this, arguments)
      }
      // 改为 afterLeave
      // this.$watch('visible', (visible: boolean) => {
      //   if (!visible && this.dragable) {
      //     domPos.style.top = this._$t
      //     domPos.style.left = this._$l
      //   }
      // })
      this.$once('hook:beforeDestroy', () => {
        domDrag.removeEventListener('mousedown', this._$d)
      })
    }
  } else {
    domDrag.style.cursor = ''
    domDrag.removeEventListener('mousedown', this._$d)
  }
}

/** hack: 使ElDialog支持 props dragable (默认true) 允许拖拽
 */
export default <T>(component: T) => {
  let options = (component as any).options || component

  // 增加 props: dragable
  if ((options.props || (options.props = {})).dragable) {
    return
  }

  // watch dragable
  ;(options.watch || (options.watch = {})).dragable = {
    immediate: true,
    handler() {
      this.$el ? handleDragable.call(this) : this.$nextTick(handleDragable)
    },
  }
  ;(options = options.props).dragable = {
    default: true,
    type: Boolean,
  }
  options.closeOnClickModal.default = false // 默认禁止点击外部关闭弹窗

  return component
}
