/**
 * 跨页面类型链接注册表
 *
 * 当某个类型的定义不在当前页面时，需要在这里注册它的完整路径。
 * key: 类型名（PascalCase）
 * value: 目标页面路径 + 锚点
 *
 * 如果类型在当前页面有定义（TypeTable / UnionType），无需注册，
 * 会自动生成 #type-xxx 的当前页锚点。
 */
export const TYPE_REGISTRY: Record<string, string> = {
  ButtonProps: '/components/button#button'
};
