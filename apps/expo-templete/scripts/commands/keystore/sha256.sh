#!/bin/bash

require_envs KEYSTORE_NAME KEY_ALIAS STORE_PASSWORD

title "SHA256 指纹"

KEYSTORE_PATH="$APP_DIR/$KEYSTORE_NAME"

if [ ! -f "$KEYSTORE_PATH" ]; then
  err "Keystore 文件不存在: $KEYSTORE_PATH"
  exit 1
fi

FINGERPRINT=$(keytool -list -v \
  -keystore "$KEYSTORE_PATH" \
  -alias "$KEY_ALIAS" \
  -storepass "$STORE_PASSWORD" \
  2>/dev/null | grep SHA256 | awk '{print $2}')

if [ -n "$FINGERPRINT" ]; then
  ok "SHA256: $FINGERPRINT"
  echo ""
  # app.config.ts 里 android.intentFilters 开了 autoVerify，域名侧
  # /.well-known/assetlinks.json 的指纹对不上，App Links 就会退化成普通 deep link
  #（点链接弹「用什么打开」而不是直接进 App）。上架后要换成 Play Console
  #「应用签名」里那份，不是这把本地 keystore 的。
  info "填进 https://<APP_LINK_HOST>/.well-known/assetlinks.json 的 sha256_cert_fingerprints"
  info "微信开放平台的「应用签名」要的是 MD5 去掉冒号的小写串，用 ${BOLD}pnpm keystore:info${NC} 取"
else
  err "无法提取 SHA256 指纹，请确认 keystore 和 alias 是否正确"
  exit 1
fi
