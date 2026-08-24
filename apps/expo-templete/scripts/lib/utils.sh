#!/bin/bash

# ── 颜色 ──────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# ── 输出 ──────────────────────────────────────────────

info()  { echo -e "${BLUE}ℹ${NC}  $*"; }
ok()    { echo -e "${GREEN}✅${NC} $*"; }
warn()  { echo -e "${YELLOW}⚠️${NC}  $*"; }
err()   { echo -e "${RED}❌${NC} $*" >&2; }
title() { echo -e "\n${BOLD}${CYAN}── $* ──${NC}\n"; }

# ── 校验 ──────────────────────────────────────────────

require_env() {
  local name="$1"
  local val="${!name}"
  if [ -z "$val" ]; then
    err "环境变量 ${BOLD}$name${NC} 未设置"
    return 1
  fi
}

require_envs() {
  local missing=0
  for name in "$@"; do
    require_env "$name" || missing=1
  done
  if [ "$missing" -eq 1 ]; then
    echo ""
    err "请在 ${BOLD}.env${NC} 中设置缺失的环境变量，或通过命令行导出"
    exit 1
  fi
}

# ── 命令检测 ──────────────────────────────────────────

has_cmd() {
  command -v "$1" &>/dev/null
}

require_cmd() {
  local cmd="$1"
  local hint="${2:-}"
  if ! has_cmd "$cmd"; then
    err "未找到命令: ${BOLD}$cmd${NC}"
    [ -n "$hint" ] && info "$hint"
    return 1
  fi
}

# ── 交互式输入 ────────────────────────────────────────
#
# 变量已有值时直接跳过提示。这样同一份脚本既能本地手敲，
# 也能被 CI 用环境变量喂参数（`env=prod version=1.2.0 pnpm build:apk`）。

prompt() {
  local var="$1"
  local label="$2"
  local default="$3"

  if [ -n "${!var}" ]; then
    return
  fi

  if [ -n "$default" ]; then
    read -rp "  $label [$default]: " input
    eval "$var=\"${input:-$default}\""
  else
    read -rp "  $label: " input
    eval "$var=\"$input\""
  fi
}

prompt_bool() {
  local var="$1"
  local label="$2"
  local default="${3:-false}"

  if [ -n "${!var}" ]; then
    return
  fi

  read -rp "  $label (true/false) [$default]: " input
  eval "$var=\"${input:-$default}\""
}

# ── 环境文件 ──────────────────────────────────────────
#
# 三套环境的文件名不对称（prod 对应 .env.production），原因写在 .env.production 顶部：
# 那个名字是 `expo export` / EAS 认的标准名，不能改；而 dev / staging 必须避开
# Metro 的 additionalExts，否则 dev server 会拿文件值盖掉命令行传进来的值。

resolve_env_file() {
  case "$1" in
    dev)     echo ".env.dev" ;;
    staging) echo ".env.staging" ;;
    prod)    echo ".env.production" ;;
    *)       return 1 ;;
  esac
}

# 把 .env（全环境共用兜底）+ .env.<环境> 一起导出到当前 shell。
#
# 这一步替代 package.json 里 dev 命令用的 dotenv-cli：prebuild 时 app.config.ts 要读
# APP_ENV / APP_LINK_HOST / WECHAT_*，Metro 打 release 包时要读 EXPO_PUBLIC_*，两边都是
# 从 process.env 拿，子进程继承即可。
#
# 顺序不能反：后 source 的 .env.<环境> 覆盖 .env 里的同名 key。
# 另外 gradle / xcodebuild 内部会把 NODE_ENV 设成 production，@expo/env 于是又会去加载
# .env.production —— 但它对「已经在 process.env 里的 key」是不覆盖的，所以打 staging 包时
# 这里导出的值仍然是最终值。
load_env_files() {
  local dir="$1"
  local file="$2"

  if [ ! -f "$dir/$file" ]; then
    err "未找到环境文件: $dir/$file"
    exit 1
  fi

  set -a
  # shellcheck disable=SC1091
  [ -f "$dir/.env" ] && . "$dir/.env"
  # shellcheck disable=SC1090
  . "$dir/$file"
  set +a

  ok "已加载环境文件: .env + $file"
}

# ── 版本号自增 ────────────────────────────────────────
#
# version（x.y.z）由人来定，versionCode / buildNumber 是「同一个 version 又打了一次包」的
# 计数器，两个商店都要求它单调递增，所以落到 .app-version.json 里自增并提交。
# 值经 APP_VERSION / APP_VERSION_CODE / APP_BUILD_NUMBER 三个环境变量交给 app.config.ts。

bump_version_field() {
  local file="$1"
  local field="$2"

  if [ ! -f "$file" ]; then
    echo '{"versionCode":0,"buildNumber":0}' > "$file"
  fi

  node -e "
    const fs = require('fs');
    const data = JSON.parse(fs.readFileSync('$file', 'utf8'));
    data['$field'] = (data['$field'] || 0) + 1;
    fs.writeFileSync('$file', JSON.stringify(data, null, 2) + '\n');
    console.log(data['$field']);
  "
}
