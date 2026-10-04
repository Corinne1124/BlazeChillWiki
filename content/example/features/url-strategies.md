---
tags:
  - urls
  - seo
title: URL 策略
description: 为页面 URL 选择可读路径或不可读的哈希
order: 1
---

# URL 策略

eziwiki 可以用两种方式之一来表达页面 URL。在 `payload/config.ts` 中设置一次即可：

```typescript
global: {
  urlStrategy: 'path',  // 或使用 'hash'
}
```

## `path` —— 可读 URL（默认）

URL 与内容树一一对应：

```
content/getting-started/quick-start.md  →  /getting-started/quick-start
content/intro.md                        →  /intro
```

读者在点击链接之前就能知道它指向哪里，搜索引擎可以索引站点结构，粘贴到聊天中的 URL 也自带含义。

**除非有特定理由，否则请使用此策略。**

## `hash` —— 不透明的 URL

每个路径都会被哈希成一个稳定且无意义的片段：

```
content/getting-started/quick-start.md  →  /a3f2e9d1-4b8c7e6f-9d2a1b3c
content/intro.md                        →  /c432b372-e0e30267-e65e26a1
```

该哈希是内容路径的 SHA-256 摘要，因此它是确定性的：同一个文件在每次构建中都会产生相同的 URL，只要文件不移动，链接就始终有效。

### 这能带来什么

拥有一个 URL 的人无法猜到另一个 URL，也无法从地址栏推断出您的内容结构。

### 这会付出什么代价

- **SEO** —— 搜索引擎可以抓取页面，但 URL 本身不提供任何信息
- **可分享性** —— 没有人能只看链接就知道它通向哪里
- **信任** —— 在谨慎的读者眼中，不透明的 URL 看起来像跟踪链接

这是隐蔽，而不是安全。每个页面仍然是静态导出中的公开文件；哈希只是让 URL 无法被猜到，而不是让它私有。要真正保持非公开，就不要发布它。

## 编写链接

在 Markdown 中编写普通的内容路径。它们会在构建时按当前生效的策略解析，因此同一份源码在两种策略下都能工作：

```markdown
参见[快速入门](/example/getting-started/quick-start)。
```

[[wiki-links|Wiki 链接]] 也是如此：

```markdown
参见 [[quick-start]]。
```

在 `path` 策略下，两者都会输出为 `/getting-started/quick-start`，在 `hash` 策略下则输出为对应的哈希。

解析不到任何页面的链接会保持原样——因此一个拼写错误会显示为失效链接，而不是悄无声息地指向首页。运行 [[validation-testing|`npm run check:links`]] 来找出它们。

## 查看所有 URL

```bash
npm run show-urls
```

```
📋 Page URLs  (strategy: path)
===============================================================================
📄 Quick Start
   source → content/getting-started/quick-start.md
   url    → https://eziwiki.vercel.app/getting-started/quick-start

🔒 [HIDDEN] Secret Demo Page
   source → content/secret-demo.md
   url    → https://eziwiki.vercel.app/secret-demo
```

这是找到 [[hidden-pages|隐藏页面]] 地址的最快方式。

## 切换策略

更改 `urlStrategy` 会改变站点上的每一个 URL。现有的链接、书签和搜索排名都会失效。如果您的站点已经发布，请把它当作一次迁移，而不是一个设置项。

## 下一步

- [[hidden-pages]] — 会被构建和解析但不会列出的页面
- [[search]] — 按内容查找任意页面
