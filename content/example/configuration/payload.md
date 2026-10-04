---
title: Payload 配置
description: payload/config.ts 中的每个字段及其作用
order: 1
---

# Payload 配置

`payload/config.ts` 存放着网站的元数据、URL 行为和主题。它刻意保持精简——页面来自文件系统，而不是来自这里。

## 最小可行配置

```typescript
import { Payload } from '@/lib/payload/types';

export const payload: Payload = {
  global: {
    title: 'My Wiki',
    description: 'My personal knowledge base',
  },
};

export default payload;
```

这就是一个完整可用的网站。其余一切都是可选的。

## `global`

### 必填

| 字段          | 用途                              |
| ------------- | --------------------------------- |
| `title`       | 网站标题，显示在浏览器标签页中    |
| `description` | 网站描述，用于 SEO 并作为后备内容 |

### 行为

```typescript
global: {
  urlStrategy: 'path',     // 'path' | 'hash'   — 默认为 'path'
  autoNavigation: true,    // boolean           — 默认为 true
}
```

- **`urlStrategy`** — 决定 URL 是镜像内容树结构还是使用哈希。参见 [[url-strategies]]。
- **`autoNavigation`** — 决定 `content/` 下的页面是否会被自动发现并添加到侧边栏，而无需显式列出。参见 [[navigation]]。

### 呈现与 SEO

```typescript
global: {
  favicon: '/favicon.svg',
  baseUrl: 'https://mywiki.com',
  seo: {
    openGraph: {
      title: 'My Wiki — Knowledge Base',
      description: 'My personal knowledge base',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'My Wiki' }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@myhandle',
    },
  },
}
```

- **`favicon`** — `public/` 中某个文件的路径
- **`lang`** — 内容的 BCP 47 语言标签，例如 `ko` 或 `ja`。该标签标注在根元素上，屏幕阅读器据此确定发音，翻译工具据此决定提供哪种语言。它还决定界面本身使用的语言以及日期的书写格式。默认值为 `en`，因此以其他语言编写的 Wiki 应当设置它。
- **`strings`** — 针对个别界面文案的替换，适用于还没有翻译的语言，或你不认同的措辞。未列出的内容会保留其已翻译的值。

  ```typescript
  strings: { search: 'Suchen…', onThisPage: 'Auf dieser Seite' }
  ```

  这些键就是 `lib/i18n/strings.ts` 中 `Strings` 的键。

- **`baseUrl`** — 用于规范 URL（canonical URL）、站点地图和 Open Graph 标签。请在发布前设置它；社交预览和 `robots.txt` 都依赖它。
- **`repoUrl`** — 源代码仓库，从侧边栏链接。省略它则不渲染任何链接，因此没有公开源码的 Wiki 不会显示失效的控件。
- **`editBranch`** — 编辑链接指向的分支。默认为 `main`；如果仓库的默认分支叫别的名字，请设置它，否则每个编辑链接都会指向不存在的分支。
- **`editUrl`** — 编辑链接的形态，用 `{path}` 表示文件所在的位置：`https://git.example.com/wiki/-/edit/main/content/{path}`。仅当无法从 `repoUrl` 识别出代码托管平台时才需要——github.com 和 gitlab.com 无需它也能生成链接。

单个页面可以通过各自的 [[frontmatter]] 覆盖标题、描述和 OG 图片。

## `navigation`

可选。省略它时，侧边栏会基于 `content/` 构建。提供它则可以控制命名与排序——完整说明参见 [[navigation]]。

## `theme`

```typescript
theme: {
  primary: '#2563eb',      // 链接与强调色
  secondary: '#7c3aed',    // 次要强调色
  background: '#ffffff',   // 页面背景
  text: '#1f2937',         // 正文文字
  sidebarBg: '#f9fafb',    // 侧边栏背景
  codeBg: '#f3f4f6',       // 行内代码背景
}
```

每个字段都是可选的，缺省时回退到默认调色板。颜色必须是六位十六进制值。参见 [[theme]]。

## 校验

每次构建前，配置都会对照 JSON Schema 进行检查：

```bash
npm run validate:payload
```

它能捕获缺失的必填字段、格式错误的颜色和非法的 `urlStrategy`。它会作为 `npm run build` 的第一步自动运行，因此损坏的配置会立即失败，而不是在渲染中途才报错。

## 环境变量

```typescript
global: {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
}
```

配置就是普通的 TypeScript，因此构建时可用的任何内容都可以使用。

## 类型

`Payload` 具有完整的类型定义，因此你的编辑器会为字段提供自动补全、标记拼写错误，并内联显示每个选项的文档。如果某个字段不在类型中，它就不是一个真实存在的选项。

## 下一步

- [[navigation]] — 侧边栏是如何构建的
- [[theme]] — 颜色与外观
- [[frontmatter]] — 每个页面的设置
