import {
  LAYOUT_MODE_HORIZONTAL,
  LAYOUT_MODE_TOP_HYBRID_HEADER_FIRST,
  LAYOUT_MODE_TOP_HYBRID_SIDEBAR_FIRST,
  LAYOUT_MODE_VERTICAL,
  LAYOUT_MODE_VERTICAL_HYBRID_HEADER_FIRST,
  LAYOUT_MODE_VERTICAL_MIX
} from '../../../../constant';
import LayoutModeCard from '../../components/LayoutModeCard';

const LAYOUTS_COMPONENTS: Record<UnionKey.ThemeLayoutMode, React.ReactNode> = {
  [LAYOUT_MODE_HORIZONTAL]: (
    <>
      <div className="h-16px rd-4px bg-primary" />
      <div className="flex flex-1 gap-6px">
        <div className="flex-1 rd-4px bg-primary-200" />
      </div>
    </>
  ),
  [LAYOUT_MODE_TOP_HYBRID_HEADER_FIRST]: (
    <>
      <div className="h-16px rd-4px bg-primary" />
      <div className="flex flex-1 gap-6px">
        <div className="w-18px rd-4px bg-primary-300" />
        <div className="flex-1 rd-4px bg-primary-200" />
      </div>
    </>
  ),
  [LAYOUT_MODE_TOP_HYBRID_SIDEBAR_FIRST]: (
    <>
      <div className="h-16px rd-4px bg-primary-300" />
      <div className="flex flex-1 gap-6px">
        <div className="w-18px rd-4px bg-primary" />
        <div className="flex-1 rd-4px bg-primary-200" />
      </div>
    </>
  ),
  [LAYOUT_MODE_VERTICAL]: (
    <>
      <div className="h-full w-18px rd-4px bg-primary" />
      <div className="flex-col flex-1 gap-6px">
        <div className="h-16px rd-4px bg-primary-200" />
        <div className="flex-1 rd-4px bg-primary-200" />
      </div>
    </>
  ),
  [LAYOUT_MODE_VERTICAL_HYBRID_HEADER_FIRST]: (
    <>
      <div className="h-full w-8px rd-4px bg-primary" />
      <div className="h-full w-16px rd-4px bg-primary-300" />
      <div className="flex-col flex-1 gap-6px">
        <div className="h-16px rd-4px bg-primary" />
        <div className="flex-1 rd-4px bg-primary-200" />
      </div>
    </>
  ),
  [LAYOUT_MODE_VERTICAL_MIX]: (
    <>
      <div className="h-full w-8px rd-4px bg-primary" />
      <div className="h-full w-16px rd-4px bg-primary-300" />
      <div className="flex-col flex-1 gap-6px">
        <div className="h-16px rd-4px bg-primary-200" />
        <div className="flex-1 rd-4px bg-primary-200" />
      </div>
    </>
  )
};

const LayoutMode = () => {
  return <LayoutModeCard {...LAYOUTS_COMPONENTS} />;
};

export default LayoutMode;
