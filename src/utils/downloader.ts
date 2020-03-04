/** 文件下载
 */
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
}

/** 下载文件
 * @param {string} url 下载地址(GET)
 * @param {object} query 查询参数
 *
 * @returns {Promise<IFile>}
 */
function download(url: string, query?: IObject) {
  const source = CancelToken.source()
  const promise = get(url, query, {
    responseType: 'blob',
    cancelToken: source.token,
  }).then(res => {
    let name = res.headers['content-disposition'].split(';')
    name = name[name.length - 1].split('=')
    name = name[name.length - 1]

    return {
      name,
      type: res.type,
      src: window.URL.createObjectURL(new Blob([res], { type: res.type })),
    }
  }) as IPromiseCancelable<IFile>
  promise.cancel = source.cancel

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
