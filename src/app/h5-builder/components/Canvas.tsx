'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ComponentType } from './types';
import ComponentItem from './ComponentItem';
import { useAtom } from 'jotai';
import {
  componentsAtom,
  selectedComponentAtom,
  canvasSizeAtom,
  pageInfoAtom,
  historyAtom,
  historyIndexAtom,
  canUndoAtom,
  canRedoAtom
} from '../store/atoms';
import { generateComplexId } from '../utils/store';

const Canvas: React.FC<{}> = () => {
  const [components, setComponents] = useAtom(componentsAtom);
  const [selectedComponent, setSelectedComponent] = useAtom(selectedComponentAtom);
  const [canvasSize] = useAtom(canvasSizeAtom);
  const [pageInfo] = useAtom(pageInfoAtom);

  const [, setHistory] = useAtom(historyAtom);
  const [, setHistoryIndex] = useAtom(historyIndexAtom);
  const [, setCanUndo] = useAtom(canUndoAtom);
  const [, setCanRedo] = useAtom(canRedoAtom);
  
  const [selectedId, setSelectedId] = useState<string | null>(selectedComponent?.id || null);
  
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

  // 更新组件顺序
  const handleUpdateComponentsOrder = useCallback((startIndex: number, endIndex: number) => {
    // 更新历史状态
    setHistory(prev => ({
      past: [...prev.past, prev.present],
      present: (() => {
        const result = Array.from(prev.present);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
      })(),
      future: [],
    }));
    setHistoryIndex(prev => prev + 1);
    setCanUndo(true);
    setCanRedo(false);
    
    setComponents(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

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
    if (index > 0 && handleUpdateComponentsOrder) {
      handleUpdateComponentsOrder(index, index - 1);
    }
  };

  // 处理组件下移
  const handleMoveComponentDown = (index: number) => {
    if (index < components.length - 1 && handleUpdateComponentsOrder) {
      handleUpdateComponentsOrder(index, index + 1);
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
                onMoveUp={() => handleMoveComponentUp(index)}
                onMoveDown={() => handleMoveComponentDown(index)}
                isFirst={index === 0}
                isLast={index === components.length - 1}
              />
            </div>
          ))}

          {components.length === 0 && (
            <div style={{ height: `${canvasSize.height}px` }} className="flex items-center justify-center text-center text-gray-400">
              <p>从左侧拖入组件到这里</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Canvas; 