---
title: 深色模式
description: 内置深色模式，自动跟随系统主题切换
order: 7
---

# 深色模式

eziwiki 内置了漂亮的深色模式，用户只需一次点击即可切换。

## 功能特性

- **一键切换** - 即时切换主题
- **偏好记忆** - 记住用户的选择
- **跟随系统** - 尊重操作系统的主题偏好
- **平滑过渡** - 主题切换带动画效果
- **无障碍** - 符合 WCAG 的对比度标准

## 使用方法

### 切换按钮

点击右上角的主题切换按钮：

- ☀️ 浅色模式
- 🌙 深色模式

### 键盘快捷键

按 `Ctrl/Cmd + Shift + D` 切换（如果已实现）。

## 主题颜色

### 浅色模式

```css
:root {
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
```

### 深色模式

```css
.dark {
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

## 自定义

### 自定义颜色

编辑 `styles/theme.css` 来自定义颜色：

```css
.dark {
  /* 你的自定义深色模式颜色 */
  --color-primary: #10b981; /* 绿色主色 */
  --color-background: #0f172a; /* 更深的背景 */
  --color-sidebar-bg: #1e293b; /* 更深的侧边栏 */
}
```

### 禁用深色模式

如需彻底移除深色模式：

1. 删除主题切换组件
2. 从 `styles/theme.css` 中删除 `.dark` 样式
3. 删除 `components/ThemeToggle.tsx` 中的深色模式逻辑

### 强制深色模式

如需始终使用深色模式：

```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
```

## 实现

### 主题切换组件

```typescript
'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // 读取已保存的主题
    const saved = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

    const initialTheme = saved || systemTheme;
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}
```

### 系统偏好检测

自动检测用户的操作系统主题：

```typescript
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// 监听系统主题变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  const newTheme = e.matches ? 'dark' : 'light';
  setTheme(newTheme);
});
```

### 持久化存储

主题偏好保存在 localStorage 中：

```typescript
// 保存主题
localStorage.setItem('theme', 'dark');

// 读取主题
const savedTheme = localStorage.getItem('theme');
```

## 语法高亮

代码块会自动适配主题：

```typescript
// 浅色模式：github-light 主题
// 深色模式：github-dark 主题

const highlighter = await getHighlighter({
  themes: ['github-light', 'github-dark'],
  langs: ['javascript', 'typescript', ...],
});
```

## 无障碍

### 对比度

所有颜色都符合 WCAG AA 标准：

- **普通文本**：最低 4.5:1
- **大号文本**：最低 3:1
- **UI 组件**：最低 3:1

### 焦点指示

两种主题下焦点状态都清晰可见：

```css
button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### 屏幕阅读器

主题切换按钮带有正确的标签：

```tsx
<button aria-label="Toggle dark mode">{/* 图标 */}</button>
```

## 最佳实践

### 测试两种主题

务必在浅色和深色两种模式下测试你的内容：

```bash
npm run dev
# 切换主题并检查：
# - 文字可读性
# - 图片可见性
# - 代码块对比度
# - 链接颜色
```

### 使用 CSS 变量

使用 CSS 变量而不是写死的颜色：

```css
✅ 好： .button {
  background: var(--color-primary);
  color: var(--color-text);
}

❌ 差： .button {
  background: #2563eb;
  color: #1f2937;
}
```

### 避免纯黑/纯白

使用略微偏离纯黑/纯白的颜色，以获得更好的可读性：

```css
✅ 好：
--color-background: #111827;  /* 深灰色 */
--color-text: #f9fafb;        /* 米白色 */

❌ 差：
--color-background: #000000;  /* 纯黑 */
--color-text: #ffffff;        /* 纯白 */
```

### 测试图片

有些图片在深色模式下可能效果不佳。可以考虑：

```markdown
<!-- 浅色模式下的图片 -->

![截图](/images/screenshot-light.png)

<!-- 或者用 CSS 来调整 -->
<img src="/images/screenshot.png" class="dark:opacity-80" />
```

## 故障排查

### 主题未持久化

如果刷新页面后主题没有保留：

1. 检查 localStorage 是否已启用
2. 确认主题已保存：`localStorage.getItem('theme')`
3. 检查 JavaScript 错误
4. 清除浏览器缓存

### 错误主题闪烁

如果你在深色模式下看到浅色主题一闪而过：

在 `app/layout.tsx` 的内容之前添加这段脚本：

```tsx
<script
  dangerouslySetInnerHTML={{
    __html: `
      (function() {
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.classList.toggle('dark', theme === 'dark');
      })();
    `,
  }}
/>
```

### 颜色不变化

如果切换主题时颜色没有变化：

1. 检查 `<html>` 上是否添加了 `.dark` 类
2. 确认 CSS 变量已定义
3. 检查 CSS 优先级问题
4. 在 DevTools 中检查元素

## 示例

### 自定义主题切换器

```typescript
export function ThemeSelector() {
  const themes = ['light', 'dark', 'auto'];
  const [theme, setTheme] = useState('auto');

  const applyTheme = (newTheme: string) => {
    if (newTheme === 'auto') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      document.documentElement.classList.toggle('dark', systemTheme === 'dark');
    } else {
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }
    localStorage.setItem('theme', newTheme);
  };

  return (
    <select value={theme} onChange={(e) => {
      setTheme(e.target.value);
      applyTheme(e.target.value);
    }}>
      <option value="light">☀️ Light</option>
      <option value="dark">🌙 Dark</option>
      <option value="auto">💻 System</option>
    </select>
  );
}
```

### 多套配色方案

```css
/* 蓝色主题（默认） */
:root {
  --color-primary: #2563eb;
}

/* 绿色主题 */
.theme-green {
  --color-primary: #059669;
}

/* 紫色主题 */
.theme-purple {
  --color-primary: #7c3aed;
}
```

## 下一步

- [定制主题颜色](/example/configuration/theme)
- [了解语法高亮](/example/features/syntax-highlighting)
- [[url-strategies|选择 URL 策略]]
