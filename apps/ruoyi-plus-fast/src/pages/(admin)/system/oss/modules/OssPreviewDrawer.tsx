import { SvgIcon } from '@shell/ui/compose';
import { Alert, Button, Descriptions, Drawer, Flex, Image, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';

import type { OssItem } from '@/service/api/system-oss';

import { formatFileSize, formatSuffixLabel, getFileVisual, isPreviewableImage, parseOssExt } from './oss-utils';
import OssFileIcon from './OssFileIcon';

interface OssPreviewDrawerProps {
  /** 下载请求是否进行中。 */
  downloading: boolean;
  /** 当前查看的文件，来自列表行数据；接口没有文件详情。 */
  file?: OssItem;
  /** 关闭抽屉。 */
  onClose: () => void;
  /** 删除当前文件；没有删除权限时不传。 */
  onDelete?: (file: OssItem) => void;
  /** 下载当前文件。 */
  onDownload: (file: OssItem) => void;
  /** 抽屉是否打开。 */
  open: boolean;
}

const OssPreviewDrawer = (props: OssPreviewDrawerProps) => {
  const { downloading, file, onClose, onDelete, onDownload, open } = props;

  const [imageBroken, setImageBroken] = useState(false);

  useEffect(() => {
    setImageBroken(false);
  }, [file?.ossId]);

  const meta = parseOssExt(file?.ext1);
  const visual = getFileVisual(file?.fileSuffix);
  const showImage = file ? isPreviewableImage(file) && !imageBroken : false;

  function renderStage() {
    if (!file) return null;

    if (showImage) {
      return (
        <div className="grid place-items-center rounded-12px bg-layout p-12px">
          <Image
            alt={file.originalName || '图片预览'}
            className="max-h-320px object-contain"
            src={file.url}
            onError={() => setImageBroken(true)}
          />
        </div>
      );
    }

    return (
      <Flex
        align="center"
        className="rounded-12px bg-layout px-16px py-32px"
        gap={12}
        vertical
      >
        <OssFileIcon
          size="large"
          suffix={file.fileSuffix}
        />
        <Typography.Text strong>{visual.label}</Typography.Text>
        <Typography.Text type="secondary">
          {imageBroken ? '图片地址已失效，刷新列表后可重新获取' : '暂不支持在线预览，可下载后查看'}
        </Typography.Text>
      </Flex>
    );
  }

  return (
    <Drawer
      destroyOnHidden
      open={open}
      title="文件预览"
      width={600}
      footer={
        <Flex
          gap={8}
          justify="space-between"
        >
          <div>
            {file && onDelete ? (
              <Button
                danger
                ghost
                icon={<SvgIcon icon="ph:trash" />}
                onClick={() => onDelete(file)}
              >
                删除文件
              </Button>
            ) : null}
          </div>
          <Flex gap={8}>
            <Button onClick={onClose}>关闭</Button>
            <Button
              disabled={!file}
              icon={<SvgIcon icon="ph:download-simple" />}
              loading={downloading}
              type="primary"
              onClick={() => file && onDownload(file)}
            >
              下载文件
            </Button>
          </Flex>
        </Flex>
      }
      onClose={onClose}
    >
      {file ? (
        <div className="flex flex-col gap-16px">
          {renderStage()}

          <Descriptions
            column={1}
            size="small"
            items={[
              {
                children: <Typography.Text copyable>{file.originalName || '—'}</Typography.Text>,
                key: 'originalName',
                label: '原始文件名'
              },
              {
                children: (
                  <Typography.Text
                    className="font-mono text-12px"
                    copyable={file.fileName ? { text: file.fileName } : undefined}
                  >
                    {file.fileName || '—'}
                  </Typography.Text>
                ),
                key: 'fileName',
                label: '对象 Key'
              },
              {
                children: (
                  <Flex
                    align="center"
                    gap={8}
                  >
                    <Tag className="m-0">{formatSuffixLabel(file.fileSuffix)}</Tag>
                    <Typography.Text type="secondary">{formatFileSize(meta.fileSize) || '大小未知'}</Typography.Text>
                  </Flex>
                ),
                key: 'type',
                label: '类型 / 大小'
              },
              {
                children: meta.contentType || <span className="text-tertiary">未记录</span>,
                key: 'contentType',
                label: 'MIME'
              },
              {
                children: (
                  <Tag
                    className="m-0"
                    color="geekblue"
                    variant="filled"
                  >
                    {file.service || '未知配置'}
                  </Tag>
                ),
                key: 'service',
                label: '存储配置'
              },
              {
                children: renderUploader(file),
                key: 'createBy',
                label: '上传人'
              },
              {
                children: file.createTime || <span className="text-tertiary">—</span>,
                key: 'createTime',
                label: '创建时间'
              }
            ]}
          />

          <Alert
            description="私有桶的预览地址约 120 秒后失效。失效时刷新列表即可拿到新地址；页面不提供永久分享链接。"
            showIcon
            title="预览地址是临时的"
            type="info"
          />
        </div>
      ) : null}
    </Drawer>
  );
};

/** 有账号名就显示账号名，账号被删掉时退回 `#id` —— 那个 id 排查时仍然查得动。 */
function renderUploader(file: OssItem) {
  if (file.createByName) return file.createByName;
  if (file.createBy) return `#${file.createBy}`;

  return <span className="text-tertiary">未知</span>;
}

export default OssPreviewDrawer;
