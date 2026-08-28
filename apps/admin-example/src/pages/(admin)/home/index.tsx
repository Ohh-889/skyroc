import { useAdminMenuBadges } from '@shell/layouts';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

import CardData from './modules/CardData';
import CreativityBanner from './modules/CreativityBanner';
import HeaderBanner from './modules/HeaderBanner';
import LineChart from './modules/LineChart';
import PieChart from './modules/PieChart';
import ProjectNews from './modules/ProjectNews';

const HOME_MENU_BADGE_KEY = 'home.updates';

const HOME_MENU_BADGE_COUNT = 25;

const Home = () => {
  const { setMenuBadgeValue } = useAdminMenuBadges();

  useEffect(() => {
    setMenuBadgeValue(HOME_MENU_BADGE_KEY, HOME_MENU_BADGE_COUNT);
  }, []);

  return (
    <ASpace
      className="w-full"
      orientation="vertical"
      size={[16, 16]}
    >
      <HeaderBanner />

      <CardData />

      <ARow gutter={[16, 16]}>
        <ACol
          lg={14}
          span={24}
        >
          <LineChart />
        </ACol>
        <ACol
          lg={10}
          span={24}
        >
          <PieChart />
        </ACol>
      </ARow>
      <ARow gutter={[16, 16]}>
        <ACol
          lg={14}
          span={24}
        >
          <ProjectNews />
        </ACol>
        <ACol
          lg={10}
          span={24}
        >
          <CreativityBanner />
        </ACol>
      </ARow>
    </ASpace>
  );
};

export const Route = createFileRoute('/(admin)/home/')({
  component: Home,
  staticData: {
    i18nKey: 'route.home',
    title: 'home',
    menu: {
      icon: 'mdi:monitor-dashboard',
      order: 1,
      badge: {
        type: 'normal',
        valueKey: HOME_MENU_BADGE_KEY
      }
    }
  }
});
