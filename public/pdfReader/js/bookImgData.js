// 书本目录，如果无ols变量则无目录，ols 变量名勿删，全局共享
var ols = [
  {
    caption: '测试目录1',
    page: '1',
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
]

// 路径配置 - 适配 Vue3 项目
var loadImgpath = '/pdfReader/files/thumb/'

bookConfig.largePath = loadImgpath // 大图路径
bookConfig.normalPath = loadImgpath
bookConfig.thumbPath = loadImgpath
bookConfig.totalPageCount = ols.length // 页面数量
