/** 获取随机数组
 * @param {number} arrayLength 随机数组长度
 */
function getRandomArray(arrayLength: number = 10000): number[] {
  const testArray: number[] = []

  while (arrayLength--) {
    testArray.push(Math.random() * arrayLength)
  }

  return testArray
}

export default getRandomArray
