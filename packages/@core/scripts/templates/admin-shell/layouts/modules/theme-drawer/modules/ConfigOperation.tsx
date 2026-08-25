import { useCopy } from '@skyroc/hooks/web';
import { showErrorMessage, showSuccessMessage, useSettingsTheme } from '@shell/theme';
import { Button as AButton } from 'antd';
import { useTranslation } from 'react-i18next';

const ConfigOperation = () => {
  const { t } = useTranslation();

  const { reset, setThemeScheme, settingsJson } = useSettingsTheme();

  const { copy } = useCopy();

  function formatConfigText() {
    const reg = /"\w+":/g;

    return settingsJson.replace(reg, (match: string) => match.replace(/"/g, ''));
  }

  async function handleCopy() {
    const text = formatConfigText();

    const success = await copy(text);

    if (success) {
      showSuccessMessage(t('theme.configOperation.copySuccessMsg'));
    } else {
      showErrorMessage(t('theme.configOperation.copyFailedMsg'));
    }
  }

  function handleReset() {
    setThemeScheme('light');

    reset();

    setTimeout(() => {
      showSuccessMessage(t('theme.configOperation.resetSuccessMsg'));
    }, 50);
  }

  return (
    <div className="flex justify-between">
      <AButton danger onClick={handleReset}>
        {t('theme.configOperation.resetConfig')}
      </AButton>
      <AButton type="primary" onClick={handleCopy}>
        {t('theme.configOperation.copyConfig')}
      </AButton>
    </div>
  );
};

export default ConfigOperation;
