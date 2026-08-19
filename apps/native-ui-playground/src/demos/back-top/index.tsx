import { BackTopBasic } from './BackTopBasic';

/**
 * BackTop 只有整页滚动这一个示例形态：显隐阈值是相对滚动容器算的，拆成多节反而要各自撑出一屏可滚内容。 文档站直接引用同目录下的 BackTopBasic（<Demo
 * src="@playground/back-top/BackTopBasic" />），这里只负责串场。
 */
const BackTopDemo = () => {
  return <BackTopBasic />;
};

export { BackTopDemo };
