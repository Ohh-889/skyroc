#!/bin/bash

title "清理构建缓存"

CLEANED=0

try_clean() {
  local label="$1"
  local target="$2"

  if [ -e "$target" ]; then
    rm -rf "$target"
    ok "$label  →  已删除"
    CLEANED=$((CLEANED + 1))
  else
    info "$label  →  不存在，跳过"
  fi
}

# android / ios 都是 prebuild 产物（根 .gitignore 里已忽略），删掉重生成没有损失。
try_clean "android/"            "$APP_DIR/android"
try_clean "ios/"                "$APP_DIR/ios"
try_clean ".expo/"              "$APP_DIR/.expo"
try_clean "build/"              "$APP_DIR/build"
try_clean "node_modules/.cache" "$APP_DIR/node_modules/.cache"

# Metro 的 transform 缓存和 haste map 落在 $TMPDIR 下，不在项目里。
# 改了 babel / metro 配置却不生效，十有八九是这两个没清。
title "清理 Metro 缓存"

# macOS 的 $TMPDIR 带结尾斜杠，Linux 的不带，统一去掉再拼
METRO_TMP="${TMPDIR:-/tmp}"
METRO_TMP="${METRO_TMP%/}"

for pattern in "metro-cache" "metro-*" "haste-map-*"; do
  # 不加引号才会展开通配；没有匹配项时 path 就是字面量，靠下面的 -e 判断挡掉
  for path in $METRO_TMP/$pattern; do
    if [ -e "$path" ]; then
      rm -rf "$path"
      ok "$(basename "$path")  →  已删除"
      CLEANED=$((CLEANED + 1))
    fi
  done
done

if has_cmd watchman; then
  info "清理 Watchman 缓存..."
  watchman watch-del-all &>/dev/null
  ok "Watchman 缓存已清理"
  CLEANED=$((CLEANED + 1))
fi

echo ""
ok "清理完成，共处理 $CLEANED 项"
info "原生目录已删除，下次真机调试前先跑 ${BOLD}pnpm prebuild:android:clean${NC} / ${BOLD}pnpm prebuild:ios:clean${NC}"
