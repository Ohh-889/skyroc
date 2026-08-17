import type { Rule } from '@skyroc/form';

/**
 * 必填标记与校验共用 rules 这一份事实：只写 rules 也能推出星号，只写 required 也能得到校验。
 *
 * `required` 显式传 `false` 时只隐藏星号，不动已有规则 —— 隐藏标记与放弃校验是两件事。
 */
export function resolveRequiredRules(required: boolean | undefined, rules: Rule[] | undefined) {
  const requiredByRules = rules?.some(rule => rule.required) ?? false;

  return {
    mergedRules: required && !requiredByRules ? [{ required: true } as Rule, ...(rules ?? [])] : rules,
    showRequired: required ?? requiredByRules
  };
}
