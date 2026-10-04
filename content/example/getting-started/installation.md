---
title: 安装
description: eziwiki 的详细安装指南
order: 2
---

# 安装

![eziwiki](/images/eziwiki.webp)

本指南介绍安装和设置 eziwiki 的多种方式。

## 方法一：`npx create-eziwiki`（推荐）

```bash
npx create-eziwiki my-docs
cd my-docs
npm install
npm run dev
```

这会生成一个自包含的项目脚手架，包含引擎、配置文件和两个起始页面。生成的项目与 eziwiki 仓库没有任何关联——结果完全归你自由编辑。

项目名称必须是合法的 npm 包名：全小写、不含空格。该命令会拒绝向已有文件的目录中写入。

## 方法二：克隆仓库

如果你想要完整的演示内容，或者打算修改引擎本身，请使用此方法：

```bash
git clone https://github.com/i3months/eziwiki.git
cd eziwiki
npm install
npm run dev
```

发布前你需要清空 `content/` 并重写 `payload/config.ts`，因为这两处存放的都是本文档站点的内容。

## 方法三：用作 GitHub 模板

1. 打开 [eziwiki 仓库](https://github.com/i3months/eziwiki)
2. 点击 **使用此模板**
3. 克隆你的新仓库，然后安装并运行：

```bash
git clone https://github.com/yourusername/your-wiki.git
cd your-wiki
npm install
npm run dev
```

## 系统要求

- **Node.js**：18.0 或更高版本
- **npm**：9.0 或更高版本（或 yarn 1.22 及以上）
- **操作系统**：macOS、Windows 或 Linux
- **内存**：至少 2GB
- **磁盘空间**：依赖项需要 500MB

## 验证安装

安装完成后，验证一切是否正常：

```bash
# 检查 Node.js 版本
node --version  # 应为 18.0 或更高版本

# 检查 npm 版本
npm --version   # 应为 9.0 或更高版本

# 运行测试
npm run test

# 校验配置
npm run validate:payload
```

## 项目结构

安装完成后，你将得到如下结构：

```
eziwiki/
├── app/              # Next.js App Router
├── components/       # React 组件
├── content/          # 你的 Markdown 文件
├── lib/              # 工具函数与逻辑
├── payload/          # 配置
│   └── config.ts     # 主配置文件
├── public/           # 静态资源
├── styles/           # 全局样式
└── package.json      # 依赖
```

## 故障排查

### Node.js 版本错误

如果你看到 Node.js 版本错误：

```bash
# 安装 nvm（Node 版本管理器）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 安装 Node.js 18
nvm install 18
nvm use 18
```

### 端口已被占用

如果端口 3000 已被占用：

```bash
# 换一个端口
PORT=3001 npm run dev
```

### 找不到模块

如果你看到模块错误：

```bash
# 清除缓存并重新安装
rm -rf node_modules package-lock.json
npm install
```

## 下一步

- [快速入门指南](/example/getting-started/quick-start)
- [创建你的第一个 Wiki](/example/getting-started/first-wiki)
- [配置你的 Wiki](/example/configuration/payload)
