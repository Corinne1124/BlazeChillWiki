---
title: 隐藏演示页面
description: 这是一个隐藏页面示例——你找到它了！
order: 99
hidden: true
---

# 🎉 你找到了隐藏页面！

![eziwiki](/images/eziwiki.webp)

此页面已从侧边栏导航中**隐藏**，但你仍然可以通过直接链接访问它。

## 你是怎么找到这里的？

你可能：

- 运行了 `npm run show-urls` 并找到了这个 URL
- 点击了其他页面上的链接
- 将此页面加入了书签
- 有人与你分享了 URL

## 这个页面有什么特别之处？

此页面在 frontmatter 中有 `hidden: true`：

```markdown
---
title: 隐藏演示页面
description: 这是一个隐藏页面示例——你找到它了！
hidden: true # 👈 正是这一行使它隐藏
---
```

这就是全部机制——不涉及任何配置文件。关于 hidden 能覆盖和不能覆盖的内容，请参见 [[hidden-pages]]。

## 隐藏页面的特性

### ✅ 功能完整

隐藏页面与普通页面完全一样：

- 完整的 Markdown 支持
- 语法高亮
- 图片和链接
- 深色模式支持
- 所有功能可用

### ✅ 可访问

任何拥有 URL 的人都可以访问此页面：

- 与他人分享链接
- 添加书签以便快速访问
- 从其他页面链接过来

### ❌ 不在侧边栏中

此页面不会出现在侧边栏导航中，因此它是“未列出”的，但并非私有。

## 使用场景

隐藏页面非常适合：

1. **草稿内容** —— 在发布前完善内容
2. **内部文档** —— 仅供团队使用的文档
3. **已废弃页面** —— 让旧内容保持可访问
4. **彩蛋** —— 给好奇用户的趣味惊喜
5. **测试** —— 测试新的布局或功能

## 示例代码

下面是带语法高亮的代码：

```typescript
interface HiddenPage {
  name: string;
  path: string;
  hidden: true;
}

const secretPage: HiddenPage = {
  name: 'Secret Demo Page',
  path: 'secret-demo',
  hidden: true,
};

console.log('This page is hidden! 🤫');
```

```python
def find_hidden_pages():
    """查找 Wiki 中所有隐藏页面。"""
    hidden_pages = []

    for page in all_pages:
        if page.hidden:
            hidden_pages.append(page)

    return hidden_pages

print(f"Found {len(find_hidden_pages())} hidden pages!")
```

## 重要说明

### 并非私有

隐藏页面是**未列出**的，而非**私有**：

- ✅ 任何拥有 URL 的人都可以访问
- ✅ 包含在静态构建中
- ✅ 可被搜索引擎收录（默认情况下）
- ❌ 不受密码保护

对于真正私有的内容，请使用身份验证，或者不要将其包含在构建中。

### 查找此页面

要查找所有隐藏页面：

```bash
npm run show-urls
```

查找标记为 🔒 [HIDDEN] 的页面。

## 自己动手试试

创建你自己的隐藏页面：

1. 创建 `content/my-secret.md`：

   ```markdown
   ---
   title: 我的隐藏页面
   hidden: true
   ---

   # 我的隐藏页面

   这是我的隐藏页面！
   ```

2. 找到 URL：

   ```bash
   npm run show-urls | grep "my-secret"
   ```

3. 与其他人分享 URL！

无需在任何地方注册页面——只要有文件就够了。

## 导航

想回去吗？

- [首页](/example/intro)
- [了解隐藏页面](/example/features/hidden-pages)
- [[url-strategies|URL 策略]]

---

**专业提示**：你可以从 Wiki 中的任何位置链接到此页面，即使它在侧边栏中处于隐藏状态！

```markdown
看看这个[隐藏演示页面](/example/secret-demo)吧！
```
