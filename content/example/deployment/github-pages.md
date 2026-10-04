---
tags:
  - deployment
  - seo
title: GitHub Pages
description: 免费将你的 Wiki 部署到 GitHub Pages
order: 3
---

# GitHub Pages

免费将你的 eziwiki 部署到 GitHub Pages。

## 前置条件

- GitHub 账户
- 包含你的 Wiki 的 Git 仓库
- 在仓库设置中启用 GitHub Pages

## 快速部署

### 1. 更新配置

编辑 `payload/config.ts`：

```typescript
global: {
  title: 'My Wiki',
  description: 'My personal knowledge base',
  baseUrl: 'https://yourusername.github.io/your-repo',
}
```

### 2. 更新 next.config.js

```javascript
const nextConfig = {
  output: 'export',
  basePath: '/your-repo', // 你的仓库名称
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
```

### 3. 构建并部署

```bash
# 构建站点
npm run build

# 部署到 gh-pages 分支
npx gh-pages -d out
```

## 自动化部署

### 使用 GitHub Actions

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

### 启用 GitHub Pages

1. 进入仓库的 Settings 设置
2. 导航到 Pages 部分
3. Source（源）选择：GitHub Actions
4. 保存

### 推送以部署

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

你的站点将上线于 `https://yourusername.github.io/your-repo`

## 自定义域名

### 1. 添加 CNAME 文件

创建 `public/CNAME`：

```
wiki.example.com
```

### 2. 配置 DNS

添加 DNS 记录：

```
Type    Name    Value
A       @       185.199.108.153
A       @       185.199.109.153
A       @       185.199.110.153
A       @       185.199.111.153
```

或者用于子域名：

```
Type    Name    Value
CNAME   wiki    yourusername.github.io
```

### 3. 启用 HTTPS

1. 进入仓库的 Settings → Pages
2. 勾选"强制 HTTPS"
3. 等待 SSL 证书颁发（最长可能需要 24 小时）

## 项目站点与用户站点

### 项目站点

- URL：`https://username.github.io/repo-name`
- 任意仓库
- 需要在配置中设置 `basePath`

### 用户站点

- URL：`https://username.github.io`
- 仓库必须命名为 `username.github.io`
- 无需设置 `basePath`

## 故障排查

### 404 错误

确保 `next.config.js` 中的 `basePath` 与你的仓库名称匹配：

```javascript
basePath: '/your-repo',  // 必须与仓库名称匹配
```

### 资源未加载

检查所有资源路径是否为相对路径：

```markdown
✅ Good: ![Image](/images/screenshot.png)
❌ Bad: ![Image](images/screenshot.png)
```

### 构建失败

查看 GitHub 中的 Actions 选项卡以获取错误日志：

```bash
# 先在本地测试构建
npm run build
```

### 显示旧内容

清除 GitHub Pages 缓存：

1. 做一处修改
2. 推送以触发新的构建
3. 等待 1-2 分钟
4. 强制刷新浏览器（Ctrl+Shift+R）

## 手动部署

### 使用 gh-pages 包

```bash
# 安装 gh-pages
npm install -D gh-pages

# 将 deploy 脚本添加到 package.json
{
  "scripts": {
    "deploy": "gh-pages -d out"
  }
}

# 构建并部署
npm run build
npm run deploy
```

### 直接使用 Git

```bash
# 构建站点
npm run build

# 创建 gh-pages 分支
git checkout --orphan gh-pages

# 添加构建产物
git add -f out
git commit -m "Deploy to GitHub Pages"

# 推送到 gh-pages 分支
git push origin gh-pages

# 切换回 main 分支
git checkout main
```

## 环境特定配置

使用环境变量：

```javascript
// next.config.js
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  basePath: isProd ? '/your-repo' : '',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
```

## 最佳实践

### 使用 GitHub Actions

自动化部署比手动部署更可靠。

### 本地测试

始终在本地测试生产构建：

```bash
npm run build
npx serve out
```

### 版本控制

不要提交 `out/` 目录：

```gitignore
# .gitignore
out/
.next/
```

### 监控部署

定期检查 Actions 选项卡，查看是否有失败的部署。

## 限制

- **构建时间**：最长 10 分钟
- **站点大小**：最大 1 GB
- **带宽**：每月 100 GB 软限制
- **构建次数**：每小时 10 次

对于更大的站点，可考虑 [Vercel](/example/deployment/vercel) 或 Netlify。

## 下一步

- [部署到 Vercel](/example/deployment/vercel)
- [静态导出](/example/deployment/static-export)
