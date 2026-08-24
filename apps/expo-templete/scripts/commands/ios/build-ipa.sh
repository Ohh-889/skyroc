#!/bin/bash
set -e

# CI 不会加载 .zshrc
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"

# CocoaPods 要 UTF-8，CI 默认可能是 ASCII-8BIT，pod install 会在中文路径/文案上炸
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
source "$SCRIPT_DIR/lib/utils.sh"

APP_DIR="${APP_DIR:-$(cd "$SCRIPT_DIR/.." && pwd)}"

# xcode-select 指向 CommandLineTools 时 xcodebuild 命令在、archive 必失败，先拦一道
if xcode-select -p 2>/dev/null | grep -q CommandLineTools; then
  err "xcode-select 指向 CommandLineTools 而非完整 Xcode"
  info "修复: sudo xcode-select -s /Applications/Xcode.app/Contents/Developer"
  exit 1
fi

# ── 参数收集 ──────────────────────────────────────────
title "iOS IPA 打包"

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

if [[ ! "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  err "版本号格式不合法: ${version}（需要 x.y.z）"
  exit 1
fi

# ── 签名配置 ──────────────────────────────────────────
#
# 模板不写死任何证书，全部走环境变量（放 .env 或 CI 的凭据里）。
#
# 默认自动签名：这个 App 有两个靶子（主 App + expo-widgets 生成的 Live Activity 扩展），
# 而 xcodebuild 命令行上的 PROVISIONING_PROFILE_SPECIFIER 会同时作用到所有靶子 ——
# 手动签名时给主 App 的描述文件套到扩展上，archive 直接失败。
# 所以 archive 走 Automatic，真正需要指名道姓的地方（导出 IPA）在 ExportOptions.plist
# 里按 bundle id 分别指定，这是两个靶子唯一能各签各的写法。
IOS_CODE_SIGN_STYLE="${IOS_CODE_SIGN_STYLE:-Automatic}"
IOS_EXPORT_METHOD="${IOS_EXPORT_METHOD:-app-store}"

if [ -z "$IOS_TEAM_ID" ]; then
  err "IOS_TEAM_ID 未设置（Apple Developer 后台右上角的 Team ID，形如 F5DLZF5YWG）"
  info "写进 .env 或 CI 凭据里，再重跑"
  exit 1
fi

if [ "$IOS_CODE_SIGN_STYLE" == "Manual" ] && [ -z "$IOS_PROVISIONING_PROFILE" ]; then
  err "IOS_CODE_SIGN_STYLE=Manual 时必须设置 IOS_PROVISIONING_PROFILE"
  exit 1
fi

title "构建参数确认"
info "App 目录:     $APP_DIR"
info "环境:         $env  ($ENV_FILE)"
info "版本号:       $version"
info "Team ID:      $IOS_TEAM_ID"
info "签名方式:     $IOS_CODE_SIGN_STYLE"
info "导出方式:     $IOS_EXPORT_METHOD"

# ── 载入环境变量 ──────────────────────────────────────
title "载入环境变量"

load_env_files "$APP_DIR" "$ENV_FILE"

[ -z "$APP_LINK_HOST" ] && warn "APP_LINK_HOST 未配置，Universal Link 不会生效"
[ -z "$WECHAT_APP_ID" ] && warn "WECHAT_APP_ID 未配置，微信登录 / 分享不可用"

# LIVE_ACTIVITY_PUSH=1 会给 App 加 aps-environment，证书不带推送能力就直接构建失败
[ "$LIVE_ACTIVITY_PUSH" == "1" ] && info "LIVE_ACTIVITY_PUSH=1，证书必须带 Push Notifications 能力"

info "APP_ENV = ${APP_ENV:-<空>}"

# ── 工具检测 ──────────────────────────────────────────
title "检测构建工具"

if ! has_cmd xcodebuild; then
  err "未找到 xcodebuild，请安装 Xcode"
  exit 1
fi
ok "xcodebuild $(xcodebuild -version | head -1)"

# ── 版本号管理 ────────────────────────────────────────
title "版本号管理"

VERSION_FILE="$APP_DIR/.app-version.json"
NEW_BUILD=$(bump_version_field "$VERSION_FILE" buildNumber)

export APP_VERSION="$version"
export APP_BUILD_NUMBER="$NEW_BUILD"

info "版本号:      $version"
info "buildNumber: $NEW_BUILD"
ok   "版本信息已更新: $VERSION_FILE"

# ── Prebuild ──────────────────────────────────────────
title "Expo Prebuild (iOS)"

(cd "$APP_DIR" && CI=1 pnpm prebuild:ios:clean)

# pod install 挂掉时 expo prebuild 仍可能返回 0，只能靠产物存在与否判断
IOS_SCHEME=$(ls "$APP_DIR/ios/" 2>/dev/null | grep '\.xcworkspace$' | sed 's/\.xcworkspace$//' | head -1)

if [ -z "$IOS_SCHEME" ]; then
  warn "Prebuild 后未生成 .xcworkspace，尝试手动 pod install..."
  (cd "$APP_DIR/ios" && pod install --repo-update)
  IOS_SCHEME=$(ls "$APP_DIR/ios/" 2>/dev/null | grep '\.xcworkspace$' | sed 's/\.xcworkspace$//' | head -1)
fi

if [ -z "$IOS_SCHEME" ]; then
  err "未找到 .xcworkspace，prebuild 和 pod install 均失败"
  exit 1
fi

ok "Prebuild 完成，Scheme: $IOS_SCHEME"

# ── 收集靶子的 Bundle ID ──────────────────────────────
#
# 主 App 和 Live Activity 扩展各有各的 bundle id，导出时要在 ExportOptions.plist 里
# 一一对应描述文件。prebuild 刚生成的工程是唯一可靠来源，排序后最短的那个是主 App
# （扩展的 id 以它为前缀）。
PBXPROJ="$APP_DIR/ios/${IOS_SCHEME}.xcodeproj/project.pbxproj"

BUNDLE_IDS=$(grep -o 'PRODUCT_BUNDLE_IDENTIFIER = [^;]*' "$PBXPROJ" | sed 's/.*= //' | tr -d '"' | sort -u)
BUNDLE_ID="${IOS_BUNDLE_ID:-$(echo "$BUNDLE_IDS" | head -1)}"

if [ -z "$BUNDLE_ID" ]; then
  err "无法从工程里解析出 Bundle ID，请显式设置 IOS_BUNDLE_ID"
  exit 1
fi

info "主 App Bundle ID: $BUNDLE_ID"
echo "$BUNDLE_IDS" | grep -v "^${BUNDLE_ID}$" | while read -r extra; do
  [ -n "$extra" ] && info "扩展 Bundle ID:   $extra"
done

# ── 构建 Archive ──────────────────────────────────────
title "构建 Release Archive"

ARCHIVE_PATH="$APP_DIR/ios/build/${IOS_SCHEME}.xcarchive"

SIGN_ARGS=(
  "CODE_SIGN_STYLE=$IOS_CODE_SIGN_STYLE"
  "DEVELOPMENT_TEAM=$IOS_TEAM_ID"
)

if [ "$IOS_CODE_SIGN_STYLE" == "Manual" ]; then
  SIGN_ARGS+=(
    'CODE_SIGN_IDENTITY=Apple Distribution'
    "PROVISIONING_PROFILE_SPECIFIER=$IOS_PROVISIONING_PROFILE"
  )
fi

(cd "$APP_DIR/ios" && xcodebuild \
  -workspace "${IOS_SCHEME}.xcworkspace" \
  -scheme "${IOS_SCHEME}" \
  -configuration Release \
  -sdk iphoneos \
  clean archive \
  -archivePath "build/${IOS_SCHEME}.xcarchive" \
  -allowProvisioningUpdates \
  "${SIGN_ARGS[@]}")

if [ ! -d "$ARCHIVE_PATH" ]; then
  err "Archive 生成失败: $ARCHIVE_PATH"
  exit 1
fi
ok "Archive 完成: $ARCHIVE_PATH"

# ── 导出 IPA ──────────────────────────────────────────
title "导出 IPA"

EXPORT_OPTIONS="$APP_DIR/ios/ExportOptions.plist"

{
  cat <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>method</key>
  <string>${IOS_EXPORT_METHOD}</string>

  <key>teamID</key>
  <string>${IOS_TEAM_ID}</string>
EOF

  # 只有手动签名才写 provisioningProfiles：自动签名下这个字段会让 Xcode 去找同名描述文件，
  # 找不到就报错，还不如让它自己挑。
  if [ -n "$IOS_PROVISIONING_PROFILE" ]; then
    cat <<EOF

  <key>signingStyle</key>
  <string>manual</string>

  <key>provisioningProfiles</key>
  <dict>
    <key>${BUNDLE_ID}</key>
    <string>${IOS_PROVISIONING_PROFILE}</string>
EOF

    if [ -n "$IOS_WIDGET_PROVISIONING_PROFILE" ]; then
      echo "$BUNDLE_IDS" | grep -v "^${BUNDLE_ID}$" | while read -r extra; do
        [ -z "$extra" ] && continue
        echo "    <key>${extra}</key>"
        echo "    <string>${IOS_WIDGET_PROVISIONING_PROFILE}</string>"
      done
    fi

    echo "  </dict>"
  else
    echo ""
    echo "  <key>signingStyle</key>"
    echo "  <string>automatic</string>"
  fi

  cat <<'EOF'

  <key>compileBitcode</key>
  <false/>
</dict>
</plist>
EOF
} > "$EXPORT_OPTIONS"

(cd "$APP_DIR/ios" && xcodebuild -exportArchive \
  -archivePath "build/${IOS_SCHEME}.xcarchive" \
  -exportOptionsPlist ExportOptions.plist \
  -exportPath build/export \
  -allowProvisioningUpdates)

IPA_SRC="$APP_DIR/ios/build/export/${IOS_SCHEME}.ipa"

if [ ! -f "$IPA_SRC" ]; then
  info "预定义路径未找到 IPA，自动搜索..."
  IPA_SRC=$(find "$APP_DIR/ios/build/export" -name "*.ipa" | head -n1)
fi

if [ -z "$IPA_SRC" ] || [ ! -f "$IPA_SRC" ]; then
  err "IPA 未生成，导出可能失败"
  exit 1
fi

# ── 复制产物 ──────────────────────────────────────────
VERSION_DIR="$APP_DIR/build/ios/${env}/${version}"
FILENAME="ios-${version}-${NEW_BUILD}-release.ipa"
IPA_DEST="${VERSION_DIR}/${FILENAME}"

mkdir -p "$VERSION_DIR"
cp "$IPA_SRC" "$IPA_DEST"
ok "IPA 已生成: $IPA_DEST"

title "IPA 打包完成 🎉"
info "产物路径: $IPA_DEST"
