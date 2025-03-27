import React from 'react';
import { ComponentType } from '../../types';

export function VideoComponent({ component }: { component: ComponentType }) {
  return (
    <div style={{ ...component.props.style }} className="video-container">
      <div className="aspect-video rounded-lg overflow-hidden">
        {component.props.src ? (
          <video
            controls
            src={component.props.src}
            poster={component.props.poster}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          >
            您的浏览器不支持视频播放
          </video>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-center p-4">
              <div className="text-4xl mb-2">🎬</div>
              <div className="text-sm text-gray-500">视频播放器</div>
              <div className="text-xs text-gray-400 mt-1">
                {component.props.title || '请添加视频地址'}
              </div>
            </div>
          </div>
        )}
      </div>
      {component.props.title && (
        <div className="text-sm mt-2 text-center">{component.props.title}</div>
      )}
    </div>
  );
} 