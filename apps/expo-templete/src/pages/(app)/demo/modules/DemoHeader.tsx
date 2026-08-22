import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';

/** DemoHeader 组件属性 */
export interface DemoHeaderProps {
  /** 页面标题 */
  title: string;
}

/**
 * Demo 分组共用的页面头部。
 *
 * (app) 整组关掉了原生 header，头部由页面自己拼。七个 demo 页要的东西完全一样—— 标题加一个返回箭头，所以收到 modules 里，免得 useRouter + NavBar 抄七遍。
 * 业务页面通常各有各的右侧按钮和背景，别照搬这个，直接用 NavBar 拼。
 */
export const DemoHeader = (props: DemoHeaderProps) => {
  const { title } = props;

  const router = useRouter();

  return (
    <NavBar
      title={title}
      onLeftPress={router.back}
    />
  );
};
