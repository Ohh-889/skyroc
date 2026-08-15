import { isString } from '@skyroc/utils';
import { Image as EXImage } from 'expo-image';
import { withUniwind } from 'uniwind';
import type { ImageProps } from './types';

/** expo-image 不认 className，用 withUniwind 把工具类映射到 style 上，让尺寸/圆角等跟随主题 token */
const StyledImage = withUniwind(EXImage);

const Image = (props: ImageProps) => {
  const { src, ...rest } = props;

  const source = isString(src) ? { uri: src } : src;

  return (
    <StyledImage
      source={source}
      {...rest}
    />
  );
};

export { Image };
