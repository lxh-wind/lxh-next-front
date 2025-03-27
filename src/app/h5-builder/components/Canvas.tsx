'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Modal } from 'antd';
import { ComponentType } from './types';
import ComponentItem from './ComponentItem';
import { renderComponentContent } from './ComponentRenderer';
import { useAtom } from 'jotai';
import {
  componentsAtom,
  selectedComponentAtom,
  canvasSizeAtom,
  pageInfoAtom
} from '../store/atoms';
import { generateComplexId } from '../utils/store';

interface CanvasProps {
  onUpdateComponentsOrder?: (startIndex: number, endIndex: number) => void;
  onAddComponent?: (component: any) => void;
}

const Canvas: React.FC<CanvasProps> = ({
  onUpdateComponentsOrder,
}) => {
  const [components, setComponents] = useAtom(componentsAtom);
  const [selectedComponent, setSelectedComponent] = useAtom(selectedComponentAtom);
  const [canvasSize] = useAtom(canvasSizeAtom);
  const [pageInfo] = useAtom(pageInfoAtom);
  
  const [selectedId, setSelectedId] = useState<string | null>(selectedComponent?.id || null);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedId(selectedComponent?.id || null);
  }, [selectedComponent]);

  const handleComponentSelect = (component: ComponentType) => {
    setSelectedId(component.id);
    setSelectedComponent(component);
  };

  const handleComponentDelete = (id: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== id));
    if (selectedComponent?.id === id) {
      setSelectedComponent(null);
    }
  };

  const handleDuplicate = (id: string) => {
    const component = components.find(comp => comp.id === id);
    if (component) {
      const newComponent = JSON.parse(JSON.stringify(component));
      newComponent.id = generateComplexId(component.type);
      setComponents(prev => [...prev, newComponent]);
    }
  };

  // 处理组件上移
  const handleMoveComponentUp = (index: number) => {
    if (index > 0 && onUpdateComponentsOrder) {
      onUpdateComponentsOrder(index, index - 1);
    }
  };

  // 处理组件下移
  const handleMoveComponentDown = (index: number) => {
    if (index < components.length - 1 && onUpdateComponentsOrder) {
      onUpdateComponentsOrder(index, index + 1);
    }
  };

  // 组件拖拽排序相关
  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', index.toString());
      
      // 设置拖动时的半透明效果
      setTimeout(() => {
        if (e.target && (e.target as HTMLElement).style) {
          (e.target as HTMLElement).style.opacity = '0.5';
        }
      }, 0);
    }
  };


  const handleDragEnd = (e: React.DragEvent) => {
    if (e.target && (e.target as HTMLElement).style) {
      (e.target as HTMLElement).style.opacity = '1';
    }
  };

  // 应用背景样式
  const getBackgroundStyle = () => {
    return {
      backgroundImage: pageInfo.bgMode === 'image' && pageInfo.bgImage ? `url(${pageInfo.bgImage})` :
                      pageInfo.bgMode === 'gradient' ? pageInfo.bgColor : undefined,
      backgroundRepeat: pageInfo.bgRepeat || 'no-repeat',
      backgroundSize: pageInfo.bgRepeat === 'no-repeat' ? 'cover' : undefined,
      // 添加微妙的内阴影效果
      boxShadow: 'inset 0 0 3px rgba(0, 0, 0, 0.05)',
    };
  };

  return (
    <div className="canvas-container">
      <div 
        ref={containerRef}
        className="canvas-content"
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
          margin: '0 auto',
          backgroundColor: '#fff',
          overflow: 'auto',
          position: 'relative',
          ...getBackgroundStyle()
        }}
      >
        {/* 添加简单阴影效果 */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            zIndex: 2
          }}
        ></div>
        
        <div 
          className="w-full relative" 
          style={{ padding: pageInfo.containerPadding }}
        >
          {components.map((component, index) => (
            <div 
              key={component.id}
              className="component-item relative"
              data-index={index}
            >
              <ComponentItem
                component={component}
                isSelected={selectedId === component.id}
                index={index}
                onSelect={() => handleComponentSelect(component)}
                onDelete={() => handleComponentDelete(component.id)}
                onDuplicate={() => handleDuplicate(component.id)}
                onDragStart={handleDragStart}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDragEnd={handleDragEnd}
                onMoveUp={() => handleMoveComponentUp(index)}
                onMoveDown={() => handleMoveComponentDown(index)}
                isFirst={index === 0}
                isLast={index === components.length - 1}
              />
            </div>
          ))}
          
          {components.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <p>从左侧拖入组件到这里</p>
            </div>
          )}
        </div>
      </div>
      
      {/* 预览模态框 */}
      <Modal
        title="移动端预览"
        open={showPreview}
        onCancel={() => setShowPreview(false)}
        footer={null}
        width={400}
      >
        <div className="w-full max-h-[80vh] overflow-auto p-0">
          <div className="bg-gray-100 rounded-t-lg p-2 text-center text-xs">
            <div className="inline-block bg-black text-white px-4 py-1 rounded-full">
              手机预览模式
            </div>
          </div>
          <div className="w-full bg-white p-4">
            {components.map((component) => (
              <div key={component.id} className="mb-4">
                {renderComponentContent(component)}
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Canvas; 