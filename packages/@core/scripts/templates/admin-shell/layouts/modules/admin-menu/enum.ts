/**
 * 水平菜单模式枚举
 *
 * 用于控制水平菜单的显示内容
 */
export enum HorizontalMenuMode {
  /**
   * 全部菜单模式
   *
   * 显示所有层级的菜单项
   */
  All = 'all',

  /**
   * 子级菜单模式
   *
   * 仅显示当前激活一级菜单下的子菜单
   */
  Child = 'child',

  /**
   * 一级菜单模式
   *
   * 仅显示一级菜单项
   */
  FirstLevel = 'first-level'
}

export enum FirstLevelMenuMode {
  /**
   * 一级菜单模式
   *
   * 仅显示一级菜单项
   */
  All = 'all',
  /**
   * 一级菜单模式
   *
   * 仅显示一级菜单项
   */
  /**
   * 子级菜单模式
   *
   * 仅显示当前激活一级菜单下的子菜单
   */
  SecondLevel = 'second-level'
}
