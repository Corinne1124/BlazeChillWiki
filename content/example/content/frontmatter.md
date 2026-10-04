---
title: Frontmatter
description: 为你的 Markdown 文件添加元数据
order: 2
---

# Frontmatter

Frontmatter 是位于 Markdown 文件开头的 YAML 元数据。它不是必需的，但为了更好的 SEO 和组织性，建议使用。

## 基本语法

Frontmatter 被包裹在 `---` 标记之间：

```markdown
---
title: 我的页面标题
description: 页面的简短描述
---

# 我的页面标题

这里写你的内容……
```

## 支持的字段

### title

页面标题用于：

- 浏览器标签页
- SEO 元标签
- Open Graph 标签

```markdown
---
title: 开始使用 eziwiki
---
```

### description

简短的描述用于：

- SEO 元描述
- Open Graph 描述
- 搜索结果

```markdown
---
title: 开始使用
description: 在 5 分钟内学会安装并使用 eziwiki
---
```

### tags

本页面所属的主题。一个文件只位于一个目录中，因此侧边栏只能展示一种排列方式；tags 则是另一种。一个页面属于一个章节，也属于它所涉及的任意多个主题。

```markdown
---
title: 部署到 Vercel
tags:
  - deployment
  - hosting
---
```

单个 tag 可以不用列表形式书写，逗号分隔的字符串也同样有效：

```markdown
tags: deployment
tags: deployment, hosting
```

每个主题都会在 `/tags/<name>` 生成一个页面，`/tags` 会列出全部主题。标签的匹配不区分大小写——`Setup` 和 `setup` 是同一个主题，而不是两个——并显示最先使用的那种写法。

[[hidden-pages|隐藏页面]] 会被排除在外。刻意不放进侧边栏的页面不应再次出现在标签列表中，否则标签索引就会变成一种枚举本应保持未列出内容的方式。

### aliases

这个页面曾经应答的地址。URL 由文件路径生成，因此把 `guides/setup.md` 移动到 `getting-started/setup.md` 会改变已发布的 URL，所有指向旧地址的书签、外部链接和搜索结果都会失效。Wiki 链接不受移动影响——它们按名称解析——但从外部到达的链接则无一幸免。

```markdown
---
title: 设置
aliases:
  - guides/setup
  - old/install-guide
---
```

每个 alias 都会被构建为一个转发到本页的页面，不进入站点地图并标记为 `noindex`，其 canonical 指向本页，这样旧地址获得的排名会转移过来，而不是被拆分。

单个 alias 可以不用列表形式书写：

```markdown
aliases: guides/setup
```

有两种错误会直接终止构建而不是被静默解决：一是 alias 指向了真实页面所占用的路径，这会让该页面无法访问；二是两个文档声明了同一个 alias，这种情况没有正确答案。在构建时发现这两类问题，比在生产环境中出现错误的页面要划算得多。

在 [[url-strategies|`hash` 策略]] 下，alias 会生成旧路径的摘要——这正是旧 URL 本身。

### updated

本页面最后一次修改的时间。它是可选的，而且通常不应该写：如果没有 `updated`，页面底部显示的日期来自最后一次修改该文件的提交记录，无需任何人记得去维护。

```markdown
---
updated: 2026-03-14
---
```

当提交记录不能说明问题时，再声明它。今天修正的一个错别字并不会让三月份的页面变得更新，而导入的文档可能早在进入仓库之前就已写成。声明的日期优先于提交记录。

不带引号的 `2026-03-14` 是 YAML 所称的日期；带引号的 `'2026-03-14'` 是字符串。两者都能被识别，完整的时间戳也是如此。没有指向真实时刻的值会被忽略，而不会被显示。

既没有声明日期也没有提交记录的页面——比如一分钟前刚写的页面——不会显示任何日期。回退到构建时间既容易也是错误的：那会显示每个页面都在站点上次发布的那一刻被修订过。

### date

本页面首次发布的时间。没有任何地方显示它；它会成为爬虫读取的结构化数据中的 `datePublished`。

```markdown
---
date: 2026-01-02
---
```

只有 frontmatter 能回答这个问题。第一次修改某个文件的提交记录是它进入仓库的时间，对于导入的 vault（笔记库）或经过重构的 wiki 而言，这并不是页面写作的时间。

## 完整示例

```markdown
---
title: API 身份验证指南
description: 学习如何使用 OAuth 2.0 对 API 请求进行身份验证
---

# API 身份验证指南

本指南涵盖身份验证方法……
```

## 为什么要使用 Frontmatter？

### 更好的 SEO

搜索引擎使用 title 和 description 用于：

- 搜索结果标题
- 元描述
- 社交媒体预览

```markdown
---
title: eziwiki - 让文档变得美观而简单
description: 一个受 Notion 和 Obsidian 启发、基于 Next.js 构建的极简 wiki 生成器
---
```

### 一致的元数据

Frontmatter 确保每个页面都有正确的元数据：

```markdown
---
title: 安装指南
description: eziwiki 的分步安装说明
---
```

### 社交分享

在社交媒体上分享时，frontmatter 提供：

- 卡片标题
- 卡片描述
- 更好的预览

## Frontmatter 与 Markdown 标题

你可以同时使用两者：

```markdown
---
title: 开始使用
description: 快速入门指南
---

# 开始使用

欢迎阅读快速入门指南……
```

frontmatter 的 `title` 用于 SEO 和元数据，而 Markdown 的 `# Heading` 显示在内容中。

## 可选的 Frontmatter

Frontmatter 完全是可选的。如果没有提供：

- title 默认为文件中的第一个 `# Heading`
- description 为空

```markdown
# 我的页面

这个页面没有 frontmatter，但仍然可以正常工作！
```

## YAML 语法

Frontmatter 使用 YAML 语法：

```yaml
---
# 简单的值
title: 我的标题
description: 我的描述

# 特殊字符使用引号
title: "标题: 带冒号"
description: '带"引号"的描述'

# 多行值
description: |
  这是一个多行
  描述，跨越多行。
---
```

## 常见模式

### 文档页面

```markdown
---
title: API 参考
description: 带有示例的完整 API 文档
---

# API 参考

## 身份验证

所有 API 请求都需要……
```

### 教程页面

```markdown
---
title: 构建你的第一个应用
description: 面向初学者的分步教程
---

# 构建你的第一个应用

在本教程中，你将学会……
```

### 指南页面

```markdown
---
title: 部署指南
description: 将你的 wiki 部署到生产环境
---

# 部署指南

本指南涵盖部署到……
```

## 最佳实践

### 保持标题简洁

```markdown
## ✅ 好的：

## title: 快速入门指南

## ❌ 太长：

## title: 一份完整的、全面的、关于开始使用 eziwiki 的快速入门指南
```

### 编写详实的描述

```markdown
## ✅ 好的：

## description: 学习如何安装 eziwiki 并创建你的第一个 wiki 页面

## ❌ 太模糊：

## description: 安装相关的东西
```

### 使用正确的大小写

```markdown
## ✅ 好的：

## title: Getting Started with eziwiki

## ❌ 不好的：

## title: getting started with eziwiki
```

### 避免重复内容

不要在 description 中重复 title：

```markdown
## ✅ 好的：

title: 安装指南
description: 安装 eziwiki 的分步说明

---

## ❌ 不好的：

title: 安装指南
description: 安装指南 - 如何安装

---
```

## 验证

eziwiki 会在构建时验证 frontmatter。常见的错误：

```markdown
## ❌ YAML 语法无效：

title: 缺少右引号
description: "未闭合的引号

---

## ❌ 结构无效：

title
description

---

## ✅ 有效：

title: 正确的标题
description: 正确的描述

---
```

## 下一步

- [学习 Markdown 基础](/example/content/markdown-basics)
- [探索代码块](/example/content/code-blocks)
- [配置你的 Wiki](/example/configuration/payload)
