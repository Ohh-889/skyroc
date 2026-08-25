import { LAYOUT_MODE_VERTICAL_HYBRID_HEADER_FIRST, LAYOUT_MODE_VERTICAL_MIX } from '../../../constant';
import { FirstLevelMenuMode, HorizontalMenuMode } from '../enum';

import Horizontal from './Horizontal';
import VerticalMixMenu from './VerticalMix';

const VerticalHybridHeaderFirst = () => {
  return [
    <Horizontal key={`${LAYOUT_MODE_VERTICAL_HYBRID_HEADER_FIRST}-horizontal`} mode={HorizontalMenuMode.FirstLevel} />,

    <VerticalMixMenu
      key={`${LAYOUT_MODE_VERTICAL_HYBRID_HEADER_FIRST}-${LAYOUT_MODE_VERTICAL_MIX}`}
      mode={FirstLevelMenuMode.SecondLevel}
    />
  ];
};

export default VerticalHybridHeaderFirst;
