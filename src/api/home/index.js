import { get, post } from '../request'

// 获取token
export const getToken = () =>
  post('/api/blade-auth/oauth/token', {
    grant_type: 'appAuth',
  })

// 获取 PDF 目录数据
export const getPdfCatalog = () => get('/api/pdf/catalog')
