// oxlint-disable import/no-unassigned-import
import { createFileRoute } from '@tanstack/react-router';
import { Card, Space, Typography } from 'antd';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { SwiperOptions } from 'swiper/types';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { ExamplePanel, PluginPageHeader } from './modules/shared';

type SwiperExampleOptions = Pick<
  SwiperOptions,
  'loop' | 'navigation' | 'pagination' | 'slidesPerGroup' | 'slidesPerView' | 'spaceBetween'
>;

interface SwiperExample {
  /** 示例唯一标识。 */
  id: number;

  /** 示例标题。 */
  label: string;

  /** 传递给 Swiper React 组件的配置。 */
  options: Partial<SwiperExampleOptions>;
}

const swiperExamples: SwiperExample[] = [
  { id: 1, label: 'Default', options: {} },
  { id: 2, label: 'Navigation', options: { navigation: true } },
  { id: 3, label: 'Pagination', options: { pagination: true } },
  { id: 4, label: 'Dynamic Bullets', options: { pagination: { dynamicBullets: true } } },
  { id: 5, label: 'Progress', options: { navigation: true, pagination: { type: 'progressbar' } } },
  { id: 6, label: 'Slides Per View', options: { pagination: { clickable: true }, slidesPerView: 3, spaceBetween: 24 } },
  { id: 7, label: 'Loop', options: { loop: true, navigation: true, pagination: { clickable: true } } }
];

const SwiperDemo = () => {
  return (
    <Space
      className="w-full"
      orientation="vertical"
      size={16}
    >
      <PluginPageHeader
        icon="simple-icons:swiper"
        resources={[{ label: 'Swiper React', url: 'https://swiperjs.com/react' }]}
        tags={['swiper/react', 'Navigation', 'Pagination']}
        title="Swiper 示例"
      />
      <ExamplePanel
        icon="simple-icons:swiper"
        title="轮播模式"
      >
        <Space
          className="w-full"
          orientation="vertical"
          size={24}
        >
          {swiperExamples.map(item => (
            <div key={item.id}>
              <Typography.Title level={4}>{item.label}</Typography.Title>
              <Swiper
                modules={[Navigation, Pagination]}
                {...item.options}
              >
                {[1, 2, 3, 4, 5].map(index => (
                  <SwiperSlide key={index}>
                    <Card className="h-220px flex items-center justify-center text-center text-24px font-semibold">
                      Slide {index}
                    </Card>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ))}
        </Space>
      </ExamplePanel>
    </Space>
  );
};

export const Route = createFileRoute('/(admin)/plugin/swiper')({
  component: SwiperDemo,
  staticData: {
    i18nKey: 'route.plugin_swiper',
    menu: {
      icon: 'simple-icons:swiper',
      order: 140
    },
    title: 'plugin_swiper'
  }
});
