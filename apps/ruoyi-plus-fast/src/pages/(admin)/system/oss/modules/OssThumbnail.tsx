import { useEffect, useState } from 'react';

import type { OssItem } from '@/service/api/system-oss';

import OssFileIcon from './OssFileIcon';
import { isPreviewableImage } from './oss-utils';

interface OssThumbnailProps {
  /** 当前行的文件记录。 */
  file: OssItem;
}

/**
 * 列表里的文件缩略图。
 *
 * 图片走真实地址，其余类型用图标。私有桶地址会过期，加载失败时退回图标即可， 不重试也不上报——一行坏数据不该升级成整页错误。
 */
const OssThumbnail = (props: OssThumbnailProps) => {
  const { file } = props;

  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setBroken(false);
  }, [file.url]);

  if (isPreviewableImage(file) && !broken) {
    return (
      <img
        alt={file.originalName || '文件缩略图'}
        className="size-40px shrink-0 rounded-8px bg-layout object-cover"
        loading="lazy"
        src={file.url}
        onError={() => setBroken(true)}
      />
    );
  }

  return <OssFileIcon suffix={file.fileSuffix} />;
};

export default OssThumbnail;
