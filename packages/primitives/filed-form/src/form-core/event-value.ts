import { isEventObject } from '@skyroc/utils';

type EventLike = { target?: any };

/**
 * 默认取值实现：Web 事件从 `target[valuePropName]` 取，checkbox 取 `checked`，其余原样返回。
 *
 * 逻辑与 `@skyroc/utils/web` 的 `getEventValue` 一致，但刻意不从那个入口引 —— 它会把整个 web 工具集（`window` / `document` / `navigator`）带进类型检查，
 * React Native 这类无 DOM 的宿主一引就报一片。这里只靠鸭子类型判断，不依赖 DOM lib。
 *
 * 非 Web 宿主的取值形态各异（RN 是 `onChange(value)` 或 `nativeEvent.text`）， 由调用方通过 `getValueFromEvent` 覆盖。
 */
export const getEventValue = (valuePropName: string = 'value', ...args: any[]) => {
  const event = args[0];

  if (!isEventObject(event)) return event;

  const { target } = event as EventLike;

  if (!target) return event;

  if (target.type === 'checkbox') return target.checked;

  return target[valuePropName];
};
