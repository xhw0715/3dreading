# 3D 翻页书 Vue3 实现说明

## 项目概述

已将示例文件夹 `shili` 中的 3D 翻页书项目转换为 Vue 3 实现。提供了两个版本：

1. **FlipBook.vue** - 简化版本，适合快速集成
2. **FlipBook3D.vue** - 增强版本，包含完整的 3D 效果和交互功能

## 文件结构

```
src/
├── views/
│   ├── FlipBook.vue          # 简化版翻页书组件
│   └── FlipBook3D.vue        # 增强版3D翻页书组件
├── composables/
│   └── useFlipBook.js        # 翻页书逻辑复用 Hook
└── router/
    └── index.js              # 路由配置
```

## 功能特性

### 基础功能

- ✅ 3D 翻页动画效果
- ✅ 页面导航（上一页、下一页、首页、末页）
- ✅ 键盘快捷键支持
- ✅ 页码输入跳转
- ✅ 目录导航
- ✅ 自动翻页
- ✅ 全屏模式
- ✅ 响应式设计

### 增强功能（FlipBook3D）

- ✅ 更真实的 3D 翻页效果
- ✅ 书脊阴影效果
- ✅ 页面阴影渲染
- ✅ 平滑的过渡动画
- ✅ 工具栏自动显示/隐藏
- ✅ 目录面板滑动效果

## 使用方法

### 1. 访问页面

启动项目后，访问以下路由：

- 简化版：`http://localhost:5173/flipbook`
- 增强版：`http://localhost:5173/flipbook3d`

### 2. 键盘快捷键

- `←` / `→` - 上一页 / 下一页
- `Home` - 跳转到首页
- `End` - 跳转到末页
- `Esc` - 关闭目录面板

### 3. 自定义配置

在组件中修改配置：

```javascript
const {
  // ... 其他方法
} = useFlipBook({
  totalPages: 4, // 总页数
  imagePath: '/shili/pdfReader_files/', // 图片路径
  tableOfContents: [
    // 目录配置
    { caption: '章节标题', page: 1 },
    // ...
  ],
})
```

### 4. 更换图片

将您的图片放在 `public/shili/pdfReader_files/` 目录下，命名为 `1.jpg`, `2.jpg`, `3.jpg` 等。

## 核心实现

### useFlipBook Composable

提供了完整的翻页书逻辑封装：

```javascript
const {
  // 状态
  currentPage, // 当前页码
  isFlipping, // 是否正在翻页
  totalPages, // 总页数
  showToc, // 是否显示目录
  isAutoPlay, // 是否自动播放

  // 计算属性
  canGoNext, // 是否可以下一页
  canGoPrev, // 是否可以上一页
  pageInfo, // 页码信息

  // 方法
  getPageImage, // 获取页面图片
  nextPage, // 下一页
  prevPage, // 上一页
  firstPage, // 首页
  lastPage, // 末页
  goToPage, // 跳转到指定页
  toggleAutoPlay, // 切换自动播放
  toggleToc, // 切换目录显示
} = useFlipBook(config)
```

### 3D 动画实现

使用 CSS 3D transforms 实现翻页效果：

```css
.flip-page {
  transform-style: preserve-3d;
  animation: flipNext 0.6s ease-in-out;
}

@keyframes flipNext {
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(-180deg);
  }
}
```

## 技术栈

- Vue 3 Composition API
- CSS 3D Transforms
- Vite

## 与原项目对比

### 原项目（jQuery）

- 使用 jQuery 操作 DOM
- 复杂的 JavaScript 类继承
- 混合的 HTML/CSS/JS 结构
- 依赖多个外部库

### Vue 3 版本

- 使用 Vue 3 响应式系统
- Composition API 组织逻辑
- 组件化开发
- 纯 Vue 实现，无外部依赖
- 更好的代码可维护性

## 扩展建议

### 1. 添加更多页面效果

```javascript
// 在 useFlipBook.js 中添加
const flipEffects = ref('default') // 'default', 'curl', 'slide'
```

### 2. 支持 PDF 文件

```javascript
import { pdfjs } from 'pdfjs-dist'

const loadPDF = async url => {
  const pdf = await pdfjs.getDocument(url).promise
  // 渲染 PDF 页面为图片
}
```

### 3. 添加缩放功能

```javascript
const zoom = ref(1)
const zoomIn = () => (zoom.value = Math.min(zoom.value + 0.1, 2))
const zoomOut = () => (zoom.value = Math.max(zoom.value - 0.1, 0.5))
```

### 4. 添加书签功能

```javascript
const bookmarks = ref([])
const addBookmark = page => {
  bookmarks.value.push({ page, timestamp: Date.now() })
}
```

## 性能优化

1. **图片懒加载** - 只加载当前页和相邻页
2. **虚拟滚动** - 大量页面时使用虚拟列表
3. **防抖处理** - 快速翻页时的防抖
4. **预加载** - 提前加载下一页图片

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

需要支持 CSS 3D transforms 和 ES6+。

## 故障排除

### 图片不显示

检查图片路径是否正确，确保图片在 `public` 目录下。

### 翻页动画卡顿

- 减小图片尺寸
- 使用 `will-change` CSS 属性
- 启用硬件加速

### 移动端触摸问题

添加触摸事件支持：

```javascript
const handleTouchStart = e => {
  touchStartX.value = e.touches[0].clientX
}

const handleTouchEnd = e => {
  const diff = e.changedTouches[0].clientX - touchStartX.value
  if (diff > 50) prevPage()
  else if (diff < -50) nextPage()
}
```

## 许可证

MIT License
