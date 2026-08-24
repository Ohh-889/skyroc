#!/bin/bash

title "开发环境检查"

PASS=0
FAIL=0

check() {
  local label="$1"
  local cmd="$2"
  local hint="${3:-}"

  printf "  %-20s" "$label"

  if has_cmd "$cmd"; then
    local ver
    case "$cmd" in
      java)       ver=$(java -version 2>&1 | head -1) ;;
      node)       ver=$(node --version 2>/dev/null) ;;
      pnpm)       ver=$(pnpm --version 2>/dev/null) ;;
      keytool)    ver="available" ;;
      adb)        ver=$(adb version 2>/dev/null | head -1) ;;
      xcodebuild) ver=$(xcodebuild -version 2>/dev/null | head -1) ;;
      pod)        ver=$(pod --version 2>/dev/null) ;;
      watchman)   ver=$(watchman --version 2>/dev/null) ;;
      *)          ver="found" ;;
    esac
    echo -e "${GREEN}✓${NC}  $ver"
    PASS=$((PASS + 1))
  else
    echo -e "${RED}✗${NC}  未安装"
    [ -n "$hint" ] && echo -e "                      ${YELLOW}→ $hint${NC}"
    FAIL=$((FAIL + 1))
  fi
}

check "Node.js"    node
check "pnpm"       pnpm      "corepack enable pnpm"
check "Java"       java      "brew install --cask zulu@17"
check "keytool"    keytool   "随 Java JDK 安装"
check "adb"        adb       "安装 Android SDK Platform-Tools"
check "Watchman"   watchman  "brew install watchman"

if [ "$(uname)" == "Darwin" ]; then
  check "Xcode"    xcodebuild "从 App Store 安装 Xcode"
  check "CocoaPods" pod       "brew install cocoapods"
fi

echo ""

# ── 环境文件 ──────────────────────────────────────────
# 三份缺一不可：打包脚本按 dev/staging/prod 直接去找对应文件，缺了就打不出那套包。
for f in .env .env.dev .env.staging .env.production; do
  printf "  %-20s" "$f"
  if [ -f "$APP_DIR/$f" ]; then
    echo -e "${GREEN}✓${NC}  存在"
    PASS=$((PASS + 1))
  else
    echo -e "${RED}✗${NC}  缺失"
    FAIL=$((FAIL + 1))
  fi
done

echo ""

if [ -n "$ANDROID_HOME" ]; then
  info "ANDROID_HOME = $ANDROID_HOME"
else
  warn "ANDROID_HOME 未设置"
  FAIL=$((FAIL + 1))
fi

if [ -n "$JAVA_HOME" ]; then
  info "JAVA_HOME    = $JAVA_HOME"
else
  warn "JAVA_HOME 未设置（可能影响 Gradle 构建）"
fi

# xcode-select 指向 CommandLineTools 时 xcodebuild 在，但 archive 一定失败，
# 单看命令是否存在检查不出来，得看它指到哪。
if [ "$(uname)" == "Darwin" ] && has_cmd xcode-select; then
  XCODE_PATH=$(xcode-select -p 2>/dev/null)
  if echo "$XCODE_PATH" | grep -q CommandLineTools; then
    warn "xcode-select 指向 CommandLineTools，iOS 打包会失败"
    info "修复: sudo xcode-select -s /Applications/Xcode.app/Contents/Developer"
    FAIL=$((FAIL + 1))
  else
    info "xcode-select  = $XCODE_PATH"
  fi
fi

echo ""

if [ "$FAIL" -eq 0 ]; then
  ok "全部通过 ($PASS/$PASS)"
else
  warn "通过 $PASS 项，缺失 $FAIL 项"
fi
