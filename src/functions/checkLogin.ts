// 检查是否登录
import CONFIG from '@/config'
import { STORAGE } from '@/enums'
import { local } from '@/utils/storage'
import { encode } from '@/functions/auth'

// mock 权限
local.set(
  STORAGE.auth,
  { children: [{ id: '0' }, { id: '1' }] },
  encode,
  CONFIG.tokenAlive
)
