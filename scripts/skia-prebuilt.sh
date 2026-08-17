#!/usr/bin/env bash
#
# 下载并安装 @shopify/react-native-skia 的预编译二进制（libs/）。
#
# 替代官方 postinstall（scripts/install-skia.mjs）。官方脚本串行下载、用 node https
# 模块（不读 https_proxy 环境变量）、且不做缓存，删一次 node_modules 就要重下 ~700M。
# 本脚本用 curl（原生走代理）、并行下载、并把 tar 包缓存到 ~/.cache/skia-prebuilt，
# 之后无论重装多少次都是本地解压，秒完成。
#
# 前提：根 package.json 必须把 @shopify/react-native-skia 放进 pnpm.ignoredBuiltDependencies。
# 留在 onlyBuiltDependencies 里等于放行官方 install-skia.mjs，700M 照样会被串行拉一遍。
#
# 用法:
#   bash scripts/skia-prebuilt.sh                  # 装到 apps/* 用到的那几份
#   bash scripts/skia-prebuilt.sh --force          # 已存在也重装
#   bash scripts/skia-prebuilt.sh --only ios       # 只要 ios（跳过 android/macos/tvos）
#   bash scripts/skia-prebuilt.sh --all            # 装到 store 里所有副本
#   bash scripts/skia-prebuilt.sh --mirror https://ghfast.top/
#
# 环境变量:
#   https_proxy / http_proxy   curl 自动读取，无需额外配置
#   SKIA_PROXY                 显式指定代理，覆盖上面两个
#   SKIA_GH_MIRROR             GitHub 镜像前缀，等价于 --mirror
#   SKIA_CACHE_DIR             缓存目录，默认 ~/.cache/skia-prebuilt
#   SKIP_SKIA_DOWNLOAD=1       整个跳过（CI 里已有 libs 时用）
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CACHE_DIR="${SKIA_CACHE_DIR:-$HOME/.cache/skia-prebuilt}"
MIRROR="${SKIA_GH_MIRROR:-}"
PROXY="${SKIA_PROXY:-}"
REPO="shopify/react-native-skia"


FORCE=0
SCOPE="apps"   # apps | all
ONLY="all"     # all | ios | android | apple
SOFT=0         # --soft:     失败只告警不中断（给 postinstall 用）
PREFETCH=0     # --prefetch: 只把 tar 包下进缓存，不解压、不碰 libs/

# artifact 名 : tar 包内子目录 : 安装到 libs/ 下的相对路径
# 这张表对应官方 install-skia.mjs 的非 Graphite 分支
ARTIFACTS=(
  "skia-android-arm:armeabi-v7a:android/armeabi-v7a"
  "skia-android-arm-64:arm64-v8a:android/arm64-v8a"
  "skia-android-arm-x64:x86_64:android/x86_64"
  "skia-android-arm-x86:x86:android/x86"
  "skia-apple-ios-xcframeworks:ios:apple/ios"
  "skia-apple-macos-xcframeworks:macos:apple/macos"
  "skia-apple-tvos-xcframeworks:tvos:apple/tvos"
)

log()  { printf '%s\n' "$*" >&2; }
die()  {
  if [[ $SOFT -eq 1 ]]; then
    log ""
    log "⚠️  Skia 预编译二进制安装失败：$*"
    log "⚠️  原生构建（pod install / gradle）会因缺少 libs/ 而报错。"
    log "⚠️  联网后手动重试： pnpm skia"
    log ""
    exit 0
  fi
  log "❌ $*"
  exit 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --force)  FORCE=1; shift ;;
    --all)    SCOPE="all"; shift ;;
    --soft)     SOFT=1; shift ;;
    --prefetch) PREFETCH=1; shift ;;
    --only)   ONLY="$2"; shift 2 ;;
    --mirror) MIRROR="$2"; shift 2 ;;
    --proxy)  PROXY="$2"; shift 2 ;;
    --cache)  CACHE_DIR="$2"; shift 2 ;;
    -h|--help) sed -n '2,33p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) die "未知参数: $1" ;;
  esac
done

if [[ "${SKIP_SKIA_DOWNLOAD:-}" == "1" || "${SKIP_SKIA_DOWNLOAD:-}" == "true" ]]; then
  log "⏭️  SKIP_SKIA_DOWNLOAD 已设置，跳过"
  exit 0
fi

command -v curl >/dev/null || die "需要 curl"
command -v tar  >/dev/null || die "需要 tar"
command -v node >/dev/null || die "需要 node"

# ---------------------------------------------------------------- 选中的 artifact

selected_artifacts() {
  local entry name
  for entry in "${ARTIFACTS[@]}"; do
    name="${entry%%:*}"
    case "$ONLY" in
      all) ;;
      ios)     [[ $name == *apple-ios* ]] || continue ;;
      apple)   [[ $name == *apple* ]]     || continue ;;
      android) [[ $name == *android* ]]   || continue ;;
      *) die "--only 只支持 all|ios|apple|android，收到: $ONLY" ;;
    esac
    printf '%s\n' "$entry"
  done
}

# ---------------------------------------------------------------- 定位要安装的副本

# pnpm 的 store 里可能同时存在多个版本（不同 peer 组合会各生成一份）。
# 默认只处理 apps/* 真正解析到的那几份 —— 只有 app 自己那份会被 CocoaPods /
# Gradle 读到，组件库里的副本不参与原生构建，装了纯属浪费磁盘。
discover_targets() {
  if [[ $SCOPE == "all" ]]; then
    find "$ROOT/node_modules/.pnpm" -maxdepth 4 -type d \
      -path "*/node_modules/@shopify/react-native-skia" 2>/dev/null | sort -u
    return
  fi
  local app link
  for app in "$ROOT"/apps/*/; do
    link="$app/node_modules/@shopify/react-native-skia"
    [[ -e "$link" ]] || continue
    node -e 'process.stdout.write(require("fs").realpathSync(process.argv[1]))' "$link"
    echo
  done | sort -u
}

skia_version_of() {
  node -e '
    const p = require(process.argv[1] + "/package.json");
    const v = (p.skia && p.skia.version) || p.skiaVersion;
    if (!v) { process.exit(1); }
    process.stdout.write(v);
  ' "$1"
}

installed_ok() {
  local pkg="$1" entry dest
  for entry in $(selected_artifacts); do
    dest="${entry##*:}"
    # 目录存在且非空即认为已装
    [[ -d "$pkg/libs/$dest" ]] || return 1
    [[ -n "$(ls -A "$pkg/libs/$dest" 2>/dev/null)" ]] || return 1
  done
  return 0
}

# ---------------------------------------------------------------- 下载（带缓存）

fetch_one() {
  local url="$1" out="$2" name="$3"
  local args=(-fL --connect-timeout 20 --retry 5 --retry-delay 2 --retry-connrefused
              -o "$out.part")
  # 进度条只在交互终端下开；重定向到文件时它会刷出几万行 CR 刷屏
  if [[ -t 2 ]]; then args+=(--progress-bar); else args+=(-sS); fi
  [[ -n "$PROXY" ]] && args+=(--proxy "$PROXY")
  [[ -s "$out.part" ]] && args+=(-C -)

  if ! curl "${args[@]}" "$url"; then
    rm -f "$out.part"
    log "   ✗ $name 下载失败"
    return 1
  fi
  # 校验完整性：截断的包或被网关塞回来的 HTML 错误页都会在这里露馅
  if ! gzip -t "$out.part" 2>/dev/null; then
    rm -f "$out.part"
    log "   ✗ $name 校验失败（文件损坏或返回了错误页）"
    return 1
  fi
  mv "$out.part" "$out"
  log "   ✓ $name"
}

ensure_cached() {
  local tag="$1" dir="$2"
  mkdir -p "$dir"

  local entry name asset url rc=0
  local -a pids
  pids=()
  for entry in $(selected_artifacts); do
    name="${entry%%:*}"
    asset="${name}-${tag}.tar.gz"

    if [[ -f "$dir/$asset" ]] && gzip -t "$dir/$asset" 2>/dev/null; then
      log "   ✓ $asset (缓存命中)"
      continue
    fi
    # 上次残留的半成品若已完整，直接扶正，省一次下载
    if [[ -f "$dir/$asset.part" ]] && gzip -t "$dir/$asset.part" 2>/dev/null; then
      mv "$dir/$asset.part" "$dir/$asset"
      log "   ✓ $asset (续传已完成)"
      continue
    fi

    url="https://github.com/${REPO}/releases/download/${tag}/${asset}"
    [[ -n "$MIRROR" ]] && url="${MIRROR%/}/${url}"

    fetch_one "$url" "$dir/$asset" "$asset" &
    pids+=("$!")
  done

  # bash 3.2（macOS 自带）下 set -u + 空数组展开会报 unbound variable，必须先判长度
  if [[ ${#pids[@]} -gt 0 ]]; then
    local pid
    for pid in "${pids[@]}"; do
      wait "$pid" || rc=1
    done
  fi
  [[ $rc -eq 0 ]] || return 1
}

# ---------------------------------------------------------------- 解压安装

install_into() {
  local pkg="$1" tag="$2" cache="$3"
  local tmp entry name subdir dest src
  tmp="$(mktemp -d)"
  # shellcheck disable=SC2064
  trap "rm -rf '$tmp'" RETURN

  for entry in $(selected_artifacts); do
    name="${entry%%:*}"
    subdir="$(echo "$entry" | cut -d: -f2)"
    dest="${entry##*:}"

    mkdir -p "$tmp/$name"
    tar -xzf "$cache/${name}-${tag}.tar.gz" -C "$tmp/$name"

    src="$tmp/$name/$subdir"
    # tar 包的顶层布局官方偶尔会调整，这里兜一层：找不到就在解压树里搜同名目录
    if [[ ! -d "$src" ]]; then
      src="$(find "$tmp/$name" -maxdepth 3 -type d -name "$subdir" | head -1)"
    fi
    [[ -n "$src" && -d "$src" ]] || die "包 ${name}-${tag}.tar.gz 里找不到 $subdir/ 目录"

    rm -rf "${pkg:?}/libs/$dest"
    mkdir -p "$pkg/libs/$dest"
    cp -R "$src/." "$pkg/libs/$dest/"
  done
}

# ---------------------------------------------------------------- 主流程

targets="$(discover_targets)"
if [[ -z "$targets" ]]; then
  # 本仓库大部分 app 是 Web，只有 native-ui-playground 依赖 skia。纯 Web 开发者
  # 每次 pnpm install 都吃一段告警纯属噪音——「压根没装」和「装了但下载失败」是
  # 两回事，前者在 postinstall（--soft）下直接静默退出。
  [[ $SOFT -eq 1 ]] && exit 0
  die "没找到已安装的 @shopify/react-native-skia，先跑 pnpm install"
fi

pending=""
while IFS= read -r pkg; do
  [[ -n "$pkg" ]] || continue
  if [[ $FORCE -eq 0 && $PREFETCH -eq 0 ]] && installed_ok "$pkg"; then
    log "✅ 已安装，跳过: ${pkg#"$ROOT"/}"
    continue
  fi
  pending+="$pkg"$'\n'
done <<< "$targets"

if [[ -z "${pending//[$'\n' ]/}" ]]; then
  log "✅ Skia 二进制齐全，无需操作（--force 可强制重装）"
  exit 0
fi

[[ -n "$PROXY" ]] && log "🔌 代理: $PROXY"
[[ -z "$PROXY" && -n "${https_proxy:-}" ]] && log "🔌 代理: ${https_proxy} (来自 https_proxy)"
[[ -n "$MIRROR" ]] && log "🪞 镜像: $MIRROR"

while IFS= read -r pkg; do
  [[ -n "$pkg" ]] || continue
  # 个别版本的 package.json 没有 skia.version / skiaVersion 字段（官方 postinstall
  # 对这种副本同样会失败）。跳过而不是整体中断，避免一个用不到的副本拖垮全流程。
  if ! ver="$(skia_version_of "$pkg")"; then
    log "⚠️  跳过（package.json 里没有 skia 版本字段）: ${pkg#"$ROOT"/}"
    continue
  fi
  tag="skia-${ver}"
  cache="$CACHE_DIR/$tag"

  log "📦 $tag  →  ${pkg#"$ROOT"/}"
  ensure_cached "$tag" "$cache" || die "下载失败，检查代理后重试（缓存已保留，会断点续传）"
  if [[ $PREFETCH -eq 1 ]]; then
    log "   ⏭️  --prefetch：只入缓存，不安装"
    continue
  fi
  log "   📂 解压安装…"
  install_into "$pkg" "$tag" "$cache"
done <<< "$pending"

log "✅ 完成。缓存目录: $CACHE_DIR"
