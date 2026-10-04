---
title: API 文档示例
description: 使用 eziwiki 打造漂亮的 API 文档
order: 3
---

# API 文档示例

![eziwiki](/images/eziwiki.webp)

eziwiki 非常适合创建整洁、条理清晰的 API 文档。

## 示例结构

```
content/
├── intro.md
├── authentication/
│   ├── _meta.json              → { "name": "🔐 认证", "order": 1 }
│   ├── api-keys.md
│   └── oauth.md
├── endpoints/
│   ├── _meta.json              → { "name": "🔌 接口", "order": 2 }
│   ├── users.md
│   ├── posts.md
│   └── webhooks.md
└── reference/
    ├── _meta.json              → { "name": "📕 参考", "order": 3 }
    ├── errors.md
    └── rate-limits.md
```

对于 API 文档，[[search]] 比导航层级更重要——读者通常是冲着某个接口（endpoint）或某个错误码来的。围栏代码块内的代码也会被索引，因此搜索字段名或状态码就能找到记录它的页面。

## 示例 API 接口页面

```markdown
---
title: 获取用户列表
description: 获取用户列表
---

# 获取用户列表

获取分页的用户列表。

## 接口（endpoint）

\`\`\`
GET /api/v1/users
\`\`\`

## 认证

需要在 `Authorization` 请求头中携带有效的 API 密钥：

\`\`\`
Authorization: Bearer YOUR_API_KEY
\`\`\`

## 查询参数

| 参数     | 类型    | 是否必填 | 说明                                      |
| -------- | ------- | -------- | ----------------------------------------- |
| `page`   | integer | 否       | 页码（默认：1）                           |
| `limit`  | integer | 否       | 每页条目数（默认：20，最大：100）         |
| `sort`   | string  | 否       | 排序字段（默认：`created_at`）            |
| `order`  | string  | 否       | 排序方式：`asc` 或 `desc`（默认：`desc`） |
| `status` | string  | 否       | 按状态筛选：`active`、`inactive`          |

## 请求示例

\`\`\`bash
curl -X GET "https://api.example.com/v1/users?page=1&limit=20" \
-H "Authorization: Bearer YOUR_API_KEY"
\`\`\`

\`\`\`javascript
const response = await fetch('https://api.example.com/v1/users?page=1&limit=20', {
headers: {
'Authorization': 'Bearer YOUR_API_KEY'
}
});

const data = await response.json();
\`\`\`

\`\`\`python
import requests

response = requests.get(
'https://api.example.com/v1/users',
params={'page': 1, 'limit': 20},
headers={'Authorization': 'Bearer YOUR_API_KEY'}
)

data = response.json()
\`\`\`

## 响应

### 成功响应（200 OK）

\`\`\`json
{
"data": [
{
"id": "usr_1234567890",
"email": "alice@example.com",
"name": "Alice Johnson",
"status": "active",
"created_at": "2024-01-15T10:30:00Z",
"updated_at": "2024-01-15T10:30:00Z"
},
{
"id": "usr_0987654321",
"email": "bob@example.com",
"name": "Bob Smith",
"status": "active",
"created_at": "2024-01-14T15:20:00Z",
"updated_at": "2024-01-14T15:20:00Z"
}
],
"pagination": {
"page": 1,
"limit": 20,
"total": 150,
"pages": 8
}
}
\`\`\`

### 响应字段

| 字段                | 类型    | 说明                             |
| ------------------- | ------- | -------------------------------- |
| `data`              | array   | 用户对象数组                     |
| `data[].id`         | string  | 用户唯一标识                     |
| `data[].email`      | string  | 用户邮箱地址                     |
| `data[].name`       | string  | 用户全名                         |
| `data[].status`     | string  | 用户状态：`active` 或 `inactive` |
| `data[].created_at` | string  | ISO 8601 时间戳                  |
| `data[].updated_at` | string  | ISO 8601 时间戳                  |
| `pagination`        | object  | 分页元数据                       |
| `pagination.page`   | integer | 当前页码                         |
| `pagination.limit`  | integer | 每页条目数                       |
| `pagination.total`  | integer | 条目总数                         |
| `pagination.pages`  | integer | 总页数                           |

## 错误响应

### 401 Unauthorized（未授权）

\`\`\`json
{
"error": {
"code": "unauthorized",
"message": "Invalid or missing API key"
}
}
\`\`\`

### 429 Too Many Requests（请求过多）

\`\`\`json
{
"error": {
"code": "rate_limit_exceeded",
"message": "Rate limit exceeded. Try again in 60 seconds."
}
}
\`\`\`

### 500 Internal Server Error（服务器内部错误）

\`\`\`json
{
"error": {
"code": "internal_error",
"message": "An unexpected error occurred"
}
}
\`\`\`

## 速率限制

- **速率限制**：每分钟 100 次请求
- **响应头**：
  - `X-RateLimit-Limit`：每分钟最大请求数
  - `X-RateLimit-Remaining`：剩余请求数
  - `X-RateLimit-Reset`：速率限制重置的 Unix 时间戳

## 相关接口

- [获取用户](/api/users/get) - 按 ID 获取单个用户
- [创建用户](/api/users/create) - 创建新用户
- [更新用户](/api/users/update) - 更新现有用户
```

## 认证页面示例

```markdown
---
title: 认证
description: 了解如何对 API 请求进行认证
---

# 认证

所有 API 请求都需要使用 API 密钥进行认证。

## 获取 API 密钥

1. 登录你的控制台（dashboard）
2. 进入"设置 → API 密钥"（Settings → API Keys）
3. 点击"创建 API 密钥"
4. 复制并妥善保管你的密钥

⚠️ **重要**：请对 API 密钥严格保密，切勿将其提交到版本控制系统中。

## 使用你的 API 密钥

将你的 API 密钥放入 `Authorization` 请求头中：

\`\`\`
Authorization: Bearer YOUR_API_KEY
\`\`\`

## 请求示例

### cURL

\`\`\`bash
curl -X GET "https://api.example.com/v1/users" \
-H "Authorization: Bearer YOUR_API_KEY"
\`\`\`

### JavaScript

\`\`\`javascript
const response = await fetch('https://api.example.com/v1/users', {
headers: {
'Authorization': 'Bearer YOUR_API_KEY'
}
});
\`\`\`

### Python

\`\`\`python
import requests

headers = {'Authorization': 'Bearer YOUR_API_KEY'}
response = requests.get('https://api.example.com/v1/users', headers=headers)
\`\`\`

## 环境变量

将你的 API 密钥保存在环境变量中：

\`\`\`bash

# .env

API_KEY=your_api_key_here
\`\`\`

\`\`\`javascript
const apiKey = process.env.API_KEY;
\`\`\`

## 安全最佳实践

- ✅ 所有请求均使用 HTTPS
- ✅ 将 API 密钥保存在环境变量中
- ✅ 定期轮换密钥
- ✅ 开发环境与生产环境使用不同的密钥
- ❌ 切勿将 API 密钥提交到版本控制
- ❌ 切勿在客户端代码中暴露 API 密钥

## 错误响应

### 401 Unauthorized（未授权）

API 密钥缺失或无效：

\`\`\`json
{
"error": {
"code": "unauthorized",
"message": "Invalid or missing API key"
}
}
\`\`\`

### 403 Forbidden（禁止访问）

密钥有效但权限不足：

\`\`\`json
{
"error": {
"code": "forbidden",
"message": "Insufficient permissions"
}
}
\`\`\`
```

## 对 API 文档的好处

### 结构清晰

通过嵌套导航按资源组织接口（endpoint）。

### 代码示例

以多种语言展示示例，并带有语法高亮。

### 可搜索

用户可以快速找到所需内容。

### 版本控制

在 Git 中跟踪 API 文档的变更。

### 易于更新

更新文档的速度与更新 API 一样快。

## 下一步

- [创建你的第一个 Wiki](/example/getting-started/first-wiki)
- [了解代码块](/example/content/code-blocks)
- [部署你的文档](/example/deployment/static-export)
