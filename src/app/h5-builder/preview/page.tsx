'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Empty, Spin, Result, Select } from 'antd';
import { MobileOutlined } from '@ant-design/icons';
import { useSearchParams } from 'next/navigation';
import { ComponentType } from '../components/types';
import dynamic from 'next/dynamic';

// 动态导入组件渲染器，避免SSR问题
const DynamicComponentRenderer = dynamic(
  () => import('../materials/ComponentRenderer').then(mod => ({ 
    default: (props: {component: ComponentType}) => mod.renderComponentContent(props.component)
  })),
  { ssr: false }
);

// 设备类型及尺寸定义
const deviceTypes = {
  iphone13: { name: 'iPhone 13', width: 390, height: 844, scale: 0.9 },
  iphone13mini: { name: 'iPhone 13 Mini', width: 375, height: 812, scale: 0.85 },
  iphone13pro: { name: 'iPhone 13 Pro', width: 390, height: 844, scale: 0.9 },
  iphone13promax: { name: 'iPhone 13 Pro Max', width: 428, height: 926, scale: 0.95 },
  android: { name: '通用安卓', width: 360, height: 740, scale: 0.85 },
  none: { name: '无边框', width: 390, height: 844, scale: 1 }
};

// 创建一个客户端组件来处理搜索参数
function PreviewContent() {
  const searchParams = useSearchParams();
  const [components, setComponents] = useState<ComponentType[]>([]);
  const [pageInfo, setPageInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deviceType, setDeviceType] = useState<string>('iphone13');

  useEffect(() => {
    // 尝试从会话存储中获取预览数据
    try {
      const previewDataStr = sessionStorage.getItem('h5_preview_data');
      
      if (previewDataStr) {
        const parsedData = JSON.parse(previewDataStr);
        setComponents(parsedData.components || []);
        // 提取页面信息
        const { components, ...pageInfoData } = parsedData;
        setPageInfo(pageInfoData);
        setError(null);
      } else {
        // 如果没有找到会话存储中的数据，尝试从URL参数获取预览数据
        const dataParam = searchParams?.get('data');
        
        if (dataParam) {
          try {
            const decodedData = decodeURIComponent(dataParam);
            const parsedData = JSON.parse(decodedData);
            setComponents(parsedData.components || []);
            // 提取页面信息
            const { components, ...pageInfoData } = parsedData;
            setPageInfo(pageInfoData);
            setError(null);
          } catch (error) {
            console.error('Failed to parse preview data from URL:', error);
            setError('预览数据解析失败');
          }
        } else {
          setError('未提供预览数据');
        }
      }
    } catch (error) {
      console.error('Failed to parse preview data from sessionStorage:', error);
      setError('预览数据加载失败');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  // 生成背景样式
  const getBackgroundStyle = () => {
    const style: React.CSSProperties = {};
    
    if (pageInfo.bgMode === 'color') {
      style.backgroundColor = pageInfo.bgColor || '#FFFFFF';
    } else if (pageInfo.bgMode === 'image' && pageInfo.bgImage) {
      style.backgroundImage = `url(${pageInfo.bgImage})`;
      style.backgroundSize = 'cover';
      style.backgroundRepeat = pageInfo.bgRepeat || 'no-repeat';
      style.backgroundPosition = 'center';
    } else if (pageInfo.bgMode === 'gradient') {
      // 如果有渐变背景的支持，可以在这里添加
      style.backgroundColor = pageInfo.bgColor || '#FFFFFF';
    } else {
      style.backgroundColor = '#FFFFFF'; // 默认背景色
    }
    
    // 添加内边距和组件间距
    if (typeof pageInfo.containerPadding === 'number') {
      style.padding = `${pageInfo.containerPadding}px`;
    }
    
    return style;
  };

  const handleDeviceChange = (value: string) => {
    setDeviceType(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" tip="加载预览..." />
      </div>
    );
  }

  if (error) {
    return (
      <Result
        status="warning"
        title="预览失败"
        subTitle={error}
      />
    );
  }

  const currentDevice = deviceTypes[deviceType as keyof typeof deviceTypes];

  return (
    <div className="preview-container bg-gray-100 min-h-screen">
      {/* 顶部操作栏 */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md px-4 py-2 z-10 flex justify-between items-center">
        <div className="text-lg font-medium">页面预览</div>
        <div className="flex items-center">
          <MobileOutlined className="mr-2" />
          <Select 
            value={deviceType}
            onChange={handleDeviceChange}
            style={{ width: 150 }}
            options={Object.entries(deviceTypes).map(([key, device]) => ({
              value: key,
              label: device.name
            }))}
          />
        </div>
      </div>
      
      {/* 预览内容 */}
      <div className="pt-16 pb-8 flex justify-center items-start">
        {deviceType !== 'none' ? (
          <div className="phone-container relative" style={{ transform: `scale(${currentDevice.scale})` }}>
            {/* iPhone 外框 */}
            <div 
              className="phone-frame bg-black rounded-[60px] shadow-xl overflow-hidden relative"
              style={{ 
                width: `${currentDevice.width + 20}px`, 
                height: `${currentDevice.height + 20}px`,
                padding: '10px'
              }}
            >
              {/* 刘海区域 */}
              <div className="notch absolute w-[150px] h-[30px] bg-black rounded-b-[14px] z-20 left-1/2 top-0 -translate-x-1/2"></div>
              
              {/* 屏幕 */}
              <div 
                className="phone-screen overflow-hidden w-full h-full rounded-[50px] relative z-10"
                style={{
                  width: `${currentDevice.width}px`,
                  height: `${currentDevice.height}px`,
                }}
              >
                {/* 状态栏 */}
                <div className="status-bar h-[44px] flex justify-between items-center px-6 bg-black bg-opacity-0 text-black font-medium text-sm z-20">
                  <div>{new Date().getHours()}:{String(new Date().getMinutes()).padStart(2, '0')}</div>
                  <div className="flex items-center space-x-1">
                    <span>●</span>
                    <span>●</span>
                    <span>●</span>
                    <span>●</span>
                  </div>
                </div>
                
                {/* 内容区域 */}
                <div 
                  className="phone-content overflow-y-auto"
                  style={{ 
                    height: `${currentDevice.height - 44}px`,
                    ...getBackgroundStyle() 
                  }}
                >
                  {components.length === 0 ? (
                    <Empty description="没有可预览的内容" />
                  ) : (
                    components.map((component) => (
                      <div 
                        key={component.id} 
                        className="component-item"
                        style={pageInfo.componentGap ? { marginBottom: `${pageInfo.componentGap}px` } : {}}
                      >
                        <DynamicComponentRenderer component={component} />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div 
            className="preview-content max-w-md mx-auto min-h-screen"
            style={{ 
              width: `${currentDevice.width}px`,
              ...getBackgroundStyle() 
            }}
          >
            {components.length === 0 ? (
              <Empty description="没有可预览的内容" />
            ) : (
              components.map((component) => (
                <div 
                  key={component.id} 
                  className="mb-4"
                  style={pageInfo.componentGap ? { marginBottom: `${pageInfo.componentGap}px` } : {}}
                >
                  <DynamicComponentRenderer component={component} />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// 主页面组件使用 Suspense 包裹 PreviewContent
export default function PreviewPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" tip="加载中..." />
      </div>
    }>
      <PreviewContent />
    </Suspense>
  );
} 