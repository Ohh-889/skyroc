import { useArray } from '@skyroc/hooks';
import { AnimatePresence, motion } from 'motion/react';

import SkyrocAvatar from '@/components/SkyrocAvatar';

const variants = {
  exit: { opacity: 0, transition: { duration: 0.3 }, x: 200 },
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, transition: { duration: 0.3 }, y: 0 }
};

const ProjectNews = () => {
  const { t } = useTranslation();

  const [newses, { down, pop, push, remove, reset, reverse, shift, sort, unshift, up }] = useArray([
    { content: t('page.home.projectNews.desc1'), id: 1, time: '2021-05-28 22:22:22' },
    { content: t('page.home.projectNews.desc2'), id: 2, time: '2023-10-27 10:24:54' },
    { content: t('page.home.projectNews.desc3'), id: 3, time: '2021-10-31 22:43:12' },
    { content: t('page.home.projectNews.desc4'), id: 4, time: '2022-11-03 20:33:31' },
    { content: t('page.home.projectNews.desc5'), id: 5, time: '2021-11-07 22:45:32' }
  ]);

  const sortByTimeDesc = () => {
    sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  };

  return (
    <ACard
      className="card-wrapper"
      size="small"
      title={t('page.home.projectNews.title')}
      variant="borderless"
      extra={[
        <AButton
          key="reset"
          type="text"
          onClick={reset}
        >
          重置
        </AButton>,
        <AButton
          key="reverse"
          type="text"
          onClick={reverse}
        >
          反转
        </AButton>,
        <AButton
          key="sort"
          type="text"
          onClick={sortByTimeDesc}
        >
          以时间排序
        </AButton>,
        <AButton
          key="unshift"
          type="text"
          onClick={() => unshift({ content: '我是第一个', id: 1, time: '2021-11-07 22:45:32' })}
        >
          从头添加
        </AButton>,
        <AButton
          key="shift"
          type="text"
          onClick={shift}
        >
          删除头部
        </AButton>,
        <AButton
          key="PUSH"
          type="text"
          onClick={() => push({ content: '我是第六个', id: 6, time: '2021-11-07 22:45:32' })}
        >
          尾部添加
        </AButton>,
        <AButton
          key="pop"
          type="text"
          onClick={pop}
        >
          删除尾部
        </AButton>,
        <a
          className="ml-8px text-primary"
          key="a"
        >
          {t('page.home.projectNews.moreNews')}
        </a>
      ]}
    >
      <AnimatePresence mode="popLayout">
        <AList
          dataSource={newses}
          renderItem={item => (
            <motion.div
              layout // 处理上移、下移等排序动画
              animate="visible" // 动画目标状态
              exit="exit" // 退出时动画
              initial="hidden" // 初始状态
              key={item.id}
              variants={variants} // 应用定义的动画 variants
            >
              <AList.Item
                actions={[
                  <AButton
                    key="up"
                    size="small"
                    onClick={() => up(item.id)}
                  >
                    上移
                  </AButton>,

                  <AButton
                    danger
                    key="del"
                    size="small"
                    onClick={() => remove(item.id)}
                  >
                    删除
                  </AButton>,
                  <AButton
                    key="down"
                    size="small"
                    onClick={() => down(item.id)}
                  >
                    下移
                  </AButton>
                ]}
              >
                <AList.Item.Meta
                  avatar={<SkyrocAvatar className="size-48px!" />}
                  description={item.time}
                  title={item.content}
                />
              </AList.Item>
            </motion.div>
          )}
        />
      </AnimatePresence>
    </ACard>
  );
};

export default ProjectNews;
