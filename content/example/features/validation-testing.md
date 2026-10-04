---
title: 校验与测试
description: 在部署前发现配置错误与失效链接
order: 9
---

# 校验与测试

三项检查会作为 `npm run build` 的一部分运行，因此问题会在构建时暴露，而不是在读者面前。

## Wiki 健康检查

同一个命令还会报告链接检查无法发现的两类问题，因为这两类问题都关乎*缺失的*链接：

```
🔗 Links OK — 102 links across 25 pages

⚠️  3 orphaned pages — nothing links here, so a reader can only arrive from the sidebar
     content/examples/personal-wiki.md
     content/examples/knowledge-base.md
     content/examples/api-docs.md

⚠️  1 dead end — no links out, so a reader arrives with nowhere to go
     content/deployment/vercel.md
```

**孤立页面**是指没有任何链接指向它的页面。它出现在侧边栏中，因此不会丢失，但阅读 Wiki 的人永远不会偶然撞见它。**死胡同（无出链页面）**是指没有任何出链的页面：读者到达后，唯一的前进方式就是后退按钮。

这两者都不是错误，也永远不会导致构建失败——一个正确的 Wiki 完全可以同时存在两者，一个没有更多内容可讲的参考页面也是合理的。它们之所以被报告，是因为从单个文档内部都看不到它们。您在点击失效链接的那一刻就会发现它；而您永远不会注意到那个无人链接的页面。

读者最先到达的页面永远不会被称作孤立页面。入口页面不需要任何链接指向。

这源于把文档视为 [[graph-and-backlinks|关系图]] 而不是树。在树中，出现在侧边栏就是全部归属，而"孤立页面"没有意义。

## 配置校验

```bash
npm run validate:payload
```

```
🔍 Validating payload configuration...

✅ Payload validation passed!
```

`payload/config.ts` 会根据 JSON Schema 进行校验。它可以发现：

- 缺少必填字段（`global.title`、`global.description`）
- 颜色格式错误——主题值必须是 `#rrggbb`
- `urlStrategy` 无效——只接受 `path` 和 `hash`
- 导航条目缺少 `name`，或嵌套方式错误

校验失败会立即停止构建，在任何内容渲染之前。

### 失败示例

```
❌ Payload validation failed:
  - /global/title must NOT have fewer than 1 characters
```

## 链接检查

```bash
npm run check:links
```

```
🔗 Links OK — 61 links across 21 pages
```

每个 [[wiki-links|Wiki 链接]] 和内部 Markdown 链接都会对照内容树进行解析。有两类问题可能出错，它们的报告方式不同，因为修复的位置也不同。

一个匹配多个页面的链接是链接本身的错误，因此它会在编写它的位置被报告：

```
🔗 1 unresolved link

  Ambiguous — use the full path to say which page is meant:

    content/guides/api.md
      [[overview]] matches api/overview, guides/overview
```

一个匹配不到任何页面的链接其实根本不是错误。某人在写别的内容时写下了它，因为正是在那时他们知道这个页面是需要的。这类链接会以相反的方式报告——按被请求的页面来报告：

```
  Wanted — 1 page linked to but not written, most-wanted first:

    [[Deploying to Fly]] — wanted by 2 pages
      content/deployment/static-export.md
      content/deployment/vercel.md
      npm run new deploying-to-fly
```

两个页面请求同一个页面，是 Wiki 对接下来该写什么最清晰的表达，而且收集它的成本为零——链接由需要该页面的人写就。拼写差异不会拆分计数：`[[Deploying to Fly]]` 和 `[[deploying to fly]]` 算作同一个页面被请求两次，因为一个文件就能同时满足两者。

## 编写被请求的页面

每个条目的最后一行就是全部：

```bash
npm run new deploying-to-fly
```

文件会连同其 frontmatter 一起创建在路径指定的目录中，并在下一次构建时发布。标题和路径同样有效：

```bash
npm run new "Deploying to Fly"                    # → deploying-to-fly.md
npm run new guides/setup -- --title "Set it up"   # npm 需要 `--`
```

以标题形式书写的目标会保留其原有大小写，这正是让请求它的链接得以解析的原因——它按标题匹配。已有文件永远不会被覆盖。

## 故意让检查失败

默认情况下，检查**只报告而不失败**。某一页中的一个悬空链接不是阻止其余二十页部署的理由，而且内容常常先于它引用的页面被写出。

要让它在失败时终止——例如在 CI 中：

```bash
npm run check:links -- --strict
```

[Graph](/graph) 页面会列出同样被请求的页面，因此这个缺口不仅从终端可见，从 Wiki 中也能看到。

## 测试

```bash
npm test           # 运行一次
npm run test:watch # 变更时运行
```

测试套件覆盖引擎本身：内容发现、导航组装、两种策略下的 URL 解析、Markdown 流水线、Wiki 链接解析、搜索索引与排序（权重），以及关系图布局。

它还会针对本站自身的内容进行断言——搜索索引中的每个章节都指向真实的锚点，且没有任何页面包含悬空链接——因此如果文档与代码出现偏差，测试就会失败。

## 类型

```bash
npm run type-check
```

`payload/config.ts` 带有类型，因此大多数配置错误会在任何脚本运行之前在您的编辑器中就被发现。如果某个字段不在 `Payload` 类型中，它就不是一个真实可用的选项。

## 格式化与代码检查

```bash
npm run lint     # ESLint，带 --fix
npm run format   # Prettier
```

## 在 CI 中

一个运行所有检查的工作流：

```yaml
- run: npm ci
- run: npm run type-check
- run: npm run lint
- run: npm test
- run: npm run check:links -- --strict
- run: npm run build
```

## 下一步

- [[payload]] — 配置中可以包含什么
- [[graph-and-backlinks]] — 在上下文中查看无法解析的链接
- [[static-export]] — 部署构建结果
