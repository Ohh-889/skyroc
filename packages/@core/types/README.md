# @skyroc/types

> 全局类型定义 - 跨平台支持

## 📦 包信息

- **包名**: `@skyroc/types`
- **目录**: `packages/@core/types`
- **平台**: 跨平台 TypeScript 类型声明
- **依赖**: 无

## 🎯 职责定位

**核心职责**:

- 提供全局类型定义
- API 响应类型
- 业务实体类型
- 通用工具类型

**设计原则**:

- 零依赖
- 类型优先
- 模块化组织

## 📐 目录结构

```
@skyroc/types/
├── src/
│   ├── api/
│   │   ├── auth.d.ts           # 认证相关类型
│   │   ├── route.d.ts          # 路由相关类型
│   │   ├── common.d.ts         # API 通用类型
│   │   ├── service.d.ts        # 服务配置类型
│   │   └── system-manage.d.ts  # 系统管理接口类型
│   ├── app/
│   │   ├── common.d.ts         # 通用类型
│   │   ├── global.d.ts         # 全局类型
│   │   ├── menu.d.ts           # 菜单类型
│   │   ├── router.d.ts         # 路由类型
│   │   ├── storage.d.ts        # 存储类型扩展点
│   │   └── union-key.d.ts      # 联合类型key
│   ├── locales/
│   │   └── i18n.d.ts           # 国际化类型
│   └── index.ts                # 统一导出
├── package.json
├── tsconfig.json
└── README.md
```

## 💡 使用示例

### 示例 1: API 类型使用

```ts
// 在 service 中使用
import type { Api } from '@skyroc/types';

async function login(params: Api.Auth.LoginParams): Promise<Api.Service.Response<Api.Auth.LoginResponse>> {
  return axios.post('/auth/login', params);
}
```

### 示例 2: 路由类型扩展

```ts
declare global {
  namespace Router {
    interface RoutePathRegistry extends Record<keyof import('@/features/router/routeTree.gen').FileRoutesByTo, true> {}
  }
}

export {};
```

### 示例 3: 存储类型使用

```ts
declare global {
  namespace StorageType {
    interface Local {
      /** The access token owned by the app auth flow. */
      token: string;
    }
  }
}

export {};
```

### 示例 4: 全局类型使用

```ts
// 无需导入,直接使用全局命名空间
const option: Common.Option = {
  label: 'Option 1',
  value: '1'
};

const storage: StorageType.Local = {
  token: 'xxx'
  // ...
};
```

## 🔌 主要导出

### API 类型

- `Api.Auth` - 认证相关类型
- `Api.Route` - 路由相关类型
- `Api.Common` - 通用 API 类型
- `Api.Service` - 服务配置类型
- `Api.SystemManage` - 系统管理接口类型

### App 类型

- `App.Global` - 全局应用类型
- `UnionKey` - 联合类型键

### 全局命名空间

- `Common` - 通用类型(Option, YesOrNo 等)
- `Menu` - 菜单类型
- `Router` - 路由类型
- `StorageType` - 存储类型
- `I18n` - 国际化类型

## 🔗 相关包

`@core` 是仓库内的基础设施目录分组，不是 TypeScript namespace 或 npm scope。
目录准入条件和当前包索引见 [`../README.md`](../README.md)。
