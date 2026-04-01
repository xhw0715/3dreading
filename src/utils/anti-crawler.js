/**
 * 反爬虫功能模块
 */

// 禁用右键菜单
export function disableContextMenu() {
  document.addEventListener('contextmenu', e => {
    e.preventDefault()
    return false
  })
}

// 禁用F12、Ctrl+Shift+I等开发者工具快捷键
export function disableDevTools() {
  document.addEventListener('keydown', e => {
    // F12
    if (e.key === 'F12') {
      e.preventDefault()
      return false
    }
    // Ctrl+Shift+I
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
      e.preventDefault()
      return false
    }
    // Ctrl+Shift+J
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
      e.preventDefault()
      return false
    }
    // Ctrl+U (查看源代码)
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault()
      return false
    }
    // Ctrl+S (保存)
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault()
      return false
    }
  })
}

// 禁用选择文本和复制
export function disableSelection() {
  document.addEventListener('selectstart', e => {
    e.preventDefault()
    return false
  })
  document.addEventListener('copy', e => {
    e.preventDefault()
    return false
  })
  // CSS方式禁用选择
  document.body.style.userSelect = 'none'
  document.body.style.webkitUserSelect = 'none'
  document.body.style.mozUserSelect = 'none'
  document.body.style.msUserSelect = 'none'
}

// 循环debugger - 使用多种方式
export function loopDebugger() {
  // 方式1: 直接debugger
  setInterval(() => {
    debugger
  }, 100)

  // 方式2: Function构造器
  setInterval(() => {
    Function('debugger')()
  }, 50)

  // 方式3: 检测调试器打开时间
  setInterval(() => {
    const start = new Date()
    debugger
    const end = new Date()
    if (end - start > 100) {
      // 检测到调试器，刷新页面
      window.location.reload()
    }
  }, 1000)
}

// 检测开发者工具是否打开
export function detectDevTools() {
  const threshold = 160
  setInterval(() => {
    if (
      window.outerWidth - window.innerWidth > threshold ||
      window.outerHeight - window.innerHeight > threshold
    ) {
      debugger
    }
  }, 500)
}

// 清空console
export function clearConsole() {
  setInterval(() => {
    console.clear()
  }, 1000)
}

// 防止在iframe中运行
export function preventIframe() {
  if (window.self !== window.top) {
    window.top.location = window.self.location
  }
}

// 禁用console方法
export function disableConsole() {
  const noop = () => {}
  console.log = noop
  console.warn = noop
  console.error = noop
  console.info = noop
  console.debug = noop
  console.table = noop
  console.dir = noop
}

// 初始化所有反爬功能
export function initAntiCrawler() {
  // 生产环境才启用
  if (import.meta.env.MODE === 'production') {
    disableContextMenu()
    disableDevTools()
    disableSelection()
    loopDebugger()
    detectDevTools()
    clearConsole()
    preventIframe()
    disableConsole()
  }
}
