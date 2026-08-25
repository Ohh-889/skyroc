import { useSettingsTheme } from '@shell/theme';
import { BarChart, GaugeChart, LineChart, PictorialBarChart, PieChart, RadarChart, ScatterChart } from 'echarts/charts';
import type {
  BarSeriesOption,
  GaugeSeriesOption,
  LineSeriesOption,
  PictorialBarSeriesOption,
  PieSeriesOption,
  RadarSeriesOption,
  ScatterSeriesOption
} from 'echarts/charts';
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent
} from 'echarts/components';
import type {
  DatasetComponentOption,
  GridComponentOption,
  LegendComponentOption,
  TitleComponentOption,
  ToolboxComponentOption,
  TooltipComponentOption
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { LabelLayout, LegacyGridContainLabel, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

export type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | PieSeriesOption
  | ScatterSeriesOption
  | PictorialBarSeriesOption
  | RadarSeriesOption
  | GaugeSeriesOption
  | TitleComponentOption
  | LegendComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | ToolboxComponentOption
  | DatasetComponentOption
>;

echarts.use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegacyGridContainLabel,
  ToolboxComponent,
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  PictorialBarChart,
  RadarChart,
  GaugeChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);

interface ChartHooks {
  onDestroy?: (chart: echarts.ECharts) => void | Promise<void>;
  onRender?: (chart: echarts.ECharts) => void | Promise<void>;
  onUpdated?: (chart: echarts.ECharts) => void | Promise<void>;
}

/**
 * Use echarts
 *
 * @param optionsFactory Echarts options factory function
 * @param darkMode Dark mode
 */
export function useEcharts<T extends ECOption>(optionsFactory: () => T, hooks: ChartHooks = {}) {
  const { darkMode, settings } = useSettingsTheme();

  const domRef = useRef<HTMLDivElement | null>(null);
  const initialSize = { height: 0, width: 0 };
  const size = useSize(domRef);

  const chart = useRef<echarts.ECharts | null>(null);
  const chartOptions = useRef<T>(optionsFactory());

  const {
    onDestroy,
    onRender = instance => {
      const textColor = darkMode ? 'rgb(224, 224, 224)' : 'rgb(31, 31, 31)';
      const maskColor = darkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.8)';

      instance.showLoading({
        color: settings.themeColor,
        fontSize: 14,
        maskColor,
        textColor
      });
    },
    onUpdated = instance => {
      instance.hideLoading();
    }
  } = hooks;

  /** Is chart rendered */
  function isRendered() {
    return Boolean(domRef.current && chart.current);
  }

  /**
   * Update chart options
   *
   * @param callback Callback function
   */
  async function updateOptions(callback: (opts: T, optsFactory: () => T) => ECOption = () => chartOptions.current) {
    if (!isRendered()) return;

    const updatedOpts = callback(chartOptions.current, optionsFactory);

    Object.assign(chartOptions.current, updatedOpts);

    if (isRendered()) {
      chart.current?.clear();
    }

    chart.current?.setOption({ ...chartOptions.current, backgroundColor: 'transparent' });

    await onUpdated?.(chart.current!);
  }

  function setOptions(options: T) {
    chart.current?.setOption(options);
  }

  /** Render chart */
  async function render() {
    if (!isRendered()) {
      const chartTheme = darkMode ? 'dark' : 'light';

      chart.current = echarts.init(domRef.current, chartTheme);

      chart.current.setOption({ ...chartOptions.current, backgroundColor: 'transparent' });

      await onRender?.(chart.current);
    }
  }

  /** Resize chart */
  function resize() {
    chart.current?.resize();
  }

  /** Destroy chart */
  async function destroy() {
    if (!chart.current) return;

    await onDestroy?.(chart.current);
    chart.current?.dispose();
    chart.current = null;
  }

  /** Change chart theme */
  async function changeTheme() {
    await destroy();
    await render();
    await onUpdated?.(chart.current!);
  }

  /**
   * Render chart by size
   *
   * @param w Width
   * @param h Height
   */
  async function renderChartBySize(w: number, h: number) {
    initialSize.width = w;
    initialSize.height = h;

    // resize chart
    if (isRendered()) {
      resize();
      return;
    }

    // render chart
    await render();

    // Don't hide loading here - let it hide when data is actually loaded
  }
  useUnmount(() => {
    destroy();
  });

  useUpdateEffect(() => {
    renderChartBySize(size?.width as number, size?.height as number);
  }, [size]);

  useUpdateEffect(() => {
    changeTheme();
  }, [darkMode]);

  return {
    domRef,
    chart,
    setOptions,
    updateOptions
  };
}
