import type { DialogAction } from '@skyroc/native-ui';
import { Button, Dialog, Text, closeDialog, showConfirmDialog, showDialog } from '@skyroc/native-ui';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

const DialogDemo = () => {
  const [lastAction, setLastAction] = useState<string>('—');
  const [declarativeShow, setDeclarativeShow] = useState(false);
  const [inputShow, setInputShow] = useState(false);

  function record(action: DialogAction, inputValue?: string) {
    setLastAction(inputValue ? `${action}（输入：${inputValue}）` : action);
  }

  async function handleAlert() {
    const action = await showDialog({ message: '这是一段提示文案', title: '提示' });

    record(action);
  }

  async function handleConfirm() {
    const action = await showConfirmDialog({
      message: '删除后不可恢复，确定继续？',
      title: '确认删除'
    });

    record(action);
  }

  async function handleDestructive() {
    const action = await showConfirmDialog({
      confirmButtonColor: 'destructive',
      confirmButtonText: '注销',
      message: '注销后账号数据将被清空',
      title: '注销账号'
    });

    record(action);
  }

  function handleInput() {
    // 输入值只在 callback / onConfirm 里给出，Promise 只回传动作本身
    showDialog({
      callback: record,
      inputPlaceholder: '请输入昵称',
      message: '请填写你的昵称',
      showCancelButton: true,
      showInput: true,
      title: '编辑昵称'
    });
  }

  async function handleAsyncBeforeClose() {
    const action = await showConfirmDialog({
      message: '确定后会等待 1.5 秒，期间按钮显示 loading',
      title: '异步拦截',
      beforeClose: nextAction =>
        new Promise<boolean>(resolve => {
          setTimeout(() => resolve(nextAction === 'confirm'), 1500);
        })
    });

    record(action);
  }

  async function handleRound(themeDirection: 'horizontal' | 'vertical') {
    const action = await showConfirmDialog({
      message: `round-button 主题 · ${themeDirection}`,
      theme: 'round-button',
      themeDirection,
      title: '圆角按钮'
    });

    record(action);
  }

  async function handleBackdrop() {
    const action = await showDialog({
      closeOnBackdropPress: true,
      message: '点击遮罩关闭，同样按取消结算',
      title: '遮罩关闭'
    });

    record(action);
  }

  async function handleProgrammaticClose() {
    const pending = showDialog({ message: '2 秒后由代码关闭', title: '命令式关闭' });

    setTimeout(closeDialog, 2000);

    record(await pending);
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-6 pb-20"
        showsVerticalScrollIndicator={false}
      >
        {/* 基础用法 */}
        <Text className="mb-4 text-lg font-semibold">基础用法</Text>
        <View className="mb-8 flex-row flex-wrap items-center gap-3">
          <Button
            variant="tonal"
            onPress={handleAlert}
          >
            提示弹窗
          </Button>
          <Button
            variant="tonal"
            onPress={handleConfirm}
          >
            确认弹窗
          </Button>
          <Button
            variant="tonal"
            onPress={() => showDialog('只传一段文案')}
          >
            纯文案
          </Button>
          <Button
            variant="tonal"
            onPress={handleDestructive}
          >
            破坏性操作
          </Button>
        </View>

        {/* 输入与拦截 */}
        <Text className="mb-4 text-lg font-semibold">输入与拦截</Text>
        <View className="mb-8 flex-row flex-wrap items-center gap-3">
          <Button
            variant="tonal"
            onPress={handleInput}
          >
            输入框
          </Button>
          <Button
            variant="tonal"
            onPress={handleAsyncBeforeClose}
          >
            异步 beforeClose
          </Button>
        </View>

        {/* 主题 */}
        <Text className="mb-4 text-lg font-semibold">主题</Text>
        <View className="mb-8 flex-row flex-wrap items-center gap-3">
          <Button
            variant="tonal"
            onPress={() => handleRound('vertical')}
          >
            圆角竖排
          </Button>
          <Button
            variant="tonal"
            onPress={() => handleRound('horizontal')}
          >
            圆角横排
          </Button>
        </View>

        {/* 关闭方式 */}
        <Text className="mb-4 text-lg font-semibold">关闭方式</Text>
        <View className="mb-2 flex-row flex-wrap items-center gap-3">
          <Button
            variant="tonal"
            onPress={handleBackdrop}
          >
            点遮罩关闭
          </Button>
          <Button
            variant="tonal"
            onPress={handleProgrammaticClose}
          >
            代码关闭
          </Button>
        </View>
        <Text
          className="mb-8"
          color="muted"
        >
          最近一次操作：{lastAction}
        </Text>

        {/* 自定义样式 */}
        <Text className="mb-4 text-lg font-semibold">自定义样式</Text>
        <View className="mb-8 flex-row flex-wrap items-center gap-3">
          <Button
            variant="tonal"
            onPress={() =>
              showConfirmDialog({
                classNames: {
                  confirmButton: 'bg-primary/10',
                  header: 'pb-1',
                  message: 'text-left',
                  popup: 'w-[92%] max-w-[380px]',
                  title: 'text-left'
                },
                message: 'popup 控制外层宽度，root 是卡片本身，其余 slot 逐个可覆盖',
                title: 'classNames 覆盖'
              })
            }
          >
            slot 覆盖
          </Button>
          <Button
            variant="tonal"
            onPress={() =>
              showDialog({
                className: 'rounded-3xl bg-carbon',
                classNames: { message: 'text-carbon-foreground', title: 'text-carbon-foreground' },
                message: 'className 覆盖的是卡片根节点',
                title: '深色卡片'
              })
            }
          >
            className 覆盖
          </Button>
        </View>

        {/* 声明式 */}
        <Text className="mb-4 text-lg font-semibold">声明式用法</Text>
        <View className="mb-8 flex-row flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onPress={() => setDeclarativeShow(true)}
          >
            受控 Dialog
          </Button>
          <Button
            variant="outline"
            onPress={() => setInputShow(true)}
          >
            受控 + 输入框
          </Button>
        </View>
      </ScrollView>

      {/* 声明式 Dialog 必须挂在 ScrollView 外面：JS 触摸响应链走的是 React 树，
          键盘弹起时 ScrollView 会在 capture 阶段抢走第一次点击用来收键盘（keyboardShouldPersistTaps 默认 never），
          放在里面的话带输入框的弹窗要点两下才关得掉 */}
      <Dialog
        message="受控用法下 show 由外部状态驱动"
        show={declarativeShow}
        showCancelButton
        title="受控 Dialog"
        onCancel={() => record('cancel')}
        onConfirm={() => record('confirm')}
        onUpdateShow={setDeclarativeShow}
      />

      <Dialog
        inputPlaceholder="随便输点什么"
        message="确定后能拿到输入值"
        show={inputShow}
        showCancelButton
        showInput
        title="受控输入"
        onCancel={value => record('cancel', value)}
        onConfirm={value => record('confirm', value)}
        onUpdateShow={setInputShow}
      />
    </View>
  );
};

export { DialogDemo };
