import axios from 'axios'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { ElMessage } from 'element-plus'

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000,
  headers: {
    'Tenant-Id': '000000',
    'blade-requested-with': 'BladeHttpRequest',
    Authorization: 'Basic c2FiZXIzOnNhYmVyM19zZWNyZXQ=',
  },
})

// 请求拦截器
service.interceptors.request.use(
  async config => {
    // 添加token
    let token = getToken()
    if (token) {
      config.headers['blade-auth'] = `bearer ${token}`
    } else {
      try {
        const res = await requestToken()
        token = res.data.access_token
        if (token) {
          // 保存token
          setToken(token)
          config.headers['blade-auth'] = `bearer ${token}`
        }
      } catch (e) {
        // 获取token失败，跳转登录或提示
        return Promise.reject('获取token失败')
      }
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  async response => {
    const res = response
    // 业务状态码处理
    if (res.status === 200) {
      return res.data
    } else if (res.status === 401) {
      // 未授权处理
      removeToken()
      const res = await requestToken()
      const token = res.data.access_token
      setToken(token)
      return Promise.reject(new Error('请重新登录'))
    } else {
      // 其他错误
      return Promise.reject(new Error(res.message || '请求出错'))
    }
  },
  async error => {
    const { config, response } = error
    // HTTP状态码处理
    if (response) {
      switch (response.status) {
        case 401:
          removeToken()
          setTimeout(async () => {
            const res = await requestToken()
            const token = res.data.access_token
            setToken(token)
          }, 2000)
          return service(config)
          break
        case 403:
          alert('没有权限访问该资源')
          break
        case 500:
          console.log('服务器内部错误')
          if (response.data && response.data.msg) {
            ElMessage.error(response.data.msg)
          }
          break
        default:
          console.error('请求错误:', error)
      }
    }
    return Promise.reject(error)
  }
)

// 封装常用方法
export const get = (url, params) => service.get(url, { params })
export const post = (url, data) => service.post(url, data)
export const put = (url, data) => service.put(url, data)
export const del = (url, params) => service.delete(url, { params })

// 获取token
function requestToken() {
  return axios.post(
    '/api/blade-auth/oauth/token',
    {
      grant_type: 'appAuth',
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Tenant-Id': '000000',
        'blade-requested-with': 'BladeHttpRequest',
        Authorization: 'Basic c2FiZXIzOnNhYmVyM19zZWNyZXQ=',
      },
    }
  )
}

export default service
