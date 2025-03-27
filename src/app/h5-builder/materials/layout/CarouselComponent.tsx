import React from 'react';
import { ComponentType } from '../../components/types';

export function CarouselComponent({ component }: { component: ComponentType }) {
  return (
    <div className="w-full bg-gray-100 rounded-lg overflow-hidden" style={{ ...component.props.style }}>
      <div className="relative h-40">
        {/* 模拟轮播图指示器 */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
          {Array.from({ length: component.props.images?.length || 3 }).map((_, i) => (
            <div 
              key={i} 
              className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-blue-500' : 'bg-gray-300'}`}
            />
          ))}
        </div>
        
        {/* 示例图片 */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-700">轮播图组件</div>
            <div className="text-xs text-gray-500 mt-1">
              {component.props.images?.length || 3}张图片
            </div>
          </div>
        </div>
        
        {/* 左右箭头 */}
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white/70 rounded-full flex items-center justify-center cursor-pointer">
          <span className="text-gray-700">←</span>
        </div>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white/70 rounded-full flex items-center justify-center cursor-pointer">
          <span className="text-gray-700">→</span>
        </div>
      </div>
    </div>
  );
} 