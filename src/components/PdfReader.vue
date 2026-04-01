<template>
  <div class="pdf-reader-container" ref="pdfContainer">
    <!-- pdfReader 内容将在这里动态加载 -->
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  olsData: {
    type: Array,
    required: true,
    default: () => []
  },
  shareTitle: {
    type: String,
    default: '分享标题内容'
  },
  shareDesc: {
    type: String,
    default: ''
  },
  shareImgUrl: {
    type: String,
    default: '/pdfReader/files/shot.jpg'
  },
  imgPath: {
    type: String,
    default: '/pdfReader/files/thumb/'
  }
})

const pdfContainer = ref(null)
const isInitialized = ref(false)

onMounted(() => {
  // 设置分享变量
  window.title = props.shareTitle
  window.desc = props.shareDesc
  window.link = window.location.href
  window.imgUrl = props.shareImgUrl

  // 加载 CSS 文件
  loadStyles()

  // 加载 jQuery 和其他脚本
  loadJQuery()
})

// 监听 olsData 变化
watch(() => props.olsData, (newData) => {
  if (newData && newData.length > 0 && isInitialized.value) {
    updateOlsData(newData)
  }
}, { deep: true })

function loadStyles() {
  const styles = [
    '/pdfReader/css/style.css',
    '/pdfReader/css/player.css',
    '/pdfReader/css/phoneTemplate.css',
    '/pdfReader/css/template.css'
  ]

  styles.forEach(href => {
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      document.head.appendChild(link)
    }
  })
}

function loadJQuery() {
  // 检查 jQuery 是否已加载
  if (window.jQuery) {
    loadPdfReaderScripts()
    return
  }

  const script = document.createElement('script')
  script.src = '/pdfReader/js/jquery.js'
  script.onload = () => {
    loadPdfReaderScripts()
  }
  document.head.appendChild(script)
}

function updateOlsData(data) {
  window.ols = data
  if (window.bookConfig) {
    window.bookConfig.totalPageCount = data.length
  }
  console.log('目录数据已更新:', data)
}

function loadPdfReaderScripts() {
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      // 检查脚本是否已加载
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = src
      script.onload = resolve
      script.onerror = reject
      document.body.appendChild(script)
    })
  }

  // 按顺序加载脚本
  async function loadAllScripts() {
    try {
      // 1. 先加载 config.js
      await loadScript('/pdfReader/js/config.js')
      console.log('已加载: config.js')

      // 2. 加载 LoadingJS.js (main.js 依赖它)
      await loadScript('/pdfReader/js/LoadingJS.js')
      console.log('已加载: LoadingJS.js')

      // 3. 注入 ols 数据
      if (props.olsData && props.olsData.length > 0) {
        window.ols = props.olsData
        console.log('目录数据已注入:', props.olsData)
      } else {
        console.warn('警告: olsData 为空')
        window.ols = []
      }

      // 4. 配置路径和页面数量
      if (window.bookConfig) {
        window.bookConfig.largePath = props.imgPath
        window.bookConfig.normalPath = props.imgPath
        window.bookConfig.thumbPath = props.imgPath
        window.bookConfig.totalPageCount = props.olsData.length
      }

      // 5. 加载 main.js
      await loadScript('/pdfReader/js/main.js')
      console.log('已加载: main.js')

      // 6. 加载 check.js
      await loadScript('/pdfReader/js/check.js')
      console.log('已加载: check.js')

      isInitialized.value = true
      console.log('所有 pdfReader 脚本加载完成')
    } catch (error) {
      console.error('加载脚本失败:', error)
    }
  }

  loadAllScripts()
}
</script>

<style scoped>
.pdf-reader-container {
  width: 100%;
  height: 100vh;
  position: relative;
}

/* 确保 pdfReader 的样式不被 Vue 的 scoped 样式影响 */
.pdf-reader-container :deep(*) {
  box-sizing: border-box;
}
</style>
