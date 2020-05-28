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
  cookie = 'XSF-TOKEN',
  /** http head字段 */
  head = 'X-XSF-TOKEN',
}
