import React from 'react';
import { ComponentType } from '../../components/types';

export function SocialShareComponent({ component }: { component: ComponentType }) {
  return (
    <div style={{ ...component.props.style }}>
      <h3 className="font-medium mb-2 text-center">{component.props.title || '分享给好友'}</h3>
      <div className="flex justify-center gap-4 my-3">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white text-2xl mb-1">
            <span>微信</span>
          </div>
          <div className="text-xs">微信</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl mb-1">
            <span>QQ</span>
          </div>
          <div className="text-xs">QQ</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white text-2xl mb-1">
            <span>微博</span>
          </div>
          <div className="text-xs">微博</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white text-2xl mb-1">
            <span>链接</span>
          </div>
          <div className="text-xs">复制链接</div>
        </div>
      </div>
      {component.props.description && (
        <div className="text-center text-sm text-gray-500 mt-2">{component.props.description}</div>
      )}
    </div>
  );
} 