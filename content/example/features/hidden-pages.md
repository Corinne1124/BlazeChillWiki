---
tags:
  - urls
title: 隐藏页面
description: 可构建、可访问，但不会出现在任何列表中的页面
order: 6
---

# 隐藏页面

隐藏页面会被构建、也能通过 URL 访问，但会被排除在所有读者可能偶然发现它的地方之外。

## 「隐藏」的含义

| 出现在                                        | 隐藏页面 |
| --------------------------------------------- | -------- |
| 侧边栏导航                                    | 否       |
| [[search\|搜索]]结果                          | 否       |
| [[graph-and-backlinks\|关系图]]与反向链接面板 | 否       |
| `sitemap.xml`                                 | 否       |
| 它自己的 URL                                  | **是**   |

隐藏页面还会带上 `noindex` robots 标签，因此搜索引擎即使遇到该 URL 也不会收录它。

适用于草稿、未列入目录的参考资料，以及你想直接链接、但不想放进导航的页面。

## 隐藏一个页面

在 frontmatter 中添加 `hidden: true`：

```markdown
---
title: 草稿笔记
description: 尚未准备好
hidden: true
---

# 草稿笔记
```

仅此而已。这就是 [[secret-demo|本站自己的隐藏页面]] 的标记方式。

### 或者通过导航

如果你维护一个手动的 `navigation` 数组，也可以在那里隐藏某个条目：

```typescript
navigation: [{ name: 'Draft Notes', path: 'notes/draft', hidden: true }];
```

隐藏一个分区会一并隐藏它下面的所有内容：

```typescript
{
  name: 'Internal',
  hidden: true,
  children: [
    { name: 'Runbook', path: 'internal/runbook' },   // 同样被隐藏
    { name: 'Oncall',  path: 'internal/oncall' },    // 同样被隐藏
  ],
}
```

两种机制都生效，因此无论以哪种方式隐藏的页面，都会在所有地方保持隐藏。

## 查找 URL

```bash
npm run show-urls
```

```
🔒 [HIDDEN] Secret Demo Page
   source → content/secret-demo.md
   url    → https://eziwiki.vercel.app/secret-demo
```

## 隐藏并不等于私密

**隐藏页面是你静态导出中的一个公开文件。**任何拿到 URL 的人都能阅读它，而且没有任何机制能阻止它被分享。使用 [[url-strategies|哈希 URL]] 只是让地址难以猜测，这属于隐匿，而非访问控制。

如果内容不能被不该看的人看到，就不要发布它。要么把它放在 `content/` 之外，要么在托管端为整个站点加上身份验证。

## 彻底排除某个页面

如果想把某个文件保留在仓库中、但完全不参与构建，就在它的文件名或文件夹名前面加上 `_`：

```text
content/
├── _drafts/          ← 永远不会被构建
│   └── half-done.md
└── published.md
```

以 `_` 或 `.` 开头的文件和文件夹会被内容扫描器跳过，因此不会产生任何页面。

用 `_` 标记那些还不应存在的内容，用 `hidden: true` 标记那些应当存在、但不应该被宣传的内容。

## 下一步

- [[url-strategies]] — 可读 URL 与不透明 URL
- [[navigation]] — 侧边栏是如何构建的
