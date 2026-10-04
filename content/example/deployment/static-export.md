---
tags:
  - deployment
title: 静态导出
description: 将你的 Wiki 导出为静态 HTML 文件
order: 1
---

# 静态导出

eziwiki 会生成一个完全静态的站点，可以部署到任何地方。

## 构建你的站点

```bash
npm run build
```

这会在 `out/` 目录中生成一个经过优化的静态站点。

## 生成了什么

```
out/
├── index.html              # 首页
├── getting-started/
│   ├── installation.html
│   ├── quick-start.html
│   └── first-wiki.html
├── configuration/
│   ├── payload.html
│   ├── navigation.html
│   └── theme.html
├── _next/                  # 优化后的资源
│   ├── static/
│   └── ...
└── ...
```

## 预览生产构建

```bash
npm run start
```

这会启动一个本地服务器来预览你的生产构建。

## 随处部署

`out/` 目录只包含静态文件（HTML、CSS、JS）。你可以将其部署到：

- **静态托管**：Netlify、Vercel、GitHub Pages
- **CDN**：Cloudflare Pages、AWS S3 + CloudFront
- **Web 服务器**：Nginx、Apache
- **任意 HTTP 服务器**：甚至一个简单的 Python 服务器

## 简单的 HTTP 服务器

在本地测试你的构建：

```bash
# 使用 Python
cd out
python -m http.server 8000

# 使用 Node.js
npx serve out

# 使用 PHP
cd out
php -S localhost:8000
```

访问 [http://localhost:8000](http://localhost:8000)

## Nginx 配置

```nginx
server {
    listen 80;
    server_name wiki.example.com;
    root /var/www/wiki/out;
    index index.html;

    location / {
        try_files $uri $uri.html $uri/ =404;
    }

    # 缓存静态资源
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Apache 配置

```apache
<VirtualHost *:80>
    ServerName wiki.example.com
    DocumentRoot /var/www/wiki/out

    <Directory /var/www/wiki/out>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted

        # 重写规则
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule ^(.*)$ /$1.html [L]
    </Directory>

    # 缓存静态资源
    <Directory /var/www/wiki/out/_next/static>
        Header set Cache-Control "public, max-age=31536000, immutable"
    </Directory>
</VirtualHost>
```

## AWS S3 + CloudFront

### 1. 创建 S3 存储桶

```bash
aws s3 mb s3://my-wiki
```

### 2. 上传文件

```bash
aws s3 sync out/ s3://my-wiki --delete
```

### 3. 配置静态网站托管

```bash
aws s3 website s3://my-wiki \
  --index-document index.html \
  --error-document 404.html
```

### 4. 设置 CloudFront

创建指向你的 S3 存储桶的 CloudFront 分发，以实现全球 CDN 分发。

## Cloudflare Pages

### 使用 Git

1. 将你的代码推送到 GitHub
2. 将仓库连接到 Cloudflare Pages
3. 设置构建命令：`npm run build`
4. 设置输出目录：`out`
5. 部署！

### 使用 CLI

```bash
# 安装 Wrangler
npm install -g wrangler

# 部署
wrangler pages publish out
```

## 自定义域名

部署后，将你的域名指向你的托管平台：

### DNS 配置

```
Type    Name    Value
A       @       192.0.2.1
CNAME   www     your-site.pages.dev
```

### HTTPS

大多数平台都提供免费的 SSL 证书：

- Vercel：自动
- Netlify：自动
- Cloudflare Pages：自动
- GitHub Pages：自动

## 构建优化

### 分析包体积

```bash
npm run build
```

检查构建输出中的包体积。

### 优化图片

将图片放在 `public/` 目录中，并使用 Next.js 的 Image 组件：

```jsx
import Image from 'next/image';

<Image src="/images/screenshot.png" alt="Screenshot" width={800} height={600} />;
```

### 精简依赖

保持你的 `package.json` 精简，只安装你需要的依赖。

## CI/CD 集成

### GitHub Actions

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - run: npm run deploy # 你的部署脚本
```

## 环境变量

为不同环境设置环境变量：

```bash
# .env.production
NEXT_PUBLIC_BASE_URL=https://wiki.example.com
```

## 故障排查

### 404 错误

确保你的服务器已配置为在不带扩展名的情况下提供 `.html` 文件。

### 资源未加载

检查 `payload/config.ts` 中的 `baseUrl` 是否与你的部署 URL 匹配。

### 构建失败

```bash
# 清除缓存并重新构建
rm -rf .next out
npm run build
```

## 下一步

- [部署到 GitHub Pages](/example/deployment/github-pages)
- [部署到 Vercel](/example/deployment/vercel)
