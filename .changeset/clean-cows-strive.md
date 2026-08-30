---
'@skyroc/form': minor
---

1. 更新依赖 2.ComputedField 组件值的更改使用useState 精准触发 不在依靠强制刷新组件变更值 使得子组件在使用react compiler的时候也能正常工作
