---
title: 知识库示例
description: 用 eziwiki 构建团队知识库
order: 2
---

# 知识库示例

![eziwiki](/images/eziwiki.webp)

使用 eziwiki 打造全面的团队知识库。

## 适用场景

- **内部文档** - 公司流程与政策
- **新员工入职** - 新员工资源
- **故障排查** - 常见问题与解决方案
- **最佳实践** - 团队标准与规范
- **常见问题** - 常见问题解答

## 示例结构

文件夹即章节，团队的心智模型与侧边栏会自动保持同步：

```
content/
├── intro.md
├── onboarding/
│   ├── _meta.json              → { "name": "🚀 新员工入职", "order": 1 }
│   ├── first-week.md
│   └── tools-and-access.md
├── engineering/
│   ├── _meta.json              → { "name": "⚙️ 工程", "order": 2 }
│   ├── architecture.md
│   ├── deployment.md
│   └── runbooks/
│       ├── incident-response.md
│       └── database-restore.md
└── processes/
    ├── _meta.json              → { "name": "📋 流程", "order": 3 }
    ├── code-review.md
    └── on-call.md
```

发布运维手册无需编辑任何配置文件——而这正是团队 Wiki 常常无法保持更新的原因。

## 示例页面

### 新员工入职页面

```markdown
---
title: 新员工入职
description: 欢迎加入团队！这里包含你上手所需的一切。
---

# 新员工入职

欢迎加入团队！🎉

## 第一天

### 上午

- [ ] 与你的经理见面
- [ ] 领取笔记本电脑和设备
- [ ] 布置你的工位
- [ ] 完成人事（HR）手续

### 下午

- [ ] IT 配置与账号创建
- [ ] 团队介绍会议
- [ ] 参观办公室
- [ ] 浏览本知识库

## 第一周

### 权限与工具

申请开通以下权限：

- [ ] GitHub 组织
- [ ] Slack 工作区
- [ ] 邮箱账号
- [ ] 项目管理工具
- [ ] 设计工具（Figma）
- [ ] 云服务（AWS）

详细的配置说明请参阅[工具与权限](/onboarding/tools-access)。

### 学习

- [ ] 阅读[编码规范](/development/coding-standards)
- [ ] 复习[Git 工作流](/development/git-workflow)
- [ ] 了解[代码评审流程](/processes/code-review)
- [ ] 学习[部署流程](/processes/deployment)

### 初始任务

你的经理会为你安排一些入门任务：

1. 配置本地开发环境
2. 修复一个小 Bug
3. 添加一个小功能
4. 提交你的第一个拉取请求（PR）

## 参考资料

- [团队结构](/onboarding/team-structure)
- [开发环境配置](/development/setup)
- [常见问题](/faq/general)

## 有问题？

别犹豫，尽管提问！我们随时提供帮助。

- **Slack**：#new-employees
- **邮箱**：hr@company.com
- **经理**：联系你的经理
```

### 流程文档

```markdown
---
title: 代码评审流程
description: 我们公司如何评审代码
---

# 代码评审流程

所有代码变更在合并到 main 分支之前都必须经过评审。

## 创建拉取请求（PR）

### 1. 创建分支

\`\`\`bash
git checkout -b feature/your-feature-name
\`\`\`

### 2. 进行修改

请按照我们的[编码规范](/development/coding-standards)编写整洁、经过测试的代码。

### 3. 提交你的更改

\`\`\`bash
git add .
git commit -m "feat: add user authentication"
\`\`\`

使用[约定式提交](https://www.conventionalcommits.org/)：

- `feat:` - 新功能
- `fix:` - Bug 修复
- `docs:` - 文档
- `refactor:` - 代码重构
- `test:` - 添加测试

### 4. 推送并创建 PR

\`\`\`bash
git push origin feature/your-feature-name
\`\`\`

在 GitHub 上创建拉取请求（PR），包含：

- **标题**：清晰、描述性的标题
- **描述**：改了什么以及为什么
- **截图**：针对 UI 变更
- **测试说明**：如何测试这些更改

## PR 模板

\`\`\`markdown

## 改了什么

对更改的简要描述。

## 为什么

说明为什么需要此项更改。

## 如何测试

1. 第一步
2. 第二步
3. 预期结果

## 截图

（如适用）

## 检查清单

- [ ] 已添加/更新测试
- [ ] 已更新文档
- [ ] 无控制台错误
- [ ] 符合编码规范
      \`\`\`

## 评审流程

### 对作者

- 及时回应反馈
- 按要求进行修改
- 修改后重新请求评审
- 不要合并自己的 PR

### 对评审人

- 在 24 小时内完成评审
- 提出建设性意见，保持友善
- 在本地测试更改
- 满意后批准

## 评审检查清单

- [ ] 代码符合我们的规范
- [ ] 已包含测试
- [ ] 无明显 Bug
- [ ] 性能可接受
- [ ] 已考虑安全问题
- [ ] 已更新文档

## 批准要求

- **小改动**：1 人批准
- **中等改动**：2 人批准
- **大改动**：2 人以上批准 + 架构师评审

## 批准之后

1. 压缩合并（Squash and merge）
2. 删除分支
3. 部署到预发布环境（staging）
4. 在预发布环境（staging）中测试
5. 部署到生产环境

## 相关

- [Git 工作流](/development/git-workflow)
- [部署流程](/processes/deployment)
- [编码规范](/development/coding-standards)
```

### 故障排查指南

```markdown
---
title: 常见问题
description: 常见问题的解决方案
---

# 常见问题

常见问题的快速解决方案。

## 开发环境

### 端口已被占用

**问题**：`Error: Port 3000 is already in use`

**解决方案**：

\`\`\`bash

# 查找占用端口 3000 的进程

lsof -i :3000

# 终止该进程

kill -9 <PID>

# 或者改用其他端口

PORT=3001 npm run dev
\`\`\`

### 找不到模块

**问题**：`Error: Cannot find module 'xyz'`

**解决方案**：

\`\`\`bash

# 清除缓存并重新安装

rm -rf node_modules package-lock.json
npm install
\`\`\`

### Git 合并冲突

**问题**：拉取时出现合并冲突

**解决方案**：

\`\`\`bash

# 暂存你的更改

git stash

# 拉取最新更改

git pull origin main

# 应用你的更改

git stash pop

# 手动解决冲突

# 然后提交

git add .
git commit -m "Resolve merge conflicts"
\`\`\`

## 数据库

### 连接被拒绝

**问题**：`Error: Connection refused to database`

**解决方案**：

1. 检查数据库是否正在运行：
   \`\`\`bash

   # PostgreSQL

   pg_isready

   # MySQL

   mysqladmin ping
   \`\`\`

2. 检查 `.env` 中的连接字符串
3. 核对数据库凭据
4. 检查防火墙设置

### 迁移失败

**问题**：数据库迁移失败

**解决方案**：

\`\`\`bash

# 回滚上一次迁移

npm run migrate:rollback

# 修复迁移文件

# 重新运行

npm run migrate
\`\`\`

## 构建与部署

### 构建失败

**问题**：`npm run build` 失败

**解决方案**：

1. 检查 TypeScript 错误：
   \`\`\`bash
   npm run type-check
   \`\`\`

2. 检查 lint 错误：
   \`\`\`bash
   npm run lint
   \`\`\`

3. 清除构建缓存：
   \`\`\`bash
   rm -rf .next out
   npm run build
   \`\`\`

### 部署失败

**问题**：部署到生产环境失败

**解决方案**：

1. 查看部署日志
2. 核对环境变量
3. 在本地测试构建：
   \`\`\`bash
   npm run build
   npm run start
   \`\`\`
4. 如果问题仍然存在，请联系 DevOps 团队

## 仍然卡住了？

- **Slack**：#engineering-help
- **邮箱**：engineering@company.com
- **升级处理**：联系你的团队负责人
```

## 对知识库的好处

### 信息集中

所有团队知识集中在一处。

### 易于更新

任何人都可以贡献和更新文档。

### 版本控制

跟踪变更，查看谁更新了什么。

### 可搜索

快速查找信息。

### 随时可用

静态站点意味着零停机时间。

## 下一步

- [创建你的第一个 Wiki](/example/getting-started/first-wiki)
- [配置导航](/example/configuration/navigation)
- [部署你的知识库](/example/deployment/static-export)
