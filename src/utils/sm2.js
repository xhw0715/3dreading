import smCrypto from 'sm-crypto'

// 从环境变量读取密钥
const SM2_PUBLIC_KEY = import.meta.env.VITE_SM2_PUBLIC_KEY || ''
const SM2_PRIVATE_KEY = import.meta.env.VITE_SM2_PRIVATE_KEY || ''

/**
 * sm2 加密方法
 * @param {string} data - 要加密的数据
 * @param {string} publicKey - 可选的公钥，不传则使用环境变量中的公钥
 * @returns {string} 加密后的数据
 */
export function encrypt(data, publicKey) {
  try {
    const key = publicKey || SM2_PUBLIC_KEY
    if (!key) {
      console.error('SM2公钥未配置，请在.env文件中设置VITE_SM2_PUBLIC_KEY')
      return ''
    }
    return smCrypto.sm2.doEncrypt(data, key, 0)
  } catch (error) {
    console.error('SM2加密失败:', error)
    return ''
  }
}

/**
 * sm2 解密方法
 * @param {string} data - 要解密的数据
 * @param {string} privateKey - 私钥（必须传入，前端不应该存储私钥）
 * @returns {string} 解密后的数据
 */
export function decrypt(data, privateKey) {
  try {
    // 优先使用传入的私钥，开发环境可以使用环境变量中的私钥
    const key = privateKey || (import.meta.env.DEV ? SM2_PRIVATE_KEY : '')
    if (!key) {
      console.error('SM2私钥未提供，前端不应该持有私钥')
      return ''
    }
    return smCrypto.sm2.doDecrypt(data, key, 0)
  } catch (error) {
    console.error('SM2解密失败:', error)
    return ''
  }
}

/**
 * 获取当前配置的公钥
 * @returns {string} 公钥
 */
export function getPublicKey() {
  return SM2_PUBLIC_KEY
}
