'use client';

import { useState, useRef } from 'react';
import { Card, Button, Badge, Avatar, Divider, Modal } from 'antd';
import { DeleteOutlined, DragOutlined, EyeOutlined, ScissorOutlined, CopyOutlined } from '@ant-design/icons';
import { ComponentType } from './types';
import dynamic from 'next/dynamic';

// 注意：实际项目中您应该安装和导入react-dnd相关依赖
// 这里为了不依赖外部包，我们实现基本的拖拽功能
// import { useDrag, useDrop, DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';

// 动态导入抽奖转盘组件以避免SSR问题
const LuckyWheel = dynamic(() => import('./marketing/LuckyWheel'), { ssr: false });

// 组件项渲染
function ComponentItem({ 
  component, 
  isSelected, 
  index,
  onSelect, 
  onDelete,
  onDuplicate,
  onDragStart,
  onDragOver,
  onDragEnd
}: {
  component: ComponentType;
  isSelected: boolean;
  index: number;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate?: () => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
}) {
  return (
    <div 
      className={`relative p-2 border border-dashed ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent'
      }`}
      onClick={onSelect}
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      data-index={index}
    >
      {isSelected && (
        <div className="absolute -top-3 -right-3 z-10 flex gap-1">
          <Button 
            type="primary" 
            size="small" 
            icon={<DragOutlined />} 
            className="flex items-center justify-center bg-blue-500"
            onClick={(e) => {
              e.stopPropagation();
              // 拖动手柄
            }}
          />
          {onDuplicate && (
            <Button 
              type="primary" 
              size="small" 
              icon={<CopyOutlined />} 
              className="flex items-center justify-center bg-green-500"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
            />
          )}
          <Button 
            type="primary" 
            danger 
            size="small" 
            icon={<DeleteOutlined />} 
            className="flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          />
        </div>
      )}

      <div>
        {renderComponentContent(component)}
      </div>
    </div>
  );
}

// 渲染不同类型的组件内容
function renderComponentContent(component: any) {
  switch(component.type) {
    case 'text':
      return (
        <div style={{ ...component.props.style }}>
          {component.props.content}
        </div>
      );
    
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
        <Button 
          type={component.props.type} 
          style={{ ...component.props.style }}
        >
          {component.props.text}
        </Button>
      );
    
    case 'carousel':
      return (
        <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
          轮播图组件
          <div className="text-xs text-gray-500 mt-1">
            {component.props.images?.length || 0}张图片
          </div>
        </div>
      );
    
    case 'productList':
      return (
        <div className="w-full bg-gray-200 p-2">
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map(item => (
              <div key={item} className="bg-white p-2 rounded">
                <div className="bg-gray-100 h-20 mb-2"></div>
                <div className="text-sm">商品名称</div>
                <div className="text-red-500">¥ 99.00</div>
              </div>
            ))}
          </div>
        </div>
      );
    
    case 'countdown':
      return (
        <div style={{ ...component.props.style }}>
          <div className="text-center">
            <div>{component.props.title}</div>
            <div className="flex justify-center gap-2 my-2">
              {component.props.showDays && (
                <span className="px-2 py-1 bg-red-500 text-white rounded">00</span>
              )}
              {component.props.showHours && (
                <>
                  <span>:</span>
                  <span className="px-2 py-1 bg-red-500 text-white rounded">00</span>
                </>
              )}
              {component.props.showMinutes && (
                <>
                  <span>:</span>
                  <span className="px-2 py-1 bg-red-500 text-white rounded">00</span>
                </>
              )}
              {component.props.showSeconds && (
                <>
                  <span>:</span>
                  <span className="px-2 py-1 bg-red-500 text-white rounded">00</span>
                </>
              )}
            </div>
          </div>
        </div>
      );
    
    case 'coupon':
      return (
        <div style={{ ...component.props.style }}>
          <div className="text-center mb-2">{component.props.title}</div>
          <div className="flex flex-col gap-2">
            {component.props.coupons?.map((coupon: any) => (
              <div 
                key={coupon.id}
                className="flex bg-white rounded overflow-hidden shadow-sm"
              >
                <div className="bg-red-500 text-white p-2 flex items-center justify-center w-20">
                  <div className="text-lg">¥{coupon.discount}</div>
                </div>
                <div className="flex-1 p-2">
                  <div>{coupon.name}</div>
                  <div className="text-xs text-gray-500">{coupon.condition}</div>
                </div>
                <div className="flex items-center p-2">
                  <button className="border border-red-500 bg-white text-red-500 px-2 py-1 rounded text-xs">
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
        <div style={{ ...component.props.style }}>
          <LuckyWheel 
            title={component.props.title}
            buttonText={component.props.buttonText}
            prizes={component.props.prizes || []}
            rotationTime={component.props.rotationTime}
          />
        </div>
      );

    case 'checkinCalendar':
      return (
        <div style={{ ...component.props.style }} className="text-center">
          <h3 className="font-medium">{component.props.title}</h3>
          <p className="text-xs text-gray-500 mb-2">{component.props.subtitle}</p>
          <div className="grid grid-cols-7 gap-1 mb-3">
            {Array(30).fill(0).map((_, i) => (
              <div 
                key={i} 
                className={`w-6 h-6 flex items-center justify-center text-xs rounded
                  ${i < 10 ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`
                }
              >
                {i + 1}
              </div>
            ))}
          </div>
          <Button type="primary" className="bg-blue-500">{component.props.buttonText}</Button>
        </div>
      );

    case 'memberBenefits':
      return (
        <div style={{ ...component.props.style }} className="text-center">
          <h3 className="font-medium">{component.props.title}</h3>
          <p className="text-xs text-gray-500 mb-2">{component.props.description}</p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {component.props.benefits.map((benefit: any, i: number) => (
              <div key={i} className="bg-white p-2 rounded shadow-sm">
                <div className="text-sm font-medium">{benefit.name}</div>
                <div className="text-xs text-gray-500">{benefit.description}</div>
              </div>
            ))}
          </div>
          <div className="bg-purple-100 rounded p-2 mb-2">
            <span className="text-lg font-medium text-purple-700">¥{component.props.price}</span>
            <span className="text-xs text-gray-500">/{component.props.period}</span>
          </div>
          <Button type="primary" className="bg-purple-700">{component.props.buttonText}</Button>
        </div>
      );

    case 'surveyForm':
      return (
        <div style={{ ...component.props.style }}>
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
            <Button type="primary">{component.props.buttonText}</Button>
            <div className="text-xs text-gray-500 mt-1">{component.props.rewardText}</div>
          </div>
        </div>
      );

    case 'teamBuying':
      return (
        <div style={{ ...component.props.style }} className="text-center">
          <h3 className="font-medium">{component.props.title}</h3>
          <p className="text-xs text-gray-500 mb-2">{component.props.description}</p>
          <div className="bg-white rounded p-3 mb-3">
            <div className="w-full h-24 bg-gray-100 mb-2"></div>
            <div className="text-left">
              <div className="font-medium">{component.props.product.name}</div>
              <div className="flex items-end gap-2 mt-1">
                <div className="text-red-500 text-lg font-bold">¥{component.props.product.teamPrice}</div>
                <div className="text-gray-500 text-xs line-through">¥{component.props.product.originalPrice}</div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="text-sm">需 {component.props.teamSize} 人成团</div>
            <div className="text-sm">剩余时间: 23:59:59</div>
          </div>
          <div className="flex justify-center mb-3">
            <Avatar.Group>
              <Avatar style={{ backgroundColor: '#f56a00' }}>U</Avatar>
              <Avatar style={{ backgroundColor: '#1890ff' }}>?</Avatar>
              <Avatar style={{ backgroundColor: '#1890ff' }}>?</Avatar>
            </Avatar.Group>
          </div>
          <Button type="primary" danger>{component.props.buttonText}</Button>
        </div>
      );

    default:
      return (
        <div className="p-2 border border-gray-300 rounded text-center">
          未知组件类型: {component.type}
        </div>
      );
  }
}

// 处理可能为undefined的组件选择函数
const handleSelect = (component: any, onSelectComponent?: (component: ComponentType) => void) => {
  if (onSelectComponent) {
    onSelectComponent(component);
  }
};

// 处理可能为undefined的组件删除函数
const handleDelete = (id: string, onDeleteComponent?: (id: string) => void) => {
  if (onDeleteComponent) {
    onDeleteComponent(id);
  }
};

interface CanvasProps {
  components: ComponentType[];
  selectedComponentId?: string;
  onSelectComponent?: (component: ComponentType) => void;
  onRemoveComponent?: (id: string) => void;
  onUpdateComponentPosition?: (id: string, position: { top: number; left: number }) => void;
  onDeleteComponent?: (id: string) => void;
  onDuplicateComponent?: (id: string) => void;
  onUpdateComponentsOrder?: (startIndex: number, endIndex: number) => void;
  zoom: number;
  canvasSize?: { width: number; height: number };
}

const Canvas: React.FC<CanvasProps> = ({
  components,
  selectedComponentId,
  onSelectComponent,
  onRemoveComponent,
  onUpdateComponentPosition,
  onDeleteComponent,
  onDuplicateComponent,
  onUpdateComponentsOrder,
  zoom,
  canvasSize = { width: 375, height: 667 } // 默认尺寸
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(selectedComponentId || null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const handleComponentSelect = (component: ComponentType) => {
    setSelectedId(component.id);
    if (onSelectComponent) {
      onSelectComponent(component);
    }
  };

  const handleComponentDelete = (id: string) => {
    if (onDeleteComponent) {
      onDeleteComponent(id);
    }
  };

  const handleDuplicate = (id: string) => {
    if (onDuplicateComponent) {
      onDuplicateComponent(id);
    }
  };

  // 基本拖拽实现
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', index.toString());
      
      // 设置拖动时的半透明效果
      setTimeout(() => {
        if (e.target && (e.target as HTMLElement).style) {
          (e.target as HTMLElement).style.opacity = '0.5';
        }
      }, 0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    try {
      // 获取拖拽的组件数据
      const componentData = JSON.parse(e.dataTransfer.getData('componentType'));
      
      if (componentData) {
        // 创建新组件并添加到画布
        const id = `component-${Date.now()}`;
        const newComponent = {
          id,
          ...componentData,
          props: { ...componentData.defaultProps }
        };
        
        if (onSelectComponent) {
          onSelectComponent(newComponent);
        }
        
        // 获取鼠标在画布中的相对位置
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          // 这里可以根据鼠标位置设置组件的定位
          // 如果你的组件支持定位属性的话
        }
      }
    } catch (error) {
      console.error('Failed to add dragged component:', error);
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.target && (e.target as HTMLElement).style) {
      (e.target as HTMLElement).style.opacity = '1';
    }
    setDragIndex(null);
  };

  // 计算画布高度 - 根据内容自适应增加
  const calculateCanvasHeight = () => {
    // 基础高度，如果没有组件则使用默认高度
    const baseHeight = canvasSize.height;
    
    if (components.length === 0) {
      return baseHeight;
    }

    // 计算所有组件占据的总高度
    let maxComponentBottom = 0;
    
    components.forEach(component => {
      // 获取组件在画布中的位置 - 从props.style中获取
      const top = parseInt(component.props?.style?.marginTop || 0, 10);
      
      // 估计组件高度 - 根据组件类型确定默认高度
      let height;
      
      // 特殊组件类型的高度调整
      switch (component.type) {
        case 'image':
          height = parseInt(component.props?.style?.height || 200, 10);
          break;
        case 'text':
          height = parseInt(component.props?.style?.height || 40, 10);
          break;
        case 'button':
          height = parseInt(component.props?.style?.height || 40, 10);
          break;
        case 'carousel':
          height = 200;
          break;
        case 'productList':
          height = 300;
          break;
        case 'countdown':
          height = 100;
          break;
        case 'coupon':
          height = 150 + (component.props?.coupons?.length || 1) * 70;
          break;
        case 'luckyWheel':
          height = 350;
          break;
        case 'checkinCalendar':
          height = 250;
          break;
        case 'memberBenefits':
          height = 250;
          break;
        case 'surveyForm':
          height = 200 + (component.props?.questions?.length || 1) * 100;
          break;
        case 'teamBuying':
          height = 350;
          break;
        default:
          height = 80; // 默认高度
      }
      
      // 考虑内边距和外边距
      const paddingTop = parseInt(component.props?.style?.paddingTop || 0, 10);
      const paddingBottom = parseInt(component.props?.style?.paddingBottom || 0, 10);
      const marginBottom = parseInt(component.props?.style?.marginBottom || 0, 10);
      
      // 计算组件底部位置 (top + height + margins & paddings)
      const bottom = top + height + marginBottom + paddingTop + paddingBottom;
      
      console.log(`组件: ${component.type}, ID: ${component.id}, 顶部: ${top}, 高度: ${height}, 底部: ${bottom}`);
      
      // 更新最大底部位置
      if (bottom > maxComponentBottom) {
        maxComponentBottom = bottom;
      }
    });
    
    // 添加底部边距并确保最小高度不小于基础高度
    const calculatedHeight = Math.max(baseHeight, maxComponentBottom + 100);
    console.log(`计算画布高度: ${calculatedHeight}px (基础高度: ${baseHeight}px, 最大组件底部: ${maxComponentBottom}px)`);
    
    return calculatedHeight;
  };

  // 根据传入的canvasSize设置画布尺寸，但高度会自适应
  const canvasStyle = {
    width: `${canvasSize.width}px`,
    height: `${calculateCanvasHeight()}px`,
    minHeight: `${canvasSize.height}px`,
    position: 'relative' as const,
    background: '#ffffff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div 
      className="canvas-container relative"
      style={{
        ...canvasStyle,
        minHeight: `${calculateCanvasHeight()}px`, // 确保顶层容器也使用计算后的高度
      }}
    >
      {/* 组件渲染区域 */}
      <div className="component-area" style={{ minHeight: `${calculateCanvasHeight()}px` }}>
        <div 
          className="relative w-full h-full bg-white"
          ref={containerRef}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* 画布内容 */}
          <div className="relative w-full" style={{ minHeight: `${calculateCanvasHeight()}px` }}>
            {components.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <p>从左侧拖入组件到这里</p>
              </div>
            ) : (
              components.map((component, index) => (
                <ComponentItem
                  key={component.id}
                  component={component}
                  isSelected={selectedId === component.id}
                  index={index}
                  onSelect={() => handleComponentSelect(component)}
                  onDelete={() => handleComponentDelete(component.id)}
                  onDuplicate={onDuplicateComponent ? () => handleDuplicate(component.id) : undefined}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                />
              ))
            )}

            {/* 悬浮按钮 - 预览 */}
            <div 
              className="absolute bottom-4 right-4 bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-lg"
              onClick={() => setShowPreview(true)}
            >
              <EyeOutlined />
            </div>
          </div>
        </div>
      </div>

      {/* 预览模态框 */}
      <Modal
        title="移动端预览"
        open={showPreview}
        onCancel={() => setShowPreview(false)}
        footer={null}
        width={400}
      >
        <div className="w-full max-h-[80vh] overflow-auto p-0">
          <div className="bg-gray-100 rounded-t-lg p-2 text-center text-xs">
            <div className="inline-block bg-black text-white px-4 py-1 rounded-full">
              手机预览模式
            </div>
          </div>
          <div className="w-full bg-white">
            {components.map((component) => (
              <div key={component.id} className="mb-2">
                {renderComponentContent(component)}
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Canvas; 