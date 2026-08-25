import { useLang } from '@shell/i18n';
import { useAdminState } from '@shell/layouts';
import { useSettingsTheme } from '@shell/theme';
import { SvgIcon } from '@shell/ui/compose';
import { createFileRoute } from '@tanstack/react-router';
import { Avatar, Button, Card, Col, Descriptions, Form, Input, Row, Select, Space, Switch, Tag, Timeline } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { showSuccessMessage } from '@/config';
import { useUserInfoQuery } from '@/service/api';

interface UserProfileFormValues {
  /** Display name shown in personal profile contexts. */
  displayName: string;
  /** Contact email used for account notifications. */
  email: string;
  /** Gender value used by the profile form. */
  gender?: string;
  /** Short self-description shown only on this profile page. */
  introduction: string;
  /** Contact phone used for account security prompts. */
  phone: string;
}

const UserCenter = () => {
  const { t } = useTranslation();
  const { changeLocale, locale, localeOptions } = useLang();
  const { data: userInfo } = useUserInfoQuery();
  const { fullContent, isMobile, openThemeDrawer, setSiderCollapse, siderCollapse, toggleFullContent } =
    useAdminState();
  const { setThemeScheme, themeScheme } = useSettingsTheme();
  const [form] = Form.useForm<UserProfileFormValues>();

  useEffect(() => {
    form.setFieldsValue(getProfileInitialValues(userInfo));
  }, [form, userInfo]);

  function handleProfileSubmit() {
    showSuccessMessage(t('page.userCenter.messages.profileSaved'));
  }

  function handleSecurityAction() {
    showSuccessMessage(t('page.userCenter.messages.securityActionTodo'));
  }

  function handleThemeSchemeChange(value: string | number) {
    setThemeScheme(value as Theme.ThemeMode);
  }

  function handleLocaleChange(value: string) {
    changeLocale(value as I18n.LangType);
  }

  function handleFullContentChange(checked: boolean) {
    if (checked !== fullContent) {
      toggleFullContent();
    }
  }

  function renderRoleTags() {
    const roles = userInfo?.roles ?? [];

    if (roles.length === 0) {
      return <Tag>{t('common.noData')}</Tag>;
    }

    return roles.map(role => (
      <Tag color="blue" key={role}>
        {role}
      </Tag>
    ));
  }

  function renderSecurityItems() {
    const items = [
      {
        action: t('page.userCenter.security.password.action'),
        desc: t('page.userCenter.security.password.desc'),
        icon: 'ph:password',
        status: t('page.userCenter.status.enabled'),
        title: t('page.userCenter.security.password.title')
      },
      {
        action: t('page.userCenter.security.phone.action'),
        desc: t('page.userCenter.security.phone.desc'),
        icon: 'ph:device-mobile',
        status: t('page.userCenter.status.bound'),
        title: t('page.userCenter.security.phone.title')
      },
      {
        action: t('page.userCenter.security.email.action'),
        desc: t('page.userCenter.security.email.desc'),
        icon: 'ph:envelope-simple',
        status: t('page.userCenter.status.bound'),
        title: t('page.userCenter.security.email.title')
      },
      {
        action: t('page.userCenter.security.device.action'),
        desc: t('page.userCenter.security.device.desc'),
        icon: 'ph:devices',
        status: t('page.userCenter.status.trusted'),
        title: t('page.userCenter.security.device.title')
      }
    ];

    return items.map(item => (
      <div
        className="flex items-center justify-between gap-16px border-b border-border-secondary py-14px last:border-b-0"
        key={item.title}
      >
        <div className="min-w-0 flex items-start gap-12px">
          <div className="size-36px flex-center shrink-0 rounded-6px bg-layout text-primary">
            <SvgIcon className="text-18px" icon={item.icon} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-8px">
              <span className="font-medium">{item.title}</span>
              <Tag color="success">{item.status}</Tag>
            </div>
            <p className="mb-0 mt-4px text-12px text-secondary">{item.desc}</p>
          </div>
        </div>
        <Button size="small" onClick={handleSecurityAction}>
          {item.action}
        </Button>
      </div>
    ));
  }

  function renderActivityItems() {
    const activities = [
      {
        content: t('page.userCenter.activity.currentLogin'),
        color: 'green'
      },
      {
        content: t('page.userCenter.activity.profileUpdated'),
        color: 'blue'
      },
      {
        content: t('page.userCenter.activity.permissionSynced'),
        color: 'gray'
      },
      {
        content: t('page.userCenter.activity.securityChecked'),
        color: 'gray'
      }
    ];

    return activities;
  }

  const userName = userInfo?.userName ?? t('page.userCenter.emptyUserName');
  const roleCount = userInfo?.roles.length ?? 0;
  const buttonCount = userInfo?.buttons.length ?? 0;

  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto max-w-1180px flex flex-col gap-16px p-16px lt-sm:p-12px">
        <Card className="card-wrapper" variant="borderless">
          <div className="flex flex-wrap items-center justify-between gap-16px">
            <div className="min-w-0 flex items-center gap-16px">
              <Avatar className="shrink-0 bg-primary text-28px" size={72}>
                {getAvatarText(userName)}
              </Avatar>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-8px">
                  <h1 className="mb-0 text-24px font-semibold lt-sm:text-20px">{userName}</h1>
                  <Tag color="success">{t('page.userCenter.status.online')}</Tag>
                </div>
                <p className="mb-0 mt-6px text-secondary">{t('page.userCenter.subtitle')}</p>
              </div>
            </div>
            <Space wrap>
              <Button icon={<SvgIcon icon="ph:palette" />} onClick={openThemeDrawer}>
                {t('page.userCenter.preferences.openThemeConfig')}
              </Button>
              <Button icon={<SvgIcon icon="ph:shield-check" />} type="primary" onClick={handleSecurityAction}>
                {t('page.userCenter.security.title')}
              </Button>
            </Space>
          </div>
        </Card>

        <Row gutter={[16, 16]}>
          <Col lg={8} md={24} xs={24}>
            <Card className="h-full card-wrapper" title={t('page.userCenter.profile.title')} variant="borderless">
              <Descriptions
                column={1}
                items={[
                  {
                    key: 'userId',
                    label: t('page.userCenter.profile.accountId'),
                    children: userInfo?.userId ?? '-'
                  },
                  {
                    key: 'roleCount',
                    label: t('page.userCenter.profile.roleCount'),
                    children: roleCount
                  },
                  {
                    key: 'roles',
                    label: t('page.userCenter.profile.roles'),
                    children: <Space wrap>{renderRoleTags()}</Space>
                  },
                  {
                    key: 'buttonPermissionCount',
                    label: t('page.userCenter.profile.buttonPermissionCount'),
                    children: buttonCount
                  }
                ]}
                size={isMobile ? 'small' : 'middle'}
              />
            </Card>
          </Col>

          <Col lg={16} md={24} xs={24}>
            <Card className="h-full card-wrapper" title={t('page.userCenter.profileForm.title')} variant="borderless">
              <Form form={form} layout="vertical" onFinish={handleProfileSubmit}>
                <Row gutter={16}>
                  <Col md={12} xs={24}>
                    <Form.Item label={t('page.userCenter.profileForm.displayName')} name="displayName">
                      <Input placeholder={t('page.userCenter.profileForm.displayNamePlaceholder')} />
                    </Form.Item>
                  </Col>
                  <Col md={12} xs={24}>
                    <Form.Item label={t('page.userCenter.profileForm.gender')} name="gender">
                      <Select
                        allowClear
                        options={[
                          { label: t('page.userCenter.profileForm.genderMale'), value: 'male' },
                          { label: t('page.userCenter.profileForm.genderFemale'), value: 'female' }
                        ]}
                        placeholder={t('page.userCenter.profileForm.genderPlaceholder')}
                      />
                    </Form.Item>
                  </Col>
                  <Col md={12} xs={24}>
                    <Form.Item label={t('page.userCenter.profileForm.phone')} name="phone">
                      <Input placeholder={t('page.userCenter.profileForm.phonePlaceholder')} />
                    </Form.Item>
                  </Col>
                  <Col md={12} xs={24}>
                    <Form.Item label={t('page.userCenter.profileForm.email')} name="email">
                      <Input placeholder={t('page.userCenter.profileForm.emailPlaceholder')} />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item label={t('page.userCenter.profileForm.introduction')} name="introduction">
                      <Input.TextArea
                        autoSize={{ maxRows: 4, minRows: 3 }}
                        placeholder={t('page.userCenter.profileForm.introductionPlaceholder')}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <div className="flex justify-end">
                  <Button htmlType="submit" icon={<SvgIcon icon="ph:floppy-disk" />} type="primary">
                    {t('page.userCenter.profileForm.saveProfile')}
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col lg={14} xs={24}>
            <Card className="h-full card-wrapper" title={t('page.userCenter.security.title')} variant="borderless">
              {renderSecurityItems()}
            </Card>
          </Col>

          <Col lg={10} xs={24}>
            <Card className="h-full card-wrapper" title={t('page.userCenter.preferences.title')} variant="borderless">
              <div className="flex flex-col gap-16px">
                <div className="flex items-center justify-between gap-16px">
                  <div>
                    <div className="font-medium">{t('page.userCenter.preferences.language')}</div>
                    <p className="mb-0 mt-4px text-12px text-secondary">
                      {t('page.userCenter.preferences.languageDesc')}
                    </p>
                  </div>
                  <Select
                    className="w-132px"
                    options={localeOptions.map(item => ({ label: item.label, value: item.key }))}
                    value={locale}
                    onChange={handleLocaleChange}
                  />
                </div>
                <div className="flex items-center justify-between gap-16px">
                  <div>
                    <div className="font-medium">{t('page.userCenter.preferences.themeScheme')}</div>
                    <p className="mb-0 mt-4px text-12px text-secondary">
                      {t('page.userCenter.preferences.themeSchemeDesc')}
                    </p>
                  </div>
                  <Select
                    className="w-132px"
                    options={[
                      { label: t('page.userCenter.preferences.themeLight'), value: 'light' },
                      { label: t('page.userCenter.preferences.themeDark'), value: 'dark' },
                      { label: t('page.userCenter.preferences.themeAuto'), value: 'auto' }
                    ]}
                    value={themeScheme}
                    onChange={handleThemeSchemeChange}
                  />
                </div>
                <div className="flex items-center justify-between gap-16px">
                  <div>
                    <div className="font-medium">{t('page.userCenter.preferences.siderCollapse')}</div>
                    <p className="mb-0 mt-4px text-12px text-secondary">
                      {t('page.userCenter.preferences.siderCollapseDesc')}
                    </p>
                  </div>
                  <Switch checked={siderCollapse} onChange={setSiderCollapse} />
                </div>
                <div className="flex items-center justify-between gap-16px">
                  <div>
                    <div className="font-medium">{t('page.userCenter.preferences.fullContent')}</div>
                    <p className="mb-0 mt-4px text-12px text-secondary">
                      {t('page.userCenter.preferences.fullContentDesc')}
                    </p>
                  </div>
                  <Switch checked={fullContent} onChange={handleFullContentChange} />
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        <Card className="card-wrapper" title={t('page.userCenter.activity.title')} variant="borderless">
          <Timeline items={renderActivityItems()} />
        </Card>
      </div>
    </div>
  );
};

function getAvatarText(userName: string) {
  return userName.slice(0, 1).toUpperCase();
}

function getProfileInitialValues(userInfo: Api.Auth.UserInfo | null | undefined): UserProfileFormValues {
  return {
    displayName: userInfo?.userName ?? '',
    email: userInfo?.userName ? `${userInfo.userName}@skyroc.dev` : '',
    gender: undefined,
    introduction: '',
    phone: '138 0000 0000'
  };
}

export const Route = createFileRoute('/(admin)/user-center')({
  component: UserCenter,
  staticData: {
    i18nKey: 'route.user-center',
    menu: {
      hide: true
    },
    title: 'user_center'
  }
});
