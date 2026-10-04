---
title: 欢迎使用 eziwiki
description: 一个简洁美观的 Wiki 与文档站点生成器
order: 999
---

# 欢迎使用 eziwiki 👋

![eziwiki](/images/eziwiki.webp)

**eziwiki** 是一个基于 Next.js 14 构建的 Wiki 与文档站点生成器，灵感来源于 Notion 和 Obsidian。编写 Markdown，即可获得一个快速的静态站点。

## 从这里开始

```bash
npx create-eziwiki my-docs
cd my-docs
npm install
npm run dev
```

打开 <http://localhost:3000>。完整教程请参阅 [[quick-start]]。

## 功能一览

**文件即页面。** 将 `.md` 文件放入 `content/`，它就会被发布。文件夹会成为侧边栏分区。无需注册步骤，也没有需要维护的导航数组——本站就没有。参见 [[navigation]]。

**[[search|搜索]]** 覆盖标题、小标题和正文，配有 <kbd>⌘K</kbd> 命令面板。搜索结果直接链接到对应章节。它完全在浏览器中基于静态索引运行，因此适用于任何托管平台——并且能正确处理韩语、日语和中文。

**[[table-of-contents|目录栏]]** 出现在每个页面上，滚动时会高亮你正在阅读的章节。

**[[wiki-links|Wiki 链接]]。** 编写 `[[quick-start]]` 即可，它会按路径、文件名或标题解析。指向不存在页面的链接会显示为失效，而不是假装可用。

**[[graph-and-backlinks|反向链接与关系图]]。** 每个页面都会列出指向它的链接，[关系图](/graph) 则展示整个站点如何相互连接。

**日期来自自身历史。** 每个页面都会显示最后修改时间，该时间取自修改它的那次提交，因此无需任何维护就能保持准确——同时还会链接到其源码，发现错误的人可以直接修正。

**构建时渲染。** Markdown 在构建期间完成解析、用 Shiki 高亮并解析链接，因此浏览器端无需加载任何 Markdown 解析器或高亮器。内容页面大约加载 88 kB 的 JavaScript。

**其他功能：** [[dark-mode]]、[[markdown-basics#数学|数学公式（KaTeX）]]、GitHub 风格 Markdown、[[url-strategies|可读或哈希 URL]]、[[hidden-pages]]、SEO 元数据以及站点地图。

## 适用场景

- **文档站点** —— API 参考、用户指南、技术文档
- **个人 Wiki** —— 真正属于你的第二大脑
- **团队知识库** —— 始终保持可搜索的内部文档
- **学习笔记** —— 带有真实交叉链接的学习资料

## 完整配置

```typescript
export const payload: Payload = {
  global: {
    title: 'My Wiki',
    description: 'My personal knowledge base',
  },
};
```

这就是一个完整的站点。其余一切——[[theme|颜色]]、[[url-strategies|URL 样式]]、SEO、手动配置 [[navigation]]——都是可选项。参见 [[payload]]。

## 部署

`npm run build` 会在 `out/` 中生成一个完全静态的站点。你可以把它部署到任何地方：[[static-export|任意静态托管]]、[[vercel|Vercel]] 或 [[github-pages|GitHub Pages]]。

## 下一步

- [[quick-start]] —— 构建你的第一个 Wiki
- [[installation]] —— 详细的安装设置
- [[markdown-basics]] —— 页面中可以写什么
