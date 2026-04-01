// 获取token
export function getToken() {
  return localStorage.getItem('assess_token')
}

// 设置token
export function setToken(token) {
  localStorage.setItem('assess_token', token)
}

// 移除token
export function removeToken() {
  localStorage.removeItem('assess_token')
}
