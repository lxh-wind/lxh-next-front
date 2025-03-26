'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Button } from 'antd';
import { MinusOutlined, PlusOutlined, DragOutlined, ExpandOutlined } from '@ant-design/icons';

interface ZoomablePaneWithRulersProps {
  children: React.ReactNode;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  isPropertyPanelOpen?: boolean;
}

const ZoomablePaneWithRulers: React.FC<ZoomablePaneWithRulersProps> = ({
  children,
  zoom = 100,
  onZoomChange,
  isPropertyPanelOpen = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rulerHorizontalRef = useRef<HTMLDivElement>(null);
  const rulerVerticalRef = useRef<HTMLDivElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);
  
  // 拖拽状态
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // 画布位置状态
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  
  // 实际画布尺寸，用于计算居中位置
  const [canvasSize, setCanvasSize] = useState({ width: 375, height: 667 });
  
  // 添加拖拽提示状态
  const [dragMessage, setDragMessage] = useState('按住鼠标拖拽画布 (可滚动查看更多)');
  
  // 获取并存储真实画布尺寸
  const updateCanvasSize = () => {
    setTimeout(() => {
      if (childrenRef.current) {
        // 获取子元素的实际尺寸
        const rect = childrenRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          // 存储原始尺寸（不考虑缩放）
          const width = rect.width;
          const height = rect.height;
          console.log('Real canvas size:', width, height);
          setCanvasSize({ width, height });
        }
      }
    }, 100);
  };

  // 初次渲染时获取画布尺寸
  useEffect(() => {
    updateCanvasSize();
  }, []);

  // 只在子元素变化时更新尺寸
  useEffect(() => {
    updateCanvasSize();
  }, [children]); // 移除 zoom 依赖
  
  // 绘制刻度尺
  useEffect(() => {
    if (rulerHorizontalRef.current && rulerVerticalRef.current) {
      drawRulers();
    }
  }, [zoom]);
  
  // 处理鼠标按下事件 - 开始拖拽
  const handleMouseDown = (e: React.MouseEvent) => {
    // 阻止事件冒泡，以防止触发Canvas内部组件选择
    e.stopPropagation(); 
    
    // 判断是否点击在画布外的背景区域
    const isBackground = 
      e.currentTarget === e.target || 
      (e.currentTarget.contains(e.target as Node) && 
       !(e.target as HTMLElement).closest('.component-item') &&
       !(e.target as HTMLElement).closest('.mobile-container'));
      
    if (e.button === 0 && isBackground) {
      e.preventDefault(); // 阻止默认行为
      
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      
      // 修改鼠标样式
      if (containerRef.current) {
        containerRef.current.style.cursor = 'grabbing';
      }
      
      // 更新拖拽提示
      setDragMessage('正在移动画布...');
    }
  };
  
  // 处理鼠标移动事件 - 更新拖拽位置
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      // 计算拖拽距离
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      // 更新画布位置
      setCanvasPosition(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      // 更新拖拽起点为当前鼠标位置
      setDragStart({ x: e.clientX, y: e.clientY });
      
      e.preventDefault();
    }
  };
  
  // 处理鼠标松开事件 - 结束拖拽
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      
      // 恢复鼠标样式
      if (containerRef.current) {
        containerRef.current.style.cursor = 'grab';
      }
      
      // 恢复拖拽提示
      setDragMessage('按住鼠标拖拽画布 (可滚动查看更多)');
    }
  };
  
  // 重置画布位置到中心
  const handleCenterCanvas = () => {
    if (containerRef.current) {
      // 计算容器的可视区域
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      // 计算画布应该位于的中心位置 - 使用实际画布尺寸
      const centerX = Math.max(0, (containerWidth - canvasSize.width * (zoom / 100)) / 2);
      const centerY = Math.max(0, (containerHeight - canvasSize.height * (zoom / 100)) / 2);
      
      console.log('Centering canvas:', centerX, centerY);
      
      // 设置画布位置
      setCanvasPosition({
        x: centerX,
        y: centerY
      });
      
      // 重置滚动位置
      containerRef.current.scrollLeft = 0;
      containerRef.current.scrollTop = 0;
      
      // 添加动画过渡效果
      if (canvasWrapperRef.current) {
        canvasWrapperRef.current.style.transition = 'all 0.3s ease-in-out';
        
        // 恢复原始transition设置
        setTimeout(() => {
          if (canvasWrapperRef.current) {
            canvasWrapperRef.current.style.transition = isDragging ? 'none' : 'all 0.1s ease';
          }
        }, 300);
      }
    }
  };
  
  // 监听全局鼠标事件
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  // 绘制水平和垂直刻度尺
  const drawRulers = () => {
    if (!rulerHorizontalRef.current || !rulerVerticalRef.current) return;
    
    const hRuler = rulerHorizontalRef.current;
    const vRuler = rulerVerticalRef.current;
    
    // 清除之前的刻度
    while (hRuler.firstChild) {
      hRuler.removeChild(hRuler.firstChild);
    }
    
    while (vRuler.firstChild) {
      vRuler.removeChild(vRuler.firstChild);
    }

    // 计算缩放比例下的刻度间距
    const scaleStep = 10;
    const scaleFactor = zoom / 100;
    
    // 添加原点指示器（0,0位置）
    const origin = document.createElement('div');
    origin.className = 'absolute top-0 left-0 w-6 h-6 bg-white z-20 flex items-center justify-center text-gray-400';
    origin.style.left = '0px';
    origin.style.top = '0px';
    origin.textContent = '0';
    hRuler.parentElement?.appendChild(origin);
    
    // 生成水平刻度
    for (let i = 0; i <= 3000; i += scaleStep) {
      const scaledPos = i * scaleFactor;
      const tick = document.createElement('div');
      
      // 主要刻度（每50像素）
      if (i % 50 === 0) {
        tick.className = 'absolute top-0 h-full border-r border-gray-200';
        tick.style.left = `${scaledPos}px`;
        
        // 添加刻度值
        const label = document.createElement('div');
        label.className = 'absolute top-0 text-xs text-gray-400';
        label.style.left = `${scaledPos + 2}px`;
        label.textContent = i.toString();
        hRuler.appendChild(label);
      } 
      // 中等刻度（每10像素）
      else if (i % 10 === 0) {
        tick.className = 'absolute top-0 h-3 border-r border-gray-100';
        tick.style.left = `${scaledPos}px`;
      }
      
      hRuler.appendChild(tick);
    }
    
    // 生成垂直刻度
    for (let i = 0; i <= 3000; i += scaleStep) {
      const scaledPos = i * scaleFactor;
      const tick = document.createElement('div');
      
      // 主要刻度（每50像素）
      if (i % 50 === 0) {
        tick.className = 'absolute left-0 w-full border-b border-gray-200';
        tick.style.top = `${scaledPos}px`;
        
        // 添加刻度值
        const label = document.createElement('div');
        label.className = 'absolute left-0 text-xs text-gray-400';
        label.style.top = `${scaledPos + 2}px`;
        label.textContent = i.toString();
        vRuler.appendChild(label);
      } 
      // 中等刻度（每10像素）
      else if (i % 10 === 0) {
        tick.className = 'absolute left-0 w-3 border-b border-gray-100';
        tick.style.top = `${scaledPos}px`;
      }
      
      vRuler.appendChild(tick);
    }
  };

  // 缩放控制
  const handleZoomIn = () => {
    if (zoom < 200) {
      const newZoom = Math.min(200, zoom + 20);
      onZoomChange?.(newZoom);
    }
  };
  
  const handleZoomOut = () => {
    if (zoom > 30) {
      const newZoom = Math.max(30, zoom - 20);
      onZoomChange?.(newZoom);
    }
  };
  
  const handleZoomReset = () => {
    onZoomChange?.(100);
  };

  // 计算缩放控制面板的位置，根据右侧面板状态调整
  const zoomControlPosition = useMemo(() => {
    // 如果右侧面板打开，将缩放控制向左移动
    if (isPropertyPanelOpen) {
      return { right: '324px' }; // 右侧面板宽度 (300px) + 额外间距 (24px)
    } else {
      return { right: '24px' }; // 正常位置
    }
  }, [isPropertyPanelOpen]);

  return (
    <div className="relative flex flex-col h-full">
      {/* 水平刻度尺 */}
      <div className="relative h-6 ml-6 bg-white z-10">
        <div
          ref={rulerHorizontalRef}
          className="absolute top-0 left-0 h-full w-full overflow-hidden"
        ></div>
      </div>
      
      <div className="flex flex-1 min-h-0">
        {/* 垂直刻度尺 */}
        <div className="relative w-6 bg-white z-10">
          <div
            ref={rulerVerticalRef}
            className="absolute top-0 left-0 h-full w-full overflow-hidden"
          ></div>
        </div>
        
        {/* 画布容器 - 改为auto允许滚动 */}
        <div 
          ref={containerRef}
          className="flex-1 relative min-h-0 overflow-auto"
          style={{ 
            backgroundSize: '20px 20px',
            backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.01) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.01) 1px, transparent 1px)',
            backgroundColor: '#f9fafc',
            cursor: isDragging ? 'grabbing' : 'grab',
            padding: '24px' // 添加内边距，使内容不贴边
          }}
          onMouseDown={handleMouseDown}
        >
          {/* 内容区域 - 适当缩小区域尺寸，防止过度滚动 */}
          <div className="relative" style={{ width: '2000px', height: '2000px' }}>
            {/* 画布视窗 - 可自由拖拽移动 */}
            <div 
              ref={canvasWrapperRef}
              className="absolute z-10"
              style={{
                left: `${canvasPosition.x}px`,
                top: `${canvasPosition.y}px`,
                transition: isDragging ? 'none' : 'all 0.1s ease'
              }}
            >
              <div 
                ref={childrenRef}
                className="relative inline-block origin-top-left"
                style={{ 
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'top left',
                  margin: '0',
                  borderRadius: '4px',
                  filter: 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.05))'
                }}
              >
                {children}
              </div>
            </div>
          </div>
          
          {/* 拖拽提示 */}
          <div className="fixed bottom-4 left-4 bg-white bg-opacity-80 text-gray-700 text-xs px-3 py-2 rounded-md flex items-center shadow-sm z-20">
            <DragOutlined className="mr-2" /> {dragMessage}
          </div>
        </div>
        
        {/* 缩放控制 - 动态调整位置 */}
        <div 
          className="fixed bottom-4 bg-white rounded-lg shadow-md p-1 z-20 transition-all duration-300"
          style={{ 
            ...zoomControlPosition,
            transitionProperty: 'right' 
          }}
        >
          <Button 
            icon={<PlusOutlined />} 
            shape="circle" 
            size="small" 
            onClick={handleZoomIn}
            title="放大 (+20%)"
          />
          <Button 
            onClick={handleZoomReset}
            size="small"
            className="font-mono my-1 mx-3"
            title="重置缩放"
          >
            {zoom}%
          </Button>
          <Button 
            icon={<MinusOutlined />} 
            shape="circle" 
            size="small" 
            onClick={handleZoomOut}
            title="缩小 (-20%)"
          />
        </div>
      </div>
    </div>
  );
};

export default ZoomablePaneWithRulers; 