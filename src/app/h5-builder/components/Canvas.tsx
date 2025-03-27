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
import { DragOutlined } from '@ant-design/icons';

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
  const [pageInfo] = useAtom(pageInfoAtom);
  const [components] = useAtom(componentsAtom);
  const isFreeModeActive = pageInfo.layoutMode === 'free';
  
  // 获取当前组件
  const component = components.find(comp => comp.id === id);
  
  const [{ isDragging }, drag] = useDrag({
    type: COMPONENT_ITEM_TYPE,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    // 自由布局模式下，禁用拖拽排序功能
    canDrag: !isFreeModeActive
  });

  const [{ isOver }, drop] = useDrop({
    accept: COMPONENT_ITEM_TYPE,
    drop: (item: any) => {
      // 如果不是自由布局模式，才处理组件间拖拽
      if (!isFreeModeActive) {
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
      }
    },
    hover: (item: any, monitor) => {
      // 自由布局模式下不处理拖拽hover
      if (isFreeModeActive) return;
      
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
    position: 'relative' as const,
    backgroundColor: isOver && !isFreeModeActive ? 'rgba(0, 0, 255, 0.05)' : undefined,
    borderTop: isOver && !isFreeModeActive ? '2px dashed #aaa' : undefined
  };
  
  // 只在非自由布局模式下应用拖拽功能
  if (!isFreeModeActive) {
    drag(drop(ref));
  } else {
    // 自由布局模式下，只应用drop功能用于接收新组件
    drop(ref);
  }
  
  return (
    <div ref={ref} style={style} className="component-item w-full" data-index={index}>
      {children}
    </div>
  );
};

// 自由布局模式下的拖拽句柄组件接口
interface DragHandleProps {
  onDragStart?: () => void;
  onDragEnd?: (offset: { x: number, y: number }) => void;
}

// 自由布局模式下的拖拽句柄组件
const DragHandle: React.FC<DragHandleProps> = ({ onDragStart, onDragEnd }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setOffset({ x: 0, y: 0 });
    
    if (onDragStart) {
      onDragStart();
    }
    
    // 阻止事件冒泡，防止触发其他点击事件
    e.stopPropagation();
  };
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newOffset = {
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y
      };
      
      setOffset(newOffset);
    };
    
    const handleMouseUp = () => {
      if (!isDragging) return;
      
      setIsDragging(false);
      
      if (onDragEnd) {
        onDragEnd(offset);
      }
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startPos, offset, onDragEnd]);
  
  return (
    <div 
      className="absolute top-0 right-0 z-20 w-6 h-6 flex items-center justify-center bg-blue-500 text-white cursor-move opacity-70 hover:opacity-100 rounded-bl-md"
      onMouseDown={handleMouseDown}
      style={{ 
        transform: isDragging ? `translate(${offset.x}px, ${offset.y}px)` : 'none',
      }}
    >
      <DragOutlined />
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
    const bgStyle: React.CSSProperties = {};
    
    // 处理背景颜色或背景图片
    if (pageInfo.bgMode === 'color') {
      bgStyle.backgroundColor = pageInfo.bgColor || '#ffffff';
    } else if (pageInfo.bgMode === 'image' && pageInfo.bgImage) {
      bgStyle.backgroundImage = `url(${pageInfo.bgImage})`;
      bgStyle.backgroundRepeat = pageInfo.bgRepeat || 'no-repeat';
      bgStyle.backgroundSize = pageInfo.bgRepeat === 'no-repeat' ? 'cover' : undefined;
    } else if (pageInfo.bgMode === 'gradient') {
      bgStyle.background = pageInfo.bgColor; // 渐变色字符串存储在bgColor中
    } else {
      // 默认背景色
      bgStyle.backgroundColor = '#ffffff';
    }
    
    return bgStyle;
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

  // 更新组件位置（自由布局模式）
  const handleUpdateComponentPosition = useCallback((id: string, newPosition: any) => {
    const updatedComponents = components.map(comp => {
      if (comp.id === id) {
        return {
          ...comp,
          position: {
            ...comp.position,
            ...newPosition
          }
        };
      }
      return comp;
    });
    
    // 更新历史状态
    const newPast = [...history.past, components];
    
    setHistory({
      past: newPast,
      present: updatedComponents,
      future: [],
    });
    
    setHistoryIndex(historyIndex + 1);
    setCanUndo(newPast.length > 0);
    setCanRedo(false);
    
    // 更新组件状态
    setComponents(updatedComponents);
  }, [components, history, historyIndex, setComponents, setHistory, setHistoryIndex, setCanUndo, setCanRedo]);

  // 处理组件拖拽结束事件（自由布局模式）
  const handleComponentDragEnd = useCallback((id: string, position: { top: number, left: number }) => {
    if (pageInfo.layoutMode === 'free') {
      handleUpdateComponentPosition(id, position);
    }
  }, [pageInfo.layoutMode, handleUpdateComponentPosition]);

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
          position: 'relative',
          boxShadow: 'inset 0 0 3px rgba(0, 0, 0, 0.05)',
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
          className={`w-full relative ${pageInfo.layoutMode === 'free' ? 'h-full' : ''}`}
          style={{ 
            padding: pageInfo.containerPadding,
            minHeight: pageInfo.layoutMode === 'free' ? canvasSize.height : 'auto'
          }}
        >
          {components.map((component, index) => (
            <DraggableComponent 
              key={component.id} 
              id={component.id} 
              index={index}
              moveItem={handleUpdateComponentsOrder}
              onDropNewComponent={handleDropNewComponentAtPosition}
            >
              <div 
                style={{ 
                  marginBottom: pageInfo.layoutMode === 'auto' && index < components.length - 1 ? pageInfo.componentGap : 0,
                  position: pageInfo.layoutMode === 'free' ? 'absolute' : 'relative',
                  top: pageInfo.layoutMode === 'free' ? component.position?.top || 0 : 'auto',
                  left: pageInfo.layoutMode === 'free' ? component.position?.left || 0 : 'auto',
                  width: pageInfo.layoutMode === 'free' ? component.position?.width || '100%' : '100%',
                  zIndex: pageInfo.layoutMode === 'free' ? component.position?.zIndex || index + 1 : 'auto',
                }}
                className={`${pageInfo.layoutMode === 'free' ? 'cursor-move relative' : ''}`}
              >
                {/* 自由布局模式下显示拖拽手柄 */}
                {pageInfo.layoutMode === 'free' && selectedId === component.id && (
                  <DragHandle 
                    onDragStart={() => {}}
                    onDragEnd={(offset: { x: number, y: number }) => {
                      // 计算新位置
                      const newPosition = {
                        top: (component.position?.top || 0) + offset.y,
                        left: (component.position?.left || 0) + offset.x
                      };
                      handleUpdateComponentPosition(component.id, newPosition);
                    }}
                  />
                )}
                
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
                  layoutMode={pageInfo.layoutMode}
                />
              </div>
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