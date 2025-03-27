'use client';

import React from 'react';
import { Dropdown } from 'antd';
import { DeleteOutlined, CopyOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { ComponentType } from './types';
import { renderComponentContent } from './ComponentRenderer';

interface ComponentItemProps {
  component: ComponentType;
  isSelected: boolean;
  index: number;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const ComponentItem: React.FC<ComponentItemProps> = ({
  component,
  isSelected,
  index,
  onSelect,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast
}) => {
  const items: MenuProps['items'] = [
    ...(!isFirst && onMoveUp ? [{
      key: 'moveUp',
      label: '上移',
      icon: <ArrowUpOutlined />,
      onClick: onMoveUp
    }] : []),
    ...(!isLast && onMoveDown ? [{
      key: 'moveDown',
      label: '下移',
      icon: <ArrowDownOutlined />,
      onClick: onMoveDown
    }] : []),
    ...(onDuplicate ? [{
      key: 'duplicate',
      label: '复制',
      icon: <CopyOutlined />,
      onClick: onDuplicate
    }] : []),
    {
      key: 'delete',
      label: '删除',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: onDelete
    }
  ];

  return (
    <Dropdown menu={{ items }} trigger={['contextMenu']}>
      <div 
        className={`relative min-h-[20px] ${
          isSelected ? 'outline outline-1 outline-blue-400 bg-blue-50' : ''
        }`}
        onClick={onSelect}
        data-index={index}
      >
        <div>
          {renderComponentContent(component)}
        </div>
      </div>
    </Dropdown>
  );
};

export default ComponentItem; 