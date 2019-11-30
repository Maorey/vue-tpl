/*
 * @Description: css样式处理测试
 * @Author: 毛瑞
 * @Date: 2019-07-03 09:03:17
 */

import {
  getStyleByName,
  styleToObject,
  objectToStyle,
  updateStyle,
} from '@/utils/style'

describe('@/utils/style css样式处理', () => {
  const STYLE = `float: left;
margin: 15px 13px;
width: 100px;
height: 105px;
font: italic bold 12px/30px sans-serif;
font-family: "Microsoft Yahei", arial, sans-serif, "Microsoft Yahei";
text-align: center;
position: relative;
overflow: visible;
background: url(https://a.cn/images/a.png?width=10&height=10) 20% center no-repeat;
border: 1px dashed transparent;
border-radius: 5px;`
  const STYLE_INLINE =
    'float:left;margin:15px 13px;width:100px;height:105px;' +
    'font:italic bold 12px/30px sans-serif;' +
    'font-family:"Microsoft Yahei", arial, sans-serif, "Microsoft Yahei";' +
    'text-align:center;position:relative;overflow:visible;' +
    'background:url(https://a.cn/images/a.png?width=10&height=10) 20% center no-repeat;' +
    'border:1px dashed transparent;border-radius:5px;'
  const STYLE_OBJECT = {
    float: 'left',
    margin: '15px 13px',
    width: '100px',
    height: '105px',
    font: 'italic bold 12px/30px sans-serif',
    'font-family': '"Microsoft Yahei", arial, sans-serif, "Microsoft Yahei"',
    'text-align': 'center',
    position: 'relative',
    overflow: 'visible',
    background:
      'url(https://a.cn/images/a.png?width=10&height=10) 20% center no-repeat',
    border: '1px dashed transparent',
    'border-radius': '5px',
  }
  const FILTER = (
    key: string,
    value: string
  ): [string, string] | string | boolean | void => {
    switch (key) {
      case 'float':
        return [key + '_', value + '_']
      case 'position':
        return 'absolute'
      case 'overflow':
        return
      default:
        return true
    }
  }
  const FILTERD_STYLE = 'float_:left_;position:absolute;overflow:visible;'
  const FILTERD_STYLE_OBJECT = {
    float_: 'left_',
    position: 'absolute',
    overflow: 'visible',
  }

  it('getStyleByName: 从CSS样式名获取CSS样式值', () => {
    expect(getStyleByName(STYLE, 'font')).toBe(
      'italic bold 12px/30px sans-serif'
    )
    expect(getStyleByName(STYLE, 'font-family')).toBe(
      '"Microsoft Yahei", arial, sans-serif, "Microsoft Yahei"'
    )
    expect(getStyleByName(STYLE, 'textAlign')).toBe('center')
    expect(getStyleByName(STYLE, 'background')).toBe(
      'url(https://a.cn/images/a.png?width=10&height=10) 20% center no-repeat'
    )
  })

  it('styleToObject: CSS样式字符串转对象/json', () => {
    expect(styleToObject(STYLE)).toEqual(STYLE_OBJECT)
    expect(styleToObject(STYLE, true)).toEqual(JSON.stringify(STYLE_OBJECT))
    expect(styleToObject(STYLE, FILTER)).toEqual(FILTERD_STYLE_OBJECT)
    expect(styleToObject(STYLE, FILTER, true)).toBe(
      JSON.stringify(FILTERD_STYLE_OBJECT)
    )
  })

  it('objectToStyle: 对象转CSS样式', () => {
    expect(objectToStyle(STYLE_OBJECT)).toBe(STYLE_INLINE)
    expect(objectToStyle(STYLE_OBJECT, FILTER)).toBe(FILTERD_STYLE)
  })

  it('updateStyle: 更新样式字符串', () => {
    const TARGET_STYLE = 'overflow:hidden'
    const TARGET_STYLE_OBJECT = { overflow: 'hidden' }
    const UPDATED_STYLE = 'float_:left_;position:absolute;overflow:hidden;'

    expect(updateStyle(FILTERD_STYLE, TARGET_STYLE)).toBe(UPDATED_STYLE)
    expect(updateStyle(FILTERD_STYLE_OBJECT, TARGET_STYLE)).toBe(UPDATED_STYLE)
    expect(updateStyle(FILTERD_STYLE_OBJECT, TARGET_STYLE_OBJECT)).toBe(
      UPDATED_STYLE
    )

    expect(updateStyle('', STYLE_OBJECT, FILTER)).toBe(FILTERD_STYLE)
    expect(updateStyle(TARGET_STYLE_OBJECT, STYLE, FILTER)).toBe(
      'overflow:visible;float_:left_;position:absolute;'
    )
  })
})
