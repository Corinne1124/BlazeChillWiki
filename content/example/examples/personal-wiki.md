---
title: 个人 Wiki 示例
description: 构建你自己的个人知识库
order: 1
---

# 个人 Wiki 示例

![eziwiki](/images/eziwiki.webp)

使用 eziwiki 构建你的个人知识库——你的第二大脑。

## 适用场景

- **学习笔记** - 记录你学到的东西
- **项目文档** - 追踪你的项目
- **读书笔记** - 记住你读过的内容
- **代码片段** - 保存有用的代码
- **会议纪要** - 记录讨论内容
- **灵感想法** - 捕捉并整理思路

## 示例结构

你的文件夹结构 _就是_ 导航——无需任何注册：

```
content/
├── intro.md
├── learning/
│   ├── _meta.json              → { "name": "📚 学习", "order": 1 }
│   ├── javascript/
│   │   ├── promises.md
│   │   ├── async-await.md
│   │   └── closures.md
│   └── typescript/
│       ├── generics.md
│       └── utility-types.md
├── projects/
│   ├── _meta.json              → { "name": "💡 项目", "order": 2 }
│   ├── todo-app.md
│   └── blog-engine.md
└── books/
    ├── _meta.json              → { "name": "📖 书籍", "order": 3 }
    └── atomic-habits.md
```

把文件放进去，它就会自动出现。使用页面 frontmatter 中的 `order` 字段可以调整它在同级页面中的排序，使用 `_meta.json` 可以为章节命名并设置颜色——参见 [[navigation]]。

## 示例页面

### 学习笔记

```markdown
---
title: JavaScript Promise 详解
description: 理解 Promise 与异步编程
---

# JavaScript Promise 详解

## 什么是 Promise？

Promise 是表示异步操作最终成功或失败的对象。

## 基本语法

\`\`\`javascript
const promise = new Promise((resolve, reject) => {
// 异步操作
if (success) {
resolve(value);
} else {
reject(error);
}
});
\`\`\`

## 使用 Promise

\`\`\`javascript
promise
.then(value => console.log(value))
.catch(error => console.error(error))
.finally(() => console.log('Done'));
\`\`\`

## 核心概念

- **Pending（待定）**：初始状态
- **Fulfilled（已兑现）**：操作成功完成
- **Rejected（已拒绝）**：操作失败

## 参考资料

- [MDN Promise 文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [JavaScript.info 的 Promise 教程](https://javascript.info/promise-basics)
```

### 项目文档

```markdown
---
title: Todo 应用项目
description: 使用 React 和 Node.js 构建的全栈 Todo 应用
---

# Todo 应用项目

## 项目概览

一个使用 React、Node.js 和 PostgreSQL 构建的全栈 Todo 应用。

## 技术栈

- **前端**：React、TypeScript、Tailwind CSS
- **后端**：Node.js、Express、PostgreSQL
- **部署**：Vercel（前端）、Railway（后端）

## 功能特性

- ✅ 创建、读取、更新、删除待办事项
- ✅ 将待办事项标记为已完成
- ✅ 按状态筛选
- ✅ 用户认证
- ✅ 响应式设计

## 架构

\`\`\`
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ React │─────▶│ Express │─────▶│ PostgreSQL │
│ Frontend │◀─────│ Backend │◀─────│ Database │
└─────────────┘ └─────────────┘ └─────────────┘
\`\`\`

## API 接口

### GET /api/todos

获取当前用户的全部待办事项。

\`\`\`typescript
interface Todo {
id: string;
title: string;
completed: boolean;
createdAt: string;
}
\`\`\`

### POST /api/todos

创建新的待办事项。

\`\`\`typescript
{
"title": "Buy groceries"
}
\`\`\`

## 经验教训

- TypeScript 让重构变得容易得多
- Tailwind CSS 大大加快了开发速度
- PostgreSQL 非常适合关系型数据
- Vercel 部署极其简单

## 下一步

- [ ] 添加截止日期
- [ ] 添加分类/标签
- [ ] 添加搜索功能
- [ ] 添加深色模式
```

### 读书笔记

```markdown
---
title: 《代码整洁之道》—— Robert C. Martin
description: 关键要点与笔记
---

# 《代码整洁之道》

**作者**：Robert C. Martin  
**出版年份**：2008  
**评分**：⭐⭐⭐⭐⭐

## 核心要点

### 有意义的命名

- 使用能表达意图的命名
- 避免误导性信息
- 做出有意义的区分
- 使用便于发音的命名

\`\`\`javascript
// ❌ 反面示例
const d = new Date();

// ✅ 正面示例
const currentDate = new Date();
\`\`\`

### 函数

- 应当保持短小
- 只做一件事
- 应有描述性的名称
- 参数应尽量少

\`\`\`javascript
// ❌ 反面示例
function processUser(name, email, age, address, phone) {
// 参数太多
}

// ✅ 正面示例
function processUser(user) {
// 单个对象参数
}
\`\`\`

### 注释

- 不要给糟糕的代码写注释——重写它
- 解释"为什么"，而不是"是什么"
- 好的代码是自我说明的

### 错误处理

- 使用异常，而不是错误码
- 不要返回 null
- 不要传递 null

## 最喜欢的名言

> "整洁的代码简单直接，读起来像优美的散文。"

> "当你读到的每个例程都与你预期的差不多时，你就知道自己在编写整洁的代码。"

## 我的笔记

这本书改变了我写代码的方式。其中的原则永不过时，适用于任何编程语言。

## 相关

- [重构](/books/refactoring)
- [设计模式](/books/design-patterns)
```

### 代码片段

```markdown
---
title: React 自定义 Hook
description: 我创建的一些实用 React Hooks
---

# React 自定义 Hook

## useLocalStorage

将状态持久化到 localStorage：

\`\`\`typescript
import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
const [value, setValue] = useState<T>(() => {
const stored = localStorage.getItem(key);
return stored ? JSON.parse(stored) : initialValue;
});

useEffect(() => {
localStorage.setItem(key, JSON.stringify(value));
}, [key, value]);

return [value, setValue] as const;
}

// 用法
const [name, setName] = useLocalStorage('name', 'John');
\`\`\`

## useDebounce

对值进行防抖（debounce）：

\`\`\`typescript
import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
const [debouncedValue, setDebouncedValue] = useState(value);

useEffect(() => {
const timer = setTimeout(() => {
setDebouncedValue(value);
}, delay);

    return () => clearTimeout(timer);

}, [value, delay]);

return debouncedValue;
}

// 用法
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 500);
\`\`\`

## useFetch

简单的数据获取：

\`\`\`typescript
import { useState, useEffect } from 'react';

function useFetch<T>(url: string) {
const [data, setData] = useState<T | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<Error | null>(null);

useEffect(() => {
fetch(url)
.then(res => res.json())
.then(setData)
.catch(setError)
.finally(() => setLoading(false));
}, [url]);

return { data, loading, error };
}

// 用法
const { data, loading, error } = useFetch<User[]>('/api/users');
\`\`\`
```

## 个人 Wiki 使用技巧

### 保持简单

不要过度整理。从少数几个分类开始，需要时再扩展。

### 写给未来的自己

想象自己在 6 个月后会重读，像给那时的自己解释一样去写。

### 在页面之间建立链接

在相关主题之间建立连接。

### 定期更新

定期回顾并更新你的笔记。

### 使用模板

为常见页面类型创建模板（读书笔记、项目文档等）。

## 下一步

- [创建你的第一个 Wiki](/example/getting-started/first-wiki)
- [学习 Markdown 基础](/example/content/markdown-basics)
- [定制你的主题](/example/configuration/theme)
