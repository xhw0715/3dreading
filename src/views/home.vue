<template>
  <PdfReader :ols-data="catalogData" share-title="分享标题内容" share-desc="" share-img-url="/pdfReader/files/shot.jpg"
    img-path="/pdfReader/files/thumb/" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PdfReader from '@/components/PdfReader.vue'

const catalogData = ref([])

onMounted(() => {
  // 模拟 API 获取 ols 数据
  fetchCatalogData()
})

// 模拟 API 获取目录数据
async function fetchCatalogData() {
  try {
    console.log('正在获取目录数据...')

    // 使用 setTimeout 模拟接口请求
    const data = await new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            caption: '测试目录1',
            page: '1',
            fileUrl: 'https://ganxincai.com//static/new/index/banner.png'
          },
          {
            caption: '测试目录2',
            page: '2',
          },
          {
            caption: '测试目录3',
            page: '3',
          },
          {
            caption: '测试目录4',
            page: '4',
          },
          {
            caption: '测试目录5',
            page: '5',
          },
          {
            caption: '测试目录6',
            page: '6',
          },
          {
            caption: '测试目录7',
            page: '7',
          },
        ])
      }, 500) // 模拟 500ms 的网络延迟
    })

    catalogData.value = data
    console.log('目录数据获取成功:', data)
  } catch (error) {
    console.error('获取目录数据失败:', error)
  }
}

// 当需要使用真实 API 时，替换为：
// import { getPdfCatalog } from '@/api/home'
// async function fetchCatalogData() {
//   try {
//     const response = await getPdfCatalog()
//     catalogData.value = response.data
//   } catch (error) {
//     console.error('获取目录数据失败:', error)
//   }
// }
</script>

<style scoped>
/* 页面级样式 */
</style>
