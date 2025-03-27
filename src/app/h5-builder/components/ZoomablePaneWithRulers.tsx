'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Button } from 'antd';
import { MinusOutlined, PlusOutlined, DragOutlined, ExpandOutlined } from '@ant-design/icons';
import { useAtom } from 'jotai';
import {
  zoomAtom,
  canvasPositionAtom,
} from '@/src/app/h5-builder/store/atoms';
import { CANVAS_DEFAULTS, PANEL_CONFIG } from '../utils/constants';

interface ZoomablePaneWithRulersProps {
  children: React.ReactNode;
  isPropertyPanelOpen?: boolean;
}

const DEFAULT_CANVAS_POSITION  = { x:350, y: 50 };

const ZoomablePaneWithRulers: React.FC<ZoomablePaneWithRulersProps> = ({
  children,
  isPropertyPanelOpen = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rulerHorizontalRef = useRef<HTMLDivElement>(null);
  const rulerVerticalRef = useRef<HTMLDivElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);
  
  const [canvasPosition, setCanvasPosition] = useAtom(canvasPositionAtom);
  const [zoom, setZoom] = useAtom(zoomAtom);
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
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
    e.stopPropagation();
    
    // 检查点击是否在画布区域外
    const isOutsideCanvas = !canvasWrapperRef.current?.contains(e.target as Node);
    
    // 只有在画布区域外点击时才允许拖动
    if (e.button === 0 && isOutsideCanvas) {
      e.preventDefault();
      
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      
      if (containerRef.current) {
        containerRef.current.style.cursor = 'grabbing';
      }
      
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
    if (zoom < CANVAS_DEFAULTS.MAX_ZOOM) {
      const newZoom = Math.min(CANVAS_DEFAULTS.MAX_ZOOM, zoom + CANVAS_DEFAULTS.ZOOM_STEP);
      setZoom?.(newZoom);
    }
  };
  
  const handleZoomOut = () => {
    if (zoom > CANVAS_DEFAULTS.MIN_ZOOM) {
      const newZoom = Math.max(CANVAS_DEFAULTS.MIN_ZOOM, zoom - CANVAS_DEFAULTS.ZOOM_STEP);
      setZoom?.(newZoom);
    }
  };
  
  const handleZoomReset = () => {
    setZoom?.(CANVAS_DEFAULTS.DEFAULT_ZOOM);
  };

  // 计算缩放控制面板的位置
  const zoomControlPosition = useMemo(() => {
    if (isPropertyPanelOpen) {
      return { right: `${PANEL_CONFIG.PROPERTY_PANEL.WIDTH + PANEL_CONFIG.PROPERTY_PANEL.MARGIN}px` };
    } else {
      return { right: `${PANEL_CONFIG.PROPERTY_PANEL.MARGIN}px` };
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
            backgroundSize: CANVAS_DEFAULTS.BACKGROUND.SIZE,
            backgroundImage: CANVAS_DEFAULTS.BACKGROUND.IMAGE,
            backgroundColor: CANVAS_DEFAULTS.BACKGROUND.COLOR,
            cursor: isDragging ? 'grabbing' : 'default',
            padding: `${CANVAS_DEFAULTS.PADDING}px`
          }}
          onMouseDown={handleMouseDown}
        >
          {/* 内容区域 - 适当缩小区域尺寸，防止过度滚动 */}
          <div className="relative" style={{ 
            width: `${CANVAS_DEFAULTS.CONTAINER_SIZE.width}px`, 
            height: `${CANVAS_DEFAULTS.CONTAINER_SIZE.height}px` 
          }}>
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
            icon={<ExpandOutlined />} 
            shape="circle" 
            size="small"
            className='mx-3'
            onClick={() => {
              setCanvasPosition(DEFAULT_CANVAS_POSITION);
              handleZoomReset();
            }}
            title="重置"
          />
          <Button 
            onClick={handleZoomReset}
            size="small"
            className="font-mono mr-3"
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