import { DarkModeContainer } from '@shell/ui/compose';

const GlobalFooter = () => {
  return (
    <DarkModeContainer className="h-full flex-center">
      <a href="https://github.com/Ohh-889/skyroc-admin/blob/master/LICENSE" rel="noopener noreferrer" target="_blank">
        Copyright MIT © 2021 Skyroc
      </a>
    </DarkModeContainer>
  );
};

export default GlobalFooter;
