---
title: 主题定制
description: 定制你的 Wiki 的颜色与外观
order: 3
---

# 主题定制

eziwiki 通过 payload 配置和 CSS 变量支持丰富的主题定制。

## 主题配置

### 基础主题

在你的 `payload/config.ts` 中添加一个 `theme` 对象：

```typescript
export const payload: Payload = {
  global: {
    title: 'My Wiki',
    description: 'My personal knowledge base',
  },
  navigation: [...],
  theme: {
    primary: '#2563eb',
    secondary: '#7c3aed',
    background: '#ffffff',
    text: '#1f2937',
    sidebarBg: '#f9fafb',
    codeBg: '#f3f4f6',
  },
};
```

### 主题属性

所有属性都是可选的：

- **primary** - 主色（链接、激活状态）
- **secondary** - 次要颜色（强调色）
- **background** - 页面背景颜色
- **text** - 正文文字颜色
- **sidebarBg** - 侧边栏背景颜色
- **codeBg** - 代码块背景颜色

颜色必须是十六进制格式：`#rrggbb`

## 内置深色模式

eziwiki 内置了自动深色模式支持。用户可以通过主题切换按钮在浅色与深色主题之间切换。

深色模式的颜色会自动调整，但你可以在 `styles/theme.css` 中自定义它们。

## 高级定制

### CSS 变量

如需更精细的控制，请编辑 `styles/theme.css`：

```css
:root {
  /* 浅色模式颜色 */
  --color-primary: #2563eb;
  --color-secondary: #7c3aed;
  --color-background: #ffffff;
  --color-text: #1f2937;
  --color-text-muted: #6b7280;
  --color-sidebar-bg: #f9fafb;
  --color-sidebar-hover: #f3f4f6;
  --color-code-bg: #f3f4f6;
  --color-code-text: #1f2937;
  --color-border: #e5e7eb;
}

.dark {
  /* 深色模式颜色 */
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --color-background: #111827;
  --color-text: #f9fafb;
  --color-text-muted: #9ca3af;
  --color-sidebar-bg: #1f2937;
  --color-sidebar-hover: #374151;
  --color-code-bg: #1f2937;
  --color-code-text: #f9fafb;
  --color-border: #374151;
}
```

### 排版

自定义字体与文字样式：

```css
:root {
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'Fira Code', 'Courier New', monospace;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
}
```

### 间距

调整间距与布局：

```css
:root {
  --sidebar-width: 280px;
  --content-max-width: 800px;
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
}
```

## 配色方案

### 蓝色主题（默认）

```typescript
theme: {
  primary: '#2563eb',
  secondary: '#7c3aed',
  background: '#ffffff',
  text: '#1f2937',
  sidebarBg: '#f9fafb',
  codeBg: '#f3f4f6',
}
```

### 绿色主题

```typescript
theme: {
  primary: '#059669',
  secondary: '#10b981',
  background: '#ffffff',
  text: '#1f2937',
  sidebarBg: '#f0fdf4',
  codeBg: '#f3f4f6',
}
```

### 紫色主题

```typescript
theme: {
  primary: '#7c3aed',
  secondary: '#a78bfa',
  background: '#ffffff',
  text: '#1f2937',
  sidebarBg: '#faf5ff',
  codeBg: '#f3f4f6',
}
```

### 深色主题

```typescript
theme: {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  background: '#111827',
  text: '#f9fafb',
  sidebarBg: '#1f2937',
  codeBg: '#1f2937',
}
```

## 分区颜色

为导航分区添加颜色：

```typescript
navigation: [
  {
    name: 'Getting Started',
    color: '#dbeafe',  // 浅蓝色
    children: [...],
  },
  {
    name: 'API Reference',
    color: '#fef3c7',  // 浅黄色
    children: [...],
  },
  {
    name: 'Examples',
    color: '#d1fae5',  // 浅绿色
    children: [...],
  },
]
```

### 推荐的分区颜色

浅淡柔和的颜色效果最好：

- **蓝色**：`#dbeafe`
- **黄色**：`#fef3c7`
- **绿色**：`#d1fae5`
- **紫色**：`#e9d5ff`
- **粉色**：`#fce7f3`
- **橙色**：`#fed7aa`
- **红色**：`#fecaca`

## 语法高亮

代码块使用 Shiki 进行语法高亮。主题在 `lib/markdown/highlighter.ts` 中配置。

可用的主题：

- `github-light`（默认浅色）
- `github-dark`（默认深色）
- `nord`
- `dracula`
- `monokai`
- `one-dark-pro`

要更改主题，请编辑 `lib/markdown/highlighter.ts`：

```typescript
const highlighter = await getHighlighter({
  themes: ['github-light', 'nord'],  // 在此更改主题
  langs: ['javascript', 'typescript', ...],
});
```

## 自定义字体

### 使用 Google Fonts

添加到 `app/layout.tsx`：

```typescript
import { Inter, Fira_Code } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const firaCode = Fira_Code({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

### 使用本地字体

将字体放入 `public/fonts/`，并添加到 `styles/theme.css`：

```css
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/CustomFont.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
}

:root {
  --font-sans: 'CustomFont', system-ui, sans-serif;
}
```

## 响应式设计

eziwiki 完全支持响应式布局。你可以在 `tailwind.config.ts` 中自定义断点：

```typescript
module.exports = {
  theme: {
    screens: {
      xs: '475px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
};
```

## 下一步

- [编写内容](/example/content/markdown-basics)
- [配置导航](/example/configuration/navigation)
- [部署你的 Wiki](/example/deployment/static-export)
