import React from 'react';
import { ComponentType } from '../../types';

export function ContainerComponent({ component }: { component: ComponentType }) {
  return (
    <div 
      style={{ 
        border: '1px dashed #ddd',
        padding: '10px',
        ...component.props.style 
      }}
      className="rounded-lg bg-gray-50"
    >
      <div className="text-xs text-gray-500 mb-2">{component.props.title || '容器组件'}</div>
      {/* 容器内容占位符 */}
      <div className="min-h-20 flex items-center justify-center">
        <div className="text-gray-400 text-sm">
          {component.props.description || '可以拖入其他组件到此区域'}
        </div>
      </div>
    </div>
  );
} 