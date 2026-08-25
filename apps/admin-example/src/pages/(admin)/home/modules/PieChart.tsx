import { useLang } from '@shell/i18n';
import { useEcharts } from '@/hooks/use-echarts';

const PieChart = () => {
  const { t } = useTranslation();

  const { locale } = useLang();

  const { domRef, updateOptions } = useEcharts(() => ({
    legend: {
      bottom: '1%',
      itemStyle: {
        borderWidth: 0
      },
      left: 'center'
    },
    series: [
      {
        avoidLabelOverlap: false,
        color: ['#5da8ff', '#8e9dff', '#fedc69', '#26deca'],
        data: [] as { name: string; value: number }[],
        emphasis: {
          label: {
            fontSize: '12',
            show: true
          }
        },
        itemStyle: {
          borderColor: '#fff',
          borderRadius: 10,
          borderWidth: 1
        },
        label: {
          position: 'center',
          show: false
        },
        labelLine: {
          show: false
        },
        name: t('page.home.schedule'),
        radius: ['45%', '75%'],
        type: 'pie'
      }
    ],
    tooltip: {
      trigger: 'item'
    }
  }));

  async function mockData() {
    await new Promise(resolve => {
      setTimeout(resolve, 1000);
    });

    updateOptions(opts => {
      opts.series[0].data = [
        { name: t('page.home.study'), value: 20 },
        { name: t('page.home.entertainment'), value: 10 },
        { name: t('page.home.work'), value: 40 },
        { name: t('page.home.rest'), value: 30 }
      ];

      return opts;
    });
  }

  function updateLocale() {
    updateOptions((opts, factory) => {
      const originOpts = factory();

      opts.series[0].name = originOpts.series[0].name;

      opts.series[0].data = [
        { name: t('page.home.study'), value: 20 },
        { name: t('page.home.entertainment'), value: 10 },
        { name: t('page.home.work'), value: 40 },
        { name: t('page.home.rest'), value: 30 }
      ];

      return opts;
    });
  }

  async function init() {
    mockData();
  }

  useMount(() => {
    init();
  });

  useUpdateEffect(() => {
    updateLocale();
  }, [locale]);
  return (
    <ACard className="card-wrapper" variant="borderless">
      <div className="h-360px overflow-hidden" ref={domRef} />
    </ACard>
  );
};

export default PieChart;
