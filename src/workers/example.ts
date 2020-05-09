let count = 0
onmessage = event => {
  // console.log('test worker 收到消息:', event.data)
  postMessage({ foo: 'foo' + count++, data: event.data })
}

export default (self as any) as WebpackWorker

// 使用:
// import Example from '@/workers/example'

// const example = new Example()
// example.onmessage = (event: any) => {
//   console.log('主线程收到消息:', event.data)
// }

// let count = 0
// setInterval(() => {
//   example.postMessage({ bar: 'bar' + count++ })
// })
