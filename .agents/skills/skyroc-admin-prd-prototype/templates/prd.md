# {{PAGE_ID}} {{PRODUCT_NAME}} {{PAGE_NAME}}

## 1. 文档信息

- 页面族：{{PAGE_FAMILY}}
- 主页面 ID：`{{PAGE_ID}}`
- 关联页面 ID：{{RELATED_PAGE_IDS}}
- 页面名称：{{PAGE_NAME}}
- 页面路径：`{{PAGE_ROUTE}}`
- 适用终端：Web
- 优先级：{{PRIORITY}}
- 规格状态：已定义
- 设计状态：原型设计
- 开发状态：{{IMPLEMENTATION_STATUS}}
- 日期：{{DATE}}

关联内容：

- [设计系统]({{DESIGN_SYSTEM_PATH}})
- [HTML 原型]({{PROTOTYPE_PATH}})
- 当前 FastAPI：`{{FASTAPI_MODULE_PATH}}`
- 当前 React：`{{REACT_PAGE_PATH}}`
- 可选参考资料：{{OPTIONAL_REFERENCES_OR_REMOVE_THIS_LINE}}

## 2. 架构结论

{{ARCHITECTURE_SUMMARY}}

```text
{{MODULE_RELATIONSHIP}}
```

页面职责：

- 前端：{{FRONTEND_RESPONSIBILITY}}
- 后端：{{BACKEND_RESPONSIBILITY}}
- 相邻模块：{{ADJACENT_RESPONSIBILITY}}

页面采用：

```text
{{PAGE_COMPOSITION}}
```

## 3. 已知事实与设计假设

### 3.1 当前 FastAPI 事实

已实现：

- {{FASTAPI_IMPLEMENTED}}

尚未实现或需要确认：

- {{FASTAPI_GAPS}}

### 3.2 当前 React 事实

{{REACT_FACTS}}

### 3.3 当前设计系统与既有页面事实

{{DESIGN_SYSTEM_FACTS}}

### 3.4 可选参考资料事实

{{OPTIONAL_REFERENCE_FACTS_OR_REMOVE_THIS_SECTION}}

### 3.5 设计假设

- {{DESIGN_ASSUMPTION}}

## 4. 页面清单

| 页面 ID     | 页面名称      | 路径             | 使用者           | 核心任务         | 页面内浮层   |
| ----------- | ------------- | ---------------- | ---------------- | ---------------- | ------------ |
| {{PAGE_ID}} | {{PAGE_NAME}} | `{{PAGE_ROUTE}}` | {{PRIMARY_USER}} | {{PRIMARY_TASK}} | {{OVERLAYS}} |

## 5. 用户与目标

### 5.1 {{PRIMARY_USER}}

目标：

1. {{USER_GOAL_1}}
2. {{USER_GOAL_2}}
3. {{USER_GOAL_3}}

## 6. 信息架构

```text
{{INFORMATION_ARCHITECTURE}}
```

## 7. 页面布局

### 7.1 桌面端

```text
{{DESKTOP_WIREFRAME}}
```

### 7.2 窄屏与手机端

- {{RESPONSIVE_RULE_1}}
- {{RESPONSIVE_RULE_2}}
- {{RESPONSIVE_RULE_3}}

## 8. 查询、表格与字段

### 8.1 查询字段

| 字段             | 参数               | 控件               | 默认值             | 规则            |
| ---------------- | ------------------ | ------------------ | ------------------ | --------------- |
| {{FILTER_LABEL}} | `{{FILTER_PARAM}}` | {{FILTER_CONTROL}} | {{FILTER_DEFAULT}} | {{FILTER_RULE}} |

### 8.2 表格列

| 列               | 数据字段           | 展示规则          | 空值处理         | 响应式                |
| ---------------- | ------------------ | ----------------- | ---------------- | --------------------- |
| {{COLUMN_LABEL}} | `{{COLUMN_FIELD}}` | {{COLUMN_FORMAT}} | {{COLUMN_EMPTY}} | {{COLUMN_RESPONSIVE}} |

### 8.3 新增 / 编辑字段

| 字段           | 请求字段         | 必填              | 默认值           | 校验                | 敏感处理           |
| -------------- | ---------------- | ----------------- | ---------------- | ------------------- | ------------------ |
| {{FORM_LABEL}} | `{{FORM_FIELD}}` | {{FORM_REQUIRED}} | {{FORM_DEFAULT}} | {{FORM_VALIDATION}} | {{FORM_SENSITIVE}} |

## 9. 交互与状态

### 9.1 列表流程

{{LIST_FLOW}}

### 9.2 新增与编辑

{{FORM_FLOW}}

### 9.3 详情

{{DETAIL_FLOW}}

### 9.4 危险操作

{{DANGEROUS_FLOW}}

### 9.5 页面状态

| 状态     | 触发条件                  | 页面表现             | 用户动作         |
| -------- | ------------------------- | -------------------- | ---------------- |
| 加载中   | {{LOADING_TRIGGER}}       | {{LOADING_UI}}       | 等待或离开       |
| 空数据   | {{EMPTY_TRIGGER}}         | {{EMPTY_UI}}         | {{EMPTY_ACTION}} |
| 局部失败 | {{PARTIAL_ERROR_TRIGGER}} | {{PARTIAL_ERROR_UI}} | 重试             |
| 整体失败 | {{FATAL_ERROR_TRIGGER}}   | {{FATAL_ERROR_UI}}   | 重新加载         |

## 10. 接口与权限

| 页面能力       | HTTP 方法与路径           | 请求                 | 响应                  | 权限             | 当前状态       |
| -------------- | ------------------------- | -------------------- | --------------------- | ---------------- | -------------- |
| {{CAPABILITY}} | `{{METHOD}} {{API_PATH}}` | {{REQUEST_CONTRACT}} | {{RESPONSE_CONTRACT}} | `{{PERMISSION}}` | {{API_STATUS}} |

## 11. 可访问性

- 纯图标按钮提供准确的可访问名称。
- 状态同时使用文字或图标，不只依赖颜色。
- 抽屉和弹窗具有标题、焦点管理和 Escape 关闭能力。
- 表单错误与具体字段关联，并在保存失败后聚焦首个错误。
- {{ADDITIONAL_A11Y_RULE}}

## 12. 验收标准

1. {{ACCEPTANCE_1}}
2. {{ACCEPTANCE_2}}
3. {{ACCEPTANCE_3}}
4. 1440px、1024px 和 390px 宽度下主要任务可完成，没有意外页面级横向溢出。
5. 原型明确标识演示数据，不调用真实写接口。

## 13. 风险与待确认项

| 项目     | 当前判断            | 影响            | 处理方式        |
| -------- | ------------------- | --------------- | --------------- |
| {{RISK}} | {{RISK_ASSESSMENT}} | {{RISK_IMPACT}} | {{RISK_ACTION}} |
