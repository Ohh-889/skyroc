#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import process from "node:process";

const rawArguments = process.argv.slice(2);
const skipFormat = rawArguments.includes("--no-format");
const targets = rawArguments.filter((argument) => argument !== "--no-format");

if (targets.length === 0) {
  console.error(
    "用法: node verify-prototypes.mjs [--no-format] <原型目录或 index.html> [更多原型目录或文件]",
  );
  process.exit(2);
}

function collectHtmlFiles(targetPath) {
  const absolutePath = resolve(targetPath);

  if (!existsSync(absolutePath)) {
    return { errors: [`路径不存在: ${absolutePath}`], files: [] };
  }

  if (statSync(absolutePath).isFile()) {
    return absolutePath.endsWith(".html")
      ? { errors: [], files: [absolutePath] }
      : { errors: [`不是 HTML 文件: ${absolutePath}`], files: [] };
  }

  const indexPath = resolve(absolutePath, "index.html");
  if (existsSync(indexPath)) {
    return { errors: [], files: [indexPath] };
  }

  const childFiles = readdirSync(absolutePath, { withFileTypes: true }).flatMap((entry) => {
    if (!entry.isDirectory() || entry.name === "node_modules" || entry.name === "qa") return [];
    return collectHtmlFiles(resolve(absolutePath, entry.name)).files;
  });

  if (childFiles.length === 0) {
    return { errors: [`目录中没有找到 index.html: ${absolutePath}`], files: [] };
  }

  return { errors: [], files: childFiles };
}

function hasPattern(source, pattern) {
  return pattern.test(source);
}

function validateHtml(filePath) {
  const source = readFileSync(filePath, "utf8");
  const errors = [];
  const warnings = [];

  const requiredPatterns = [
    ["缺少 HTML5 doctype", /<!doctype html>/i],
    ['根元素必须声明 lang="zh-CN"', /<html\b[^>]*\blang=["']zh-CN["']/i],
    ["缺少 UTF-8 字符集", /<meta\b[^>]*charset=["']?UTF-8["']?/i],
    ["缺少移动端 viewport", /<meta\b[^>]*name=["']viewport["'][^>]*content=/i],
    ["缺少非空页面标题", /<title>\s*[^<\s][^<]*<\/title>/i],
    ["缺少全局 box-sizing", /box-sizing\s*:\s*border-box/i],
    ["缺少可见键盘焦点样式", /:focus-visible/i],
    ["缺少响应式媒体查询", /@media\s*\([^)]*max-width/i],
    ["缺少减少动画偏好处理", /prefers-reduced-motion/i],
    ["缺少页面主内容 main", /<main\b/i],
    ["缺少可交互按钮", /<button\b/i],
    ["缺少原型交互脚本", /<script\b/i],
  ];

  for (const [message, pattern] of requiredPatterns) {
    if (!hasPattern(source, pattern)) errors.push(message);
  }

  if (/\{\{[A-Z0-9_]+\}\}/.test(source)) errors.push("仍包含模板占位符");
  if (/\b(?:TODO|FIXME)\b/.test(source)) errors.push("仍包含 TODO 或 FIXME");
  if (/https?:\/\/(?:cdn|unpkg|jsdelivr)\./i.test(source))
    warnings.push("存在外部 CDN 依赖，请确认离线可用性");
  if (/role=["'](?:alert)?dialog["']/i.test(source)) {
    if (!/aria-modal=["']true["']/i.test(source)) errors.push('弹窗或抽屉缺少 aria-modal="true"');
    if (!/aria-labelledby=["'][^"']+["']/i.test(source))
      errors.push("弹窗或抽屉缺少 aria-labelledby");
  }
  if (!/(?:role=["']status["']|aria-live=["'](?:polite|assertive)["'])/i.test(source)) {
    warnings.push("未发现 Toast 或状态反馈的可访问声明");
  }

  const buttonTags = source.match(/<button\b[\s\S]*?>/gi) ?? [];
  const buttonsWithoutType = buttonTags.filter(
    (tag) => !/\btype=["'](?:button|submit|reset)["']/i.test(tag),
  );
  if (buttonsWithoutType.length > 0) {
    warnings.push(`${buttonsWithoutType.length} 个 button 没有显式 type`);
  }

  return { errors, warnings };
}

const collectionResults = targets.map(collectHtmlFiles);
const collectionErrors = collectionResults.flatMap((result) => result.errors);
const htmlFiles = [...new Set(collectionResults.flatMap((result) => result.files))];

let failed = false;

for (const error of collectionErrors) {
  failed = true;
  console.error(`✗ ${error}`);
}

for (const filePath of htmlFiles) {
  const result = validateHtml(filePath);

  if (result.errors.length === 0) {
    console.log(`✓ 静态规范通过: ${filePath}`);
  } else {
    failed = true;
    console.error(`✗ 静态规范失败: ${filePath}`);
    for (const error of result.errors) console.error(`  - ${error}`);
  }

  for (const warning of result.warnings) console.warn(`  ! ${warning}`);
}

if (!skipFormat && htmlFiles.length > 0) {
  const formatResult = spawnSync("pnpm", ["exec", "oxfmt", "--check", ...htmlFiles], {
    encoding: "utf8",
    stdio: "pipe",
  });

  if (formatResult.status === 0) {
    console.log(`✓ Oxfmt 通过: ${htmlFiles.length} 个 HTML 文件`);
  } else {
    failed = true;
    console.error("✗ Oxfmt 检查失败");
    if (formatResult.stdout.trim()) console.error(formatResult.stdout.trim());
    if (formatResult.stderr.trim()) console.error(formatResult.stderr.trim());
  }
}

if (failed) process.exit(1);

console.log(`完成: ${htmlFiles.length} 个原型通过基础检查。仍需执行浏览器尺寸、交互和控制台验收。`);
