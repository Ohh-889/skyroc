import { createFileRoute } from '@tanstack/react-router';

import { fetchCustomBackendError } from '@/service/api';

const Request = () => {
  const { t } = useTranslation();

  async function triggerError(code: string, message: string) {
    try {
      await fetchCustomBackendError(code, message);
    } catch {
      // The request adapter has already rendered the user-facing error state.
    }
  }

  async function logout() {
    await triggerError('8888', t('request.logoutMsg'));
  }

  async function logoutWithModal() {
    await triggerError('7777', t('request.logoutWithModalMsg'));
  }

  async function refreshToken() {
    await triggerError('9999', t('request.tokenExpired'));
  }

  async function handleRepeatedMessageError() {
    await Promise.all([
      triggerError('2222', t('page.function.request.repeatedErrorMsg1')),
      triggerError('2222', t('page.function.request.repeatedErrorMsg1')),
      triggerError('2222', t('page.function.request.repeatedErrorMsg1')),
      triggerError('3333', t('page.function.request.repeatedErrorMsg2')),
      triggerError('3333', t('page.function.request.repeatedErrorMsg2')),
      triggerError('3333', t('page.function.request.repeatedErrorMsg2'))
    ]);
  }

  async function handleRepeatedModalError() {
    await Promise.all([
      triggerError('7777', t('request.logoutWithModalMsg')),
      triggerError('7777', t('request.logoutWithModalMsg')),
      triggerError('7777', t('request.logoutWithModalMsg'))
    ]);
  }

  return (
    <ASpace
      className="w-full"
      direction="vertical"
      size={16}
    >
      <ACard
        className="card-wrapper"
        size="small"
        title={t('request.logout')}
        variant="borderless"
      >
        <AButton onClick={() => logout()}>{t('common.trigger')}</AButton>
      </ACard>

      <ACard
        className="card-wrapper"
        size="small"
        title={t('request.logoutWithModal')}
        variant="borderless"
      >
        <AButton onClick={() => logoutWithModal()}>{t('common.trigger')}</AButton>
      </ACard>

      <ACard
        className="card-wrapper"
        size="small"
        title={t('request.refreshToken')}
        variant="borderless"
      >
        <AButton onClick={() => refreshToken()}>{t('common.trigger')}</AButton>
      </ACard>

      <ACard
        className="card-wrapper"
        size="small"
        title={t('page.function.request.repeatedErrorOccurOnce')}
        variant="borderless"
      >
        <AButton onClick={() => handleRepeatedMessageError()}>
          {t('page.function.request.repeatedError')} (Message)
        </AButton>
        <AButton
          className="ml-12px"
          onClick={() => handleRepeatedModalError()}
        >
          {t('page.function.request.repeatedError')}(Modal)
        </AButton>
      </ACard>
    </ASpace>
  );
};

export const Route = createFileRoute('/(admin)/function/request')({
  component: Request,
  staticData: {
    i18nKey: 'route.function_request',
    menu: {
      icon: 'carbon:network-overlay',
      order: 3
    },
    title: 'function_request'
  }
});
