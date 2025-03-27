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
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// 定义拖拽项类型
const COMPONENT_ITEM_TYPE = 'COMPONENT_ITEM';

// 拖拽项组件
interface DraggableComponentProps {
  id: string;
  index: number;
  children: React.ReactNode;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ id, index, moveItem, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // 使用简化的拖拽逻辑，不再使用hoverIndex状态
  const [{ isDragging }, drag] = useDrag({
    type: COMPONENT_ITEM_TYPE,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    })
  });

  const [{ isOver }, drop] = useDrop({
    accept: COMPONENT_ITEM_TYPE,
    drop: (item: { id: string; index: number }) => {
      // 只在drop时执行一次移动操作
      if (item.index !== index) {
        moveItem(item.index, index);
      }
    },
    hover: (item: { id: string; index: number }, monitor) => {
      if (!ref.current || item.index === index) {
        return;
      }
      
      // 获取矩形区域
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      // 计算中点
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // 获取鼠标位置
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      
      // 计算鼠标相对位置
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      
      // 只有当鼠标越过中线位置时才进行判断
      // 向下拖动：鼠标需要超过下半部分
      // 向上拖动：鼠标需要超过上半部分
      if ((item.index < index && hoverClientY < hoverMiddleY) ||
          (item.index > index && hoverClientY > hoverMiddleY)) {
        return;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });
  
  // 设置样式
  const opacity = isDragging ? 0.4 : 1;
  const style = {
    opacity,
    backgroundColor: isOver ? 'rgba(0, 0, 255, 0.05)' : undefined,
    borderTop: isOver ? '2px dashed #aaa' : undefined
  };
  
  drag(drop(ref));
  
  return (
    <div ref={ref} style={style} className="component-item relative" data-index={index}>
      {children}
    </div>
  );
};

const Canvas: React.FC<{}> = () => {
  const [components, setComponents] = useAtom(componentsAtom);
  const [selectedComponent, setSelectedComponent] = useAtom(selectedComponentAtom);
  const [canvasSize] = useAtom(canvasSizeAtom);
  const [pageInfo] = useAtom(pageInfoAtom);

  const [history, setHistory] = useAtom(historyAtom);
  const [historyIndex, setHistoryIndex] = useAtom(historyIndexAtom);
  const [canUndo, setCanUndo] = useAtom(canUndoAtom);
  const [canRedo, setCanRedo] = useAtom(canRedoAtom);
  
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
    // 保存当前状态到历史
    const newComponents = components.filter(comp => comp.id !== id);
    const newPast = [...history.past, components];
    
    setHistory({
      past: newPast,
      present: newComponents,
      future: [],
    });
    
    // 不再需要更新 historyIndex，因为我们现在使用 past.length 来判断
    // setHistoryIndex(historyIndex + 1);
    
    // 根据newPast的长度判断是否可以撤销
    setCanUndo(newPast.length > 0);
    setCanRedo(false);
    
    // 更新组件状态
    setComponents(newComponents);
    
    if (selectedComponent?.id === id) {
      setSelectedComponent(null);
    }
  };

  // 更新组件顺序
  const handleUpdateComponentsOrder = useCallback((startIndex: number, endIndex: number) => {
    // 确保索引有效
    if (startIndex === endIndex || 
        startIndex < 0 || 
        endIndex < 0 || 
        startIndex >= components.length || 
        endIndex >= components.length) {
      return;
    }

    // 更新组件数组
    const newComponents = [...components];
    const [movedItem] = newComponents.splice(startIndex, 1);
    newComponents.splice(endIndex, 0, movedItem);
    
    // 更新历史状态
    const newPast = [...history.past, components];
    
    setHistory({
      past: newPast,
      present: newComponents,
      future: [],
    });
    
    setHistoryIndex(historyIndex + 1);
    // 只要past中有记录就可以撤销
    setCanUndo(newPast.length > 0);
    setCanRedo(false);
    
    // 更新组件状态
    setComponents(newComponents);
  }, [components, history, historyIndex, setHistory, setHistoryIndex, setCanUndo, setCanRedo, setComponents]);

  const handleDuplicate = (id: string) => {
    const component = components.find(comp => comp.id === id);
    if (component) {
      const newComponent = JSON.parse(JSON.stringify(component));
      newComponent.id = generateComplexId(component.type);
      
      // 更新历史状态
      const newComponents = [...components, newComponent];
      const newPast = [...history.past, components];
      
      setHistory({
        past: newPast,
        present: newComponents,
        future: [],
      });
      
      setHistoryIndex(historyIndex + 1);
      // 根据newPast的长度判断是否可以撤销
      setCanUndo(newPast.length > 0);
      setCanRedo(false);
      
      // 更新组件状态
      setComponents(newComponents);
    }
  };

  // 处理组件上移
  const handleMoveComponentUp = (index: number) => {
    if (index > 0) {
      handleUpdateComponentsOrder(index, index - 1);
    }
  };

  // 处理组件下移
  const handleMoveComponentDown = (index: number) => {
    if (index < components.length - 1) {
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
    <DndProvider backend={HTML5Backend}>
      <div className="canvas-container">
        <div 
          ref={containerRef}
          className="canvas-content"
          style={{
            width: canvasSize.width,
            minHeight: canvasSize.height,
            margin: '0 auto',
            backgroundColor: '#fff',
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
              <DraggableComponent 
                key={component.id} 
                id={component.id} 
                index={index}
                moveItem={handleUpdateComponentsOrder}
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
              </DraggableComponent>
            ))}

            {components.length === 0 && (
              <div style={{ height: `${canvasSize.height}px` }} className="flex items-center justify-center text-center text-gray-400">
                <p>从左侧拖入组件到这里</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default Canvas; 