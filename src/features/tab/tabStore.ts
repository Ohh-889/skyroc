import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RoutePath } from '@soybean-react/vite-plugin-react-router';

interface InitialStateType {
  activeFirstLevelMenuKey: string;
  activeTabId: string;
  removeCacheKey: RoutePath | null;
  tabs: App.Global.Tab[];
}

const initialState: InitialStateType = {
  /** - 当前一级菜单 */
  activeFirstLevelMenuKey: '',
  /** - 当前标签页 */
  activeTabId: '',
  /** - 需要删除的缓存页面 */
  removeCacheKey: null,
  /** - 标签页 */
  tabs: []
};

export const tabSlice = createSlice({
  initialState,
  name: 'tab',
  reducers: {
    addTab: (state, { payload }: PayloadAction<App.Global.Tab>) => {
      const { fixedIndex } = payload;
      if (fixedIndex || fixedIndex === 0) {
        state.tabs.splice(fixedIndex, 0, payload);
      } else {
        state.tabs = [...state.tabs, payload];
      }
    },
    changeTabLabel(state, { payload }: PayloadAction<{ index: number; label?: string }>) {
      const { index, label } = payload;

      if (label) {
        state.tabs[index].i18nKey = label;
      } else {
        state.tabs[index].i18nKey = state.tabs[index].oldLabel;
      }
    },
    // 新增：清空所有标签页相关数据（重置为初始状态）
    clearTabData: () => {
      return initialState;
    },
    setActiveFirstLevelMenuKey: (state, action: PayloadAction<string>) => {
      state.activeFirstLevelMenuKey = action.payload;
    },
    setActiveTabId: (state, action: PayloadAction<string>) => {
      state.activeTabId = action.payload;
    },
    setTabs: (state, action: PayloadAction<App.Global.Tab[]>) => {
      state.tabs = action.payload;
    },
    updateTab: (state, { payload }: PayloadAction<{ index: number; tab: App.Global.Tab }>) => {
      const { index, tab } = payload;

      state.tabs[index] = tab;
    }
  },
  selectors: {
    selectActiveFirstLevelMenuKey: tab => tab.activeFirstLevelMenuKey,
    selectActiveTabId: tab => tab.activeTabId,
    selectTabs: tab => tab.tabs
  }
});

export const { addTab, changeTabLabel, clearTabData, setActiveFirstLevelMenuKey, setActiveTabId, setTabs, updateTab } =
  tabSlice.actions;

export const { selectActiveFirstLevelMenuKey, selectActiveTabId, selectTabs } = tabSlice.selectors;
