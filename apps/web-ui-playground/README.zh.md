# Skyroc UI Playground（演示场）

[English](./README.md) | [简体中文](./README.zh.md)

Skyroc UI 的交互式组件展示和测试环境。基于 Next.js 15 构建，为所有组件提供全面的开发和测试平台。

## 概述

Playground 是一个 Next.js 应用，具有多重用途：

- **组件展示** - 浏览和交互 50+ Skyroc UI 组件
- **实时示例** - 查看组件在实际使用场景中的表现
- **开发环境** - 独立测试新组件和功能
- **代码参考** - 查看每个演示的实现细节和源代码

## 快速开始

```bash
# 安装依赖（如果尚未安装）
pnpm install

# 启动开发服务器
pnpm dev

# 打开 http://localhost:3000
```

## 可用脚本

| 命令         | 描述           |
| ------------ | -------------- |
| `pnpm dev`   | 启动开发服务器 |
| `pnpm build` | 构建生产版本   |
| `pnpm start` | 启动生产服务器 |
| `pnpm lint`  | 运行 ESLint    |

## 项目结构

```
playground/
├── src/
│   ├── app/
│   │   ├── (demo)/          # 组件演示
│   │   │   ├── button/
│   │   │   ├── input/
│   │   │   ├── card/
│   │   │   └── ...          # 50+ 组件演示
│   │   ├── layout.tsx       # 根布局
│   │   └── page.tsx         # 首页
│   ├── components/          # Playground 专用组件
│   ├── config.ts            # 配置文件
│   └── css/                 # 样式
├── public/                  # 静态资源
└── next.config.ts          # Next.js 配置
```

## 组件演示

所有组件演示位于 `src/app/(demo)/` 目录下。每个组件都有自己的目录，包含：

- 多个使用示例
- 不同的变体和状态
- 交互式演示
- 边缘情况和错误处理

### 添加新演示

1. 在 `src/app/(demo)/[component-name]/` 下创建新目录
2. 在 `modules/` 子目录中添加演示模块
3. 创建 `page.tsx` 来展示演示
4. 如需要，更新 `components-meta.ts`

## 特性

- **热重载** - 开发过程中即时反馈
- **TypeScript** - 所有演示的完整类型安全
- **响应式** - 在不同屏幕尺寸上测试组件
- **主题切换** - 在亮色和暗色模式之间切换
- **代码高亮** - 语法高亮的代码示例

## 技术栈

- **框架**: Next.js 15 (App Router)
- **UI 库**: Skyroc UI (workspace 包)
- **样式**: Tailwind CSS 4
- **TypeScript**: 完整类型支持
- **图标**: Lucide React

## 部署

Playground 可以部署到多个平台：

### Vercel（推荐）

```bash
# 部署到 Vercel
pnpm deploy:playground
```

### Cloudflare Pages

```bash
# 构建 Cloudflare 版本
pnpm build
```

配置可在 `wrangler.jsonc` 和 `open-next.config.ts` 中找到。

## 贡献

在向 Skyroc UI 添加新组件时，请同时：

1. 在 playground 中添加完整的演示
2. 包含多个使用示例
3. 记录边缘情况
4. 在不同主题下测试

## 许可证

MIT 许可证 © 2024-至今 [Ohh](https://github.com/Ohh-889)
