#!/bin/bash

require_envs KEYSTORE_NAME KEY_ALIAS STORE_PASSWORD

title "证书信息: $KEYSTORE_NAME"

KEYSTORE_PATH="$APP_DIR/$KEYSTORE_NAME"

if [ ! -f "$KEYSTORE_PATH" ]; then
  err "Keystore 文件不存在: $KEYSTORE_PATH"
  exit 1
fi

keytool -list -v \
  -keystore "$KEYSTORE_PATH" \
  -alias "$KEY_ALIAS" \
  -storepass "$STORE_PASSWORD"
