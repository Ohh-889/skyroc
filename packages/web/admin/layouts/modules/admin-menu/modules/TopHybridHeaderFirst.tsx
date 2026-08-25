import { LAYOUT_MODE_TOP_HYBRID_HEADER_FIRST, LAYOUT_MODE_VERTICAL } from '../../../constant';
import { HorizontalMenuMode } from '../enum';

import Horizontal from './Horizontal';
import Vertical from './Vertical';

const ReversedHorizontalMix = () => {
  return [
    <Vertical key={LAYOUT_MODE_VERTICAL} />,

    <Horizontal key={`${LAYOUT_MODE_TOP_HYBRID_HEADER_FIRST}-horizontal`} mode={HorizontalMenuMode.FirstLevel} />
  ];
};

export default ReversedHorizontalMix;
