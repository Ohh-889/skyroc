import { Cell, CellGroup, Stepper, Text } from '@skyroc/native-ui';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View } from 'react-native';

import {
  LOCALE_PREFERENCES,
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercent,
  formatRelativeTime,
  useLocale
} from '@/feature/i18n';
import type { LocalePreference } from '@/feature/i18n';

import { DemoHeader } from './modules/DemoHeader';

/** 演示相对时间用的固定偏移：25 分钟前。写死是为了每次进来看到的都一样，好比对两门语言的措辞 */
const RELATIVE_SAMPLE_OFFSET = 25 * 60 * 1000;

/** 演示数字格式化用的样本值，特意带上千分位和小数 */
const NUMBER_SAMPLE = 1234567.891;

const CURRENCY_SAMPLE = 1980.5;

const PERCENT_SAMPLE = 0.1286;

interface SectionProps {
  children: ReactNode;
  description?: string;
  title: string;
}

const Section = (props: SectionProps) => {
  const { children, description, title } = props;

  return (
    <View className="mx-4 gap-3 rounded-2xl bg-card p-4">
      <View className="gap-1">
        <Text
          size="base"
          weight="semibold"
        >
          {title}
        </Text>

        {description ? (
          <Text
            color="muted"
            size="sm"
          >
            {description}
          </Text>
        ) : null}
      </View>

      {children}
    </View>
  );
};

/**
 * 国际化演示页。
 *
 * 四段分别对应模板在 i18n 上做的四个决定：切换与持久化、跟随系统、插值与复数、格式化统一入口。 页面自身的文案也全部走词条——一个「讲 i18n 却自己写死中文」的演示页说服不了任何人。
 *
 * 注意整页**没有 loading 态**：词条是打包进来的，i18next 在模块顶层同步初始化完毕（见 `feature/i18n/i18n`），切语言也不是异步的。真要做成按需加载的词条，这里就得多一个骨架屏，
 * 那正是模板不那么做的原因。
 */
const I18nDemoScreen = () => {
  const { t } = useTranslation();

  const { locale, options, preference, setPreference, systemLocale } = useLocale();

  const [unread, setUnread] = useState(3);

  const now = Date.now();

  /** 「跟随系统」那一项要把系统实际会给的语言标出来，否则用户没法判断选了会变成什么 */
  function preferenceLabel(item: LocalePreference) {
    if (item === 'system') return t('locale.options.system');

    return options.find(option => option.value === item)?.label ?? item;
  }

  return (
    <View className="flex-1 bg-background">
      <DemoHeader title={t('demo.i18n.title')} />

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-4 pb-10"
      >
        <View className="mx-4 gap-2">
          <Text
            color="muted"
            size="sm"
          >
            {t('demo.i18n.intro')}
          </Text>
        </View>

        {/* ---- 1. 切换 ---- */}
        <View className="mx-4 gap-3">
          <Text
            size="sm"
            weight="medium"
          >
            {t('demo.i18n.pick')}
          </Text>

          <View className="flex-row gap-1 rounded-xl bg-muted p-1">
            {LOCALE_PREFERENCES.map(item => {
              const selected = preference === item;

              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  className="min-h-11 flex-1 items-center justify-center rounded-lg active:opacity-80 data-[selected=true]:bg-primary"
                  data-selected={selected}
                  key={item}
                  onPress={() => setPreference(item)}
                >
                  <Text className={selected ? 'text-sm text-primary-foreground' : 'text-sm text-foreground'}>
                    {preferenceLabel(item)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ---- 2. 状态 ---- */}
        <CellGroup
          inset
          title={t('demo.i18n.state.title')}
        >
          <Cell
            title={t('demo.i18n.state.preference')}
            trailing={preferenceLabel(preference)}
          />

          <Cell
            title={t('demo.i18n.state.effective')}
            trailing={locale}
          />

          {/* 偏好是「跟随系统」时，这一行就是它算出来的结果；手动选过之后两者可能不一致 */}
          <Cell
            title={t('demo.i18n.state.system')}
            trailing={systemLocale}
          />
        </CellGroup>

        {/* ---- 3. 插值与复数 ---- */}
        <Section
          description={t('demo.i18n.plural.description')}
          title={t('demo.i18n.plural.title')}
        >
          <View className="flex-row items-center justify-between gap-3">
            <Text
              className="flex-1"
              size="sm"
            >
              {t('demo.i18n.plural.sample', { count: unread })}
            </Text>

            <Stepper
              max={99}
              min={0}
              value={unread}
              onChange={setUnread}
            />
          </View>
        </Section>

        {/* ---- 4. 格式化 ---- */}
        <Section
          description={t('demo.i18n.format.description')}
          title={t('demo.i18n.format.title')}
        >
          <CellGroup border>
            <Cell
              title={t('demo.i18n.format.date')}
              trailing={formatDate(now)}
            />

            <Cell
              title={t('demo.i18n.format.dateTime')}
              trailing={formatDate(now, 'dateTime')}
            />

            <Cell
              title={t('demo.i18n.format.weekday')}
              trailing={formatDate(now, 'weekday')}
            />

            <Cell
              title={t('demo.i18n.format.relative')}
              trailing={formatRelativeTime(now - RELATIVE_SAMPLE_OFFSET, now)}
            />

            <Cell
              title={t('demo.i18n.format.number')}
              trailing={formatNumber(NUMBER_SAMPLE)}
            />

            <Cell
              title={t('demo.i18n.format.currency')}
              trailing={formatCurrency(CURRENCY_SAMPLE)}
            />

            <Cell
              title={t('demo.i18n.format.percent')}
              trailing={formatPercent(PERCENT_SAMPLE)}
            />
          </CellGroup>
        </Section>
      </ScrollView>
    </View>
  );
};

export default I18nDemoScreen;
