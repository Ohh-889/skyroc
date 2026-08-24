#!/bin/bash
set -e

# CI（Jenkins / GitHub Actions 的 shell step）不会加载 .zshrc，brew 装的东西不在 PATH 里
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
source "$SCRIPT_DIR/lib/utils.sh"

APP_DIR="${APP_DIR:-$(cd "$SCRIPT_DIR/.." && pwd)}"

# ── 参数收集 ──────────────────────────────────────────
title "Android APK 打包"

prompt       env                    "构建环境 (dev/staging/prod)" "prod"
prompt       version                "版本号 (如 1.2.0)"           ""

# ── 参数校验 ──────────────────────────────────────────
if ! ENV_FILE=$(resolve_env_file "$env"); then
  err "构建环境不合法: ${env}（需要 dev/staging/prod）"
  exit 1
fi

if [ -z "$version" ]; then
  err "版本号不能为空"
  exit 1
fi

# versionName 只认 x.y.z；写成 1.2 或 v1.2.0 商店侧的版本比较会出意外
if [[ ! "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  err "版本号格式不合法: ${version}（需要 x.y.z）"
  exit 1
fi

title "构建参数确认"
info "App 目录:     $APP_DIR"
info "环境:         $env  ($ENV_FILE)"
info "版本号:       $version"

# ── 载入环境变量 ──────────────────────────────────────
title "载入环境变量"

load_env_files "$APP_DIR" "$ENV_FILE"

# APP_LINK_HOST 空着的话，app.config.ts 会拼出 `applinks:undefined` 和一条 host 为空的
# intentFilter：包能出，App Links 一定不通。不拦构建，但必须让人看见。
[ -z "$APP_LINK_HOST" ] && warn "APP_LINK_HOST 未配置，App Links / Universal Link 不会生效"
[ -z "$WECHAT_APP_ID" ] && warn "WECHAT_APP_ID 未配置，微信登录 / 分享不可用"

info "APP_ENV = ${APP_ENV:-<空>}"

# ── 工具检测 ──────────────────────────────────────────
title "检测构建工具"

if ! has_cmd pnpm; then
  err "未找到 pnpm，请先 corepack enable pnpm"
  exit 1
fi
ok "pnpm $(pnpm -v)"

if ! has_cmd java; then
  err "未找到 java，Gradle 构建需要 JDK 17"
  exit 1
fi

# ── 版本号管理 ────────────────────────────────────────
title "版本号管理"

VERSION_FILE="$APP_DIR/.app-version.json"
NEW_CODE=$(bump_version_field "$VERSION_FILE" versionCode)

export APP_VERSION="$version"
export APP_VERSION_CODE="$NEW_CODE"

info "版本号:       $version"
info "versionCode:  $NEW_CODE"
ok   "版本信息已更新: $VERSION_FILE"

# ── Prebuild ──────────────────────────────────────────
#
# --clean 是必须的：android/ 是产物目录，上一次构建残留的 manifest / gradle 配置会盖过
# app.config.ts 的改动（scheme、App Links、Live Activity 开关都在这一步落地）。
title "Expo Prebuild (Android)"

(cd "$APP_DIR" && CI=1 pnpm prebuild:android:clean)
ok "Prebuild 完成"

# expo prebuild 生成的 release 签名默认指向 debug.keystore（见 android/app/build.gradle）。
# 上架包必须换成自己的 keystore，否则永远只能装不能发。
if grep -q "signingConfig signingConfigs.debug" "$APP_DIR/android/app/build.gradle" 2>/dev/null; then
  warn "release 仍在用 debug 签名，这个包不能上架"
  info "用 ${BOLD}pnpm keystore:generate${NC} 生成 keystore，再用 expo 的 config plugin 写进 build.gradle"
fi

# ── 构建 APK ──────────────────────────────────────────
title "构建 Release APK"

# 产物落到 build/ 下 —— 根 .gitignore 已经忽略这个目录名
VERSION_DIR="$APP_DIR/build/android/${env}/${version}"
FILENAME="android-${version}-${NEW_CODE}-release.apk"
APK_DEST="${VERSION_DIR}/${FILENAME}"
APK_SRC="$APP_DIR/android/app/build/outputs/apk/release/app-release.apk"

(cd "$APP_DIR/android" && ./gradlew assembleRelease)

# 改过 applicationId / flavor 后默认路径就变了，找不到就全局搜一遍
if [ ! -f "$APK_SRC" ]; then
  info "预定义路径未找到 APK，自动搜索..."
  APK_SRC=$(find "$APP_DIR/android" -name "*.apk" -path "*/release/*" ! -name "*unaligned*" | head -n1)
fi

if [ -z "$APK_SRC" ] || [ ! -f "$APK_SRC" ]; then
  err "APK 未生成，构建可能失败"
  exit 1
fi

mkdir -p "$VERSION_DIR"
cp "$APK_SRC" "$APK_DEST"
ok "APK 已生成: $APK_DEST"

title "APK 打包完成 🎉"
info "产物路径: $APK_DEST"
