import type { FieldElement } from '@skyroc/type-utils/web';
import { isEventObject } from '../object';

type Event = { target: any };

export const isCheckBoxInput = (element: FieldElement): element is HTMLInputElement => element.type === 'checkbox';

export const isRadioInput = (element: FieldElement): element is HTMLInputElement => element.type === 'radio';

export const isFileInput = (element: FieldElement): element is HTMLInputElement => element.type === 'file';

export const getEventValue = (valuePropName: string = 'value', ...args: any[]) => {
  const event = args[0];

  if (!isEventObject(event)) return event;

  const { target } = event as Event;

  if (!target) return event;

  if (isCheckBoxInput(target)) return target.checked;

  return target[valuePropName];
};
