# @skyroc/web-admin-vite

Skyroc Admin 的 Vite 配置预设包，用来把 admin 应用里重复的构建、代理、插件、别名和开发服务器配置收口到一个共享入口。

## 什么时候使用

当一个 admin 应用符合下面约定时，可以直接使用这个包：

- 页面目录在 `src/pages`
- 组件目录在 `src/components`
- 本地图标目录在 `src/assets/svg-icon`
- 使用 TanStack Router、React、UnoCSS、unplugin-icons、unplugin-auto-import
- 使用 `VITE_*` 环境变量配置 base url 和代理

如果应用只需要少量差异，优先通过 `application` 配置覆盖预设；只有确实需要 Vite 原生能力时，再通过 `vite` 字段合并原始 Vite 配置。

## 快速开始

在应用的 `vite.config.ts` 中使用：

```ts
import { defineConfig } from '@skyroc/web-admin-vite';

export default defineConfig({
  application: {
    css: {
      additionalData: '@use "@/styles/scss/global.scss" as *;'
    }
  }
});
```

如果完全使用默认预设，也可以写成：

```ts
import { defineConfig } from '@skyroc/web-admin-vite';

export default defineConfig();
```

需要根据 Vite 命令或 mode 动态配置时，传入工厂函数：

```ts
import { defineConfig } from '@skyroc/web-admin-vite';

export default defineConfig(configEnv => {
  return {
    application: {
      base: configEnv.mode === 'prod' ? '/admin/' : '/'
    }
  };
});
```

## 默认预设

`defineConfig` 会生成一份完整的 Vite 配置，并在最后合并 `vite` 字段里的原始配置。

默认包含：

- `base`: 使用 `application.base`，否则读取 `VITE_BASE_URL`，再否则为 `/`
- `build`: 统一资源输出目录和基础 manual chunks
- `define`: 注入 `__DEV__` 和 `BUILD_TIME`
- `css`: 可配置 SCSS `additionalData`
- `plugins`: 注入 admin 内置插件组
- `preview`: 默认端口 `9725`
- `resolve`: 默认 `@ -> src`、`~ -> .`，并 dedupe React runtime
- `server`: 默认 `host = 0.0.0.0`、`open = true`、`port = 9527`
- `proxy`: 开发服务下根据环境变量创建代理

## 环境变量

常用环境变量如下：

| 变量名                        | 作用                                |
| ----------------------------- | ----------------------------------- |
| `VITE_BASE_URL`               | 应用 base url                       |
| `VITE_HTTP_PROXY`             | 为 `Y` 时，在 dev server 中启用代理 |
| `VITE_PROXY_LOG`              | 为 `Y` 时，打印代理请求日志         |
| `VITE_SERVICE_BASE_URL`       | 默认后端服务地址                    |
| `VITE_OTHER_SERVICE_BASE_URL` | 其他后端服务地址，支持 JSON5 字符串 |

示例：

```dotenv
VITE_BASE_URL=/
VITE_HTTP_PROXY=Y
VITE_PROXY_LOG=Y
VITE_SERVICE_BASE_URL=https://api.example.com
VITE_OTHER_SERVICE_BASE_URL={ auth: "https://auth.example.com" }
```

默认代理路径：

- 主服务：`/proxy-default`
- 其他服务：`/proxy-${key}`

例如 `VITE_OTHER_SERVICE_BASE_URL={ auth: "https://auth.example.com" }` 会创建 `/proxy-auth`。

## 配置结构

```ts
import { defineConfig } from '@skyroc/web-admin-vite';

export default defineConfig({
  application: {
    // admin preset options
  },
  vite: {
    // raw Vite config, merged after the admin preset
  }
});
```

`application` 用于调整 admin 预设，`vite` 用于补充 Vite 原生配置。两者都配置同一项时，`vite` 会在最后合并。

### 为什么分成 application 和 vite

`application` 是 admin 语义配置，`vite` 是原始 Vite `UserConfig`。这样拆开是为了避免 `plugins`、`build`、`server`、`resolve` 等字段在顶层产生歧义。

```ts
export default defineConfig({
  application: {
    plugins: {
      router: false,
      autoImport: {
        antd: false
      }
    },
    build: {
      manualChunks: {
        charts: ['echarts']
      }
    }
  },
  vite: {
    server: {
      fs: {
        strict: false
      }
    }
  }
});
```

如果把 Vite options 平铺在顶层：

```ts
export default defineConfig({
  plugins: [],
  build: {},
  server: {}
});
```

`plugins` 就无法清楚表示它是 Vite 原生插件数组，还是 admin preset 的插件开关对象；`build` 也会同时像 Vite 的 `BuildOptions` 和 admin 的构建预设。当前设计保持边界清楚：后台应用语义放 `application`，Vite 原生能力放 `vite`，需要最终覆盖时由 `vite` 合并在最后。

## application 配置

### base

配置应用 base url。支持静态值，也支持根据上下文动态返回。

```ts
export default defineConfig({
  application: {
    base: '/admin/'
  }
});
```

```ts
export default defineConfig({
  application: {
    base: context => (context.isBuild ? '/admin/' : '/')
  }
});
```

### css

配置 SCSS 全局注入。

```ts
export default defineConfig({
  application: {
    css: {
      additionalData: '@use "@/styles/scss/global.scss" as *;'
    }
  }
});
```

关闭 CSS 预设：

```ts
export default defineConfig({
  application: {
    css: false
  }
});
```

### build

默认会按 admin 项目约定整理构建产物：

- CSS 输出到 `css/`
- 图片输出到 `images/`
- 页面 chunk 输出到 `js/pages/`
- 组件 chunk 输出到 `js/components/`
- React、Ant Design、i18n、TanStack Router 拆分为独立 chunk

追加 manual chunks：

```ts
export default defineConfig({
  application: {
    build: {
      manualChunks: {
        charts: ['echarts']
      }
    }
  }
});
```

关闭 build 预设：

```ts
export default defineConfig({
  application: {
    build: false
  }
});
```

### server

覆盖开发服务器配置：

```ts
export default defineConfig({
  application: {
    server: {
      open: false,
      port: 3000,
      warmupClientFiles: ['./index.html', './src/pages/**/*']
    }
  }
});
```

关闭 server 预设：

```ts
export default defineConfig({
  application: {
    server: false
  }
});
```

### proxy

默认代理启用条件：

- 当前命令是 `serve`
- 不是 preview
- `VITE_HTTP_PROXY=Y`

手动控制：

```ts
export default defineConfig({
  application: {
    proxy: {
      enabled: context => context.isServe && !context.isPreview,
      enableLog: true
    }
  }
});
```

自定义服务配置：

```ts
export default defineConfig({
  application: {
    proxy: {
      serviceConfig: {
        baseURL: 'https://api.example.com',
        proxyPattern: '/api',
        other: [
          {
            baseURL: 'https://auth.example.com',
            proxyPattern: '/auth-api'
          }
        ]
      }
    }
  }
});
```

关闭代理预设：

```ts
export default defineConfig({
  application: {
    proxy: false
  }
});
```

### resolve

默认别名：

- `@` 指向 `src`
- `~` 指向应用根目录

默认 dedupe：

- `react`
- `react-dom`
- `react/jsx-dev-runtime`
- `react/jsx-runtime`

覆盖别名：

```ts
export default defineConfig({
  application: {
    resolve: {
      rootAlias: false,
      srcAlias: 'source'
    }
  }
});
```

关闭 React dedupe：

```ts
export default defineConfig({
  application: {
    resolve: {
      dedupeReact: false
    }
  }
});
```

### buildTime

默认注入：

```ts
define: {
  __DEV__: JSON.stringify(command === 'serve'),
  BUILD_TIME: JSON.stringify(buildTime)
}
```

修改构建时间格式：

```ts
export default defineConfig({
  application: {
    buildTime: {
      format: 'YYYY-MM-DD HH:mm',
      timezone: 'Asia/Shanghai'
    }
  }
});
```

修改注入变量名：

```ts
export default defineConfig({
  application: {
    buildTimeDefineName: '__BUILD_TIME__'
  }
});
```

关闭构建时间注入：

```ts
export default defineConfig({
  application: {
    buildTimeDefineName: false
  }
});
```

## 插件配置

默认插件顺序：

1. `prependPlugins`
2. TanStack DevTools
3. TanStack Router
4. React
5. Babel
6. UnoCSS icon preset
7. unplugin-icons and svg sprite
8. auto-import
9. html build meta
10. vite-plugin-inspect
11. remove-console
12. project info
13. `appendPlugins`

所有内置插件都可以传 options，或者用 `false` 关闭：

```ts
export default defineConfig({
  application: {
    plugins: {
      inspect: false,
      projectInfo: false,
      removeConsole: false
    }
  }
});
```

### 插入自定义插件

```ts
import type { Plugin } from 'vite';
import { defineConfig } from '@skyroc/web-admin-vite';

const myPlugin: Plugin = {
  name: 'my-plugin'
};

export default defineConfig({
  application: {
    plugins: {
      appendPlugins: [myPlugin]
    }
  }
});
```

### React

传给 `@vitejs/plugin-react` 的配置：

```ts
export default defineConfig({
  application: {
    plugins: {
      react: {
        jsxRuntime: 'automatic'
      }
    }
  }
});
```

关闭 React 插件：

```ts
export default defineConfig({
  application: {
    plugins: {
      react: false
    }
  }
});
```

### Babel

Babel 插件默认启用 Jotai preset 和 React Compiler preset。Jotai preset 会把项目自定义的
`atomWithPartial` 识别为 atom 工厂，因此调用点变量名会自动写入 `debugLabel`，供 Devtools
显示并用于开发态热更新缓存。

```ts
export default defineConfig({
  application: {
    plugins: {
      babel: {
        jotai: false,
        reactCompiler: false
      }
    }
  }
});
```

关闭 Babel 插件：

```ts
export default defineConfig({
  application: {
    plugins: {
      babel: false
    }
  }
});
```

### Router

默认 TanStack Router 配置：

- `routesDirectory`: `./src/pages`
- `generatedRouteTree`: `./src/features/router/routeTree.gen.ts`
- `routeToken`: `layout`
- `target`: `react`
- `autoCodeSplitting`: `true`

覆盖配置：

```ts
export default defineConfig({
  application: {
    plugins: {
      router: {
        routesDirectory: './src/routes'
      }
    }
  }
});
```

### 图标

`unocss`、`unpluginIcon`、`autoImport` 会共享图标配置：

- `iconPrefix`: 默认 `icon`
- `localIconPrefix`: 默认 `icon-local`

默认本地图标目录是 `src/assets/svg-icon`。

覆盖本地图标目录：

```ts
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@skyroc/web-admin-vite';

const localIconPath = fileURLToPath(new URL('./src/icons', import.meta.url));

export default defineConfig({
  application: {
    plugins: {
      unocss: {
        iconPrefix: 's-icon',
        localIconPrefix: 's-icon-local',
        localIconPath
      },
      unpluginIcon: {
        iconPrefix: 's-icon',
        localIconPrefix: 's-icon-local',
        localIconPath
      },
      autoImport: {
        iconPrefix: 's-icon',
        localIconPrefix: 's-icon-local',
        localIconPath
      }
    }
  }
});
```

如果三处都要统一改，建议先保持目录约定，避免在使用端重复配置。

### Auto Import

默认自动导入：

- `react`
- `FC` type
- `react-i18next`
- `ahooks`
- `src/components/**`
- `src/config.ts`
- Ant Design 的 `A` 前缀组件，例如 `AButton -> Button`
- 图标组件

追加 resolver：

```ts
export default defineConfig({
  application: {
    plugins: {
      autoImport: {
        dirs: ['src/components/**', 'src/hooks/**'],
        dts: 'src/types/auto-imports.d.ts'
      }
    }
  }
});
```

关闭 Ant Design `A` 前缀解析：

```ts
export default defineConfig({
  application: {
    plugins: {
      autoImport: {
        antd: false
      }
    }
  }
});
```

### Html

默认在 build 时向 `index.html` 的 `<head>` 注入构建时间 meta：

```html
<meta
  name="buildTime"
  content="2026-05-25 12:00:00"
/>
```

修改 meta 名称：

```ts
export default defineConfig({
  application: {
    plugins: {
      html: {
        metaName: 'x-build-time'
      }
    }
  }
});
```

## 合并原始 Vite 配置

需要使用 Vite 原生配置时，放到 `vite` 字段：

```ts
import { defineConfig } from '@skyroc/web-admin-vite';

export default defineConfig({
  application: {
    css: {
      additionalData: '@use "@/styles/scss/global.scss" as *;'
    }
  },
  vite: {
    optimizeDeps: {
      include: ['antd']
    }
  }
});
```

`vite` 会在 admin 预设之后合并，因此适合做最终覆盖。

## 常用命令

```bash
pnpm --filter @skyroc/web-admin-vite typecheck
pnpm --filter @skyroc/web-admin-vite build
```

在 workspace 应用中直接消费该包时，建议在应用的 `predev`、`prebuild`、`prepreview` 中先构建本包，避免 Vite 加载到过期的 `dist`。
