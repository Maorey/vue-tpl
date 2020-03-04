/** 计数器缓存 */
const CACHE: IObject<number> = {}
/** 获取唯一key
 * @param {string} name key标识(命名空间)
 */
function getKey(name?: string): string {
  return (
    (name || (name = '')) + (CACHE[name] ? ++CACHE[name] : (CACHE[name] = 1))
  )
}

export default getKey
