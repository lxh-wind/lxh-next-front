'use client';

import { Menu, Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

interface CommonOperationsProps {
  onDownloadJson: () => void;
  onUploadJson: () => void;
  onClearCanvas: () => void;
}

const CommonOperations: React.FC<CommonOperationsProps> = ({
  onDownloadJson,
  onUploadJson,
  onClearCanvas,
}) => {
  const items: MenuProps['items'] = [
    {
      key: 'downloadJson',
      label: '下载json文件',
      onClick: onDownloadJson,
    },
    {
      key: 'uploadJson',
      label: '上传json文件',
      onClick: onUploadJson,
    },
    {
      key: 'clearCanvas',
      label: '清空画布',
      onClick: onClearCanvas,
    },
  ];

  return (
    <Dropdown menu={{ items }} placement="bottomLeft">
      <Button type="primary">
        常用操作 <DownOutlined />
      </Button>
    </Dropdown>
  );
};

export default CommonOperations; 