import { setAtomValue } from '@skyroc/core-state';
import { atom, useAtomValue } from 'jotai';

export type MenuBadgeValues = Record<string, Router.MenuBadgeValue | undefined>;

const menuBadgeValuesAtom = atom<MenuBadgeValues>({});

function updateMenuBadgeValues(getNextValues: (currentValues: MenuBadgeValues) => MenuBadgeValues) {
  setAtomValue(menuBadgeValuesAtom, getNextValues);
}

export function setMenuBadgeValue(key: string, value: Router.MenuBadgeValue | undefined) {
  updateMenuBadgeValues(currentValues => ({ ...currentValues, [key]: value }));
}

export function setMenuBadgeValues(values: MenuBadgeValues) {
  updateMenuBadgeValues(currentValues => ({ ...currentValues, ...values }));
}

export function clearMenuBadgeValues(keys?: string[]) {
  if (!keys) {
    setAtomValue(menuBadgeValuesAtom, {});
    return;
  }

  updateMenuBadgeValues(currentValues => {
    const nextValues = { ...currentValues };

    keys.forEach(key => {
      delete nextValues[key];
    });

    return nextValues;
  });
}

export function useAdminMenuBadges() {
  const badgeValues = useAtomValue(menuBadgeValuesAtom);

  return {
    badgeValues,
    clearMenuBadgeValues,
    setMenuBadgeValue,
    setMenuBadgeValues
  };
}
