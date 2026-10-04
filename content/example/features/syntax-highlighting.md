---
title: 语法高亮
description: 由 Shiki 驱动的漂亮代码高亮
order: 8
---

# 语法高亮

eziwiki 使用 [Shiki](https://shiki.matsu.io/) 提供漂亮、准确的语法高亮。

## 为什么选择 Shiki？

- **准确** —— 使用与 VS Code 相同的 TextMate 语法
- **漂亮** —— 就是您在编辑器中已经熟悉的高亮效果
- **零客户端开销** —— 代码在构建期间完成高亮，因此不会向浏览器发送高亮器
- **两种主题同时支持** —— 浅色和深色主题以 CSS 变量形式输出，切换主题时不会闪烁或重新高亮

## 支持的语言

Shiki 内置了一百多种语言的语法——JavaScript、TypeScript、Python、Go、Rust、C、C++、C#、Java、Ruby、PHP、SQL、GraphQL、HTML、CSS、YAML、TOML、Bash 等等。

### 只加载您用到的语言

全部加载会让第一页渲染前多花大约二十秒，因此 eziwiki 会扫描您的内容，找出其中实际用到的语言，只加载这些语言以及少量常见默认项。本站加载了十六种语法，初始化时间远不到一秒。

实际效果是：**用任何受支持的语言写一个围栏代码块，它就能直接生效**——下一次构建会将其纳入。如果某个围栏代码块的语言 Shiki 无法识别，它会以纯文本渲染，而不会导致构建失败。

## 用法

### 基础代码块

使用带语言标识符的三重反引号：

````markdown
```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
```
````

结果：

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
```

### TypeScript 示例

````markdown
```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```
````

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```

### Python 示例

````markdown
```python
def calculate_fibonacci(n: int) -> list[int]:
    """Generate Fibonacci sequence."""
    if n <= 0:
        return []

    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])

    return fib
```
````

```python
def calculate_fibonacci(n: int) -> list[int]:
    """Generate Fibonacci sequence."""
    if n <= 0:
        return []

    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])

    return fib
```

## 配置

### 更换主题

编辑 `lib/markdown/highlighter.ts`：

```typescript
import { getHighlighter } from 'shiki';

const highlighter = await getHighlighter({
  themes: ['github-light', 'github-dark'],  // 在此处更换主题
  langs: ['javascript', 'typescript', ...],
});
```

### 可用主题

常用主题：

- `github-light`、`github-dark`（默认）
- `nord`
- `dracula`
- `monokai`
- `one-dark-pro`
- `material-theme`
- `solarized-light`、`solarized-dark`

查看[全部主题](https://github.com/shikijs/shiki/blob/main/docs/themes.md)。

### 添加语言

添加更多需要支持的语言：

```typescript
const highlighter = await getHighlighter({
  themes: ['github-light', 'github-dark'],
  langs: [
    'javascript',
    'typescript',
    'python',
    'rust', // 添加 Rust
    'kotlin', // 添加 Kotlin
    'swift', // 添加 Swift
  ],
});
```

## 深色模式支持

代码块会自动适配主题：

```typescript
// 浅色模式：github-light 主题
// 深色模式：github-dark 主题

const html = highlighter.codeToHtml(code, {
  lang: 'javascript',
  theme: isDark ? 'github-dark' : 'github-light',
});
```

## 行内代码

行内代码使用简单的等宽字体样式：

```markdown
在 JavaScript 中使用 `const` 而不是 `var`。
```

在 JavaScript 中使用 `const` 而不是 `var`。

## 行号

要添加行号，请修改高亮器配置：

```typescript
const html = highlighter.codeToHtml(code, {
  lang: 'javascript',
  theme: 'github-light',
  lineNumbers: true, // 启用行号
});
```

## 行高亮

高亮特定行：

```typescript
const html = highlighter.codeToHtml(code, {
  lang: 'javascript',
  theme: 'github-light',
  lineOptions: [
    { line: 3, classes: ['highlighted'] },
    { line: 5, classes: ['highlighted'] },
  ],
});
```

## 复制按钮

为代码块添加复制按钮：

```typescript
'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={copyCode}
        className="absolute top-2 right-2 p-2 rounded bg-gray-700 hover:bg-gray-600"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
```

## 语言检测

如果未指定语言，Shiki 会尝试自动检测：

````markdown
```
function hello() {
  console.log('Hello!');
}
```
````

但最好始终显式指定语言：

````markdown
```javascript
function hello() {
  console.log('Hello!');
}
```
````

## 性能

### 构建时渲染

代码块在构建时而非运行时完成高亮：

```typescript
// 构建期间
const html = highlighter.codeToHtml(code, { lang, theme });

// 作为静态 HTML 提供
<div dangerouslySetInnerHTML={{ __html: html }} />
```

这意味着：

- **加载更快** —— 无需客户端处理
- **包体积更小** —— 浏览器中无需语法高亮库
- **对 SEO 友好** —— 完全渲染的 HTML

### 包体积

Shiki 只在构建时运行，因此不会增加您的客户端包体积。

## 最佳实践

### 始终指定语言

````markdown
✅ 好：

```javascript
const x = 10;
```

❌ 不好：

```
const x = 10;
```
````

### 使用正确的缩进

````markdown
✅ 好：

```javascript
function example() {
  if (true) {
    console.log('Properly indented');
  }
}
```

❌ 不好：

```javascript
function example() {
  if (true) {
    console.log('Bad indentation');
  }
}
```
````

### 添加注释

````markdown
```javascript
// 初始化用户数据
const user = {
  name: 'Alice',
  email: 'alice@example.com',
};

// 发送欢迎邮件
sendEmail(user.email, 'Welcome!');
```
````

### 保持示例聚焦

````markdown
✅ 好——聚焦的示例：

```javascript
// 计算总额
const total = items.reduce((sum, item) => sum + item.price, 0);
```

❌ 不好——代码太多：

```javascript
// 100 行无关的代码……
```
````

## 故障排查

### 语言未被识别

如果某种语言没有被高亮：

1. 检查语言名称是否正确
2. 将其添加到高亮器配置的 `langs` 数组中
3. 查看[受支持的语言](https://github.com/shikijs/shiki/blob/main/docs/languages.md)

### 主题不生效

如果主题没有生效：

1. 检查主题名称是否正确
2. 将其添加到高亮器配置的 `themes` 数组中
3. 重新构建站点：`npm run build`

### 代码未高亮

如果代码块没有被高亮：

1. 检查三重反引号是否正确
2. 确认已指定语言标识符
3. 检查代码中是否有语法错误
4. 重新构建站点

## 示例

### Diff 高亮

展示代码变更：

````markdown
```diff
- const oldValue = 10;
+ const newValue = 20;
```
````

### Shell 命令

````markdown
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```
````

### 配置文件

````markdown
```json
{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  }
}
```
````

## 下一步

- [学习 Markdown 基础](/example/content/markdown-basics)
- [探索代码块指南](/example/content/code-blocks)
- [定制主题](/example/configuration/theme)
