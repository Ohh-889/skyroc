import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface PhoneFrameProps {
  /** 屏幕内容 */
  children: ReactNode;
  /** 固定屏幕高度。右侧常驻手机用它，避免在 demo 之间切换时机身忽高忽低； 窄屏内联的那台仍按内容撑高，单点 demo 不会拖出大片留白。 */
  fill?: boolean;
}

/** 机身：外圈是边框，内圈才是视口 */
export const PhoneFrame = (props: PhoneFrameProps) => {
  const { children, fill = false } = props;

  return (
    <div className="w-[375px] shrink-0 rounded-[2.5rem] shadow-xl">
      <div
        className={cn(
          // 用 skyroc 的 background 令牌而不是 fd-background：demo 自身就是 bg-background，
          // 同色才连成一整块屏幕，短 demo 下方的留白才像「屏幕剩余空间」而不是缺了一块
          'skyroc-phone-screen relative flex w-full flex-col overflow-hidden rounded-[1.75rem] bg-background',
          fill ? 'skyroc-phone-screen-fill' : 'max-h-[600px] min-h-[120px]'
        )}
      >
        {children}
      </div>
    </div>
  );
};
