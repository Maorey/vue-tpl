/** 文件下载 */
import { Canceler } from 'axios'
import { get, CancelToken } from './ajax'

export interface IPromiseCancelable<T> extends Promise<T> {
  cancel: Canceler
}

export interface IFile {
  /** ObjectURL */
  src: string
  /** 文件名 */
  name: string
  /** 文件类型 */
  type: string
  /** 文件大小 */
  size: number
}

/** 下载文件
 * @param {string} url 下载地址(GET)
 * @param {object} query 查询参数
 * @param {string} name 指定文件名
 *
 * @returns {Promise<IFile>}
 */
function download(url: string, query?: IObject, name?: string) {
  const source = CancelToken.source()
  const promise = get(url, query, {
    responseType: 'blob',
    // contentType: 'application/octet-stream;charset=UTF-8',
    cancelToken: source.token,
  })
    .then(res => {
      ;(source as any).cancel = 0 // 已完成不可取消
      if (!name) {
        name = res.headers['content-disposition'].split(';')
        name = (name as any)[(name as any).length - 1].split('=')
        name = (name as any)[(name as any).length - 1]
      }

      return {
        name,
        size: res.data.size,
        // res.data.type, // application/x-msdownload
        type: (name as string).substring(
          (name as string).lastIndexOf('.') + 1 || (name as string).length
        ),
        src: window.URL.createObjectURL(res.data),
      }
    })
    .catch(err => {
      ;(source as any).cancel = 0 // 已完成不可取消
      throw err
    }) as IPromiseCancelable<IFile>
  promise.cancel = (message?: string) => {
    if (source.cancel) {
      console.warn(message || '取消下载:', url, query, name)
      source.cancel(message)
      ;(source as any).cancel = 0 // 只取消一次
    }
  }

  return promise
}

/** 保存已下载文件
 * @param {IFile} info 文件信息
 */
function save(info: IFile) {
  const link = document.createElement('a')
  link.style.display = 'none'
  link.download = info.name
  link.href = info.src

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/** 释放文件
 * @param {string|IFile} info 文件内容字符串
 */
function free(info: string | IFile) {
  window.URL.revokeObjectURL((info as IFile).src || (info as string))
}

export { download, save, free }
