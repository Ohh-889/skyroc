#!/bin/bash

# ns — 原生构建工具箱的统一入口。
#
# 所有命令都以「App 根目录」为基准工作，而不是调用者的 cwd：pnpm 从 apps/expo-templete
# 里跑、Jenkins 从仓库根跑、手敲可能从任何地方跑，用脚本自身位置推导才稳。
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_DIR="${APP_DIR:-$(cd "$ROOT_DIR/.." && pwd)}"
export APP_DIR

# 非 UTF-8 locale 下 bash 会把中文标点的字节当成变量名的一部分（`$env（需要...` 整个展开成空），
# 而 CI 的 shell 常常连 LANG 都没设，先兜一层
export LANG="${LANG:-en_US.UTF-8}"

source "$ROOT_DIR/lib/utils.sh"

# keystore 命令的参数（KEYSTORE_NAME 等）习惯写在 .env 里，这里先兜一份。
# 打包命令会在确定环境后自己再 source 一次 .env + .env.<环境>。
if [ -f "$APP_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  . "$APP_DIR/.env"
  set +a
fi

show_help() {
  title "ns — Native Scripts 工具箱"
  echo "用法:  ns <command> [subcommand]"
  echo ""
  echo "命令:"
  echo "  android build-apk   打 Android Release APK"
  echo "  ios build-ipa       打 iOS Release IPA"
  echo "  keystore generate   生成新的 Android keystore"
  echo "  keystore info       查看完整证书信息"
  echo "  keystore sha256     仅输出 SHA256 指纹（配 assetlinks.json / 微信开放平台用）"
  echo "  doctor              检查开发环境就绪状态"
  echo "  clean               清理构建缓存 (android/ios/.expo/metro)"
  echo ""
  echo "打包命令的参数（不给就交互式提问，给了就直接用，CI 里可整条命令注入）:"
  echo "  env                       构建环境 (dev/staging/prod)"
  echo "  version                   版本号 (x.y.z)"
  echo ""
  echo "iOS 签名相关环境变量:"
  echo "  IOS_TEAM_ID                       Apple Developer Team ID（必填）"
  echo "  IOS_BUNDLE_ID                     Bundle ID，默认取 app.config.ts 里的值"
  echo "  IOS_PROVISIONING_PROFILE          描述文件名；不填则走自动签名"
  echo "  IOS_WIDGET_PROVISIONING_PROFILE   Live Activity 靶子的描述文件名（手动签名时必填）"
  echo "  IOS_EXPORT_METHOD                 导出方式，默认 app-store"
  echo ""
  echo "Keystore 命令需要以下环境变量:"
  echo "  KEYSTORE_NAME       keystore 文件名"
  echo "  KEY_ALIAS           key 别名"
  echo "  STORE_PASSWORD      密码"
  echo "  DNAME               证书身份信息 (仅 generate 需要)"
}

CMD="$1"
SUB="$2"

case "$CMD" in
  android)
    case "$SUB" in
      build-apk)  source "$ROOT_DIR/commands/android/build-apk.sh" ;;
      *)
        err "未知子命令: android ${SUB:-<空>}"
        echo ""
        echo "可用子命令: build-apk"
        exit 1
        ;;
    esac
    ;;
  ios)
    case "$SUB" in
      build-ipa)  source "$ROOT_DIR/commands/ios/build-ipa.sh" ;;
      *)
        err "未知子命令: ios ${SUB:-<空>}"
        echo ""
        echo "可用子命令: build-ipa"
        exit 1
        ;;
    esac
    ;;
  keystore)
    case "$SUB" in
      generate) source "$ROOT_DIR/commands/keystore/generate.sh" ;;
      info)     source "$ROOT_DIR/commands/keystore/info.sh" ;;
      sha256)   source "$ROOT_DIR/commands/keystore/sha256.sh" ;;
      *)
        err "未知子命令: keystore ${SUB:-<空>}"
        echo ""
        echo "可用子命令: generate | info | sha256"
        exit 1
        ;;
    esac
    ;;
  doctor)
    source "$ROOT_DIR/commands/doctor.sh"
    ;;
  clean)
    source "$ROOT_DIR/commands/clean.sh"
    ;;
  help|--help|-h|"")
    show_help
    ;;
  *)
    err "未知命令: $CMD"
    show_help
    exit 1
    ;;
esac
