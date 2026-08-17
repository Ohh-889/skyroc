import { useEffect, useRef, useState } from 'react';
import type { NativeSyntheticEvent, TextLayoutEventData } from 'react-native';

/**
 * 测量阶段。
 *
 * `full` 先量完整文本占几行，判断是否真的溢出； `search` 用二分找出「正文 + 省略号 + 操作文本」刚好放得下 rows 行的字符数； `settled` 表示测量结束，隐藏文本可以卸载。
 */
type MeasurePhase = 'full' | 'search' | 'settled';

/** 一轮测量的内部状态 */
interface MeasureState {
  /** 当前阶段 */
  phase: MeasurePhase;
  /** Search 阶段正在试探的字符数 */
  probe: number;
  /** 收起态最终渲染的字符数，null 表示尚未测出 */
  sliceEnd: number | null;
}

/** 初始状态用模块级常量，重置时 setState 同一引用可以让 React 跳过一次重渲染 */
const INITIAL_STATE: MeasureState = { phase: 'full', probe: 0, sliceEnd: null };

/** 尚未消费过任何探针 */
const NO_PROBE = -1;

/** 按码点切分，二分时才不会把代理对（emoji）截成半个字符 */
function toChars(content: string) {
  return Array.from(content);
}

function midpoint(lo: number, hi: number) {
  return Math.floor((lo + hi) / 2);
}

interface UseTextEllipsisOptions {
  /** 完整文本内容 */
  content: string;
  /**
   * 除内容与行数之外影响排版的入参拼成的信号，变化时重新测量。
   *
   * 运行时 `style` 里的字号变化不在其中，需要重测时请一并反映到这里。
   */
  layoutKey: string;
  /** 收起态最多显示的行数 */
  rows: number;
  /** 是否需要为内联操作文本裁剪出位置；为 false 时完全不测量，交给原生尾部省略号 */
  sliceable: boolean;
}

/**
 * 量出收起态下正文该截到第几个字符。
 *
 * `numberOfLines` 会在原生侧先把文本裁掉，`onTextLayout` 拿到的行数因此永远不超过 `rows`， 靠它判断截断只能得到「是否恰好占满」而不是「是否溢出」。所以真实行数必须由一个不带
 * `numberOfLines` 的隐藏文本量出来，再用二分收敛出裁剪点——只有这样省略号与操作文本才能真正内联在末行。
 */
const useTextEllipsis = (options: UseTextEllipsisOptions) => {
  const { content, layoutKey, rows, sliceable } = options;

  const [state, setState] = useState(INITIAL_STATE);

  /** 二分区间：lo 一定放得下，hi 一定放不下 */
  const boundsRef = useRef({ hi: 0, lo: 0 });
  /** 已消费过的探针，父级重排会让同一份文本再触发一次 onTextLayout，靠它去重 */
  const handledRef = useRef(NO_PROBE);

  const chars = toChars(content);
  const phase = sliceable ? state.phase : 'settled';

  function settle(sliceEnd: number | null) {
    setState({ phase: 'settled', probe: 0, sliceEnd });
  }

  function handleMeasure(e: NativeSyntheticEvent<TextLayoutEventData>) {
    // 隐藏文本不设 numberOfLines，这里的行数才是完整文本的真实行数
    const fits = e.nativeEvent.lines.length <= rows;

    if (state.phase === 'full') {
      // 完整文本用 chars.length 当探针标记，二分探针恒小于它，不会撞号
      if (handledRef.current === chars.length) return;

      handledRef.current = chars.length;

      // 没溢出就不需要操作入口，溢出了才开始找裁剪点
      if (fits) {
        settle(null);
        return;
      }

      boundsRef.current = { hi: chars.length, lo: 0 };
      setState({ phase: 'search', probe: midpoint(0, chars.length), sliceEnd: null });
      return;
    }

    if (state.phase !== 'search' || handledRef.current === state.probe) return;

    handledRef.current = state.probe;

    const bounds = fits ? { hi: boundsRef.current.hi, lo: state.probe } : { hi: state.probe, lo: boundsRef.current.lo };

    boundsRef.current = bounds;

    // 区间收敛到相邻两点，lo 就是还能放下省略号与操作文本的最大字符数
    if (bounds.hi - bounds.lo <= 1) {
      settle(bounds.lo);
      return;
    }

    setState({ phase: 'search', probe: midpoint(bounds.lo, bounds.hi), sliceEnd: null });
  }

  // 内容、行数或排版参数变化后，上一轮量出的裁剪点全部作废
  useEffect(() => {
    boundsRef.current = { hi: 0, lo: 0 };
    handledRef.current = NO_PROBE;
    setState(INITIAL_STATE);
  }, [content, layoutKey, rows]);

  return {
    /** 挂在隐藏测量文本上的 onTextLayout */
    handleMeasure,
    /** 当前阶段，`settled` 时隐藏测量文本不再需要渲染 */
    phase,
    /** 隐藏文本当前该渲染的正文，`search` 阶段还要由调用方补上省略号与操作文本 */
    probeContent: state.phase === 'full' ? content : chars.slice(0, state.probe).join(''),
    /** 收起态最终渲染的正文，null 表示还没测出，先按原生尾部省略号渲染 */
    slicedContent: state.sliceEnd === null ? null : chars.slice(0, state.sliceEnd).join('')
  };
};

export { useTextEllipsis };
