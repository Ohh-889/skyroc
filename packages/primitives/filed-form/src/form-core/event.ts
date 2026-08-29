// oxlint-disable unicorn/number-literal-case
/* eslint-disable @typescript-eslint/prefer-literal-enum-member */
/* eslint-disable no-bitwise */

/** Form field change event system Uses bitwise flags to efficiently track and combine different types of field changes */

/**
 * Enumeration of change tags using bitwise flags Each tag represents a different type of field change that can be
 * tracked
 */
export enum ChangeTag {
  /** Field value has changed */
  Value = 0b000001,
  /** Field is currently being validated */
  Validating = 0b000010,
  /** Field validation errors have changed */
  Errors = 0b000100,
  /** Field validation warnings have changed */
  Warnings = 0b001000,
  /** Field has been touched by user interaction */
  Touched = 0b010000,
  /** Field value differs from initial value */
  Dirty = 0b100000,
  /** Field validation has completed */
  Validated = 0b1000000,
  /** Field has been reset */
  Reset = 0b10000000,
  /** Field disabled state has changed */
  Disabled = 0b100000000,
  /** Field hidden state has changed */
  Hidden = 0b1000000000,

  /** Combination of all validation status flags */
  Status = Errors | Warnings | Validated | Validating | Disabled | Hidden,
  /** All possible change flags */
  All = 0x7fffffff
}

/** Type representing a bitmask of change flags Used to efficiently combine and check multiple change types */
export type ChangeMask = number;

/** Checks if a change mask contains a specific tag */
export const hasTag = (mask: ChangeMask, tag: ChangeTag) => (mask & tag) !== 0;

/** Adds one or more tags to a change mask */
export const addTag = (mask: ChangeMask, ...tags: ChangeTag[]) => tags.reduce((m, t) => m | t, mask);

/** Removes one or more tags from a change mask */
export const delTag = (mask: ChangeMask, ...tags: ChangeTag[]) => tags.reduce((m, t) => m & ~t, mask);

/** Options for configuring subscription masks Used to specify which types of changes to listen for */
export interface SubscribeMaskOptions {
  /** Subscribe to all change types */
  all?: boolean;
  /** Subscribe to dirty state changes */
  dirty?: boolean;
  /** Subscribe to disabled state changes */
  disabled?: boolean;
  /** Subscribe to validation error changes */
  errors?: boolean;
  /** Subscribe to hidden state changes */
  hidden?: boolean;
  /** Subscribe to field reset events */
  reset?: boolean;
  /** Subscribe to touched state changes */
  touched?: boolean;
  /** Subscribe to validation completion events */
  validated?: boolean;
  /** Subscribe to validation status changes */
  validating?: boolean;
  /** Subscribe to value changes */
  value?: boolean;
  /** Subscribe to validation warning changes */
  warnings?: boolean;
}

/** Converts subscription options to a change mask */
export const toMask = (opt: SubscribeMaskOptions = {}): ChangeMask => {
  // If 'all' is specified, return mask for all changes
  if (opt.all) return ChangeTag.All;

  // Build array of selected tags
  const tags: ChangeTag[] = [];
  if (opt.value) tags.push(ChangeTag.Value);
  if (opt.errors) tags.push(ChangeTag.Errors);
  if (opt.warnings) tags.push(ChangeTag.Warnings);
  if (opt.validating) tags.push(ChangeTag.Validating);
  if (opt.validated) tags.push(ChangeTag.Validated);
  if (opt.touched) tags.push(ChangeTag.Touched);
  if (opt.dirty) tags.push(ChangeTag.Dirty);
  if (opt.disabled) tags.push(ChangeTag.Disabled);
  if (opt.hidden) tags.push(ChangeTag.Hidden);
  if (opt.reset) tags.push(ChangeTag.Reset);

  // Combine all selected tags into a single mask
  return addTag(0, ...tags);
};
