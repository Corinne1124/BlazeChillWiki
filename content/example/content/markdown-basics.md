---
tags:
  - markdown
title: Markdown 基础
description: 学习编写 Wiki 内容所需的 Markdown 语法
order: 1
---

# Markdown 基础

eziwiki 完整支持 GitHub 风格 Markdown（GFM）。本指南涵盖你需要的全部语法。

## 标题

```markdown
# 标题 1

## 标题 2

### 标题 3

#### 标题 4

##### 标题 5

###### 标题 6
```

## 文本格式

```markdown
**粗体文本**
_斜体文本_
**_粗体加斜体_**
~~删除线~~
`行内代码`
```

**粗体文本**
_斜体文本_
**_粗体加斜体_**
~~删除线~~
`行内代码`

## 列表

### 无序列表

```markdown
- 项目 1
- 项目 2
  - 嵌套项目 2.1
  - 嵌套项目 2.2
- 项目 3
```

- 项目 1
- 项目 2
  - 嵌套项目 2.1
  - 嵌套项目 2.2
- 项目 3

### 有序列表

```markdown
1. 第一项
2. 第二项
3. 第三项
   1. 嵌套项 3.1
   2. 嵌套项 3.2
```

1. 第一项
2. 第二项
3. 第三项
   1. 嵌套项 3.1
   2. 嵌套项 3.2

### 任务列表

```markdown
- [x] 已完成的任务
- [ ] 未完成的任务
- [ ] 另一个任务
```

- [x] 已完成的任务
- [ ] 未完成的任务
- [ ] 另一个任务

## 链接

```markdown
[链接文本](https://example.com)
[带标题的链接](https://example.com '标题文本')
[内部链接](/example/getting-started/quick-start)
```

[链接文本](https://example.com)
[带标题的链接](https://example.com '标题文本')
[内部链接](/example/getting-started/quick-start)

## 图片

```markdown
![替代文本](/images/screenshot.png)
![带标题的替代文本](/images/screenshot.png '图片标题')
```

## 代码块

### 行内代码

```markdown
在 JavaScript 中使用 `const` 而不是 `var`。
```

在 JavaScript 中使用 `const` 而不是 `var`。

### 带语法高亮的代码块

````markdown
```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
```
````

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
```

更多细节请参见 [代码块](/example/content/code-blocks)。

## 引用块

```markdown
> 这是一个引用块。
> 它可以跨越多行。
>
> > 嵌套引用块
```

> 这是一个引用块。
> 它可以跨越多行。
>
> > 嵌套引用块

## 表格

```markdown
| 表头 1   | 表头 2   | 表头 3   |
| -------- | -------- | -------- |
| 单元格 1 | 单元格 2 | 单元格 3 |
| 单元格 4 | 单元格 5 | 单元格 6 |
```

| 表头 1   | 表头 2   | 表头 3   |
| -------- | -------- | -------- |
| 单元格 1 | 单元格 2 | 单元格 3 |
| 单元格 4 | 单元格 5 | 单元格 6 |

### 对齐

```markdown
| 左对齐 | 居中 | 右对齐 |
| :----- | :--: | -----: |
| L1     |  C1  |     R1 |
| L2     |  C2  |     R2 |
```

| 左对齐 | 居中 | 右对齐 |
| :----- | :--: | -----: |
| L1     |  C1  |     R1 |
| L2     |  C2  |     R2 |

## 分隔线

```markdown
---
---
```

---

## Markdown 中的 HTML

你可以在 Markdown 中使用 HTML 标签：

```markdown
<div style="color: red;">
  这段文本是红色的。
</div>

<details>
  <summary>点击展开</summary>
  这里隐藏着内容。
</details>
```

<details>
  <summary>点击展开</summary>
  这里隐藏着内容。
</details>

## 转义字符

使用反斜杠转义特殊字符：

```markdown
\*不是斜体\*
\[不是链接\]
\`不是代码\`
```

\*不是斜体\*
\[不是链接\]
\`不是代码\`

## 换行

行末的两个空格会创建一个换行：

```markdown
第一行  
第二行
```

或者使用空行来分段：

```markdown
第一段

第二段
```

## 脚注

```markdown
这是一个带脚注的句子[^1]。

[^1]: 这是脚注的内容。
```

这是一个带脚注的句子[^1]。

[^1]: 脚注会汇集在页面底部，每条脚注都会链接回它被引用的位置。

## 数学

用 `$` 将表达式包裹起来以嵌入句子中，或用 `$$` 让它独占一行：

```markdown
质能关系是 $E = mc^2$。

$$
\int_0^1 x^2 \, dx = \frac{1}{3}
$$
```

质能关系是 $E = mc^2$。

$$
\int_0^1 x^2 \, dx = \frac{1}{3}
$$

排版在构建期间完成，因此页面加载时公式已经绘制好——不会下载任何数学库，文本稳定之后也不会有内容再移动到位。

如需显示字面上的美元符号，请转义为 `\$`。同一行中两个未转义的美元符号会被当作公式处理，因此 `$5 and $7` 会变成数学公式，而不是两个价格。

## 表情符号

直接输入字符本身：

```markdown
😊 ❤️ 🚀 🎉
```

😊 ❤️ 🚀 🎉

像 `:smile:` 这样的短代码会被原样保留，而不会被展开。无论哪种方式，最终进入 HTML 的都是字符本身，在源文件中看起来也相同。

## 提示框

以 `[!KIND]` 开头的引用块会变成提示框。这种语法在 GitHub 和 Obsidian 中是一致的，因此为其中任一平台编写的文档都可以在这里渲染，而在这里编写的文档在任何不了解该约定的地方也仍然会被当作普通引用。

```markdown
> [!NOTE]
> 有用的信息。

> [!WARNING] 注意脚下
> 标记行上的标题会取代默认标题。

> [!TIP]- 可选详情
> 末尾的 `-` 会将其折叠；`+` 则默认展开。
```

> [!NOTE]
> 读者不应错过的有用信息。

> [!WARNING] 注意脚下
> 标记行上的标题会取代默认标题。

> [!TIP]- 可选详情
> 以末尾的 `-` 折叠。这是一个 `<details>` 元素，因此无需任何脚本即可展开和收起。

五种类型带有各自的颜色——`note`、`tip`、`important`、`warning` 和 `caution`。Obsidian 更长的类型列表同样被接受，并映射到其中最接近的类型，因此笔记库能保留原有的格式：`danger` 会被当作 `caution`，`success` 当作 `tip`，`question` 当作 `important`。

无法识别的类型会保持为普通引用块，而不会被渲染成别的东西。提示框内部的一切行为都与外部一致——链接、[[wiki-links|Wiki 链接]] 和代码都能正常工作。

## 剧透文本

用一对 `||` 包起来的文字会显示为黑色遮块，点击后才显现——适合藏住剧情走向或谜底，避免无意间剧透。它要求写在同一行内，内容按纯文本处理，但其中可以写 [[wiki-links|Wiki 链接]]：

```markdown
凶手其实就是||管家||，他……

> [!SPOILER] 结局真相
> 这句话要点击后才能看到。
```

效果：

凶手其实就是||管家||，而||全城的人都是他扮演的||。

> [!SPOILER] 结局真相
>
> 这个示例页面并没有真正的秘密——剧透只是把文字藏到读者点击为止。块级剧透用 `> [!SPOILER]`（或中文写法 `> [!剧透]`）标记，默认收起，点击标题展开。

## 最佳实践

### 使用描述性的链接文本

```markdown
✅ 好的：[阅读安装指南](/example/getting-started/installation)
❌ 不好的：[点击这里](/example/getting-started/installation)
```

### 保持行简短

将长行拆开以提高可读性：

```markdown
✅ 好的：
这是一个长段落，为了在源码中获得更好的可读性，
被拆成了多行。

❌ 不好的：
这是一个没有任何换行、一直延续下去的长段落，使得源文件中的内容难以阅读。
```

### 使用一致的格式

```markdown
✅ 好的：

- 项目 1
- 项目 2
- 项目 3

❌ 不好的：

- 项目 1

* 项目 2

- 项目 3
```

### 为图片添加替代文本

```markdown
✅ 好的：![展示用户分析数据的仪表盘截图](/images/dashboard.png)
❌ 不好的：![](/images/dashboard.png)
```

## 下一步

- [了解 Frontmatter](/example/content/frontmatter)
- [探索代码块](/example/content/code-blocks)
- [创建你的第一个 Wiki](/example/getting-started/first-wiki)
