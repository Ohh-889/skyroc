import { createAtomWithStorage } from '@skyroc/core-state';

import { MMKV_STORAGE } from '@/store/mmkv-storage';

import { createInitialTasks, normalizeFinanceTasks } from './task-model';

const FINANCE_TASKS_STORAGE_KEY = 'demo.financeTasks';

/**
 * 演示页的任务事实来源。
 *
 * MMKV 同步读取，页面重新挂载或 App 冷启动时都能直接恢复任务、状态与资料勾选结果。
 */
export const financeTasksAtom = createAtomWithStorage(FINANCE_TASKS_STORAGE_KEY, createInitialTasks(), {
  storageName: MMKV_STORAGE,
  validate: normalizeFinanceTasks
});
