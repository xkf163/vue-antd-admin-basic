import {LOGIN, ROUTES,CODEIMAGE,PERMISSION} from '@/services/api'
import {request, METHOD, removeAuthorization} from '@/utils/request'

/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function login1(name, password) {
  return request(LOGIN, METHOD.POST, {
    name: name,
    password: password
  })
}

export async function login(parameter) {
  return request(LOGIN, METHOD.POST, parameter)
}

export async function queryPermissionsByUser() {
  return request(PERMISSION, METHOD.GET)
}


// export function logout(logoutToken) {
//   return axios({
//     url: '/sys/logout',
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json;charset=UTF-8',
//       'X-Access-Token':  logoutToken
//     }
//   })
// }


/**
 * 验证码图片
 * @param currdatetime
 * @returns {Promise<*>}
 */
export async function getCodeImage(currdatetime) {
  return request(CODEIMAGE + currdatetime, METHOD.GET)
}

export async function getRoutesConfig() {
  return request(ROUTES, METHOD.GET)
}

/**
 * 退出登录
 */
export function logout() {
  localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
  localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY)
  localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
  removeAuthorization()
}
export default {
  login,
  getCodeImage,
  logout,
  getRoutesConfig
}
