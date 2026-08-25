import type { HeightMapToken } from 'antd/es/theme/interface';
import type { SeedToken } from 'antd/es/theme/internal';

const genControlHeight = (token: SeedToken): HeightMapToken => {
  const { controlHeight } = token;

  return {
    controlHeightSM: controlHeight * 0.75,
    controlHeightXS: controlHeight * 0.5,
    controlHeightLG: controlHeight * 1.25
  };
};

export default genControlHeight;
