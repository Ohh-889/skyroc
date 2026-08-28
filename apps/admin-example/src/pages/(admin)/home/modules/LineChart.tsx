import { useLang } from '@shell/i18n';
import { useEcharts } from '@/hooks/use-echarts';

const LineChart = () => {
  const { t } = useTranslation();

  const { locale } = useLang();

  const { domRef, updateOptions } = useEcharts(() => ({
    grid: {
      top: '3%',
      containLabel: true,
      left: '3%',
      right: '4%'
    },
    legend: {
      data: [t('page.home.downloadCount'), t('page.home.registerCount')]
    },
    series: [
      {
        areaStyle: {
          color: {
            colorStops: [
              {
                color: '#8e9dff',
                offset: 0.25
              },
              {
                color: '#fff',
                offset: 1
              }
            ],
            type: 'linear',
            x: 0,
            x2: 0,
            y: 0,
            y2: 1
          }
        },
        color: '#8e9dff',
        data: [] as number[],
        emphasis: {
          focus: 'series'
        },
        name: t('page.home.downloadCount'),
        smooth: true,
        stack: 'Total',
        type: 'line'
      },
      {
        areaStyle: {
          color: {
            colorStops: [
              {
                color: '#26deca',
                offset: 0.25
              },
              {
                color: '#fff',
                offset: 1
              }
            ],
            type: 'linear',
            x: 0,
            x2: 0,
            y: 0,
            y2: 1
          }
        },
        color: '#26deca',
        data: [],
        emphasis: {
          focus: 'series'
        },
        name: t('page.home.registerCount'),
        smooth: true,
        stack: 'Total',
        type: 'line'
      }
    ],
    tooltip: {
      axisPointer: {
        label: {
          backgroundColor: '#6a7985'
        },
        type: 'cross'
      },
      trigger: 'axis'
    },
    xAxis: {
      boundaryGap: false,
      data: [] as string[],
      type: 'category'
    },
    yAxis: {
      type: 'value'
    }
  }));

  async function mockData() {
    await new Promise(resolve => {
      setTimeout(resolve, 1000);
    });

    updateOptions(opts => {
      opts.xAxis.data = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00'];
      opts.series[0].data = [4623, 6145, 6268, 6411, 1890, 4251, 2978, 3880, 3606, 4311];
      opts.series[1].data = [2208, 2016, 2916, 4512, 8281, 2008, 1963, 2367, 2956, 678];

      return opts;
    });
  }

  function init() {
    mockData();
  }

  function updateLocale() {
    updateOptions((opts, factory) => {
      const originOpts = factory();
      opts.legend.data = originOpts.legend.data;
      opts.series[0].name = originOpts.series[0].name;
      opts.series[1].name = originOpts.series[1].name;

      return opts;
    });
  }
  // init

  useMount(() => {
    init();
  });

  useUpdateEffect(() => {
    updateLocale();
  }, [locale]);
  return (
    <ACard
      className="card-wrapper"
      variant="borderless"
    >
      <div
        className="h-360px overflow-hidden"
        ref={domRef}
      />
    </ACard>
  );
};

export default LineChart;
