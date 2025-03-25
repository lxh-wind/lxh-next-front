'use client';

import React from 'react';
import { Button } from 'antd';
import { DeleteOutlined, DragOutlined, CopyOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { ComponentType } from './types';
import { renderComponentContent } from './ComponentRenderer';

interface ComponentItemProps {
  component: ComponentType;
  isSelected: boolean;
  index: number;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate?: () => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
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
  onDragStart,
  onDragOver,
  onDragEnd,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast
}) => {
  return (
    <div 
      className={`relative min-h-[20px] ${
        isSelected ? 'outline outline-1 outline-blue-400 bg-blue-50' : ''
      }`}
      onClick={onSelect}
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      data-index={index}
    >
      {isSelected && (
        <div className="absolute -top-3 -right-3 z-10 flex gap-1">
          <Button 
            type="primary" 
            size="small" 
            icon={<DragOutlined />} 
            className="flex items-center justify-center bg-blue-500"
            onClick={(e) => {
              e.stopPropagation();
              // 拖动手柄
            }}
          />
          {!isFirst && onMoveUp && (
            <Button 
              type="primary" 
              size="small" 
              icon={<ArrowUpOutlined />} 
              className="flex items-center justify-center bg-blue-500"
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp();
              }}
              title="上移"
            />
          )}
          {!isLast && onMoveDown && (
            <Button 
              type="primary" 
              size="small" 
              icon={<ArrowDownOutlined />} 
              className="flex items-center justify-center bg-blue-500"
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown();
              }}
              title="下移"
            />
          )}
          {onDuplicate && (
            <Button 
              type="primary" 
              size="small" 
              icon={<CopyOutlined />} 
              className="flex items-center justify-center bg-green-500"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
            />
          )}
          <Button 
            type="primary" 
            danger 
            size="small" 
            icon={<DeleteOutlined />} 
            className="flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          />
        </div>
      )}

      <div>
        {renderComponentContent(component)}
      </div>
    </div>
  );
};

export default ComponentItem; 