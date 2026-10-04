<div align="center">
  <!--<img src="eziwiki.webp" alt="EziWiki">-->
  <br/><hr/>
</div>

<p align="center"><em><strong>基于eziwki的wiki网站</strong></em></p>
<!--
<p align="center">
  <a href="https://i3months.com">🌐 在线演示</a> •
  <a href="https://eziwiki.vercel.app">🌐 演示（Vercel）</a>
</p>
-->
## 项目结构

```
eziwiki/
├── payload/
│   └── config.ts          # 站点配置
├── content/               # 你的 Markdown 文件
│   ├── intro.md
│   ├── guides/
│   ├── api/
│   └── tutorials/
├── public/                # 静态资源
│   ├── images/
│   └── favicon.svg
├── out/                   # 构建产物（自动生成）
│
├── app/                   # Next.js 页面
├── components/            # React 组件
├── lib/                   # 核心工具
├── scripts/               # 构建脚本
└── styles/                # 全局样式
```

**开始上手，需要编辑：**

- `payload/config.ts` - 导航、主题、SEO
- `content/` - 你的 Markdown 内容
- `public/` - 图片和资源

**想进一步定制？** 你可以修改 `components/`、`styles/` 和 `lib/` 来满足自己的需求。

## 配置

### 编辑 `payload/config.ts`

```typescript
import { Payload } from '@/lib/payload/types';

export const payload: Payload = {
  global: {
    title: '我的 Wiki',
    description: '我的个人知识库',
    lang: 'en', // BCP 47 语言标签；如果 wiki 不是英文，请设置此项
    baseUrl: 'https://your-site.com',
    repoUrl: 'https://github.com/you/your-wiki', // 可选；侧边栏链接和编辑链接
    urlStrategy: 'path', // 'path'（可读、利于 SEO）| 'hash'（不透明）
    autoNavigation: true, // 自动发现下方未列出的 content/ 文件
  },
  // 可选。完全省略它，导航将根据 content/ 自动构建。
  navigation: [
    {
      name: '简介',
      path: 'intro', // 链接到 content/intro.md
    },
    {
      name: '指南',
      color: '#fef08a', // 可选的文件夹颜色
      children: [
        { name: '快速开始', path: 'guides/quick-start' },
        { name: '配置', path: 'guides/configuration' },
      ],
    },
  ],
  // 可选。将文档以其页面图片的形式展示，而不是在查看器中显示——
  // 适用于扫描件，它们没有可丢失的文本。参见下文的 PDF 嵌入。
  documents: {
    raster: ['scans/**'],
  },
  theme: {
    // 可选 - 省略时使用默认值。这些设置浅色主题的配色；
    // 深色模式保留自己的配色。还有：background、text、sidebarBg、codeBg。
    primary: '#2563eb',
    secondary: '#7c3aed',
  },
};
```

### 导航选项

导航是可选的。`content/` 下的每个 Markdown 文件都会自动发布，配置中未提及的文件会被追加到与其目录匹配的分区中。仅当你需要控制命名和排序时才使用 `navigation`；设置 `global.autoNavigation: false` 可改为完全由它决定。

排序和展示也可以来自内容本身：

**Frontmatter（每页）：**

```markdown
---
title: 快速入门 # 侧边栏标签；未设置时回退到文件名
description: 5 分钟上手
order: 1 # 在所在目录内的排序权重
hidden: true # 可构建、可链接，但不会出现在侧边栏
---
```

**`_meta.json`（每目录）：**

```json
{ "name": "📚 开始使用", "order": 1, "color": "#dbeafe" }
```

**基本页面：**

```typescript
{ name: '开始使用', path: 'intro' }
```

**带子项的文件夹：**

```typescript
{
  name: '指南',
  color: '#fef08a',  // 可选
  children: [
    { name: '安装', path: 'guides/setup' },
  ],
}
```

**隐藏页面：**

```typescript
{ name: '私密笔记', path: 'private/notes', hidden: true }
```

### 添加内容

在 `content/` 中创建与你的路径对应的 Markdown 文件：

**`content/guides/quick-start.md`**

```markdown
---
title: 快速入门指南
---

# 快速入门指南

欢迎！请查看[配置指南](/guides/configuration)。
```

Frontmatter 是可选的。

## 导出

将你的 wiki 构建为静态文件：

```bash
npm run build
```

将 `out/` 目录部署到 Netlify、Vercel、GitHub Pages。

## 功能特性

### 搜索

在任意位置按 <kbd>⌘K</kbd>（在 Windows 和 Linux 上是 <kbd>Ctrl K</kbd>），或点击侧边栏中的搜索框。

全文搜索覆盖页面标题、每个标题和页面内容。搜索结果直接链接到匹配的小节，而不是页面顶部。索引在构建时生成到 `public/search-index.json`，并完全在浏览器中检索——无需服务器、无需第三方服务，可在任何静态主机上运行。

索引在第一次搜索时才加载，因此只浏览不搜索的页面永远不会下载它。

韩语、日语和中文内容按字符二元组（bigram）建立索引，因此搜索 `위키` 能匹配 `위키문서를`——仅靠空格分词会漏掉这些情况。

### 目录

在宽屏上，每个页面都会自动生成目录侧栏，由页面的 `h2` 到 `h4` 标题构建而成，滚动时会高亮当前所在的小节。它是在构建时渲染的，因此直接包含在 HTML 中，而不是由脚本拼装。

### 标题锚点

标题下方的每个标题都带有指向自身的链接，在悬停或键盘聚焦时显示，这样无需从地址栏复制 id 即可分享某个小节。

### Wiki 链接

按名称链接到页面，无需知道它存放在哪里：

```markdown
[[quick-start]] # 按文件名
[[快速入门]] # 按标题
[[getting-started/quick-start]] # 按完整路径
[[quick-start#prerequisites|第一步]] # 锚点与标签
```

若一个简写匹配多个页面，会拒绝而非猜测；若目标什么都不匹配，会渲染成明显的破损文本，而不是死链接。`npm run check:links` 会列出所有这类问题——包括指向页面没有的标题的锚点、指向不存在页面的普通 `[link](/page)`，以及发布在站点自留地址（`/graph/`、`/tags/…`）上的页面。配合 CI 使用的 `--strict` 选项，以上任何一项都会导致构建失败。

悬停在任意 wiki 链接上，卡片会显示目标的标题和开头几行。两者都在构建时写入链接，因此卡片不产生任何请求——键盘用户聚焦时也能看到，按 <kbd>Esc</kbd> 关闭。

### 嵌入与引用（包含）

开头的 `!` 会直接显示目标内容而不是链接过去，就像笔记库（vault）那样：

```markdown
![[diagram.png]] # public/ 中的图片，按名称或路径引用
![[diagram.png|架构]] # 标签会变成 alt 文本
![[manual.pdf]] # PDF，在查看器中显示
![[quick-start]] # 另一页面的文本，内联显示
![[quick-start#prerequisites]] # 仅该小节
```

被包含的页面会被加框显示，并带有返回其维护位置的链接，这样一段内容可以只存在于一个文档中，在需要的地方出现，而无需复制。

仅当嵌入单独占据一个段落时才进行引用（包含）——块不能放在句子中间——并且页面不能直接或通过链条间接包含自身。嵌套最多三层。被包含的标题不会进入目录侧栏，目录描述的是你正在浏览的页面。

### PDF 嵌入

单独一行嵌入的 PDF 会显示为第一页，在构建时渲染为 WebP。点击「打开」后它会变成一个跟随主题的查看器：翻到哪页绘制哪页、跟随滚动的页码计数器、缩放、下载和全屏。

pdf.js——一个 1 MB 的解析器——只在读者真正打开文档时才加载，因此浏览经过时只消耗一张图片。构建产出的就是这张图片和文件链接，禁用 JavaScript 的读者看到的也是这些。

封面图需要 `npm i -D @napi-rs/canvas`，默认并未安装；构建在发现 PDF 缺少它时会给出提示，而且文档无论如何都能打开。pdf.js 为字符映射、标准字体和图像编解码器获取的数据会被暂存到 `public/pdfjs/`——但仅当 wiki 中包含 PDF 时才如此，所以不含 PDF 的 wiki 不会部署任何额外内容。

扫描件是例外，需要显式开启：

```typescript
documents: {
  raster: ['scans/**'], // public/ 下的路径；支持 * ** ?
}
```

这些文档会改为逐页绘制，并以这些图片的形式展示——没有查看器、没有 pdf.js、没有任何脚本。扫描页本身已经是图片，没有可选中或可搜索的文本，所以不会有任何损失，而且示例扫描件这样反而*更小*：作为 PDF 是 247 kB，作为图片是 90 kB。

之所以保持默认关闭，是因为同样的处理会毁掉文本文档——一个 33 kB 的六页文本 PDF 会变成 1.3 MB 的 WebP，并随之丢失文本层——而且从文件本身无法可靠判断它是哪种类型。

### 标签

一个文件只属于一个文件夹，所以侧边栏只显示一种组织方式。frontmatter 中的 `tags` 提供另一种：

```markdown
---
title: 部署到 Vercel
tags: [deployment, hosting]
---
```

每个主题在 `/tags/<name>` 下都有对应页面，`/tags` 列出全部主题，每个带标签的页面都会显示它所属的主题。隐藏页面不会出现。

### 爬虫与答案引擎

每个页面都带有 canonical URL、Open Graph 和 Twitter 卡片、`Article` 结构化数据，以及与页面实际显示的路径一致的 `BreadcrumbList`——声明了却不显示的路径，这种不一致带来的损失超过标记带来的收益。

`sitemap.xml` 以最后一次修改页面的提交来为每个页面标注日期。这正是该字段的意义所在：如果 sitemap 给每个页面都盖上站点发布时刻的时间戳，就等于每次部署都告诉爬虫所有内容都变了，直到爬虫不再相信这个字段。还没有任何历史的页面不带日期，而不是随便猜一个；索引页面则取其所列页面中最新的日期。

`llms.txt` 是为另一种读者准备的。答案引擎到达一个页面时，看到的是它用不上的导航、目录侧栏、搜索框，以及藏在某个角落的文章；它必须自己推断站点是什么、哪些页面重要——侧边栏有三十个链接，而文章只有一个。这个文件直接把这些讲清楚——wiki 的名称、它是什么、每个页面的一句话介绍，按阅读顺序排列：

```markdown
# 我的 Wiki

> 我的个人知识库

## 页面

- [快速入门](https://example.com/getting-started/quick-start/): 5 分钟上手。
```

它由 sitemap 使用的同一注册表生成，因此新增、重命名或改写描述的页面会自动出现在其中，无需任何人维护第二份列表。两个文件都不会包含隐藏页面。

### 待建页面

链接到一个尚不存在的页面正是 wiki 成长的方式：有人在写别的内容时写下 `[[deploying to fly]]`，因为正是在那一刻他们知道这个页面是需要的。`npm run check:links` 从另一端收集这些链接——按被请求的页面而非发起请求的页面统计——因此报告就是一份待写内容清单，按需求热度排序：

```
Wanted — 1 page linked to but not written, most-wanted first:

  [[Deploying to Fly]] — wanted by 2 pages
    content/deployment/static-export.md
    content/deployment/vercel.md
    npm run new deploying-to-fly
```

最后一行就是全部答案。`npm run new` 会按链接所暗示的路径创建文件及其 frontmatter：

```bash
npm run new guides/deploying
npm run new "Deploying to Fly"                    # → deploying-to-fly.md
npm run new guides/setup -- --title "Set it up"   # npm needs the `--`
```

以标题形式书写的目标会保留其大小写，这正是让请求它的链接得以解析的原因。除此之外无需任何操作——页面会在下一次构建时发布。已有文件永远不会被覆盖。

`/graph` 也会列出同样的待建页面，因此这个缺口在站点和终端里都能看到。

### Wiki 健康检查

`npm run check:links` 还会报告两种链接检查无法发现的问题，因为它们关乎缺失的链接而非错误的链接：**孤页（orphans）**（没有任何链接指向）和**死胡同（dead ends）**（没有向外链接）。两者都不会导致构建失败——一个正确的 wiki 完全可以同时存在这两种情况——但它们也无法从单个页面内部看到。

### 图表

一个 ```mermaid 围栏会在构建时被绘制并输出为 SVG——不会向浏览器发送任何渲染器，页面加载时不会发生布局位移，爬虫也能看到图表。颜色来自样式表，因此会跟随深色模式。

支持 `flowchart`、`sequenceDiagram`、`stateDiagram-v2`、`classDiagram` 和 `erDiagram`；其他类型会保持为代码块，而不会中断构建。

### 代码块

一个围栏能表达的比它的语言更多：

````markdown
```typescript title="lib/greet.ts" {2,4-6} showLineNumbers

```
````

`title=`（或 `file=`）会替换栏中的语言名，因为文件名比「TypeScript」更能说明问题。`{2,4-6}` 标记正在讨论的行，这样正文就不必让读者自己数行号。`showLineNumbers` 在左侧生成一个行号槽，由 CSS 计数器绘制而不是写进标记里——这正是复制时不会带上行号的原因。

这一切都在构建时完成。为其他工具准备的注解会被忽略而不是报错，因此从别处写好的文档仍会按其代码原样渲染。

### 数学公式

`$…$` 和 `$$…$$` 会在构建时用 [KaTeX](https://katex.org) 排版，因此浏览器收到的是排好的标记——无需下载公式解析器，页面稳定后也不会再发生重排。

```markdown
质能关系是 $E = mc^2$。

$$
\int_0^1 x^2 \, dx = \frac{1}{3}
$$
```

行内公式位于句子之中；`$$` 块独立成行并居中。唯一常驻的开销是 KaTeX 的样式表，gzip 后 3.6 kB，由每个页面共享；它的字体只有真正绘制公式的页面才会加载。

### GitHub 风格 Markdown

表格、任务列表、脚注、删除线和裸 URL 的行为与在 GitHub 上一致：

```markdown
| 选项   | 默认值 |
| ------ | -----: |
| `lang` |   `en` |

- [x] 已撰写
- [ ] 已审阅

需要注明来源的说法[^1]。~~已划掉。~~ <https://example.com>

[^1]: 脚注会集中出现在页面底部，每条都链接回正文。
```

诸如 `:smile:` 之类的 emoji 简写不会被展开——直接写字符本身，😊，无需构建步骤，在源文件中读起来也一样。

### 提示框

以 `[!KIND]` 开头的引用块会变成提示框，使用 GitHub 和 Obsidian 共有的语法：

```markdown
> [!WARNING] 注意空隙
> 标记行上的标题会替换默认标题。

> [!TIP]- 折叠收起
> 末尾的 `-` 会将其变成 `<details>`，无需任何脚本。
```

`note`、`tip`、`important`、`warning` 和 `caution` 各有对应的颜色，Obsidian 更长的类型列表会映射到其中最近的一个。无法识别的类型保持为普通引用。

### 别名

页面会移动。由于 URL 来自文件的路径，移动页面会破坏所有指向旧地址的链接——声明别名后，旧 URL 会继续响应：

```markdown
---
title: 安装
aliases:
  - guides/setup
---
```

每个别名都会构建成一个转发页面，标记为 `noindex`，其 canonical 指向目标页面。若别名遮蔽了真实页面，或被两个页面同时声明，构建会中止。

### 阅读顺序

每个页面末尾都有上一篇和下一篇的链接。顺序是侧边栏的扁平化结果，因此无需额外配置即可遵循 `order` 和 `_meta.json`，隐藏页面会被跳过。链接带有 `rel="prev"` 和 `rel="next"`。

### 界面语言

页面使用其书写时所用的语言，wiki 周围的界面也如此。设置 `global.lang` 后，搜索框、目录侧栏、上一篇/下一篇链接等都会随之切换：

```typescript
global: {
  lang: 'ko',
}
```

英语、韩语和中文已内置翻译。其余语言可以通过 `global.strings` 逐项自定义，未覆盖的部分会保留英文。

```typescript
global: {
  lang: 'de',
  strings: { search: 'Suchen…', onThisPage: 'Auf dieser Seite' },
}
```

键与 `lib/i18n/strings.ts` 中 `Strings` 的键一致。日期也跟随 `lang`，因此韩语 wiki 会显示 `2026년 8월 3일` 而不是 `August 3, 2026`。

在构建时解析，并以纯数据的形式传给页面：读者下载的是 wiki 所用的一种语言，而不是它翻译过的所有语言。

### 最后更新时间

每个页面都会显示最后修改时间。要做到这一点无需维护任何东西：日期来自最后一次修改文件的提交，这是唯一不会与页面脱节的页面年龄记录。

当提交不能说明问题时，可以从 frontmatter 覆盖它——今天修一个错别字并不会让三月的页面变得更新：

```markdown
---
updated: 2026-03-14
---
```

尚未提交的页面不显示日期，而不是显示构建时间——构建时间会声称每个页面都在站点发布那一刻被修订过。由于日期来自提交历史，浅克隆只能为它拥有的提交所涉及的页面标注日期；更早的页面保持无日期状态，而不是被错误标注。在 GitHub Actions 上，请使用 `fetch-depth: 0` 检出；在 Vercel 上，将 `VERCEL_DEEP_CLONE` 环境变量设置为 `true`。

同一个日期也会以 `dateModified` 进入结构化数据，因此读者和爬虫永远不会得到不同的信息。

### 编辑本页

当发现错误的人能够修复它时，wiki 才更有价值，而决定他们是否动手的关键往往是两者之间的距离。设置 `repoUrl` 后，每个页面都会带有直达其源码的链接：

```typescript
global: {
  repoUrl: 'https://github.com/you/your-wiki',
  editBranch: 'main', // 可选；除非另行指定，默认为 'main'
}
```

仅凭 URL 即可识别 github.com 和 gitlab.com。对于其他情况——自托管的代码托管平台、不同的内容目录——直接给出模板，用 `{path}` 表示文件位置：

```typescript
editUrl: 'https://git.example.com/wiki/-/edit/main/content/{path}';
```

两者都不配置，就没有页面会提供链接——这正是私有或未发布的 wiki 想要的。

### 在线编辑

静态站点没有服务端可写，所以「在线编辑」的落地方式是**把改动提交到 GitHub 仓库**。开启后，页脚会多出一个「在此编辑」，侧边栏顶部会多出一个「新建页面」：读者输入一把对本仓库有写权限的 GitHub Token，即可在浏览器里改正文、改 frontmatter、新建、移动（自动补 `aliases`）或删除页面；保存即提交，已有的 Pages 工作流随后自动重新构建上线。

```typescript
global: {
  repoUrl: 'https://github.com/you/your-wiki', // 编辑器只认识 GitHub 仓库
},
editor: {
  enabled: true,
  // branch: 'main', // 可选；默认取 global.editBranch，再默认为 main
},
```

Token 由读者自己输入，只保存在他自己的浏览器里（勾选记住时才写入 `localStorage`），并且只发送给 `api.github.com`。纯静态站点没有安全边界可言——编辑器代码和仓库地址都是公开的——真正的权限来自 token 本身：没有 token 的人即便打开编辑器也提交不了任何东西。编辑器代码按需加载，从不编辑的读者不会为它付出任何字节。详见 [[在线编辑]]。

### 反向链接与关系图

每个页面末尾都会列出链接到它的页面——同时来自 Wiki 链接和普通 Markdown 链接——以及一张展示其周边关系的小型关系图：该页面、双向一步链接可达的所有页面，以及这些邻居之间的链接。

`/graph` 页面绘制整个站点——节点大小按链接数计算，悬停可隔离某个邻域，点击可导航。它是纯 SVG 加一个简单的力导向布局，因此任何地方都无需下载图表库。

### URL 策略

在 `payload/config.ts` 中设置 `global.urlStrategy`：

```
'path'（默认）  guides/setup → /guides/setup
'hash'          guides/setup → /c432b372-e0e30267-e65e26a1
```

`path` 提供可读、可索引、可分享的 URL。`hash` 会隐藏内容结构，代价是 SEO 和任何人都能看懂的 URL——只有在需要隐藏时才用它。

无论哪种方式，在 Markdown 中写普通路径都会自动解析：

```markdown
[安装指南](/guides/setup)
```

列出每个页面及其 URL：`npm run show-urls`

### 构建时渲染

Markdown 在构建时被编译为 HTML——解析、用 [Shiki](https://shiki.style) 做语法高亮、解析链接——因此不会向浏览器发送任何 Markdown 解析器或高亮器。内容页面加载 **88 kB** 的 JS，而运行时渲染器需要 314 kB。

Shiki 内置了一百多种语言的语法定义，全部加载需要约 20 秒才能渲染出第一页。eziwiki 会扫描你的内容，只加载实际用到的语言，再加上一些常用默认项——初始化时间降到一秒以内。无法识别的围栏会渲染为纯文本，而不是导致构建失败。

### 自动导航

没有需要维护的 navigation 数组——本仓库自己的 `payload/config.ts` 中就没有。页面在 `content/` 下被自动发现，按文件夹分组，并按 frontmatter 的 `order` 和每个文件夹的 `_meta.json` 排序：

```json
{ "name": "📚 开始使用", "order": 2, "color": "#dbeafe" }
```

当你想要手动控制时，添加 `navigation` 数组即可；它不必面面俱到，因为未声明的页面仍会被发现并追加进来。

**文件夹也可以是页面。**把一个与目录同名的 `.md` 放在目录旁边，该目录就不再只是分区：这个页面成为父页面，目录里的其它 Markdown 文件自动成为它的子页面，侧边栏表现为"可点击父页面 + 展开箭头 + 缩进的子页面"，支持任意层级的嵌套。页面路径就是文件路径，`content/ailan.md` 发布为 `/ailan`，与它同级的 `ailan/` 里的页面挂在它下面——不需要 `index.md`，也不需要额外配置。

```
content/ailan.md            → /ailan（父页面）
content/ailan/story.md      → 子页面
content/ailan/abilities.md  → 子页面
```

目录里没有同名页面时，它就是一个不可点击的分区（标题不可点，与从前一样）；`index.md` 也只是一个普通页面，路径为 `.../index`。父页面未设置排序时，它所在目录沿用该页面 frontmatter 里的 `order`，因此把 `ailan.md` 与 `ailan/` 放在一起不会改变它原本在侧边栏中的位置。

## 命令

```bash
npm run dev              # 开发服务器
npm run build            # 构建生产版本
npm run check            # 校验配置 + 检查链接与类型（CI 用 -- --strict）
npm run validate:payload # 只检查配置
npm run check:links      # 只报告未解析的链接和值得撰写的页面
npm run new <path>       # 创建页面，含 frontmatter
npm run build:search     # 重新生成搜索索引
npm run show-urls        # 列出每个页面及其 URL
npm run build:template   # 重新构建 create-eziwiki 模板
npm test                 # 运行测试套件
```

`npm run build` 与 `npm run dev` 都由 `scripts/build.cjs` 驱动，而不是一串 `&&`。几个前置步骤（搜索索引、pdf.js 资源、PDF 页面图）读的是同一份 payload，写的是 `public/` 下互不相干的目录，所以它们并行执行；配置校验、链接检查与类型检查合并为一次 `npm run check`，与生成步骤同时开始。每一步都会把自己的产物记录在 `.build-cache/` 下，源文件与产物都没变时直接跳过——因此第二次 `npm run dev` 几乎不花时间在这上面。

开发模式不做校验与链接检查：它们是检查而非产物，存在意义是拦住一次部署，而部署是 `npm run build`。需要时用 `npm run check`。

`next build` 自身不再重复运行 ESLint 与 TypeScript——两者都已在上面的并行阶段跑过，`npm run lint` 与 `npm run type-check` 也随时可用。

构建 ID 由内容派生（`next.config.js` 中的 `generateBuildId`），而不是每次随机。同样的内容构建两次，产物逐字节相同：浏览器与 CDN 不必为一个没有任何变化的部署重新拉取资源，增量托管平台也能认出它已经有的输出。

## 参与贡献

参与指南请参阅 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可证

MIT 许可证——详情请参阅 [LICENSE](LICENSE)。
