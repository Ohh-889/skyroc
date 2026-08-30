import { type ChildProcess, spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  _electron as electron,
  type ElectronApplication,
  type JSHandle,
  type Page,
  expect,
  test
} from '@playwright/test';
import type { BrowserWindow } from 'electron';

const root = path.resolve(import.meta.dirname, '..', '..');
let electronApp: ElectronApplication;
let mainWin: JSHandle<BrowserWindow>;
let page: Page;
let testUserDataDir: string | undefined;
let xvfbProcess: ChildProcess | undefined;

function startXvfbOnLinux(): Promise<void> {
  if (process.platform !== 'linux' || process.env.DISPLAY) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    xvfbProcess = spawn('Xvfb', [':99', '-screen', '0', '1280x720x24', '-ac'], {
      stdio: 'ignore',
      detached: true
    });

    xvfbProcess.once('error', reject);

    setTimeout(() => {
      process.env.DISPLAY = ':99';
      resolve();
    }, 500);
  });
}

test.beforeAll(async () => {
  test.setTimeout(30000);
  await startXvfbOnLinux();
  testUserDataDir = mkdtempSync(path.join(os.tmpdir(), 'skyroc-electron-e2e-'));

  electronApp = await electron.launch({
    args: ['.', '--no-sandbox', `--user-data-dir=${testUserDataDir}`],
    cwd: root,
    env: { ...process.env, NODE_ENV: 'development' }
  });
  page = await electronApp.firstWindow();

  mainWin = await electronApp.browserWindow(page);
  await mainWin.evaluate(async win => {
    win.webContents.executeJavaScript('console.log("Execute JavaScript with e2e testing.")');
  });
});

test.afterAll(async () => {
  if (page) {
    await page.screenshot({ path: 'test/screenshots/e2e.png' });
    await page.close();
  }

  if (electronApp) {
    await electronApp.close();
  }

  if (testUserDataDir) {
    rmSync(testUserDataDir, { force: true, recursive: true });
    testUserDataDir = undefined;
  }

  if (xvfbProcess?.pid) {
    process.kill(-xvfbProcess.pid);
    xvfbProcess = undefined;
  }
});

test.describe('[electron-vite-react] e2e tests', () => {
  test('startup', async () => {
    const title = await page.title();
    expect(title).toBe('Electron + Vite + React');
    await expect(page).toHaveURL(/#\/login$/);
    await expect.poll(() => mainWin.evaluate(win => win.getSize())).toEqual([440, 620]);
  });

  test('should load login page correctly', async () => {
    const h1 = await page.$('h1');
    const heading = await h1?.textContent();
    expect(heading).toBe('欢迎回来');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test/screenshots/login.png' });
  });

  test('should validate credentials with FormField', async () => {
    await page.getByLabel('邮箱').fill('');
    await page.getByLabel('邮箱').blur();
    await page.getByRole('textbox', { name: '密码', exact: true }).fill('');
    await page.getByRole('textbox', { name: '密码', exact: true }).blur();
    await page.getByRole('button', { name: '登录', exact: true }).click();
    await expect(page.getByText('请输入邮箱')).toBeVisible();
    await expect(page.getByText('请输入密码')).toBeVisible();
  });

  test('should enter the desktop shell', async () => {
    await page.getByTestId('local-mode').click();
    await expect(page).toHaveURL(/#\/settings\/?$/);
    await expect(page.getByRole('heading', { name: '设置中心' })).toBeVisible();
    await expect.poll(async () => (await mainWin.evaluate(win => win.getSize()))[0]).toBeGreaterThanOrEqual(760);

    await page.getByTestId('profile-dropdown-trigger').click();
    await expect(page.getByText('应用设置', { exact: true })).toBeVisible();
    await page.getByText('返回登录', { exact: true }).click();
    await expect(page.getByRole('alertdialog')).toBeVisible();
    await expect(page.getByText('确认返回登录页？')).toBeVisible();
    await page.getByRole('button', { name: '取消' }).click();
    await expect(page).toHaveURL(/#\/settings\/?$/);

    await page.getByTestId('sidebar-toggle').click();
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+K' : 'Control+K');
    await expect(page.getByText('全局命令面板')).toBeAttached();

    await page.keyboard.press('Escape');
  });

  test('should navigate settings and switch responsibility sections', async () => {
    await page.getByTestId('nav-settings').click();
    await expect(page).toHaveURL(/#\/settings\/?$/);
    await expect(page.getByRole('heading', { name: '设置中心' })).toBeVisible();

    const launchAtLoginSwitch = page.getByRole('switch', { name: '开机启动' });
    await expect(launchAtLoginSwitch).not.toBeChecked();
    await launchAtLoginSwitch.click();
    await expect(launchAtLoginSwitch).toBeChecked();
    await expect
      .poll(() =>
        page.evaluate(() => JSON.parse(localStorage.getItem('skyroc.desktop.settings') ?? '{}').launchAtLogin)
      )
      .toBe(true);

    await page.getByTestId('settings-section-appearance').click();
    await expect(page.getByRole('heading', { name: '主题与颜色' })).toBeVisible();
    const darkThemeRadio = page.getByRole('radio', { name: '深色' });
    await darkThemeRadio.click();
    await expect(darkThemeRadio).toBeChecked();
    await expect
      .poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('skyroc.desktop.settings') ?? '{}').themeMode))
      .toBe('dark');
    await expect(page.locator('html')).toHaveClass(/dark/);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    const darkBackground = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--background').trim();
    });
    expect(darkBackground).toBe('90 10% 8%');

    await page.getByRole('radio', { name: '跟随系统' }).click();
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect(page.locator('html')).toHaveClass(/dark/);
    await page.emulateMedia({ colorScheme: 'light' });
    await expect(page.locator('html')).not.toHaveClass(/dark/);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    const mossColors = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      return {
        accent: styles.getPropertyValue('--accent').trim(),
        primary: styles.getPropertyValue('--primary').trim()
      };
    });
    await page.getByRole('radio', { name: '使用雾霭蓝' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-accent', 'blue');
    await expect
      .poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('skyroc.desktop.settings') ?? '{}').accentColor))
      .toBe('blue');
    const blueColors = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      return {
        accent: styles.getPropertyValue('--accent').trim(),
        primary: styles.getPropertyValue('--primary').trim()
      };
    });
    expect(blueColors.primary).not.toBe(mossColors.primary);
    expect(blueColors.accent).not.toBe(mossColors.accent);

    await page.getByText('自定义', { exact: true }).click();
    await page.getByLabel('自定义主题色').fill('#7c3aed');
    await expect(page.locator('html')).toHaveAttribute('data-accent', 'custom');
    await expect
      .poll(() =>
        page.evaluate(() => JSON.parse(localStorage.getItem('skyroc.desktop.settings') ?? '{}').customAccentColor)
      )
      .toBe('#7c3aed');

    await page.getByText('高对比', { exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('data-contrast', 'high');
    const grayscaleSwitch = page.getByRole('switch', { name: '灰度模式' });
    await grayscaleSwitch.click();
    await expect(grayscaleSwitch).toBeChecked();
    await expect(page.locator('html')).toHaveAttribute('data-grayscale', 'true');

    await page.getByTestId('settings-section-general').click();
    await expect(launchAtLoginSwitch).toBeChecked();

    await page.getByTestId('settings-section-data').click();
    await expect(page.getByText('删除本地数据')).toBeVisible();
  });
});
