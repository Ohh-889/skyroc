import { ExceptionBase } from '@skyroc/web-ui-antd';

const NotFound = () => {
  const { t } = useTranslation();

  return <ExceptionBase buttonText={t('common.backToHome')} type="404" />;
};

export default NotFound;
