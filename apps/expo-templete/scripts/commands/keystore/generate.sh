#!/bin/bash

require_envs KEYSTORE_NAME KEY_ALIAS STORE_PASSWORD DNAME

title "生成 Keystore"

KEYSTORE_PATH="$APP_DIR/$KEYSTORE_NAME"

if [ -f "$KEYSTORE_PATH" ]; then
  warn "文件 $KEYSTORE_PATH 已存在，跳过生成"
  info "如需重新生成，请先手动删除该文件"
  exit 0
fi

# validity 给足 10000 天：证书一过期，商店就再也接不了用同一把 key 签的更新包，
# 换 key 等于换应用。根 .gitignore 里 *.jks 已被忽略，别把它提交进仓库。
keytool -genkeypair \
  -v \
  -storetype JKS \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -keystore "$KEYSTORE_PATH" \
  -alias "$KEY_ALIAS" \
  -storepass "$STORE_PASSWORD" \
  -keypass "$STORE_PASSWORD" \
  -dname "$DNAME"

if [ $? -eq 0 ]; then
  ok "Keystore 已生成: $KEYSTORE_PATH"
  info "接着跑 ${BOLD}pnpm keystore:sha256${NC} 拿指纹，填进 assetlinks.json 和微信开放平台"
else
  err "Keystore 生成失败"
  exit 1
fi
