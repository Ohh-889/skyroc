# Expo 模板规格

> 这份文档回答一个问题：**一个值得复用的 Expo 模板，应该包含什么、不该包含什么、以及为什么。**
> 它是设计依据与自检清单，不是使用说明。使用说明请写在 `README.md`。

---

## 0. 设计原则

模板的价值不在"塞了多少库"，而在**帮使用者省掉多少不可逆的早期决策**。四条原则贯穿全文：

1. **换起来越贵的东西，模板越该定死。**
   路由结构、环境矩阵、主题 token、鉴权存储位置——这些后期重构等于重写。
   而 UI 动画库、图表库、富文本编辑器随时能装，模板不该替人选。

2. **示例只留最小可运行的一份。**
   示例页越多，使用者删得越久。每个能力配一个能跑通的最小范例，且必须能一键删干净。

3. **模板假设自己会被裁剪。**
   业务无关的东西集中放、明确标注、独立目录。裁剪路径写进 README 第一屏。

4. **文档写"为什么"，不写"有什么"。**
   "有什么"看 `package.json` 就够了。使用者真正缺的是边界知识：
   为什么 token 放 SecureStore、什么改动必须重新 build 而不能 OTA。

---

## 1. 验收标准

模板做得好不好，只看一条：

> **克隆下来，改包名和图标，配好环境变量，30 分钟内能不能在真机上装出一个带登录的包。**

能，就是好模板。围绕这条标准，下面的能力分成五层：

| 层 | 名称 | 判定 | 缺了会怎样 |
|---|---|---|---|
| L0 | 地基 | 必须有 | 后期补 = 重写 |
| L1 | 核心链路 | 必须有 | 跑不通"开发→上架" |
| L2 | 体验基线 | 强烈建议 | App 一眼廉价 |
| L3 | 工程质量 | 强烈建议 | 多人协作即失控 |
| L4 | 可选能力 | 按需 | 用脚手架命令生成，不预装 |

---

## 2. L0 · 地基（不可逆决策）

### 2.1 路由与导航

**方案**：Expo Router（文件式路由）+ typed routes 开启。

**必须包含**：

- 分组结构定死：`(auth)` / `(tabs)` / `(modal)` / `(onboarding)`
- 一个**真实可跑的守卫**：未登录 → `redirect` 到登录页；登录成功 → `replace` 回主栈（不是 `push`，否则能返回登录页）
- 深链接（deep link）与 universal link 的 scheme 配置 + 一个"从推送点进详情页"的完整链路
- 404 页 `+not-found.tsx`、根级 `_layout.tsx` 的加载编排

**坑**：守卫写在 `_layout` 还是 `useEffect` 里，直接决定会不会闪一帧登录页。模板必须给出正确写法并注释说明。

### 2.2 环境矩阵

**方案**：`app.config.ts`（**不是**静态 `app.json`，必须能读环境变量）。

**必须包含**：

- 三套环境：`development` / `staging` / `production`
- 每套环境独立的 `bundleIdentifier` / `package`、`name`、图标、splash
  → **三个包能同时装在同一台手机上**，这是联调的刚需
- 环境变量加载策略：`EXPO_PUBLIC_*` 与构建期变量的区分（前者会被打进包，绝不能放密钥）
- `.env.example` 必须提交，`.env.*` 必须 gitignore

**坑**：这块后期补极痛苦——包名一改，已安装用户全部丢失、推送证书重配、渠道包重签。

### 2.3 主题系统

**方案**：token 化，亮/暗色 + 跟随系统 + 手动覆盖三态。

**必须包含**：

- 语义化 token：`colors` / `spacing` / `radius` / `typography` / `shadow`
  颜色用语义名（`bg.primary`、`text.muted`），不用 `gray500`
- 三态切换：`system` | `light` | `dark`，选择持久化
- 状态栏样式、导航栏背景、splash 背景跟随主题
- 与 UI 组件库（若使用 `@skyroc/native-ui`）的 token 对接方式

**坑**：必须在写第一个业务页面之前定好。全项目补主题是地狱。

### 2.4 鉴权与安全存储

**必须包含**：

- token 存 `expo-secure-store`，**不是** AsyncStorage
- 完整闭环：登录 → 持久化 → 冷启动恢复 → 静默刷新 → 登出清理
- **登出必须清 Query cache**，否则下一个账号会看到上一个账号的数据
- 401 刷新时的**并发请求排队**：多个请求同时 401，只发一次 refresh，其余等待复用结果
- 生物识别解锁（`expo-local-authentication`）留好扩展点

---

## 3. L1 · 核心链路（跑通"开发→上架"）

### 3.1 构建与发布

**必须包含**：

- `eas.json`：`development`（dev client）/ `preview`（内测分发）/ `production` 三套 profile
- **Development Build 而非 Expo Go 为默认开发方式**，并在 README 说明原因
  （Expo Go 装不了任意原生库，新手第一次装 native 依赖就崩）
- EAS Update：channel 与 `runtimeVersion` 策略
  推荐 `runtimeVersion: { policy: "fingerprint" }`，并解释清楚
- **一张"什么改动能 OTA、什么必须重新 build"的对照表**（见 §9）
- 版本号策略：`version` 手动 / `buildNumber` 由 EAS 自增
- 提交配置：`eas submit` 的 App Store / Play Console 凭据说明

### 3.2 网络层

**必须包含**：

- 统一请求客户端：baseURL 按环境切、token 注入、超时、重试（仅幂等请求）
- 统一错误结构：业务错误码 / HTTP 错误 / 网络断开 三类分开处理
- 服务端状态用 **TanStack Query**，客户端状态用 zustand，**两者绝不混用**
- 请求取消（页面卸载时 abort）
- 离线检测（`expo-network` / NetInfo）与断网提示
- 一个完整的"分页列表 + 详情"接口范例，包含 loading / empty / error / retry 四态

**坑**：把接口数据塞进全局 store 是 RN 项目最常见的架构错误，模板必须用范例把正确姿势立住。

### 3.3 安全区与键盘

三个决定"廉价感"的细节：

- `react-native-safe-area-context`：`SafeAreaView` 与 `useSafeAreaInsets` 的正确取舍（列表页用 insets，不用 SafeAreaView 包整页）
- 键盘避让：推荐 `react-native-keyboard-controller`，给出输入框贴键盘上方的范例
- 状态栏：`expo-status-bar` 随主题切换 style

### 3.4 启动编排

**必须包含**：

- `expo-splash-screen` 手动控制 hide 时机
- 首帧前完成：字体加载 → 主题恢复 → token 恢复 → 语言恢复
- **不允许出现白屏闪烁**——这是模板质量最直观的体现
- 字体用 `expo-font` 预加载，并给出自定义字体接入范例

---

## 4. L2 · 体验基线

### 4.1 列表方案（抄得最多的一段代码）

一个 **FlashList** 的完整范例，必须同时包含：

- 分页加载（`onEndReached` + 去重 + 防抖）
- 下拉刷新
- 骨架屏（首次加载）
- 空态（有插图、有引导动作）
- 错误态 + 重试按钮
- `estimatedItemSize` 与 `keyExtractor` 的正确配置

### 4.2 表单

`react-hook-form` + `zod`，一个带完整校验错误展示的登录表单：

- 字段级错误 + 表单级错误
- 提交中禁用 + loading
- 键盘 `returnKeyType` 串联聚焦
- 服务端校验错误回填到对应字段

### 4.3 权限与原生能力

封装统一的权限请求 hook，**必须包含"被拒绝后引导去系统设置"这一步**（90% 的模板都漏）：

- 相机 / 相册 / 定位 / 通知 / 麦克风
- 三态处理：未询问 / 已授权 / 已拒绝（含"不再询问"）
- iOS `Info.plist` 用途文案与 Android 权限声明配齐，且文案可按环境本地化

### 4.4 推送通知

- `expo-notifications`：token 注册、上报后端、前台/后台/杀进程三种状态的接收
- 点击通知的路由跳转（与 §2.1 深链接打通）
- Android channel 配置、iOS 权限时机（不要一进 App 就弹）
- 角标清理

### 4.5 国际化

- i18n 骨架（推荐 `i18next` + `expo-localization`）
- 语言持久化 + 跟随系统
- **至少保证 RTL 不崩**（布局用 `start/end` 而非 `left/right`）
- 日期/数字/货币格式化统一入口

### 4.6 错误处理与可观测性

- 根级 `ErrorBoundary` + 兜底页（可重启 App）
- 崩溃与异常上报（Sentry 或同类），dev 环境默认关闭
- source map 上传接入 EAS Build 流程
- 关键埋点入口预留（不预装具体分析 SDK）

### 4.7 其他体验细节

- 触觉反馈（`expo-haptics`）统一封装，别每个按钮各写各的
- 图片：`expo-image` + 占位图 + 缓存策略
- 手势与动画：`react-native-gesture-handler` + `reanimated` 配好（这两个的 babel/plugin 配置最容易出错）
- 无障碍基线：所有可点区域有 `accessibilityLabel`、命中区 ≥ 44pt

---

## 5. L3 · 工程质量

- **TypeScript strict**，路径别名（`@/*`），`tsconfig` 继承 `expo/tsconfig.base`
- Lint / 格式化：oxlint + oxfmt（或项目既有方案），与仓库根配置对齐
- `husky` + `lint-staged` + `commitlint`（Conventional Commits）
- CI：`typecheck` + `lint` + `test` + 至少一次 `eas build --profile preview` 的冒烟
- 测试基线：
  - Jest + React Native Testing Library 配好能跑，给 2~3 个示例（组件 / hook / util）
  - Maestro 一条登录流程 e2e 当样板
  - **不追求覆盖率数字**，追求"新人能照着写第二个测试"
- `.gitignore` / `.easignore` / `.npmrc` 齐全
- Node 版本锁定（`.nvmrc` 或 `engines`）

---

## 6. L4 · 可选能力（**不预装**，用生成命令按需加）

这些放进模板会变成负担，应该做成脚手架命令或文档片段：

支付、地图、蓝牙、WebView 桥接、扫码、音视频、文件上传与断点续传、图表、富文本编辑器、社交登录（微信/Apple/Google）、应用内更新提示、埋点 SDK。

> 如果团队有高频固定需求（例如微信登录+支付），可以做成**独立 workspace 包**被模板可选引入，而不是写进模板主干。

---

## 7. 目录结构

```
apps/expo-templete/
├── app/                      # 路由（Expo Router）
│   ├── _layout.tsx           # 根布局：Provider 编排 + splash 控制
│   ├── +not-found.tsx
│   ├── (auth)/               # 登录/注册/找回
│   ├── (tabs)/               # 主栈
│   └── (modal)/              # 模态层
├── src/
│   ├── api/                  # 请求客户端 + 接口定义 + Query hooks
│   ├── components/           # 通用组件（业务无关）
│   ├── features/             # 按业务域分的模块（可整目录删除）
│   ├── hooks/                # 通用 hooks（权限、主题、键盘…）
│   ├── i18n/
│   ├── store/                # zustand，仅客户端状态
│   ├── theme/                # token 定义与 Provider
│   ├── utils/
│   └── types/
├── assets/                   # 图标、splash、字体、插图
├── examples/                 # ⚠️ 示例代码，交付前整目录删除
├── docs/
│   ├── ota-vs-rebuild.md     # §9 对照表
│   └── release.md            # 发版手册
├── app.config.ts
├── eas.json
├── .env.example
└── README.md
```

**关键约定**：

- `app/` 只放路由与布局，**不写业务逻辑**，页面逻辑下沉到 `src/features/*`
- `features/` 按域切分，每个域自包含（组件 + hooks + api + types），删除一个域不影响其他
- `examples/` 是模板的一次性脚手架，README 第一屏就告诉用户删掉它

---

## 8. 依赖清单（按职责分组）

> 版本一律用 `npx expo install` 解析，**不手写版本号**——Expo SDK 对原生依赖有严格版本约束。

| 职责 | 选型 | 说明 |
|---|---|---|
| 路由 | `expo-router` | typed routes 必开 |
| 服务端状态 | `@tanstack/react-query` | 含 persist（可选） |
| 客户端状态 | `zustand` | 轻量足够，不上 Redux |
| 表单 | `react-hook-form` + `zod` | schema 与后端类型共享 |
| 存储 | `expo-secure-store` + `react-native-mmkv` | 密钥用前者，普通缓存用后者 |
| 列表 | `@shopify/flash-list` | |
| 动画/手势 | `react-native-reanimated` + `react-native-gesture-handler` | babel plugin 顺序有坑 |
| 键盘 | `react-native-keyboard-controller` | |
| 安全区 | `react-native-safe-area-context` | |
| 图片 | `expo-image` | |
| 国际化 | `i18next` + `react-i18next` + `expo-localization` | |
| 通知 | `expo-notifications` | |
| 上报 | `@sentry/react-native` | dev 关闭 |
| UI | `@skyroc/native-ui` | 本仓库自有组件库 |

---

## 9. OTA vs. 重新构建（必须写进文档的对照表）

| 改动 | EAS Update 够用 | 必须重新 build |
|---|:---:|:---:|
| JS 业务逻辑、页面、样式 | ✅ | |
| 图片/字体等 JS 侧资源 | ✅ | |
| 文案、i18n 词条 | ✅ | |
| 新增 JS-only 依赖 | ✅ | |
| 新增含原生代码的依赖 | | ✅ |
| 修改 `app.config.ts` 中的原生字段（权限、scheme、插件） | | ✅ |
| 升级 Expo SDK | | ✅ |
| 改包名 / 图标 / splash | | ✅ |
| 修改 `runtimeVersion` | | ✅ |

> 这张表是模板文档里**使用频率最高**的一页。放显眼位置。

---

## 10. 明确排除（模板不该有的东西）

- ❌ **完整业务 UI 组件库**——除非那正是要推广的东西（本仓库有 `@skyroc/native-ui`，则它是默认选择而非模板内实现）
- ❌ **十几个示例页面**——每个能力一个最小范例，多了只会被删
- ❌ **重型状态管理方案**——服务端/客户端状态分离是原则问题，不是库能解决的
- ❌ **具体业务概念**（订单、商品、工单）
- ❌ **过度封装的"万能组件"**——`<XButton>` 包了 20 个 props，改需求时比原生还难用
- ❌ **手写的原生模块**——除非模板就是为它服务的
- ❌ **未验证的"最佳实践"**——模板里的每一行都会被复制上千次，抄错的代价是复利

---

## 11. README 必须回答的问题

模板文档的价值在"为什么"，以下每条都要有答案：

1. 5 分钟裁剪清单：改包名 → 换图标/splash → 删 `examples/` → 配 `.env` → 跑起来
2. 为什么默认 Development Build 而不是 Expo Go
3. 为什么 token 放 SecureStore
4. 为什么服务端状态不进全局 store
5. 什么改动能 OTA、什么必须重新 build（§9）
6. 三套环境怎么切、怎么让三个包共存
7. 首次真机调试完整步骤（含证书/签名）
8. 发版流程：build → 内测 → 提审 → OTA 修复
9. 升级 Expo SDK 的操作路径与风险点
10. 常见报错速查（reanimated 配置、pod 安装、metro 缓存、证书过期）

---

## 12. 自检清单

交付前逐条过：

**能跑通**
- [ ] `pnpm i` → `npx expo start` 一次成功，无警告
- [ ] iOS / Android 真机各装一次 development build
- [ ] 三套环境的包能同时装在一台机器上
- [ ] 走通一次 EAS Update 热更新
- [ ] 走通一次 `eas build --profile production`

**体验无瑕疵**
- [ ] 冷启动无白屏闪烁
- [ ] 亮/暗色切换无残留色块，状态栏跟随
- [ ] 键盘弹出不遮挡输入框，列表可滚到底
- [ ] 刘海屏 / 灵动岛 / 底部手势条不遮挡内容
- [ ] 断网时有明确提示且可重试

**架构正确**
- [ ] 登出后再登录，看不到上个账号的任何数据
- [ ] 并发 401 只触发一次 refresh
- [ ] 删掉 `examples/` 与任意一个 `features/*` 后仍能启动
- [ ] `app/` 下没有业务逻辑

**工程完整**
- [ ] typecheck / lint / test 全绿
- [ ] CI 跑通
- [ ] `.env.example` 与实际使用的变量一致
- [ ] README 十问全部有答案

---

## 附：一句话总结

> **好的 Expo 模板 = 一条能跑通的「本地开发 → 应用商店」完整链路 + 一套定好的不可逆决策，而不是一个装满库的 `node_modules`。**
