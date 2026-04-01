import MarkdownIt from 'markdown-it'

function createMarkdownRenderer() {
  const md = new MarkdownIt({
    breaks: true,
    linkify: false,
    html: true,
    // linkify: true,
    typographer: true,
  })

  // 1. 预处理：修复原始文本中的<a标签
  const originalParse = md.parse.bind(md)
  md.parse = function (src, env) {
    // 预处理：确保<a和属性、属性之间都有空格
    const preprocessedSrc = src
      .replace(/<a(\s*)([^>]*?)href=/g, '<a$1$2 href=')
      .replace(/<a([^>]*?)target=/g, '<a$1 target=')
    return originalParse(preprocessedSrc, env)
  }

  // 2. 自定义链接渲染器
  const defaultLinkRender =
    md.renderer.rules.link_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options)
    }

  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    const token = tokens[idx]

    // 规范化属性格式
    const attrs = token.attrs || []
    let hasTarget = false

    // 处理属性
    const normalizedAttrs = attrs.map(attr => {
      // 确保href和target属性前有空格
      if (attr[0] === 'target') hasTarget = true
      return attr
    })

    // 如果存在target属性，确保格式正确
    if (hasTarget) {
      token.attrs = normalizedAttrs
    }

    // 渲染后再次检查
    let rendered = defaultLinkRender(tokens, idx, options, env, self)
    rendered = rendered
      .replace(/<a([^\s>]*)href=/g, '<a$1 href=')
      .replace(/(\S)target=/g, '$1 target=')

    return rendered
  }

  // 3. 后处理：最终保障
  const originalRender = md.render.bind(md)
  md.render = function (src, env) {
    // 预处理
    const preprocessedSrc = src
      .replace(/<a(\s*)([^>]*?)href=/g, '<a$1$2 href=')
      .replace(/(\S)target=/g, '$1 target=')

    // 渲染
    let result = originalRender(preprocessedSrc, env)

    // 后处理：确保所有规则都应用
    result = result
      .replace(/<a([^\s>]*)href=/g, '<a$1 href=')
      .replace(/(\S)target=/g, '$1 target=')
      .replace(/(target="[^"]*")(\S)/g, '$1 $2') // 确保target后有空格

    return result
  }

  return md
}

export default createMarkdownRenderer
