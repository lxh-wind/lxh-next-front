import React from 'react';
import { ComponentType } from '../../components/types';

export function ProductListComponent({ component }: { component: ComponentType }) {
  const viewMode = (component.props as any).viewMode || 'grid';
  const columns = (component.props as any).columns || 2;
  
  return (
    <div className="w-full bg-gray-50 p-3 rounded-md" style={{ ...component.props.style }}>
      {component.props.title && (
        <div className="text-base font-medium mb-3 flex justify-between items-center">
          <div>{component.props.title}</div>
          <div className="text-xs text-gray-500">查看更多 &gt;</div>
        </div>
      )}
      
      {viewMode === 'grid' && (
        <div className={`grid grid-cols-${columns} gap-2`}>
          {[1, 2, 3, 4].map(item => (
            <div key={item} className="bg-white p-2 rounded-lg shadow-sm">
              <div className="bg-gray-100 h-24 mb-2 rounded"></div>
              <div className="text-sm font-medium truncate">精选商品名称</div>
              <div className="flex justify-between items-center mt-1">
                <div className="text-red-500 font-medium">¥ 99.00</div>
                <div className="text-xs text-gray-500">已售42件</div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {viewMode === 'list' && (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map(item => (
            <div key={item} className="bg-white p-2 rounded-lg shadow-sm flex">
              <div className="bg-gray-100 w-24 h-24 rounded flex-shrink-0"></div>
              <div className="ml-2 flex-grow">
                <div className="text-sm font-medium">精选商品名称</div>
                <div className="text-xs text-gray-500 mt-1">商品描述信息</div>
                <div className="mt-auto flex justify-between items-end">
                  <div className="text-red-500 font-medium">¥ 99.00</div>
                  <button className="bg-red-500 text-white text-xs px-2 py-1 rounded">购买</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {viewMode === 'card' && (
        <div className="overflow-x-auto">
          <div className="flex gap-3 pb-2" style={{ minWidth: 'max-content' }}>
            {[1, 2, 3, 4, 5].map(item => (
              <div key={item} className="bg-white p-2 rounded-lg shadow-sm w-36 flex-shrink-0">
                <div className="bg-gray-100 h-24 mb-2 rounded"></div>
                <div className="text-sm font-medium truncate">精选商品</div>
                <div className="text-red-500 font-medium">¥ 99.00</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 