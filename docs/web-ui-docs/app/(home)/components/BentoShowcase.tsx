'use client';

import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Divider,
  Icon,
  Input,
  Progress,
  Select,
  Slider,
  Switch,
  Tabs,
  Tag,
  Toggle
} from '@skyroc/web-ui';
import type { SelectProps, TabsOptionData } from '@skyroc/web-ui';
import { Bell, Bold, Check, Italic, Moon, Sun, Underline } from 'lucide-react';
import { useState } from 'react';

const frameworkItems: SelectProps['items'] = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Angular', value: 'angular' }
];

const tabItems: TabsOptionData[] = [
  { children: '', label: '概览', value: 'overview' },
  { children: '', label: '分析', value: 'analytics' },
  { children: '', label: '报表', value: 'reports' }
];

type TabValue = 'analytics' | 'overview' | 'reports';

const notifications = [
  { name: '张三', message: '提交了新的 Pull Request', time: '2 分钟前', color: 'primary' as const },
  { name: '李四', message: '评论了你的代码审查', time: '15 分钟前', color: 'info' as const },
  { name: '王五', message: '完成了部署任务', time: '1 小时前', color: 'success' as const }
];

const notificationTagLabels = {
  primary: 'PR',
  info: '评论',
  success: '部署'
} satisfies Record<(typeof notifications)[number]['color'], string>;

const tabMeta = {
  overview: {
    indicatorClassName: 'bg-primary',
    label: '概览'
  },
  analytics: {
    indicatorClassName: 'bg-info',
    label: '分析'
  },
  reports: {
    indicatorClassName: 'bg-success',
    label: '报表'
  }
} satisfies Record<TabValue, { indicatorClassName: string; label: string }>;

export const BentoShowcase = () => {
  const [framework, setFramework] = useState('react');
  const [tabValue, setTabValue] = useState<TabValue>('overview');
  const [volume, setVolume] = useState(68);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const activeTabMeta = tabMeta[tabValue];

  function onTabValueChange(value: string) {
    if (value in tabMeta) {
      setTabValue(value as TabValue);
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-3 auto-rows-auto">
      {/* 大卡片：用户设置面板（占 2 列） */}
      <Card
        classNames={{
          root: 'md:col-span-2 overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm shadow-lg shadow-primary/5'
        }}
      >
        <div className="border-b border-border px-5 py-3">
          <div className="flex items-center gap-2">
            <Icon
              icon="lucide:settings"
              className="size-4 text-muted-foreground"
            />
            <span className="text-sm font-medium text-foreground">用户设置</span>
          </div>
        </div>
        <div className="grid gap-5 p-5 sm:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="bento-username"
                className="text-sm font-medium text-foreground"
              >
                用户名
              </label>
              <Input
                id="bento-username"
                placeholder="请输入用户名"
                size="sm"
                defaultValue="skyroc_dev"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">技术栈</label>
              <Select
                items={frameworkItems}
                onValueChange={setFramework}
                size="sm"
                value={framework}
              />
            </div>
            <Button
              color="primary"
              size="sm"
              className="w-full"
            >
              <Check className="mr-1.5 size-3.5" />
              保存设置
            </Button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {darkMode ? <Moon className="size-4 text-primary" /> : <Sun className="size-4 text-warning" />}
                <span className="text-sm text-foreground">深色模式</span>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
                aria-label="切换深色模式"
              />
            </div>
            <Divider />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="size-4 text-info" />
                <span className="text-sm text-foreground">消息通知</span>
              </div>
              <Checkbox
                checked={notificationsEnabled}
                onCheckedChange={v => setNotificationsEnabled(v === true)}
                aria-label="开启消息通知"
              />
            </div>
            <Divider />
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground">字体大小</span>
                <Tag
                  variant="pure"
                  color="primary"
                  className="text-xs"
                >
                  {volume}%
                </Tag>
              </div>
              <Slider
                defaultValue={[volume]}
                max={100}
                onValueChange={v => setVolume(v[0]!)}
                step={1}
                aria-label="字体大小"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* 通知中心 */}
      <Card
        classNames={{
          root: 'overflow-hidden md:row-span-2 border-border/60 bg-card/60 backdrop-blur-sm shadow-lg shadow-info/5'
        }}
      >
        <div className="border-b border-border px-5 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon
                icon="lucide:bell"
                className="size-4 text-muted-foreground"
              />
              <span className="text-sm font-medium text-foreground">通知中心</span>
            </div>
            <Badge
              color="destructive"
              content="3"
              open
            >
              <span />
            </Badge>
          </div>
        </div>
        <div
          role="list"
          className="divide-y divide-border"
        >
          {notifications.map((item, i) => (
            <div
              key={i}
              role="listitem"
              className="flex items-start gap-3 p-4 transition-colors hover:bg-muted/30"
            >
              <Avatar
                size="sm"
                className="shrink-0 mt-0.5"
                fallback={item.name[0]}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{item.name}</span> {item.message}
                </p>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
              <Tag
                color={item.color}
                variant="pure"
                className="text-xs shrink-0"
              >
                {notificationTagLabels[item.color]}
              </Tag>
            </div>
          ))}
        </div>
        <div className="border-t border-border px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            color="carbon"
            className="w-full text-xs"
          >
            查看全部通知
          </Button>
        </div>
      </Card>

      {/* 数据统计 */}
      <Card
        classNames={{ root: 'overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm shadow-lg shadow-success/5' }}
      >
        <div className="border-b border-border px-5 py-3">
          <div className="flex items-center gap-2">
            <Icon
              icon="lucide:bar-chart-3"
              className="size-4 text-muted-foreground"
            />
            <span className="text-sm font-medium text-foreground">项目统计</span>
          </div>
        </div>
        <div className="space-y-4 p-5">
          <div>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-muted-foreground">组件覆盖率</span>
              <span className="font-medium text-success">92%</span>
            </div>
            <Progress
              value={92}
              color="success"
              aria-label="组件覆盖率"
            />
          </div>
          <div>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-muted-foreground">测试通过率</span>
              <span className="font-medium text-primary">87%</span>
            </div>
            <Progress
              value={87}
              color="primary"
              aria-label="测试通过率"
            />
          </div>
          <div>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-muted-foreground">文档完善度</span>
              <span className="font-medium text-warning">64%</span>
            </div>
            <Progress
              value={64}
              color="warning"
              aria-label="文档完善度"
            />
          </div>
        </div>
      </Card>

      {/* Tabs 演示 */}
      <Card classNames={{ root: 'overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm' }}>
        <div className="border-b border-border px-5 py-3">
          <div className="flex items-center gap-2">
            <Icon
              icon="lucide:folder-kanban"
              className="size-4 text-muted-foreground"
            />
            <span className="text-sm font-medium text-foreground">选项卡</span>
          </div>
        </div>
        <div className="p-5 space-y-3">
          <Tabs
            enableIndicator
            items={tabItems}
            size="sm"
            value={tabValue}
            onValueChange={onTabValueChange}
          />
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <div className="flex items-center gap-2">
              <div className={`size-2 rounded-full ${activeTabMeta.indicatorClassName}`} />
              <span className="text-xs text-muted-foreground">当前面板：{activeTabMeta.label}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 文本格式控件 + Tag 展示 */}
      <Card classNames={{ root: 'overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm' }}>
        <div className="border-b border-border px-5 py-3">
          <div className="flex items-center gap-2">
            <Icon
              icon="lucide:toggle-right"
              className="size-4 text-muted-foreground"
            />
            <span className="text-sm font-medium text-foreground">控件 & 标签</span>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Toggle
              aria-label="粗体"
              size="sm"
            >
              <Bold className="size-4" />
            </Toggle>
            <Toggle
              aria-label="斜体"
              size="sm"
            >
              <Italic className="size-4" />
            </Toggle>
            <Toggle
              aria-label="下划线"
              size="sm"
            >
              <Underline className="size-4" />
            </Toggle>
          </div>
          <Divider />
          <div className="flex flex-wrap gap-1.5">
            <Tag color="primary">React 19</Tag>
            <Tag color="success">稳定版</Tag>
            <Tag color="warning">Beta</Tag>
            <Tag color="info">新功能</Tag>
            <Tag color="destructive">废弃</Tag>
          </div>
        </div>
      </Card>

      {/* 颜色主题 */}
      <Card classNames={{ root: 'overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm' }}>
        <div className="border-b border-border px-5 py-3">
          <div className="flex items-center gap-2">
            <Icon
              icon="lucide:palette"
              className="size-4 text-muted-foreground"
            />
            <span className="text-sm font-medium text-foreground">颜色主题</span>
          </div>
        </div>
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-4 gap-2">
            <div className="flex flex-col items-center gap-1.5">
              <div className="size-8 rounded-lg bg-primary" />
              <span className="text-[10px] text-muted-foreground">Primary</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="size-8 rounded-lg bg-success" />
              <span className="text-[10px] text-muted-foreground">Success</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="size-8 rounded-lg bg-warning" />
              <span className="text-[10px] text-muted-foreground">Warning</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="size-8 rounded-lg bg-info" />
              <span className="text-[10px] text-muted-foreground">Info</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Button
              size="sm"
              color="primary"
            >
              主要
            </Button>
            <Button
              size="sm"
              color="success"
              variant="soft"
            >
              成功
            </Button>
            <Button
              size="sm"
              color="warning"
              variant="outline"
            >
              警告
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
