/** 鉴权 */

/** 是否满足(全部)指定权限
 * @param {...String} authKey 权限id
 *
 * @returns {Boolean}
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function fit(...authKey: string[]) {
  return true
}
/** 是否包含指定权限(之一)
 * @param {...String} authKey 权限id
 *
 * @returns {Boolean}
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function any(...authKey: string[]) {
  return true
}

/** 初始化权限 */
// eslint-disable-next-line no-empty-function, @typescript-eslint/no-unused-vars
export default (auth: any, expires?: number) => {}
export { fit, any }
