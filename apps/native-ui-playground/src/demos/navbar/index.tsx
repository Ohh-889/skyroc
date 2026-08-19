import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { NavBarAction } from './NavBarAction';
import { NavBarBasic } from './NavBarBasic';
import { NavBarBorderless } from './NavBarBorderless';
import { NavBarCustomContent } from './NavBarCustomContent';
import { NavBarDisabled } from './NavBarDisabled';
import { NavBarStyles } from './NavBarStyles';
import { NavBarText } from './NavBarText';

/** NavBar 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/navbar/NavBarBasic" />）， 所以这里只负责串场，不要把示例代码写回本文件。 */
const NavBarDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="只给 title 即可；示例内嵌展示，故关掉 safeAreaTop。"
        title="基础用法（title）"
      >
        <NavBarBasic />
      </Section>

      <Section
        description="leftArrow 显示返回箭头，rightText 配合 onRightPress 提供主操作。"
        title="返回与操作（leftArrow / rightText）"
      >
        <NavBarAction />
      </Section>

      <Section
        description="leftText 与 rightText 同时使用时，两侧都是文字按钮。"
        title="文字导航（leftText / rightText）"
      >
        <NavBarText />
      </Section>

      <Section
        description="leftDisabled 与 rightDisabled 会阻止对应区域点击，并显示禁用反馈。"
        title="禁用状态（leftDisabled / rightDisabled）"
      >
        <NavBarDisabled />
      </Section>

      <Section
        description="left、right 和 title 均支持 ReactNode；onTitlePress 让标题区域可点击。"
        title="自定义内容（left / right / title）"
      >
        <NavBarCustomContent />
      </Section>

      <Section
        description="backColor 调整返回箭头颜色；className 与 classNames 覆盖主体和各个样式槽。"
        title="颜色与样式覆盖（backColor / classNames）"
      >
        <NavBarStyles />
      </Section>

      <Section
        description="border={false} 去掉底部分隔线；嵌入式 Demo 统一关闭 safeAreaTop，独立页面默认开启。"
        title="无分隔线（border）"
      >
        <NavBarBorderless />
      </Section>
    </ScrollView>
  );
};

export { NavBarDemo };
