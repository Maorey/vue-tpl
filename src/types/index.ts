/*
 * @Description: 类型补充定义
 * @Author: 毛瑞
 * @Date: 2019-07-02 17:01:30
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-07-08 13:34:45
 */

/** js对象
 */
export interface IObject<T = any> {
  [key: string]: T
}
