export const TEMPLATE_NAMES = ['admin', 'expo'] as const;

export type TemplateName = (typeof TEMPLATE_NAMES)[number];

interface TemplateDefinition {
  /** 交互选择时展示的名称。 */
  label: string;
  /** 未提供项目名时的默认目录名。 */
  projectName: string;
  /** 生成后提示用户执行的启动脚本。 */
  startScript: string;
}

export const TEMPLATES: Record<TemplateName, TemplateDefinition> = {
  admin: {
    label: 'Skyroc Admin (React)',
    projectName: 'skyroc-admin',
    startScript: 'dev'
  },
  expo: {
    label: 'Skyroc Expo (React Native)',
    projectName: 'skyroc-app',
    startScript: 'start'
  }
};

export function isTemplateName(value: string): value is TemplateName {
  return TEMPLATE_NAMES.includes(value as TemplateName);
}
