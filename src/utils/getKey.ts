const CACHE_KEY: IObject<number> = {}
/** 获取唯一key
 * @param {string} name key标识(命名空间)
 */
function getKey(name?: string): string {
  return (
    (name || (name = '')) +
    (CACHE_KEY[name] ? ++CACHE_KEY[name] : (CACHE_KEY[name] = 1))
  )
}

const CACHE_UUID: IObject<string> = {}
const CHAR = 'qwertyuioplkjhgfdsazxcvbnm78965_41230MNBVCXZLKJHGFDSAPOIUYTREWQ'
/** 获取客户端唯一标识(默认长度16)
 * @param key uuid标识
 * @param len uuid长度
 * @param refresh 是否更新key对应的uuid
 */
function getUuid(
  key?: string | number,
  len?: number,
  refresh?: boolean | string
) {
  if (!refresh && (refresh = CACHE_UUID[key as string])) {
    return refresh
  }

  refresh = Date.now().toString(36) // 时间戳(长度8)
  if ((len = (len || 16) - refresh.length) > 0) {
    while (len--) {
      refresh += CHAR[(Math.random() * CHAR.length) | 0]
    }
  } else if (len < 0) {
    refresh = refresh.substring(0, refresh.length + len)
  }

  return (CACHE_UUID[key as string] = refresh)
}

export { getKey as default, getUuid }
