import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import './styles/base.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { initAntiCrawler } from './utils/anti-crawler'

// 初始化反爬功能
initAntiCrawler()

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.mount('#app')
