# Vue 3 + Vite 项目

基于 Vue 3 和 Vite 构建的聊天应用，集成了国密 SM2 和 AES/DES 加密功能。

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
# 或
pnpm install
```

### 2. 配置环境变量

**重要：首次运行前必须配置环境变量**

```bash
# 复制环境变量模板
cp .env.example .env.development

# 编辑 .env.development 文件，填入实际的密钥
```

详细配置步骤请查看 [QUICK_START.md](./QUICK_START.md)

### 3. 生成 SM2 密钥（可选）

如果需要使用 SM2 加密，可以使用以下命令生成密钥对：

````

将生成的密钥复制到 `.env.development` 文件中。

### 4. 启动开发服务器

```bash
npm run dev
# 或
pnpm dev
````

访问 http://localhost:8080

## 📦 构建生产版本

```bash
npm run build
# 或
pnpm build
```

构建前请确保配置了 `.env.production` 文件。

## 🔐 安全配置

本项目使用环境变量管理敏感信息（密钥、API 地址等），提高了安全性。

### 环境变量说明

| 变量名                 | 说明                   | 是否必需 |
| ---------------------- | ---------------------- | -------- |
| `VITE_SM2_PUBLIC_KEY`  | SM2 公钥（用于加密）   | 可选     |
| `VITE_SM2_PRIVATE_KEY` | SM2 私钥（仅开发环境） | 可选     |
| `VITE_AES_KEY`         | AES 加密密钥           | 推荐     |
| `VITE_DES_KEY`         | DES 加密密钥           | 推荐     |

### 安全提示

- ✅ 环境变量文件（`.env.development`、`.env.production`）已添加到 `.gitignore`
- ✅ 生产环境不应该包含私钥
- ✅ 定期更换密钥
- ✅ 使用 HTTPS 传输数据

更多安全建议请查看 [SECURITY_UPGRADE.md](./SECURITY_UPGRADE.md)

## 📚 文档

- [快速开始指南](./QUICK_START.md) - 环境变量配置步骤
- [环境变量配置说明](./ENV_CONFIG.md) - 详细的配置文档
- [安全升级指南](./SECURITY_UPGRADE.md) - 更安全的加密方案

## 🛠️ 技术栈

- **框架**: Vue 3 + Vite
- **UI 组件**: Element Plus
- **路由**: Vue Router 4
- **加密**:
  - SM2（国密算法）- sm-crypto
  - AES/DES - crypto-js
- **Markdown**: markdown-it
- **XSS 防护**: DOMPurify

## 📁 项目结构

```
├── src/
│   ├── api/              # API 接口
│   ├── assets/           # 静态资源
│   ├── components/       # 组件
│   ├── utils/            # 工具函数
│   │   ├── aes.js       # AES/DES 加密（使用环境变量）
│   │   ├── sm2.js       # SM2 加密（使用环境变量）
│   │   └── dynamic-crypto.js  # 动态密钥加密（推荐）
│   ├── views/            # 页面
│   └── main.js           # 入口文件
├── scripts/              # 脚本工具
├── .env.example          # 环境变量模板
├── .env.development      # 开发环境配置（不提交）
├── .env.production       # 生产环境配置（不提交）
└── vite.config.js        # Vite 配置
```

## 🔧 常见问题

### Q: 环境变量不生效？

A: 修改环境变量后需要重启开发服务器。

### Q: SM2 加密失败？

A: 检查 `.env.development` 中的 `VITE_SM2_PUBLIC_KEY` 是否正确配置。

### Q: 团队成员如何配置？

A: 每个团队成员需要复制 `.env.example` 并填入自己的密钥。

更多问题请查看 [QUICK_START.md](./QUICK_START.md)

## 📄 License

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**注意**: 请勿将 `.env.development` 和 `.env.production` 文件提交到 Git 仓库！
