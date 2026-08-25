import { ExceptionBase } from '@shell/ui/antd';

const NotFound = () => {
  const { t } = useTranslation();

  return <ExceptionBase buttonText={t('common.backToHome')} type="404" />;
};

export default NotFound;
