/** 窗口尺寸 */
export const enum SIZE {
  xSmall = 'xs',
  small = 'sm',
  medium = 'md',
  large = 'lg',
  xLarge = 'xl',
}

/** 本地存储 */
export const enum STORAGE {
  /** 用户信息 */
  me = '`',
  /** 权限 */
  auth = '~',
  /** 偏好 */
  prefer = '!',
}

/** 授权 */
export const enum AUTH {
  /** cookie字段 */
  cookie = 'XSRF-TOKEN',
  /** http head字段 */
  head = 'X-XSRF-TOKEN',
}

/** 所有皮肤 */
export const enum SKIN {
  light = 'light',
}
/** 所有皮肤 */
export const SKINS = [SKIN.light]

/** 接口响应代码 */
export const enum API_CODE {
  success = 200,
  unauthorized = 401,
  error = 500,
  timeout = 'ECONNABORTED',
  /** 修改密码 */
  MODIFY_PASSWORD = 10001,
  /** 用户不存在或者密码不正确 */
  LOGIN_ERROR = 10002,
  /** 错误登录超过5次,限制登录30分钟 */
  RESTRICT_LOGIN = 10003,
  /** 密码错误 */
  PASSWORD_ERROR = 10004,
  /** 没有登录 */
  SESSION_NOT_LOGIN = 20001,
  /** 没有权限 */
  SESSION_NOT_PERMISSION = 20002,
  /** 没有CSRF或者CSRF不正确 */
  SESSION_NOT_CSRF = 20003,
  /** 网关超时 */
  GATEWAY_TIMEOUT = 20004,
  /** 服务异常 */
  SERVER_EXCEPTION = 20005,
  /** 请求异常 */
  REQUEST_EXCEPTION = 20006,
}

/** 权限注册 { 键: 描述 } */
export type Auth = { [key: string]: string }
