// 消息总线
import { on, once, off, emit } from '@/utils/eventBus'

describe('@/utils/eventBus: 消息总线', () => {
  const nameSpace = 'test'
  const eventA = 'a'
  const eventB = 'b'
  let a: string
  let b: string
  const handler = (a1: string, a2: string) => {
    a = a1
    b = a2
  }
  const handler1 = (a1: string, a2: string) => {
    a = a1
    b = a2
  }

  it('on: 监听事件', () => {
    expect(on(eventA, handler)).toBeUndefined()
    expect(on(eventB, nameSpace, handler)).toBeUndefined()
  })

  it('once: 监听事件(只触发一次)', () => {
    expect(once(eventA, nameSpace, handler)).toBeUndefined()
    expect(once(eventB, handler)).toBeUndefined()
  })

  it('emit: 触发事件', () => {
    emit(eventA, eventA, nameSpace)
    expect(a).toBe(eventA)
    expect(b).toBe(nameSpace)

    emit(nameSpace + '.' + eventB, nameSpace, eventA)
    expect(a).toBe(nameSpace)
    expect(b).toBe(eventA)

    // 触发一次
    emit(nameSpace + '.' + eventA, eventA)
    expect(a).toBe(eventA)
    expect(b).toBeUndefined()

    emit(eventB, undefined, eventB)
    expect(a).toBeUndefined()
    expect(b).toBe(eventB)

    // 不应生效
    emit(nameSpace + '.' + eventA, eventA)
    expect(a).toBeUndefined()
    expect(b).toBe(eventB)

    emit(eventB, eventB, nameSpace)
    expect(a).toBeUndefined()
    expect(b).toBe(eventB)
  })

  it('off: 移除事件', () => {
    a = b = ''
    // 移除所有事件
    off()
    emit(eventA, eventA, nameSpace)
    expect(a).toBe('')
    expect(b).toBe('')
    // 移除指定事件
    on(eventA, nameSpace, handler)
    on(eventA, nameSpace, handler1)
    on(eventB, handler)
    off(eventA, nameSpace)
    emit(nameSpace + '.' + eventA, eventA, nameSpace)
    expect(a).toBe('')
    expect(b).toBe('')
    emit(eventB, eventB, nameSpace)
    expect(a).toBe(eventB)
    expect(b).toBe(nameSpace)
    // 移除指定事件的指定回调
    on(eventB, handler1)
    off(eventA, handler1)
    emit(eventB, nameSpace, eventB)
    expect(a).toBe(nameSpace)
    expect(b).toBe(eventB)
  })
})
