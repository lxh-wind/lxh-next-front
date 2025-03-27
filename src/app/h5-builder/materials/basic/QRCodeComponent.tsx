import React from 'react';
import { ComponentType } from '../../components/types';

export function QRCodeComponent({ component }: { component: ComponentType }) {
  return (
    <div style={{ ...component.props.style }} className="text-center">
      <h3 className="font-medium mb-2">{component.props.title || '扫码关注'}</h3>
      <div className="p-4 bg-white inline-block rounded-lg shadow-sm mb-2">
        {/* 二维码占位 */}
        <div className="w-32 h-32 bg-gray-100 p-2 rounded flex items-center justify-center">
          <div className="w-24 h-24 bg-gray-200 grid grid-cols-4 grid-rows-4 gap-1 p-1">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className={`${Math.random() > 0.5 ? 'bg-gray-800' : 'bg-transparent'}`}></div>
            ))}
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600">{component.props.description || '扫描二维码，获取更多信息'}</p>
    </div>
  );
} 