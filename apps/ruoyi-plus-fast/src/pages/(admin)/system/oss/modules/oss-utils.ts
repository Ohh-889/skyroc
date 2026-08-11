import type { OssItem } from '@/service/api/system-oss';

/** 从 ext1 里解析出来的文件元信息。后端只把它当扩展位，字段随时可能缺。 */
export interface OssFileMeta {
  /** MIME 类型，缺失时为空 */
  contentType?: string;
  /** 字节数，非数字一律当作缺失 */
  fileSize?: number;
}

/** 文件类型的配色分组。具体类名在 OssFileIcon 里，UnoCSS 只扫 tsx。 */
export type OssFileTone =
  | 'archive'
  | 'audio'
  | 'code'
  | 'doc'
  | 'image'
  | 'pdf'
  | 'sheet'
  | 'slide'
  | 'text'
  | 'unknown'
  | 'video';

/** 文件类型在界面上的呈现方式。颜色只是辅助，label 才是真正可读的那一份信息。 */
export interface OssFileVisual {
  /** Iconify 图标名 */
  icon: string;
  /** 类型中文名，供 Tooltip 和无障碍读取 */
  label: string;
  /** 配色分组 */
  tone: OssFileTone;
}

interface FileGroup extends OssFileVisual {
  suffixes: string[];
}

/** 能直接在浏览器里渲染成图片的后缀。列表缩略图只认这一批。 */
const IMAGE_SUFFIXES = new Set(['.avif', '.bmp', '.gif', '.ico', '.jpeg', '.jpg', '.png', '.svg', '.webp']);

const FILE_GROUPS: FileGroup[] = [
  {
    icon: 'ph:image',
    label: '图片',
    suffixes: [...IMAGE_SUFFIXES],
    tone: 'image'
  },
  {
    icon: 'ph:file-pdf',
    label: 'PDF',
    suffixes: ['.pdf'],
    tone: 'pdf'
  },
  {
    icon: 'ph:file-doc',
    label: '文档',
    suffixes: ['.doc', '.docx', '.odt', '.pages', '.rtf'],
    tone: 'doc'
  },
  {
    icon: 'ph:file-xls',
    label: '表格',
    suffixes: ['.csv', '.numbers', '.ods', '.xls', '.xlsx'],
    tone: 'sheet'
  },
  {
    icon: 'ph:file-ppt',
    label: '演示',
    suffixes: ['.key', '.odp', '.ppt', '.pptx'],
    tone: 'slide'
  },
  {
    icon: 'ph:file-zip',
    label: '压缩包',
    suffixes: ['.7z', '.bz2', '.gz', '.rar', '.tar', '.zip'],
    tone: 'archive'
  },
  {
    icon: 'ph:file-video',
    label: '视频',
    suffixes: ['.avi', '.mkv', '.mov', '.mp4', '.webm', '.wmv'],
    tone: 'video'
  },
  {
    icon: 'ph:file-audio',
    label: '音频',
    suffixes: ['.aac', '.flac', '.m4a', '.mp3', '.ogg', '.wav'],
    tone: 'audio'
  },
  {
    icon: 'ph:file-code',
    label: '代码',
    suffixes: ['.css', '.html', '.js', '.json', '.sql', '.ts', '.tsx', '.xml', '.yaml', '.yml'],
    tone: 'code'
  },
  {
    icon: 'ph:file-text',
    label: '文本',
    suffixes: ['.log', '.md', '.txt'],
    tone: 'text'
  }
];

const UNKNOWN_VISUAL: OssFileVisual = {
  icon: 'ph:file',
  label: '文件',
  tone: 'unknown'
};

/** 后缀在后端不保证带点，统一补上再比较，避免 png 和 .png 走两套分支。 */
export function normalizeSuffix(suffix: null | string | undefined) {
  const value = (suffix ?? '').trim().toLowerCase();

  if (!value) return '';

  return value.startsWith('.') ? value : `.${value}`;
}

/**
 * 解析 ext1。
 *
 * 它是一行自由格式的 JSON 字符串，历史数据里可能是空串、非 JSON，甚至是数组。 任何一条脏数据都不该让整张表崩掉，所以这里只做尽力而为的读取。
 */
export function parseOssExt(ext1: null | string | undefined): OssFileMeta {
  if (!ext1) return {};

  try {
    const parsed: unknown = JSON.parse(ext1);

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};

    const source = parsed as Record<string, unknown>;
    const rawSize = source.fileSize;
    const rawType = source.contentType;
    const fileSize = typeof rawSize === 'number' ? rawSize : Number(rawSize);

    return {
      contentType: typeof rawType === 'string' && rawType ? rawType : undefined,
      fileSize: Number.isFinite(fileSize) && fileSize >= 0 ? fileSize : undefined
    };
  } catch {
    return {};
  }
}

/** 是否可以直接当图片渲染。没有 url 的记录一律按普通文件处理。 */
export function isPreviewableImage(file: OssItem) {
  return Boolean(file.url) && IMAGE_SUFFIXES.has(normalizeSuffix(file.fileSuffix));
}

export function getFileVisual(suffix: null | string | undefined): OssFileVisual {
  const normalized = normalizeSuffix(suffix);
  const group = FILE_GROUPS.find(item => item.suffixes.includes(normalized));

  return group ?? UNKNOWN_VISUAL;
}

/** 从浏览器给的 File 名里取后缀，用来在上传抽屉里选图标。 */
export function getSuffixFromFileName(fileName: string) {
  const dotIndex = fileName.lastIndexOf('.');

  return dotIndex > 0 ? fileName.slice(dotIndex) : '';
}

export function formatFileSize(bytes: number | undefined) {
  if (bytes === undefined) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;

  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

/** 表格里的“类型”一列。后缀去掉点再大写，比 `.PNG` 更像类型名。 */
export function formatSuffixLabel(suffix: null | string | undefined) {
  const normalized = normalizeSuffix(suffix);

  return normalized ? normalized.slice(1).toUpperCase() : '未知';
}

/** 上传抽屉里展示待传文件用。这里的 File 还没有后端 ext1，只能读浏览器给的值。 */
export function describeLocalFile(file: File) {
  const size = formatFileSize(file.size);

  return [file.type || '未知类型', size].filter(Boolean).join(' · ');
}
