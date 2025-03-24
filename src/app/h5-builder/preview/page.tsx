'use client';

import { useEffect, useState } from 'react';
import { Button, Empty, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';

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
          <h3 className="font-medium">{component.props.title}</h3>
          <p className="text-xs text-gray-500 mb-2">{component.props.description}</p>
          <div className="bg-yellow-100 rounded-full w-32 h-32 mx-auto relative mb-2 border-4 border-yellow-500">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-red-500 transform rotate-45"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-xs">转盘示意</div>
            </div>
          </div>
          <button className="bg-red-500 text-white px-4 py-2 rounded">
            {component.props.buttonText}
          </button>
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

export default function PreviewPage() {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 尝试从URL参数获取预览数据
    const dataParam = searchParams.get('data');
    
    if (dataParam) {
      try {
        const decodedData = decodeURIComponent(dataParam);
        const parsedData = JSON.parse(decodedData);
        // 如果是数组，直接作为组件列表处理
        if (Array.isArray(parsedData)) {
          setPageData({ components: parsedData });
        } else {
          // 否则假设是包含components属性的对象
          setPageData(parsedData);
        }
      } catch (err) {
        console.error('解析URL预览数据失败', err);
        // 如果URL参数解析失败，尝试从sessionStorage获取
        loadFromSessionStorage();
      }
    } else {
      // 没有URL参数，尝试从sessionStorage获取
      loadFromSessionStorage();
    }
    
    setLoading(false);
  }, [searchParams]);

  const loadFromSessionStorage = () => {
    const previewData = sessionStorage.getItem('h5_preview_data');
    
    if (previewData) {
      try {
        setPageData(JSON.parse(previewData));
      } catch (err) {
        console.error('解析预览数据失败', err);
      }
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!pageData || !pageData.components || pageData.components.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Empty description="没有预览内容" />
        <Button onClick={handleBack} icon={<ArrowLeftOutlined />} className="mt-4">
          返回编辑
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部操作栏 */}
      <div className="sticky top-0 z-10 bg-white shadow px-4 py-2 flex items-center justify-between">
        <Button onClick={handleBack} icon={<ArrowLeftOutlined />}>
          返回编辑
        </Button>
        <div className="text-sm font-medium">
          移动端预览
        </div>
        <div style={{ width: 24 }} />
      </div>
      
      {/* 移动设备模拟框 */}
      <div className="max-w-md mx-auto my-4 bg-white rounded-lg shadow overflow-hidden">
        {/* 手机顶部状态栏模拟 */}
        <div className="h-8 bg-gray-800 flex items-center justify-between px-4">
          <div className="text-white text-xs">12:00</div>
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-white opacity-70"></div>
            <div className="w-3 h-3 rounded-full bg-white opacity-70"></div>
            <div className="w-3 h-3 rounded-full bg-white opacity-70"></div>
          </div>
        </div>
        
        {/* 页面内容 */}
        <div className="min-h-[500px] overflow-auto">
          {pageData.components.map((component: any, index: number) => (
            <div key={index} className="mb-4">
              <ComponentRenderer component={component} />
            </div>
          ))}
        </div>
        
        {/* 底部模拟 */}
        <div className="h-8 bg-gray-100 border-t"></div>
      </div>
      
      <div className="max-w-md mx-auto px-4 mb-8 text-center text-xs text-gray-500">
        此预览仅供参考，实际效果可能因设备不同而有所差异
      </div>
    </div>
  );
} 