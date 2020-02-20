// 要求 大小写字母、特殊字符(括号空格不算 _-!@#$%^&* )、数字 的组合
// const REG_PASSWORD = /^[a-z_\-!@#$%^&*][\w\-!@#$%^&*]+$/i
// 分组计数也不行
// eslint-disable-next-line max-len
// const REG_PASSWORD = /^(?:([a-z])|([_\-!@#$%^&*]))(?:(\d)|([a-z])|([_\-!@#$%^&*]))+$/i
const CHAR = '_!@#$%^&*-' // 允许的特殊字符

const REG_LETTER = /[a-z]/i // 字母: 1
const REG_CHARACTER = new RegExp(`[${CHAR}]`) // 特殊字符: 2
const REG_NUMBER = /\d/ // 数字: 4
/** 验证密码
 * @param {String} str 密码
 *
 * @returns {true|Error} 不符合要求抛出错误信息
 */
function password(str: string) {
  let length = str.length

  if (!length) {
    throw new Error('请输入密码')
  }
  if (length < 8 || length > 16) {
    throw new Error('密码长度在8-16位之间')
  }

  let char: any = str[0]
  if (REG_LETTER.test(char)) {
    let typeCount = 0
    while (--length) {
      char = str[length] // 客串标识
      char = REG_LETTER.test(char)
        ? 1
        : REG_CHARACTER.test(char)
          ? 2
          : REG_NUMBER.test(char)
            ? 4
            : 0
      if (char) {
        typeCount |= char
      } else {
        break
      }
    }
    // typeCount = 0 : 三种都没有
    // typeCount = 1 : 只有字母
    // typeCount = 3 : 字母、特殊字符组合
    // typeCount = 5 : 字母、数字组合
    // typeCount = 6 : 特殊字符、数字组合
    // typeCount = 7 : 字母、特殊字符、数字组合
    if (typeCount === 7) {
      return true
    }

    throw new Error(`请输入：英文字母、字符（${CHAR}）、数字 的组合`)
  }

  throw new Error('首位必须为：英文字母')
}

const DIC = [
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', // 1
  CHAR, // 2
  '0123456789', // 4
]
const random = (str: string) => str[(Math.random() * str.length) | 0]
/** 获取随机密码
 */
function randomPassword() {
  let password = random(DIC[0])
  // 密码长度
  let typeCount = 1 // 字母有了
  let type
  let len = 7 + ((Math.random() * 9) | 0)
  while (len--) {
    type =
      len < 2 && typeCount < 7
        ? typeCount < 5
          ? 2
          : 1
        : (Math.random() * 3) | 0
    password += random(DIC[type])
    typeCount |= type << 1 || 1
  }

  return password
}

/** 验证用户名
 * @param {String} str 用户名
 *
 * @returns {true|Error} 不符合要求抛出错误信息
 */
function username(str: string) {
  const length = str.length
  if (!length) {
    throw new Error('请输入用户名')
  }
  if (length < 3 || length > 20) {
    throw new Error('用户名长度在3-20位之间')
  }

  return true
}

// 固话：86 代表中国可省；区号2到4位数字不详细检查了；固话号码7到8位数字
// const REG_TELEPHONE = /^(?:86\s?-\s?)?(?:\d{2,4}\s?-\s?)?\d{7,8}$/
// 手机号码：（+86 或 86 或 0 + ） 1开头11位数
const REG_PHONE = /^(?:\+?86)?\s?0?1\d{10}$/
/** 验证电话号码
 * @param {String} str 电话号码
 *
 * @returns {true|Error} 不符合要求抛出错误信息
 */
function phone(str: string) {
  if (!str.length) {
    throw new Error('请输入电话号码')
  }
  if (REG_PHONE.test(str)) {
    return true
  }
  throw new Error('请输入正确的电话号码')
}

// 邮箱 抄的，不造为啥要写这么长，不过管用
// eslint-disable-next-line max-len
// const REG_EMAIL_LONG = /^[\w!#$%&'*+/=?^`{|}~-]+(?:\.[\w!#$%&'*+/=?^`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/
const REG_EMAIL = /^[\w-]+@[\w-.]+$/
/** 验证邮箱
 * @param {String} str 邮箱
 *
 * @returns {true|Error} 不符合要求抛出错误信息
 */
function email(str: string) {
  if (!str.length) {
    throw new Error('请输入邮箱')
  }
  if (REG_EMAIL.test(str)) {
    return true
  }
  throw new Error('请输入正确的邮箱')
}

// url http/https(/ftp/ws)...
const REG_URL = /^https?:\/\/.+/
/** 验证url
 * @param {String} str url
 *
 * @returns {true|Error} 不符合要求抛出错误信息
 */
function url(str: string) {
  if (!str.length) {
    throw new Error('请输入链接')
  }
  if (REG_URL.test(str)) {
    return true
  }
  throw new Error('请输入正确的链接')
}

// 身份证号码可(6-4-2-2-4)中横线分割【不检查区号/出生日期】
// eslint-disable-next-line max-len
// const REG_IDCARD_FORMAT = /^\d{6}\s?-?\s?\d{4}\s?-?\s?\d{2}\s?-?\s?\d{2}\s?-?\s?\d{3}(?:\d|X)$/
const REG_IDCARD = /^\d{17}(?:\d|X)$/
/** 验证身份证号码
 * @param {String} str 身份证号码
 *
 * @returns {true|Error} 不符合要求抛出错误信息
 */
function idCard(str: string) {
  if (!str.length) {
    throw new Error('请输入身份证号码')
  }
  if (REG_IDCARD.test(str)) {
    return true
  }
  throw new Error('请输入正确的身份证号码')
}

/** 验证是否正整数
 * @param {string | number} str 数字
 *
 * @returns {true|Error} 不符合要求抛出错误信息
 */
function pInt(str: any) {
  str = parseFloat(str)
  if (str > 0 && str === (str | 0)) {
    return true
  }
  throw new Error('请输入正整数')
}

/** 验证是否合法ip
 * @param {string} ip ip地址
 *
 * @returns {true|Error} 不符合要求抛出错误信息
 */
function ip(str: string) {
  const result = str.split('.')
  let len = result.length
  let pass: boolean | number = len === 4
  if (pass) {
    while (len--) {
      pass = parseInt(result[len])
      if (!(pass = pass >= 0 && pass <= 255)) {
        break
      }
    }
  }

  if (pass) {
    return true
  }
  throw new Error('请输入正确的ip地址')
}

export {
  username,
  password,
  randomPassword,
  phone,
  email,
  url,
  idCard,
  pInt,
  ip,
}
