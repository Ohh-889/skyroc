import { showConfirmModal } from '@skyroc/web-admin-theme';
import { SvgIcon } from '@skyroc/web-ui-compose';
import { Alert, Button, Drawer, Flex, Typography, Upload } from 'antd';
import { useEffect, useState } from 'react';

import { describeLocalFile, getFileVisual, getSuffixFromFileName } from './oss-utils';
import OssFileIcon from './OssFileIcon';

interface OssUploadDrawerProps {
  /** 上传请求是否进行中。 */
  loading: boolean;
  /** 关闭抽屉。 */
  onClose: () => void;
  /** 提交文件；失败时抛出，由抽屉转成字段级提示。 */
  onUpload: (file: File) => Promise<void>;
  /** 抽屉是否打开。 */
  open: boolean;
}

/**
 * 把上传失败翻译成用户能处理的一句话。
 *
 * 全局请求层已经弹过一次原始报错，这里不重复弹消息，只在抽屉里留下可读的解释， 免得用户对着 "Request failed with status code 413" 猜发生了什么。
 */
function resolveUploadErrorText(error: unknown) {
  const status = (error as { response?: { status?: number } })?.response?.status;

  if (status === 400) return '上传文件不能为空，请重新选择。';
  if (status === 413) return '文件超过系统允许的大小，请选择更小的文件。';
  if (status === 401 || status === 403) return '当前账号没有上传权限，请联系管理员。';
  if (status && status >= 500) return '当前存储配置不可用，请联系管理员确认默认存储。';

  return '上传失败，请稍后重试。';
}

const OssUploadDrawer = (props: OssUploadDrawerProps) => {
  const { loading, onClose, onUpload, open } = props;

  const [file, setFile] = useState<File>();
  const [errorText, setErrorText] = useState<string>();

  useEffect(() => {
    if (open) return;

    setFile(undefined);
    setErrorText(undefined);
  }, [open]);

  function handleSelect(nextFile: File) {
    setFile(nextFile);
    setErrorText(undefined);
  }

  function handleClose() {
    if (loading) return;

    if (!file) {
      onClose();
      return;
    }

    showConfirmModal({
      closable: true,
      content: '已选择的文件还没有上传，关闭后需要重新选择。',
      okText: '放弃上传',
      title: '取消本次上传？',
      onOk: onClose
    });
  }

  async function handleSubmit() {
    if (!file) return;

    setErrorText(undefined);

    try {
      await onUpload(file);
    } catch (error) {
      setErrorText(resolveUploadErrorText(error));
    }
  }

  const suffix = file ? getSuffixFromFileName(file.name) : '';
  const visual = getFileVisual(suffix);

  return (
    <Drawer
      destroyOnHidden
      open={open}
      title="上传文件"
      size={520}
      footer={
        <Flex
          gap={8}
          justify="flex-end"
        >
          <Button
            disabled={loading}
            onClick={handleClose}
          >
            取消
          </Button>
          <Button
            disabled={!file}
            icon={<SvgIcon icon="ph:upload-simple" />}
            loading={loading}
            type="primary"
            onClick={handleSubmit}
          >
            开始上传
          </Button>
        </Flex>
      }
      mask={{ closable: !loading }}
      onClose={handleClose}
    >
      <div className="flex flex-col gap-16px">
        <Alert
          description="文件会上传到当前租户的默认存储配置。实际大小限制以服务端配置为准，超出时会被拒绝。"
          showIcon
          title="上传目标"
          type="info"
        />

        <Upload.Dragger
          accept="*"
          disabled={loading}
          maxCount={1}
          showUploadList={false}
          beforeUpload={nextFile => {
            handleSelect(nextFile);
            return false;
          }}
        >
          <div className="flex flex-col items-center gap-8px px-16px py-12px">
            <span className="size-48px grid place-items-center rounded-12px bg-primary-bg text-22px text-primary">
              <SvgIcon icon="ph:upload-simple" />
            </span>
            <Typography.Text strong>拖拽文件到这里，或点击选择</Typography.Text>
            <Typography.Text
              className="text-12px"
              type="secondary"
            >
              首期每次上传一个文件，不支持断点续传
            </Typography.Text>
          </div>
        </Upload.Dragger>

        {file ? (
          <Flex
            align="center"
            className="rounded-10px bg-layout p-12px"
            gap={12}
          >
            <OssFileIcon suffix={suffix} />
            <div className="min-w-0 flex-1">
              <Typography.Text
                className="block"
                ellipsis={{ tooltip: file.name }}
                strong
              >
                {file.name}
              </Typography.Text>
              <Typography.Text
                className="text-12px"
                type="secondary"
              >
                {visual.label} · {describeLocalFile(file)}
              </Typography.Text>
            </div>
            <Button
              aria-label="移除已选文件"
              disabled={loading}
              icon={<SvgIcon icon="ph:x" />}
              size="small"
              type="text"
              onClick={() => setFile(undefined)}
            />
          </Flex>
        ) : null}

        {errorText ? (
          <Alert
            showIcon
            title={errorText}
            type="error"
          />
        ) : null}

        <Typography.Text
          className="text-12px"
          type="secondary"
        >
          上传走服务器中转。关闭页面不会继续上传，也不支持刷新后恢复。
        </Typography.Text>
      </div>
    </Drawer>
  );
};

export default OssUploadDrawer;
