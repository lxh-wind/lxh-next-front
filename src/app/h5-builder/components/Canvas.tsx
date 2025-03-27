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
import { useDrag, useDrop } from 'react-dnd';
import { COMPONENT_ITEM_TYPE } from './ComponentPanel';

// 拖拽项组件
interface DraggableComponentProps {
  id: string;
  index: number;
  children: React.ReactNode;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  onDropNewComponent: (item: any, index: number) => void;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ id, index, moveItem, onDropNewComponent, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag({
    type: COMPONENT_ITEM_TYPE,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    })
  });

  const [{ isOver }, drop] = useDrop({
    accept: COMPONENT_ITEM_TYPE,
    drop: (item: any) => {
      // 如果是组件间拖拽顺序调整
      if (item.index !== undefined && item.id) {
        if (item.index !== index) {
          moveItem(item.index, index);
        }
      } 
      // 如果是从面板拖入的新组件
      else if (item.componentType) {
        onDropNewComponent(item, index);
        return { handled: true };
      }
    },
    hover: (item: any, monitor) => {
      // 只处理组件间排序操作
      if (!item.id || item.index === undefined) return;
      if (!ref.current || item.index === index) {
        return;
      }
      
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      
      if ((item.index < index && hoverClientY < hoverMiddleY) ||
          (item.index > index && hoverClientY > hoverMiddleY)) {
        return;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });
  
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
  const emptyAreaRef = useRef<HTMLDivElement>(null);

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

  // 处理从面板拖入的新组件到指定位置
  const handleDropNewComponentAtPosition = useCallback((item: { componentType: any }, targetIndex: number) => {
    if (!item.componentType) return;
    
    const newComponent = {
      ...item.componentType,
      id: generateComplexId(item.componentType.type),
      props: { ...item.componentType.defaultProps }
    };
    
    // 创建新的组件数组，在指定位置插入新组件
    const newComponents = [...components];
    newComponents.splice(targetIndex, 0, newComponent);
    
    // 更新历史状态
    const newPast = [...history.past, components];
    
    setHistory({
      past: newPast,
      present: newComponents,
      future: [],
    });
    
    setHistoryIndex(historyIndex + 1);
    setCanUndo(newPast.length > 0);
    setCanRedo(false);
    
    // 更新组件状态
    setComponents(newComponents);
    
    // 选中新添加的组件
    setSelectedComponent(newComponent);
  }, [components, history, historyIndex, setComponents, setHistory, setHistoryIndex, setCanUndo, setCanRedo, setSelectedComponent]);

  // 处理从面板拖入的新组件到画布末尾
  const handleDropNewComponent = useCallback((item: { componentType: any }) => {
    handleDropNewComponentAtPosition(item, components.length);
  }, [components.length, handleDropNewComponentAtPosition]);

  // 应用背景样式
  const getBackgroundStyle = () => {
    return {
      backgroundImage: pageInfo.bgMode === 'image' && pageInfo.bgImage ? `url(${pageInfo.bgImage})` :
                      pageInfo.bgMode === 'gradient' ? pageInfo.bgColor : undefined,
      backgroundRepeat: pageInfo.bgRepeat || 'no-repeat',
      backgroundSize: pageInfo.bgRepeat === 'no-repeat' ? 'cover' : undefined,
      boxShadow: 'inset 0 0 3px rgba(0, 0, 0, 0.05)',
    };
  };

  // 添加画布区域的拖放处理
  const [{ isOver: isCanvasOver }, dropCanvas] = useDrop({
    accept: COMPONENT_ITEM_TYPE,
    drop: (item: any, monitor) => {
      // 如果是新组件（从面板拖入）并且没有被子组件处理
      if (item.componentType && !item.id && !monitor.didDrop()) {
        handleDropNewComponent(item);
        return { handled: true };
      }
      return undefined;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true })
    })
  });

  // 添加画布为空时的放置区
  const [, dropEmptyArea] = useDrop({
    accept: COMPONENT_ITEM_TYPE,
    drop: (item: any) => {
      if (item.componentType) {
        handleDropNewComponent(item);
        return { handled: true };
      }
    }
  });

  // 设置空画布区域的ref
  useEffect(() => {
    if (emptyAreaRef.current) {
      dropEmptyArea(emptyAreaRef.current);
    }
  }, [dropEmptyArea]);

  return (
    <div className="canvas-container">
      <div 
        ref={(node) => {
          containerRef.current = node;
          dropCanvas(node);
        }}
        className="canvas-content"
        style={{
          width: canvasSize.width,
          minHeight: canvasSize.height,
          margin: '0 auto',
          backgroundColor: '#fff',
          position: 'relative',
          ...getBackgroundStyle(),
          border: isCanvasOver ? '2px dashed #1890ff' : undefined,
          transition: 'border-color 0.3s'
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
              onDropNewComponent={handleDropNewComponentAtPosition}
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
            <div 
              ref={emptyAreaRef}
              style={{ height: `${canvasSize.height}px` }} 
              className="flex items-center justify-center text-center text-gray-400"
            >
              <p>从左侧拖入组件到这里</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Canvas; 