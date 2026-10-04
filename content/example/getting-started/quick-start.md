---
title: 快速入门
description: 5 分钟上手 eziwiki
order: 1
---

# 快速入门

![eziwiki](/images/eziwiki.webp)

## 前置要求

- Node.js 18 或更高版本
- 对 Markdown 有基本了解

## 第 1 步：创建一个 Wiki

```bash
npx create-eziwiki my-docs
```

这会生成一个完整的项目脚手架——包含引擎、配置和两个起始页面。

> 更喜欢直接从仓库本身开始？参见 [[installation]]。

## 第 2 步：安装并运行

```bash
cd my-docs
npm install
npm run dev
```

打开 <http://localhost:3000>。

## 第 3 步：编写页面

创建 `content/notes/first.md`：

```markdown
---
title: 我的第一页
description: 这是我的第一个 Wiki 页面
order: 1
---

# 我的第一页

欢迎来到我的 Wiki！
```

保存文件。页面会出现在侧边栏的 **Notes** 分区下——无需修改配置，也无需重启。这就是完整的工作流程：**一个文件就是一页**。

## 第 4 步：为分区命名

这个文件夹变成了一个名为 "Notes" 的分区。要为其命名或排序，请添加 `content/notes/_meta.json`：

```json
{
  "name": "📓 Notes",
  "order": 1,
  "color": "#dbeafe"
}
```

完整的选项列表参见 [[navigation]]。

## 第 5 步：将页面链接起来

```markdown
了解基础知识，参见 [[first]]。
```

Wiki 链接按文件名、完整路径或页面标题解析，因此无需知道页面位于何处也能建立链接。目标页面会自动在底部获得一个反向链接。参见 [[wiki-links]]。

## 第 6 步：让它属于你

编辑 `payload/config.ts`：

```typescript
export const payload: Payload = {
  global: {
    title: 'My Awesome Wiki',
    description: 'My personal knowledge base',
    baseUrl: 'https://mywiki.com',
  },
};
```

发布前请设置 `baseUrl`——规范化 URL、站点地图和社交分享预览都会用到它。参见 [[payload]] 和 [[theme]]。

## 第 7 步：构建

```bash
npm run build
```

构建产物是一个完全静态的站点，位于 `out/` 中。可以部署到任何地方——参见 [[static-export]]。

## 命令

```bash
npm run dev              # 开发服务器
npm run build            # 静态生产构建
npm run start            # 预览生产构建

npm run show-urls        # 列出每个页面及其 URL
npm run check:links      # 报告无法解析的链接和值得撰写的页面
npm run new <path>       # 创建页面，包括完整的 Frontmatter
npm run validate:payload # 检查配置

npm run lint             # ESLint
npm run format           # Prettier
npm test                 # 测试套件
```

## 下一步

- [[markdown-basics]] — 一个页面可以包含什么
- [[frontmatter]] — 每个页面的设置
- [[search]] — 读者如何找到内容
