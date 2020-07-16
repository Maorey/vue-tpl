import { isString } from '@/utils'

function generateValue(template: string, value: string) {
  return (template + '').replace(/\{\s*value\s*\}/, value)
}

/** hack: ElRate for 显示分数支持函数
 */
export default <T>(component: T) => {
  const options = (component as any).options || component

  if (!options.computed.text._) {
    options.props.scoreTemplate = {
      type: [String, Function],
      default: '{value}',
    }
    options.computed.text = function() {
      if (this.showScore) {
        const scoreTemplate = this.scoreTemplate
        let value = this.rateDisabled ? this.value : this.currentValue
        value = +value || 0
        return isString(scoreTemplate)
          ? generateValue(scoreTemplate, value)
          : generateValue(scoreTemplate(value), value)
      }

      if (this.showText) {
        return this.texts[Math.ceil(this.currentValue) - 1]
      }

      return ''
    }
    options.computed.text._ = 1
  }

  return component
}
