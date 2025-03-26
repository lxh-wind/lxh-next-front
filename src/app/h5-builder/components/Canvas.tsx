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
  zoomAtom,
  canvasSizeAtom,
  pageInfoAtom
} from '../store/atoms';
import { generateComplexId } from '../utils/store';
import { COMPONENT_DEFAULTS } from '../utils/constants';

interface CanvasProps {
  onUpdateComponentsOrder?: (startIndex: number, endIndex: number) => void;
  onAddComponent?: (component: any) => void;
}

const Canvas: React.FC<CanvasProps> = ({
  onUpdateComponentsOrder,
  onAddComponent,
}) => {
  const [components, setComponents] = useAtom(componentsAtom);
  const [selectedComponent, setSelectedComponent] = useAtom(selectedComponentAtom);
  const [zoom] = useAtom(zoomAtom);
  const [canvasSize] = useAtom(canvasSizeAtom);
  const [pageInfo] = useAtom(pageInfoAtom);
  
  const [selectedId, setSelectedId] = useState<string | null>(selectedComponent?.id || null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [dropIndicatorPosition, setDropIndicatorPosition] = useState<number | null>(null);
  
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
    setDragIndex(index);
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    // 显示放置指示器
    if (dragIndex !== null && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const mouseY = e.clientY - containerRect.top;
      
      let targetIndex = -1;
      const componentItems = containerRef.current.querySelectorAll('[data-index]');
      
      for (let i = 0; i < componentItems.length; i++) {
        const item = componentItems[i] as HTMLElement;
        const itemRect = item.getBoundingClientRect();
        const itemY = itemRect.top + itemRect.height / 2 - containerRect.top;
        
        if (mouseY < itemY) {
          targetIndex = parseInt(item.getAttribute('data-index') || '-1', 10);
          break;
        }
      }
      
      if (targetIndex === -1 && componentItems.length > 0) {
        // 如果鼠标位于所有项目下方，则指示器应该在最后一个项目之后
        targetIndex = componentItems.length;
      }
      
      setDropIndicatorPosition(targetIndex);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setDropIndicatorPosition(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDropIndicatorPosition(null);
    
    // 组件重新排序
    if (dragIndex !== null && onUpdateComponentsOrder) {
      const targetIndex = findDropTargetIndex(e);
      
      if (targetIndex !== -1 && targetIndex !== dragIndex) {
        onUpdateComponentsOrder(dragIndex, targetIndex > dragIndex ? targetIndex - 1 : targetIndex);
      }
    } else {
      // 处理从组件面板拖拽添加新组件的逻辑
      try {
        const componentData = JSON.parse(e.dataTransfer.getData('componentType'));
        
        if (componentData && onAddComponent) {
          // 直接调用 onAddComponent 而不是生成 ID
          onAddComponent(componentData);
          
          // 获取新添加的组件（会是数组中的最后一个）
          // 组件添加后的处理逻辑，如果需要的话
        }
      } catch (error) {
        console.error('Failed to add dragged component:', error);
      }
    }
  };

  const findDropTargetIndex = (e: React.DragEvent): number => {
    if (!containerRef.current) return -1;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const mouseY = e.clientY - containerRect.top;
    
    const componentItems = containerRef.current.querySelectorAll('[data-index]');
    
    // 如果没有组件或鼠标在第一个组件上方，则返回0
    if (componentItems.length === 0) return 0;
    
    for (let i = 0; i < componentItems.length; i++) {
      const item = componentItems[i] as HTMLElement;
      const itemRect = item.getBoundingClientRect();
      const itemMiddleY = itemRect.top + itemRect.height / 2 - containerRect.top;
      
      if (mouseY < itemMiddleY) {
        return parseInt(item.getAttribute('data-index') || '0', 10);
      }
    }
    
    // 如果鼠标在所有组件下方，则返回组件数量
    return components.length;
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.target && (e.target as HTMLElement).style) {
      (e.target as HTMLElement).style.opacity = '1';
    }
    setDragIndex(null);
    setDropIndicatorPosition(null);
  };

  // 计算画布高度 - 根据内容自适应增加
  const calculateCanvasHeight = () => {
    // 基础高度，如果没有组件则使用默认高度
    const baseHeight = canvasSize.height;
    
    if (components.length === 0) {
      return baseHeight;
    }

    // 计算所有组件占据的总高度
    let maxComponentBottom = 0;
    
    components.forEach(component => {
      // 获取组件在画布中的位置 - 从props.style中获取
      const top = component.props?.style?.marginTop || 0;
      
      // 根据组件类型设置默认高度
      const height = component.props?.style?.height || 
                    COMPONENT_DEFAULTS.HEIGHTS[component.type.toUpperCase() as keyof typeof COMPONENT_DEFAULTS.HEIGHTS] || 
                    COMPONENT_DEFAULTS.HEIGHTS.DEFAULT;
      
      // 计算组件底部位置，考虑padding和margin
      const paddingTop = component.props?.style?.paddingTop || 0;
      const paddingBottom = component.props?.style?.paddingBottom || 0;
      const marginBottom = component.props?.style?.marginBottom || 0;
      
      // 计算组件底部位置 (top + height + margins & paddings)
      const bottom = top + height + marginBottom + paddingTop + paddingBottom;
      
      // 更新最大底部位置
      if (bottom > maxComponentBottom) {
        maxComponentBottom = bottom;
      }
    });
    
    // 添加底部边距并确保最小高度不小于基础高度
    const calculatedHeight = Math.max(baseHeight, maxComponentBottom + 100);
    
    return calculatedHeight;
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