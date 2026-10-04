---
title: 你的第一个 Wiki
description: 从零创建你的第一个 Wiki 页面
order: 3
---

# 你的第一个 Wiki

让我们从零开始创建你的第一个 Wiki 页面！

## 第 1 步：创建 Markdown 文件

在 `content/` 目录下创建一个新文件：

```bash
# 创建新文件
touch content/my-first-page.md
```

## 第 2 步：添加 Frontmatter

打开该文件，在文件顶部添加 Frontmatter：

```markdown
---
title: 我的第一页
description: 这是我的第一个 Wiki 页面
---
```

Frontmatter 是可选的，但建议添加，以便获得更好的 SEO 和导航效果。

## 第 3 步：编写内容

使用 Markdown 添加你的内容：

```markdown
---
title: 我的第一页
description: 这是我的第一个 Wiki 页面
---

# 我的第一页

欢迎来到我的第一个 Wiki 页面！

## 我今天学到了什么

- 如何创建 Wiki 页面
- 如何使用 Markdown
- 如何添加 Frontmatter

## 代码示例

这是一个简单的 JavaScript 函数：

\`\`\`javascript
function greet(name) {
return `Hello, ${name}!`;
}

console.log(greet('World'));
\`\`\`

## 下一步

接下来我会学习更多关于 [Markdown 基础](/example/content/markdown-basics) 的内容。
```

## 第 4 步：查看你的页面

保存文件，然后打开 <http://localhost:3000>。**就这样**——页面已经出现在侧边栏中，位于以它的文件夹命名的分区之下，并且已经可以被搜索到。

无需更新任何 navigation 数组。`content/` 下的每个 Markdown 文件都会被自动发布。

## 组织内容

### 创建文件夹

文件夹会成为侧边栏分区：

```bash
mkdir -p content/guides
touch content/guides/getting-started.md
touch content/guides/advanced.md
```

两个页面会立即出现，并归入 **Guides** 分区。

### 命名并排序分区

要控制文件夹的呈现方式，请在其页面旁边添加一个 `_meta.json`：

```json
{
  "name": "📖 Guides",
  "order": 1,
  "color": "#dbeafe"
}
```

### 页面排序

在每个页面的 Frontmatter 中使用 `order`——数字越小越靠前：

```markdown
---
title: 入门
order: 1
---
```

没有 `order` 的页面会排在设有 `order` 的页面之后，并按字母顺序排列。

### 手动控制

如果你想要文件夹无法表达的页面结构，可以在 `payload/config.ts` 中添加一个 `navigation` 数组。它不必列出所有页面——未列出的页面仍然会被发现并追加进来。参见 [[navigation]]。

## 打造优秀 Wiki 页面的技巧

### 使用清晰的标题

```markdown
# 主标题（H1）

## 分区（H2）

### 子分区（H3）
```

### 添加代码块

```markdown
\`\`\`typescript
const greeting: string = 'Hello, World!';
\`\`\`
```

### 在页面之间建立链接

```markdown
查看[另一个页面](/guides/getting-started)。
```

### 添加列表

```markdown
- 项目符号 1
- 项目符号 2
  - 嵌套项

1. 编号项 1
2. 编号项 2
```

### 插入图片

```markdown
![替代文本](/images/screenshot.png)
```

## 常见模式

### 文档页面

```markdown
---
title: API 参考
description: 完整的 API 文档
---

# API 参考

## 身份验证

所有 API 请求都需要身份验证……

## 接口端点

### GET /api/users

返回用户列表……
```

### 教程页面

```markdown
---
title: 构建你的第一个应用
description: 分步教程
---

# 构建你的第一个应用

在本教程中，你将学习……

## 前置要求

- 已安装 Node.js
- 基本的 JavaScript 知识

## 第 1 步：初始化

首先，创建一个新项目……
```

### 参考页面

```markdown
---
title: 配置选项
description: 所有可用的配置选项
---

# 配置选项

## 全局设置

### title

- 类型：`string`
- 必填：是
- 说明：站点标题

### description

- 类型：`string`
- 必填：否
- 说明：站点描述
```

## 下一步

- [学习 Markdown 基础](/example/content/markdown-basics)
- [探索配置选项](/example/configuration/payload)
- [定制你的主题](/example/configuration/theme)

恭喜！你已经创建了你的第一个 Wiki 页面。🎉
