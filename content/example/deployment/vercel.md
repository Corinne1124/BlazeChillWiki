---
tags:
  - deployment
title: 部署到 Vercel
description: 几分钟内将你的 eziwiki 部署到 Vercel
order: 2
---

# 部署到 Vercel

![eziwiki](/images/eziwiki.webp)

Vercel 是以零配置部署你的 eziwiki 的最简单方式。

## 快速部署

### 使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
vercel
```

按照提示操作，你的站点将在几秒钟内上线！

### 使用 Vercel 控制台

1. 访问 [vercel.com](https://vercel.com)
2. 点击"新建项目"（New Project）
3. 导入你的 Git 仓库
4. 点击"部署"（Deploy）

就这么简单！Vercel 会自动检测 Next.js 并配置好一切。

## 自动部署

### 生产部署

每次推送到 main 分支都会触发一次生产部署：

```bash
git push origin main
```

你的站点会在 `your-project.vercel.app` 自动更新

### 预览部署

每个拉取请求都会获得一个唯一的预览 URL：

```bash
git checkout -b feature-branch
git push origin feature-branch
```

创建一个 PR，即可获得类似 `your-project-git-feature-branch.vercel.app` 的预览链接

## 自定义域名

### 1. 添加域名

在 Vercel 控制台中：

1. 进入 Project Settings → Domains
2. 添加你的域名：`wiki.example.com`
3. 按照 DNS 说明操作

### 2. 配置 DNS

添加 Vercel 提供的 DNS 记录：

```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

### 3. 启用 HTTPS

Vercel 会自动配置 SSL 证书，默认启用 HTTPS。

## 环境变量

### 添加变量

在 Vercel 控制台中：

1. 进入 Project Settings → Environment Variables
2. 添加变量：

```
NEXT_PUBLIC_BASE_URL=https://wiki.example.com
```

### 在代码中使用

```typescript
// payload/config.ts
global: {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
}
```

## 构建配置

### vercel.json

创建 `vercel.json` 以进行自定义配置：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "out",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

### 构建设置

在 Vercel 控制台中：

- **框架预设**：Next.js
- **构建命令**：`npm run build`
- **输出目录**：`out`
- **安装命令**：`npm install`

## 性能优化

### 边缘网络

Vercel 会自动部署到全球边缘网络，让世界各地的访问都更快。

### 自动缓存

静态资源会自动缓存：

- HTML：带重新验证的缓存
- JS/CSS：长期缓存
- 图片：优化并缓存

### 分析

启用 Vercel Analytics：

```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## 部署工作流

### 开发

```bash
# 在本地开发
npm run dev

# 提交更改
git add .
git commit -m "Update content"
```

### 预览

```bash
# 创建功能分支
git checkout -b new-feature

# 推送以获取预览
git push origin new-feature
```

创建 PR 以获取预览 URL。

### 生产

```bash
# 合并到 main
git checkout main
git merge new-feature
git push origin main
```

自动生产部署！

## 回滚

### 使用控制台

1. 进入 Deployments
2. 找到之前的部署
3. 点击"提升为生产部署"（Promote to Production）

### 使用 CLI

```bash
# 列出部署
vercel ls

# 回滚到指定部署
vercel rollback [deployment-url]
```

## 监控

### 部署日志

在 Vercel 控制台中查看日志：

1. 进入 Deployments
2. 点击某个部署
3. 查看构建和运行时日志

### 实时日志

```bash
# 流式查看日志
vercel logs
```

## 团队协作

### 添加团队成员

1. 进入 Project Settings → Team
2. 邀请成员
3. 设置权限（Viewer、Developer、Admin）

### 受保护分支

配置分支保护：

1. 进入 Git → Branch Protection
2. 合并前要求审查
3. 要求状态检查通过

## Vercel 功能

### 即时回滚

一键回滚到任意之前的部署。

### 预览评论

直接在 GitHub PR 中评论预览部署。

### 自动 HTTPS

为所有域名提供免费的 SSL 证书。

### 全球 CDN

部署到全球 100 多个边缘节点。

### 零配置

与 Next.js 开箱即用。

## 定价

### Hobby（免费）

- 无限次部署
- 每月 100 GB 带宽
- 自动 HTTPS
- 预览部署
- 非常适合个人 Wiki

### Pro（每月 $20）

- 每月 1 TB 带宽
- 团队协作
- 分析功能
- 密码保护
- 自定义部署区域

## 故障排查

### 构建失败

在 Vercel 控制台中查看构建日志：

```bash
# 在本地测试构建
npm run build
```

### 环境变量

确保所有必需的变量都已在 Vercel 控制台中设置。

### 域名无法访问

1. 检查 DNS 传播：`dig wiki.example.com`
2. 等待 DNS 传播，最长 48 小时
3. 确认 DNS 记录与 Vercel 的说明一致

### 显示旧内容

Vercel 的缓存策略比较激进。如需强制刷新：

1. 做一处修改
2. 推送以触发新的部署
3. 强制刷新浏览器（Ctrl+Shift+R）

## 最佳实践

### 使用 Git 集成

连接你的 Git 仓库以实现自动部署。

### 启用预览部署

在合并到生产环境之前测试更改。

### 设置自定义域名

使用你自己的域名，让站点更专业。

### 监控分析数据

跟踪页面浏览量和性能。

### 使用环境变量

不要把敏感数据写进代码里。

## 与其他平台的对比

| 功能       | Vercel       | GitHub Pages | Netlify      |
| ---------- | ------------ | ------------ | ------------ |
| 设置       | 即时         | 手动         | 简单         |
| 自定义域名 | 免费         | 免费         | 免费         |
| HTTPS      | 自动         | 自动         | 自动         |
| 预览 URL   | 支持         | 不支持       | 支持         |
| 分析       | 支持（付费） | 不支持       | 支持（付费） |
| 构建时间   | 快           | 中等         | 快           |

## 下一步

- [部署到 GitHub Pages](/example/deployment/github-pages)
- [静态导出](/example/deployment/static-export)
