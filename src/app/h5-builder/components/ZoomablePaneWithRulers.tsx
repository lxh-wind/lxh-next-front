'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

interface ZoomablePaneWithRulersProps {
  children: React.ReactNode;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

const ZoomablePaneWithRulers: React.FC<ZoomablePaneWithRulersProps> = ({
  children,
  zoom = 100,
  onZoomChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rulerHorizontalRef = useRef<HTMLDivElement>(null);
  const rulerVerticalRef = useRef<HTMLDivElement>(null);
  
  // 绘制刻度尺
  useEffect(() => {
    if (rulerHorizontalRef.current && rulerVerticalRef.current) {
      drawRulers();
    }
  }, [zoom]);

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

    // 水平刻度
    for (let i = 0; i <= 1200; i += 10) {
      const tick = document.createElement('div');
      tick.className = 'absolute top-0 border-l border-gray-400';
      tick.style.left = `${i}px`;
      
      if (i % 100 === 0) {
        // 大刻度
        tick.style.height = '14px';
        const label = document.createElement('div');
        label.className = 'text-[8px] text-gray-600 absolute';
        label.style.top = '14px';
        label.style.left = '2px';
        label.innerText = `${i}`;
        tick.appendChild(label);
      } else if (i % 50 === 0) {
        // 中刻度
        tick.style.height = '10px';
      } else {
        // 小刻度
        tick.style.height = '6px';
      }
      
      hRuler.appendChild(tick);
    }
    
    // 垂直刻度
    for (let i = 0; i <= 1200; i += 10) {
      const tick = document.createElement('div');
      tick.className = 'absolute left-0 border-t border-gray-400';
      tick.style.top = `${i}px`;
      
      if (i % 100 === 0) {
        // 大刻度
        tick.style.width = '14px';
        const label = document.createElement('div');
        label.className = 'text-[8px] text-gray-600 absolute rotate-90 origin-top-left';
        label.style.left = '14px';
        label.style.top = '0px';
        label.innerText = `${i}`;
        tick.appendChild(label);
      } else if (i % 50 === 0) {
        // 中刻度
        tick.style.width = '10px';
      } else {
        // 小刻度
        tick.style.width = '6px';
      }
      
      vRuler.appendChild(tick);
    }
  };

  // 缩放控制
  const handleZoomIn = () => {
    if (zoom < 200) {
      onZoomChange?.(zoom + 10);
    }
  };
  
  const handleZoomOut = () => {
    if (zoom > 30) {
      onZoomChange?.(zoom - 10);
    }
  };
  
  const handleZoomReset = () => {
    onZoomChange?.(100);
  };

  return (
    <div className="relative flex flex-col h-full">
      {/* 水平刻度尺 */}
      <div className="relative h-6 ml-6 border-b border-gray-300 bg-gray-50 z-10">
        <div
          ref={rulerHorizontalRef}
          className="absolute top-0 left-0 h-full w-full overflow-hidden"
        ></div>
      </div>
      
      <div className="flex flex-1 min-h-0">
        {/* 垂直刻度尺 */}
        <div className="relative w-6 border-r border-gray-300 bg-gray-50 z-10">
          <div
            ref={rulerVerticalRef}
            className="absolute top-0 left-0 h-full w-full overflow-hidden"
          ></div>
        </div>
        
        {/* 画布容器 */}
        <div 
          ref={containerRef}
          className="flex-1 p-8 overflow-auto relative bg-gray-100 min-h-0"
          style={{ overflowX: 'auto', overflowY: 'auto' }}
        >
          <div 
            className="relative inline-block origin-top-left"
            style={{ 
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top left'
            }}
          >
            {children}
          </div>
        </div>
        
        {/* 缩放控制 */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-white rounded-lg shadow-md p-1 z-20">
          <Button 
            icon={<PlusOutlined />} 
            shape="circle" 
            size="small" 
            onClick={handleZoomIn}
          />
          <Button 
            onClick={handleZoomReset}
            size="small"
            className="font-mono"
          >
            {zoom}%
          </Button>
          <Button 
            icon={<MinusOutlined />} 
            shape="circle" 
            size="small" 
            onClick={handleZoomOut}
          />
        </div>
      </div>
    </div>
  );
};

export default ZoomablePaneWithRulers; 