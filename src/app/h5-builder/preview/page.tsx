'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Button, Empty, Spin, Result } from 'antd';
import { ArrowLeftOutlined, CloseOutlined } from '@ant-design/icons';
import { useSearchParams, useRouter } from 'next/navigation';
import { ComponentType } from '../components/types';
import dynamic from 'next/dynamic';


// 用于渲染不同类型组件的助手组件
const ComponentRenderer = ({ component }: { component: any }) => {
  switch (component.type) {
    case 'text':
      return <div style={component.props.style}>{component.props.content}</div>;
    
    case 'image':
      return (
        <img 
          src={component.props.src} 
          alt={component.props.alt} 
          style={{ 
            ...component.props.style,
            maxWidth: '100%'
          }} 
        />
      );
    
    case 'button':
      return (
        <button 
          type="button" 
          style={{
            ...component.props.style,
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            backgroundColor: component.props.type === 'primary' ? '#1677ff' : '#ffffff',
            color: component.props.type === 'primary' ? '#ffffff' : '#333333',
            cursor: 'pointer',
            textAlign: 'center',
            display: 'inline-block',
          }}
        >
          {component.props.text}
        </button>
      );
    
    case 'carousel':
      return (
        <div 
          style={{
            width: '100%',
            height: '200px',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...component.props.style
          }}
        >
          <div>轮播图组件（预览模式）</div>
          <div className="text-xs text-gray-500">
            {component.props.images?.length || 0}张图片
          </div>
        </div>
      );
    
    case 'productList':
      return (
        <div style={component.props.style}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: `repeat(${component.props.columns || 2}, 1fr)`,
            gap: '10px'
          }}>
            {[1, 2, 3, 4].map(item => (
              <div key={item} style={{ 
                backgroundColor: '#ffffff', 
                padding: '10px', 
                borderRadius: '4px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ 
                  height: '100px', 
                  backgroundColor: '#f5f5f5', 
                  marginBottom: '8px',
                  borderRadius: '4px'
                }}></div>
                <div style={{ fontSize: '14px' }}>商品名称</div>
                {component.props.showPrice && (
                  <div style={{ color: '#ff4d4f', fontSize: '16px', marginTop: '4px' }}>¥ 99.00</div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    
    case 'countdown':
      return (
        <div style={component.props.style}>
          <div style={{ textAlign: 'center' }}>
            <div>{component.props.title}</div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '8px', 
              margin: '10px 0' 
            }}>
              {component.props.showDays && (
                <span style={{ 
                  padding: '4px 8px', 
                  backgroundColor: '#ff4d4f', 
                  color: 'white',
                  borderRadius: '4px'
                }}>00</span>
              )}
              {component.props.showHours && (
                <>
                  <span>:</span>
                  <span style={{ 
                    padding: '4px 8px', 
                    backgroundColor: '#ff4d4f', 
                    color: 'white',
                    borderRadius: '4px'
                  }}>00</span>
                </>
              )}
              {component.props.showMinutes && (
                <>
                  <span>:</span>
                  <span style={{ 
                    padding: '4px 8px', 
                    backgroundColor: '#ff4d4f', 
                    color: 'white',
                    borderRadius: '4px'
                  }}>00</span>
                </>
              )}
              {component.props.showSeconds && (
                <>
                  <span>:</span>
                  <span style={{ 
                    padding: '4px 8px', 
                    backgroundColor: '#ff4d4f', 
                    color: 'white',
                    borderRadius: '4px'
                  }}>00</span>
                </>
              )}
            </div>
          </div>
        </div>
      );
    
    case 'coupon':
      return (
        <div style={component.props.style}>
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            {component.props.title}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {component.props.coupons.map((coupon: any) => (
              <div 
                key={coupon.id}
                style={{ 
                  display: 'flex',
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div style={{ 
                  backgroundColor: '#ff4d4f',
                  color: 'white',
                  padding: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '80px'
                }}>
                  <div style={{ fontSize: '18px' }}>¥{coupon.discount}</div>
                </div>
                <div style={{ 
                  flex: 1,
                  padding: '10px'
                }}>
                  <div>{coupon.name}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>{coupon.condition}</div>
                </div>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 10px'
                }}>
                  <button 
                    style={{
                      border: '1px solid #ff4d4f',
                      background: 'white',
                      color: '#ff4d4f',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    领取
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'luckyWheel':
      return (
        <div style={component.props.style} className="text-center p-4">
          <h3 className="font-medium text-orange-500">{component.props.title}</h3>
          <p className="text-xs text-gray-500 mb-2">{component.props.description}</p>
          <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-100 mx-auto mb-2">
            <div className="relative w-56 h-56 mx-auto">
              {/* Wheel background */}
              <div className="absolute inset-0 rounded-full border-8 border-orange-500 bg-gradient-to-b from-yellow-100 to-orange-50"></div>
              
              {/* Decorative dots */}
              {Array(12).fill(0).map((_, i) => {
                const angle = (i / 12) * 2 * Math.PI;
                const dotX = 28 + Math.cos(angle) * 26;
                const dotY = 28 + Math.sin(angle) * 26;
                return (
                  <div 
                    key={i}
                    className={`absolute w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-yellow-500' : 'bg-orange-500'}`}
                    style={{ 
                      left: `${dotX}%`, 
                      top: `${dotY}%`,
                    }}
                  ></div>
                );
              })}
              
              {/* Segments */}
              {Array(6).fill(0).map((_, i) => {
                const angle = (i / 6) * 2 * Math.PI;
                const lineX1 = 50;
                const lineY1 = 50;
                const lineX2 = 50 + Math.cos(angle) * 45;
                const lineY2 = 50 + Math.sin(angle) * 45;
                return (
                  <div 
                    key={i}
                    className="absolute bg-gray-300 h-0.5 origin-left"
                    style={{ 
                      left: `${lineX1}%`, 
                      top: `${lineY1}%`,
                      width: '45%',
                      transform: `rotate(${angle}rad)`
                    }}
                  ></div>
                );
              })}
              
              {/* Prize names */}
              {Array(6).fill(0).map((_, i) => {
                const angle = (i / 6) * 2 * Math.PI + Math.PI / 6; // offset for positioning
                const prizeX = 50 + Math.cos(angle) * 30;
                const prizeY = 50 + Math.sin(angle) * 30;
                return (
                  <div 
                    key={i}
                    className="absolute text-xs font-bold text-orange-700 transform -translate-x-1/2 -translate-y-1/2"
                    style={{ 
                      left: `${prizeX}%`, 
                      top: `${prizeY}%`,
                    }}
                  >
                    {i % 2 === 0 ? `红包` : `谢谢`}
                  </div>
                );
              })}
              
              {/* Center button */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold">{component.props.buttonText}</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'checkinCalendar':
      return (
        <div style={component.props.style} className="text-center p-4">
          <h3 className="font-medium">{component.props.title}</h3>
          <p className="text-xs text-gray-500 mb-2">{component.props.subtitle}</p>
          <div className="grid grid-cols-7 gap-1 mb-3">
            {Array(30).fill(0).map((_, i) => (
              <div 
                key={i} 
                className={`w-6 h-6 flex items-center justify-center text-xs rounded
                  ${i < 7 ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`
                }
              >
                {i + 1}
              </div>
            ))}
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            {component.props.buttonText}
          </button>
        </div>
      );

    case 'surveyForm':
      return (
        <div style={component.props.style} className="p-4">
          <h3 className="font-medium">{component.props.title}</h3>
          <p className="text-xs text-gray-500 mb-3">{component.props.description}</p>
          {component.props.questions.map((question: any, i: number) => (
            <div key={i} className="mb-3">
              <div className="text-sm font-medium mb-1">{i+1}. {question.title}</div>
              {question.type === 'radio' && (
                <div className="flex flex-col gap-1">
                  {question.options.map((option: string, j: number) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                      <div className="text-sm">{option}</div>
                    </div>
                  ))}
                </div>
              )}
              {question.type === 'checkbox' && (
                <div className="flex flex-col gap-1">
                  {question.options.map((option: string, j: number) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border border-gray-300"></div>
                      <div className="text-sm">{option}</div>
                    </div>
                  ))}
                </div>
              )}
              {question.type === 'text' && (
                <div className="border border-gray-300 rounded p-2 h-20 bg-white"></div>
              )}
            </div>
          ))}
          <div className="text-center mt-3">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              {component.props.buttonText}
            </button>
            <div className="text-xs text-gray-500 mt-1">{component.props.rewardText}</div>
          </div>
        </div>
      );
    
    default:
      return <div>未知组件类型: {component.type}</div>;
  }
};

// 创建一个客户端组件来处理搜索参数
function PreviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [components, setComponents] = useState<ComponentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 尝试从会话存储中获取预览数据
    try {
      const previewDataStr = sessionStorage.getItem('h5_preview_data');
      
      if (previewDataStr) {
        const parsedData = JSON.parse(previewDataStr);
        setComponents(parsedData.components || []);
        setError(null);
      } else {
        // 如果没有找到会话存储中的数据，尝试从URL参数获取预览数据
        const dataParam = searchParams?.get('data');
        
        if (dataParam) {
          try {
            const decodedData = decodeURIComponent(dataParam);
            const parsedData = JSON.parse(decodedData);
            setComponents(parsedData.components || []);
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

  const handleBack = () => {
    router.back();
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

  return (
    <div className="preview-container">
      {/* 顶部操作栏 */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md px-4 py-2 z-10 flex justify-between items-center">
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleBack}>返回编辑器</Button>
        <div className="text-lg font-medium">页面预览</div>
        <Button type="text" icon={<CloseOutlined />} onClick={handleBack} />
      </div>
      
      {/* 预览内容 */}
      <div className="preview-content pt-14 pb-8 px-4 max-w-md mx-auto">
        {components.length === 0 ? (
          <Empty description="没有可预览的内容" />
        ) : (
          components.map((component) => (
            <div key={component.id} className="mb-4">
              <ComponentRenderer component={component} />
            </div>
          ))
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