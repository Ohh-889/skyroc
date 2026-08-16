// Sheet 内部要用的可滚动容器：普通 ScrollView / FlatList 的手势会被面板拦截，必须换成这几个。
// 不转出 BottomSheetFlashList——它在 5.2 已废弃，且渲染时才会因缺少 @shopify/flash-list 抛错
export {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetSectionList,
  BottomSheetTextInput,
  BottomSheetView,
  // 开发期调试开关：调用后 gorhom 会打印 containerHeight / contentHeight 等布局日志
  enableLogging
} from '@gorhom/bottom-sheet';
export { Sheet } from './Sheet';
export { sheetVariants } from './sheet-variants';
export type { SheetProps, SheetSlots } from './types';
