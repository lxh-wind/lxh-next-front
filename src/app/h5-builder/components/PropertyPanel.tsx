'use client';
import { useCallback, useEffect, useState } from 'react';
import { Form, Input, InputNumber, ColorPicker, Select, Tabs, Space, Tag, Button, Modal, Switch, Checkbox, DatePicker, Table, Alert, Divider, Collapse, Radio } from 'antd';
import { useAtom, useSetAtom } from 'jotai';
import {
  componentsAtom,
  selectedComponentAtom,
  historyAtom,
  historyIndexAtom,
  canUndoAtom,
  canRedoAtom,
  pageInfoAtom
} from '@/src/app/h5-builder/store/atoms';
import dayjs from 'dayjs';
import { CouponComponentConfig } from '../materials/configs/CouponComponentConfig';
import { ProductListConfig } from '../materials/configs/ProductListConfig';
import RouteEditor from './RouteEditor';

export default function PropertyPanel() {
  const setComponents = useSetAtom(componentsAtom);
  const [selectedComponent, setSelectedComponent] = useAtom(selectedComponentAtom);
  const [pageInfo] = useAtom(pageInfoAtom);
  
  const setHistory = useSetAtom(historyAtom);
  const setHistoryIndex = useSetAtom(historyIndexAtom);
  const setCanUndo = useSetAtom(canUndoAtom);
  const setCanRedo = useSetAtom(canRedoAtom);

  // 判断是否为自由布局模式
  const isFreeModeActive = pageInfo.layoutMode === 'free';

  // 添加状态来存储组件的实际尺寸信息
  const [componentRect, setComponentRect] = useState<DOMRect | null>(null);

  // 当选中组件变化时，获取其实际尺寸
  useEffect(() => {
    if (selectedComponent && isFreeModeActive) {
      const componentElement = document.getElementById(`component-${selectedComponent.id}`);
      if (componentElement) {
        // 获取组件尺寸
        const rect = componentElement.getBoundingClientRect();
        setComponentRect(rect);
        
        // 创建ResizeObserver监听组件尺寸变化
        const resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            setComponentRect(entry.target.getBoundingClientRect());
          }
        });
        
        resizeObserver.observe(componentElement);
        
        return () => {
          resizeObserver.disconnect();
        };
      }
    }
  }, [selectedComponent, isFreeModeActive]);

  // 辅助函数，获取组件实际宽高
  const getActualSize = (property: 'width' | 'height') => {
    if (componentRect && isFreeModeActive) {
      if (property === 'width') {
        // 如果position中已经定义了数值宽度，优先使用它
        if (typeof selectedComponent?.position?.width === 'number') {
          return selectedComponent.position.width;
        }
        // 否则返回实际计算的宽度
        return Math.round(componentRect.width);
      } else if (property === 'height') {
        // 如果position中已经定义了数值高度，优先使用它
        if (typeof selectedComponent?.position?.height === 'number') {
          return selectedComponent.position.height;
        }
        // 否则返回实际计算的高度
        return Math.round(componentRect.height);
      }
    }
    return undefined;
  };

  // 应用实际尺寸到组件
  const applyActualSize = () => {
    if (selectedComponent && isFreeModeActive && componentRect) {
      const newPosition = {
        width: Math.round(componentRect.width),
        height: Math.round(componentRect.height)
      };
      updateComponentPosition(selectedComponent.id, newPosition);
    }
  };

  // 更新组件属性
  const onUpdateComponent = useCallback((id: string, props: any) => {
    // 仅在不频繁更新的属性变更时记录历史
    if (Object.keys(props).some(key => !['style.marginTop', 'style.marginBottom'].includes(key))) {
      setHistory(prev => ({
        past: [...prev.past, prev.present],
        present: prev.present.map(comp => 
          comp.id === id ? { ...comp, props: { ...comp.props, ...props } } : comp
        ),
        future: [],
      }));
      setHistoryIndex(prev => prev + 1);
      setCanUndo(true);
      setCanRedo(false);
    }
    
    setComponents(prev => 
      prev.map(comp => 
        comp.id === id 
          ? { ...comp, props: { ...comp.props, ...props } } 
          : comp
      )
    );
    
    if (selectedComponent && selectedComponent.id === id) {
      setSelectedComponent(prev => 
        prev ? { ...prev, props: { ...prev.props, ...props } } : null
      );
    }
  }, [selectedComponent]);

  // 更新组件位置和尺寸
  const updateComponentPosition = useCallback((id: string, position: any) => {
    // 当修改宽高时，可能需要调整位置，确保不超出画布
    if ((position.width || position.height) && selectedComponent) {
      const componentElement = document.getElementById(`component-${id}`);
      const canvasElement = document.querySelector('.canvas-content');
      
      if (componentElement && canvasElement) {
        const canvasRect = canvasElement.getBoundingClientRect();
        const currentLeft = selectedComponent.position?.left || 0;
        const currentTop = selectedComponent.position?.top || 0;
        
        // 计算新宽高
        const newWidth = position.width || 
          (typeof selectedComponent.position?.width === 'number' 
            ? selectedComponent.position.width 
            : 200);
        const newHeight = position.height && position.height !== 'auto' 
          ? position.height 
          : (typeof selectedComponent.position?.height === 'number' 
              ? selectedComponent.position.height 
              : 100);
        
        // 计算边界
        const maxLeft = canvasRect.width - newWidth - (pageInfo.containerPadding || 0) * 2;
        const maxTop = canvasRect.height - newHeight - (pageInfo.containerPadding || 0) * 2;
        
        // 如果当前位置会超出边界，则调整位置
        if (currentLeft > maxLeft) {
          position.left = Math.max(0, maxLeft);
        }
        
        if (currentTop > maxTop) {
          position.top = Math.max(0, maxTop);
        }
      }
    }
    
    setHistory(prev => ({
      past: [...prev.past, prev.present],
      present: prev.present.map(comp => 
        comp.id === id ? { ...comp, position: { ...comp.position, ...position } } : comp
      ),
      future: [],
    }));
    setHistoryIndex(prev => prev + 1);
    setCanUndo(true);
    setCanRedo(false);
    
    setComponents(prev => 
      prev.map(comp => 
        comp.id === id 
          ? { ...comp, position: { ...comp.position, ...position } } 
          : comp
      )
    );
    
    if (selectedComponent && selectedComponent.id === id) {
      setSelectedComponent(prev => 
        prev ? { ...prev, position: { ...prev.position, ...position } } : null
      );
    }
  }, [selectedComponent, pageInfo.containerPadding]);

  if (!selectedComponent) {
    return (
      <div className="p-4 text-center text-gray-400">
        <p>请选择一个组件来编辑属性</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <div className="text-lg font-bold mr-4">属性设置</div>
        <Tag color="blue" className="cursor-pointer">{selectedComponent.name}</Tag>
      </div>

      <div className="mb-6">
        <div className="mb-4">
          <div className="text-gray-500 mb-1">组件名称</div>
          <Input 
            value={selectedComponent.type} 
            disabled 
            className="bg-gray-50"
          />
        </div>
        <div className="mb-4">
          <div className="text-gray-500 mb-1">组件ID</div>
          <Input 
            value={selectedComponent.id} 
            disabled 
            className="bg-gray-50"
          />
        </div>
      </div>

      <Tabs
        defaultActiveKey="style"
        className="px-0"
        centered
        items={[
          {
            key: 'style',
            label: '样式',
            children: (
              <div>
                <Form layout="vertical">
                  {/* 自由布局模式下显示位置和尺寸设置 */}
                  {isFreeModeActive && (
                    <>
                      <div className="mb-4">
                        <div className="font-medium mb-2 flex justify-between items-center">
                          <span>位置与尺寸</span>
                          <Button 
                            size="small"
                            onClick={applyActualSize}
                            title="使用实际尺寸"
                          >
                            应用实际尺寸
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Form.Item label="X 坐标" className="mb-2">
                            <InputNumber
                              min={0}
                              value={selectedComponent.position?.left}
                              onChange={(value) => updateComponentPosition(selectedComponent.id, {
                                left: value
                              })}
                              addonAfter="px"
                              style={{ width: '100%' }}
                            />
                          </Form.Item>
                          <Form.Item label="Y 坐标" className="mb-2">
                            <InputNumber
                              min={0}
                              value={selectedComponent.position?.top}
                              onChange={(value) => updateComponentPosition(selectedComponent.id, {
                                top: value
                              })}
                              addonAfter="px"
                              style={{ width: '100%' }}
                            />
                          </Form.Item>
                          <Form.Item label="宽度" className="mb-2">
                            <InputNumber
                              min={20}
                              value={getActualSize('width')}
                              onChange={(value) => {
                                if (value) {
                                  updateComponentPosition(selectedComponent.id, {
                                    width: value
                                  });
                                }
                              }}
                              addonAfter="px"
                              style={{ width: '100%' }}
                              placeholder={typeof selectedComponent.position?.width === 'string' ? selectedComponent.position.width : "auto"}
                            />
                          </Form.Item>
                          <Form.Item label="高度" className="mb-2">
                            <InputNumber
                              min={20}
                              value={getActualSize('height')}
                              onChange={(value) => {
                                if (value) {
                                  updateComponentPosition(selectedComponent.id, {
                                    height: value
                                  });
                                } else {
                                  updateComponentPosition(selectedComponent.id, {
                                    height: 'auto'
                                  });
                                }
                              }}
                              addonAfter="px"
                              style={{ width: '100%' }}
                              placeholder={typeof selectedComponent.position?.height === 'string' ? selectedComponent.position.height : "auto"}
                            />
                          </Form.Item>
                        </div>
                      </div>
                      <Form.Item label="层级 (Z-Index)" className="mb-4">
                        <InputNumber
                          min={1}
                          value={selectedComponent.position?.zIndex}
                          onChange={(value) => updateComponentPosition(selectedComponent.id, {
                            zIndex: value
                          })}
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                      <hr className="my-4 border-gray-200" />
                    </>
                  )}

                  {/* 内边距设置 */}
                  <Form.Item label="内边距" className="mb-4">
                    <InputNumber
                      min={0}
                      max={100}
                      defaultValue={selectedComponent.props?.style?.padding || 0}
                      onChange={(value) => onUpdateComponent(selectedComponent.id, {
                        style: { ...selectedComponent.props?.style, padding: value }
                      })}
                      addonAfter="px"
                    />
                  </Form.Item>

                  {/* 背景颜色设置 */}
                  <Form.Item label="背景颜色" className="mb-4">
                    <ColorPicker
                      value={selectedComponent.props?.style?.backgroundColor || '#fff8e8'}
                      onChange={(color) => onUpdateComponent(selectedComponent.id, {
                        style: { ...selectedComponent.props?.style, backgroundColor: color }
                      })}
                    />
                  </Form.Item>

                  {/* 圆角设置 */}
                  <Form.Item label="圆角" className="mb-4">
                    <InputNumber
                      min={0}
                      max={100}
                      defaultValue={selectedComponent.props?.style?.borderRadius || 0}
                      onChange={(value) => onUpdateComponent(selectedComponent.id, {
                        style: { ...selectedComponent.props?.style, borderRadius: value }
                      })}
                      addonAfter="px"
                    />
                  </Form.Item>
                </Form>
              </div>
            )
          },
          {
            key: 'content',
            label: '内容',
            children: (
              <div>
                {renderContentForm()}
              </div>
            )
          }
        ]}
      />
    </div>
  );

  // 渲染内容设置表单
  function renderContentForm() {
    if (!selectedComponent) {
      return <div>请先选择一个组件</div>;
    }
    
    switch (selectedComponent.type) {
      case 'text':
        return (
          <Form layout="vertical">
            <Form.Item label="文本内容">
              <Input.TextArea
                rows={4}
                defaultValue={selectedComponent.props?.content}
                onChange={(e) => onUpdateComponent(selectedComponent.id, {
                  content: e.target.value
                })}
              />
            </Form.Item>
            <Form.Item label="字体大小">
              <InputNumber
                min={12}
                max={72}
                defaultValue={selectedComponent.props?.style?.fontSize || 16}
                onChange={(value) => onUpdateComponent(selectedComponent.id, {
                  style: { ...selectedComponent.props?.style, fontSize: value }
                })}
                addonAfter="px"
              />
            </Form.Item>
            <Form.Item label="字体颜色">
              <ColorPicker
                defaultValue={selectedComponent.props?.style?.color || '#000000'}
                onChange={(color) => onUpdateComponent(selectedComponent.id, {
                  style: { ...selectedComponent.props?.style, color: color }
                })}
              />
            </Form.Item>
            <Form.Item label="对齐方式">
              <Select
                defaultValue={selectedComponent.props?.style?.textAlign || 'left'}
                onChange={(value) => onUpdateComponent(selectedComponent.id, {
                  style: { ...selectedComponent.props?.style, textAlign: value }
                })}
              >
                <Select.Option value="left">左对齐</Select.Option>
                <Select.Option value="center">居中</Select.Option>
                <Select.Option value="right">右对齐</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        );
      
      case 'image':
        return (
          <Form layout="vertical">
            <Form.Item label="图片地址">
              <Input
                defaultValue={selectedComponent.props?.src}
                onChange={(e) => onUpdateComponent(selectedComponent.id, {
                  src: e.target.value
                })}
              />
            </Form.Item>
            <Form.Item label="替代文本">
              <Input
                defaultValue={selectedComponent.props?.alt}
                onChange={(e) => onUpdateComponent(selectedComponent.id, {
                  alt: e.target.value
                })}
              />
            </Form.Item>
          </Form>
        );
      
      case 'button':
        return (
          <Form layout="vertical">
            <Form.Item label="按钮文本">
              <Input
                defaultValue={selectedComponent.props?.text}
                onChange={(e) => onUpdateComponent(selectedComponent.id, {
                  text: e.target.value
                })}
              />
            </Form.Item>
            <Form.Item label="按钮类型">
              <Select
                defaultValue={selectedComponent.props?.buttonType || 'primary'}
                onChange={(value) => onUpdateComponent(selectedComponent.id, {
                  buttonType: value
                })}
              >
                <Select.Option value="primary">主按钮</Select.Option>
                <Select.Option value="default">次按钮</Select.Option>
                <Select.Option value="dashed">虚线按钮</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        );

      case 'luckyWheel':
        return (
          <Form layout="vertical">
            <Form.Item label="标题">
              <Input
                defaultValue={selectedComponent.props?.title || ''}
                onChange={(e) => onUpdateComponent(selectedComponent.id, {
                  title: e.target.value
                })}
              />
            </Form.Item>
            <Form.Item label="描述">
              <Input.TextArea
                rows={2}
                defaultValue={selectedComponent.props?.description}
                onChange={(e) => onUpdateComponent(selectedComponent.id, {
                  description: e.target.value
                })}
              />
            </Form.Item>
            <Form.Item label="按钮文本">
              <Input
                defaultValue={selectedComponent.props?.buttonText}
                onChange={(e) => onUpdateComponent(selectedComponent.id, {
                  buttonText: e.target.value
                })}
              />
            </Form.Item>
            <Form.Item label="奖品设置">
              <Button onClick={() => {
                const prizes = (selectedComponent.props as any)?.prizes || [];
                Modal.info({
                  title: '淘宝风格奖品设置',
                  width: 700,
                  content: (
                    <div>
                      <Table
                        dataSource={prizes.map((prize: any, index: number) => ({
                          ...prize,
                          key: prize.id || index.toString()
                        }))}
                        columns={[
                          {
                            title: '奖品名称',
                            dataIndex: 'name',
                            key: 'name',
                          },
                          {
                            title: '概率',
                            dataIndex: 'probability',
                            key: 'probability',
                            render: (prob: number) => `${(prob * 100).toFixed(1)}%`
                          },
                          {
                            title: '背景颜色',
                            dataIndex: 'bgColor',
                            key: 'bgColor',
                            render: (color: string) => (
                              <div style={{ 
                                width: '24px', 
                                height: '24px', 
                                backgroundColor: color,
                                borderRadius: '4px',
                                border: '1px solid #ddd'
                              }}></div>
                            )
                          }
                        ]}
                      />
                      <Alert 
                        style={{ marginTop: '10px' }}
                        message="提示：高级奖品编辑功能将在后续版本提供" 
                        type="info" 
                      />
                    </div>
                  ),
                });
              }}>打开奖品编辑器</Button>
            </Form.Item>
            <Form.Item label="样式设置">
              <ColorPicker
                value={selectedComponent.props?.style?.backgroundColor || '#fff8e8'}
                onChange={(color) => onUpdateComponent(selectedComponent.id, {
                  style: { ...selectedComponent.props?.style, backgroundColor: color }
                })}
              />
              <div style={{ marginTop: '8px', marginBottom: '8px' }}>背景颜色</div>
              <Divider style={{ margin: '8px 0' }} />
              
              <div style={{ marginBottom: '8px' }}>圆角</div>
              <InputNumber
                min={0}
                max={50}
                value={selectedComponent.props?.style?.borderRadius || 8}
                onChange={(value) => onUpdateComponent(selectedComponent.id, {
                  style: { ...selectedComponent.props?.style, borderRadius: value }
                })}
              />
              <Divider style={{ margin: '8px 0' }} />
              
              <div style={{ marginBottom: '8px' }}>内边距</div>
              <Space>
                <InputNumber
                  min={0}
                  max={50}
                  value={selectedComponent.props?.style?.paddingTop || 10}
                  onChange={(value) => onUpdateComponent(selectedComponent.id, {
                    style: { ...selectedComponent.props?.style, paddingTop: value }
                  })}
                  addonBefore="上"
                />
                <InputNumber
                  min={0}
                  max={50}
                  value={selectedComponent.props?.style?.paddingRight || 10}
                  onChange={(value) => onUpdateComponent(selectedComponent.id, {
                    style: { ...selectedComponent.props?.style, paddingRight: value }
                  })}
                  addonBefore="右"
                />
                <InputNumber
                  min={0}
                  max={50}
                  value={selectedComponent.props?.style?.paddingBottom || 10}
                  onChange={(value) => onUpdateComponent(selectedComponent.id, {
                    style: { ...selectedComponent.props?.style, paddingBottom: value }
                  })}
                  addonBefore="下"
                />
                <InputNumber
                  min={0}
                  max={50}
                  value={selectedComponent.props?.style?.paddingLeft || 10}
                  onChange={(value) => onUpdateComponent(selectedComponent.id, {
                    style: { ...selectedComponent.props?.style, paddingLeft: value }
                  })}
                  addonBefore="左"
                />
              </Space>
            </Form.Item>
          </Form>
        );
        
      case 'coupon':
        return (
          <CouponComponentConfig 
            component={selectedComponent} 
            onChange={(updatedComponent) => {
              // 更新组件
              setComponents(prev => 
                prev.map(comp => 
                  comp.id === updatedComponent.id ? updatedComponent : comp
                )
              );
              
              // 更新选中的组件
              setSelectedComponent(updatedComponent);
              
              // 记录到历史
              setHistory(prev => ({
                past: [...prev.past, prev.present],
                present: prev.present.map(comp => 
                  comp.id === updatedComponent.id ? updatedComponent : comp
                ),
                future: [],
              }));
              setHistoryIndex(prev => prev + 1);
              setCanUndo(true);
              setCanRedo(false);
            }}
          />
        );
        
      case 'checkinCalendar':
        return (
          <Form layout="vertical">
            <Form.Item label="基本设置">
              <Collapse ghost>
                <Collapse.Panel header="标题和文本设置" key="1">
                  <Form.Item label="签到标题">
                    <Input
                      defaultValue={selectedComponent.props?.title || ''}
                      onChange={(e) => onUpdateComponent(selectedComponent.id, {
                        title: e.target.value
                      })}
                    />
                  </Form.Item>
                  {selectedComponent.type === 'checkinCalendar' && (
                    <Form.Item label="副标题">
                      <Input
                        defaultValue={selectedComponent.props?.subtitle || ''}
                        onChange={(e) => onUpdateComponent(selectedComponent.id, {
                          subtitle: e.target.value
                        })}
                      />
                    </Form.Item>
                  )}
                  <Form.Item label="标题颜色">
                    <ColorPicker
                      defaultValue={selectedComponent.props?.titleColor || '#333'}
                      onChange={(color) => onUpdateComponent(selectedComponent.id, {
                        titleColor: color.toHexString()
                      })}
                    />
                  </Form.Item>
                  <Form.Item label="提示文本">
                    <Input
                      defaultValue={selectedComponent.props?.streakText || '已连续签到 X 天'}
                      placeholder="已连续签到 X 天"
                      onChange={(e) => onUpdateComponent(selectedComponent.id, {
                        streakText: e.target.value
                      })}
                    />
                  </Form.Item>
                  <Form.Item label="显示奖励提示">
                    <Switch
                      defaultChecked={selectedComponent.props?.showRewardTips || false}
                      onChange={(checked) => onUpdateComponent(selectedComponent.id, {
                        showRewardTips: checked
                      })}
                    />
                  </Form.Item>
                  {selectedComponent.props?.showRewardTips && (
                    <Form.Item label="奖励提示文本">
                      <Input
                        defaultValue={selectedComponent.props?.rewardTips || ''}
                        onChange={(e) => onUpdateComponent(selectedComponent.id, {
                          rewardTips: e.target.value
                        })}
                      />
                    </Form.Item>
                  )}
                </Collapse.Panel>
                
                <Collapse.Panel header="日历设置" key="2">
                  <Form.Item label="月份天数">
                    <InputNumber
                      min={28}
                      max={31}
                      defaultValue={selectedComponent.props?.daysInMonth || 30}
                      onChange={(value) => onUpdateComponent(selectedComponent.id, {
                        daysInMonth: value
                      })}
                    />
                  </Form.Item>
                  <Form.Item label="当前天">
                    <InputNumber
                      min={1}
                      max={selectedComponent.props?.daysInMonth || 30}
                      defaultValue={selectedComponent.props?.currentDay || new Date().getDate()}
                      onChange={(value) => onUpdateComponent(selectedComponent.id, {
                        currentDay: value
                      })}
                    />
                  </Form.Item>
                  <Form.Item label="签到标记显示">
                    <Switch
                      defaultChecked={selectedComponent.props?.showSignedIcon || false}
                      onChange={(checked) => onUpdateComponent(selectedComponent.id, {
                        showSignedIcon: checked
                      })}
                    />
                  </Form.Item>
                </Collapse.Panel>
                
                <Collapse.Panel header="样式设置" key="3">
                  <Form.Item label="顶部背景色">
                    <ColorPicker
                      defaultValue={selectedComponent.props?.headerBackground || 'linear-gradient(135deg, #ff9500 0%, #ff6000 100%)'}
                      onChange={(color) => onUpdateComponent(selectedComponent.id, {
                        headerBackground: color.toHexString()
                      })}
                    />
                  </Form.Item>
                  <Form.Item label="顶部文字颜色">
                    <ColorPicker
                      defaultValue={selectedComponent.props?.headerTextColor || '#fff'}
                      onChange={(color) => onUpdateComponent(selectedComponent.id, {
                        headerTextColor: color.toHexString()
                      })}
                    />
                  </Form.Item>
                  <Form.Item label="已签到日期背景色">
                    <ColorPicker
                      defaultValue={selectedComponent.props?.signedBackground || 'linear-gradient(135deg, #e6f7ff 0%, #d9f1ff 100%)'}
                      onChange={(color) => onUpdateComponent(selectedComponent.id, {
                        signedBackground: color.toHexString()
                      })}
                    />
                  </Form.Item>
                  <Form.Item label="已签到日期文字颜色">
                    <ColorPicker
                      defaultValue={selectedComponent.props?.signedColor || '#1890ff'}
                      onChange={(color) => onUpdateComponent(selectedComponent.id, {
                        signedColor: color.toHexString()
                      })}
                    />
                  </Form.Item>
                  <Form.Item label="奖励文字颜色">
                    <ColorPicker
                      defaultValue={selectedComponent.props?.rewardColor || '#ff4d4f'}
                      onChange={(color) => onUpdateComponent(selectedComponent.id, {
                        rewardColor: color.toHexString()
                      })}
                    />
                  </Form.Item>
                </Collapse.Panel>
                
                <Collapse.Panel header="按钮设置" key="4">
                  <Form.Item label="按钮文本">
                    <Input
                      defaultValue={selectedComponent.props?.buttonText || '签到'}
                      onChange={(e) => onUpdateComponent(selectedComponent.id, {
                        buttonText: e.target.value
                      })}
                    />
                  </Form.Item>
                  <Form.Item label="已签到按钮文本">
                    <Input
                      defaultValue={selectedComponent.props?.signedButtonText || '已签到'}
                      onChange={(e) => onUpdateComponent(selectedComponent.id, {
                        signedButtonText: e.target.value
                      })}
                    />
                  </Form.Item>
                  <Form.Item label="按钮背景色">
                    <ColorPicker
                      defaultValue={selectedComponent.props?.buttonColor || '#ff4d4f'}
                      onChange={(color) => onUpdateComponent(selectedComponent.id, {
                        buttonColor: color.toHexString()
                      })}
                    />
                  </Form.Item>
                  <Form.Item label="按钮颜色">
                    <Select
                      defaultValue={selectedComponent.props?.buttonColor || 'primary'}
                      onChange={(value) => onUpdateComponent(selectedComponent.id, {
                        buttonColor: value
                      })}
                    >
                      <Select.Option value="primary">主色</Select.Option>
                      <Select.Option value="success">成功色</Select.Option>
                      <Select.Option value="warning">警告色</Select.Option>
                      <Select.Option value="danger">危险色</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="按钮大小">
                    <Select
                      defaultValue={selectedComponent.props?.signButtonSize || 'middle'}
                      onChange={(value) => onUpdateComponent(selectedComponent.id, {
                        signButtonSize: value
                      })}
                    >
                      <Select.Option value="large">大</Select.Option>
                      <Select.Option value="middle">中</Select.Option>
                      <Select.Option value="small">小</Select.Option>
                    </Select>
                  </Form.Item>
                </Collapse.Panel>
              </Collapse>
            </Form.Item>
            
            <Form.Item label="奖励设置">
              <Button 
                type="primary" 
                onClick={() => {
                  Modal.info({
                    title: '签到奖励设置',
                    width: 600,
                    content: (
                      <div className="p-4">
                        <p className="mb-4">配置特定天数的奖励:</p>
                        <Table
                          dataSource={selectedComponent.props?.rewards || []}
                          columns={[
                            {
                              title: '签到天数',
                              dataIndex: 'day',
                              key: 'day',
                            },
                            {
                              title: '奖励内容',
                              dataIndex: 'reward',
                              key: 'reward',
                            },
                          ]}
                          pagination={false}
                        />
                        <p className="mt-4 text-gray-500">注: 详细的奖励编辑功能将在高级编辑器中提供</p>
                      </div>
                    ),
                  });
                }}
              >
                编辑签到奖励
              </Button>
            </Form.Item>
          </Form>
        );
        
      case 'teamBuying':
        return (
          <Form layout="vertical">
            <Form.Item label="拼团标题">
              <Input
                defaultValue={selectedComponent.props?.title || ''}
                onChange={(e) => onUpdateComponent(selectedComponent.id, {
                  title: e.target.value
                })}
              />
            </Form.Item>
            <Form.Item label="描述">
              <Input.TextArea
                rows={2}
                defaultValue={selectedComponent.props?.description || ''}
                onChange={(e) => onUpdateComponent(selectedComponent.id, {
                  description: e.target.value
                })}
              />
            </Form.Item>
            <Form.Item label="团购人数">
              <InputNumber
                min={2}
                max={50}
                defaultValue={selectedComponent.props?.teamSize || 2}
                onChange={(value) => onUpdateComponent(selectedComponent.id, {
                  teamSize: value
                })}
              />
            </Form.Item>
            <Form.Item label="按钮文本">
              <Input
                defaultValue={selectedComponent.props?.buttonText || '立即参团'}
                onChange={(e) => onUpdateComponent(selectedComponent.id, {
                  buttonText: e.target.value
                })}
              />
            </Form.Item>
            <Form.Item label="商品设置">
              <Button onClick={() => {
                Modal.info({
                  title: '商品设置',
                  width: 600,
                  content: (
                    <div>
                      <p>商品编辑将在高级编辑器中提供</p>
                    </div>
                  ),
                });
              }}>商品选择</Button>
            </Form.Item>
          </Form>
        );
        
      case 'memberBenefits':
        return (
          <Form layout="vertical">
            <Form.Item label="会员权益标题">
              <Input
                defaultValue={selectedComponent.props?.title || ''}
                onChange={(e) => onUpdateComponent(selectedComponent.id, {
                  title: e.target.value
                })}
              />
            </Form.Item>
            <Form.Item label="描述文字">
              <Input.TextArea
                rows={2}
                defaultValue={selectedComponent.props?.description || ''}
                onChange={(e) => onUpdateComponent(selectedComponent.id, {
                  description: e.target.value
                })}
              />
            </Form.Item>
            <Form.Item label="列数">
              <Select
                defaultValue={selectedComponent.props?.columns || 3}
                onChange={(value) => onUpdateComponent(selectedComponent.id, {
                  columns: value
                })}
              >
                <Select.Option value={2}>2列</Select.Option>
                <Select.Option value={3}>3列</Select.Option>
                <Select.Option value={4}>4列</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="会员权益列表">
              <Button onClick={() => {
                const benefits = (selectedComponent.props?.benefits || []).map((b: any) => ({...b}));
                Modal.info({
                  title: '会员权益设置',
                  width: 600,
                  content: (
                    <div className="p-4">
                      <div className="my-4">
                        <Button type="primary" onClick={() => {
                          benefits.push({
                            icon: 'gift',
                            title: '新权益',
                            description: '会员专享权益'
                          });
                          onUpdateComponent(selectedComponent.id, {
                            benefits: [...benefits]
                          });
                          Modal.destroyAll();
                        }}>
                          添加权益
                        </Button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {benefits.map((benefit: any, index: number) => (
                          <div key={index} className="border p-3 my-2 rounded">
                            <div className="flex justify-between mb-2">
                              <div className="font-bold">{benefit.title || '未命名权益'}</div>
                              <Button 
                                type="text" 
                                danger
                                onClick={() => {
                                  const newBenefits = benefits.filter((_: any, i: number) => i !== index);
                                  onUpdateComponent(selectedComponent.id, {
                                    benefits: newBenefits
                                  });
                                  Modal.destroyAll();
                                }}
                              >
                                删除
                              </Button>
                            </div>
                            <div className="mb-2">
                              <div className="text-gray-500 mb-1">图标</div>
                              <Select
                                style={{ width: '100%' }}
                                defaultValue={benefit.icon || 'gift'}
                                onChange={(value) => {
                                  benefits[index].icon = value;
                                  onUpdateComponent(selectedComponent.id, {
                                    benefits: [...benefits]
                                  });
                                }}
                              >
                                <Select.Option value="discount">💰 折扣</Select.Option>
                                <Select.Option value="gift">🎁 礼品</Select.Option>
                                <Select.Option value="priority">⭐ 优先</Select.Option>
                                <Select.Option value="service">👨‍💼 服务</Select.Option>
                                <Select.Option value="delivery">🚚 配送</Select.Option>
                                <Select.Option value="return">↩️ 退换</Select.Option>
                                <Select.Option value="points">🏆 积分</Select.Option>
                                <Select.Option value="vip">👑 VIP</Select.Option>
                              </Select>
                            </div>
                            <div className="mb-2">
                              <div className="text-gray-500 mb-1">权益名称</div>
                              <Input
                                defaultValue={benefit.title}
                                onChange={(e) => {
                                  benefits[index].title = e.target.value;
                                  onUpdateComponent(selectedComponent.id, {
                                    benefits: [...benefits]
                                  });
                                }}
                              />
                            </div>
                            <div>
                              <div className="text-gray-500 mb-1">权益描述</div>
                              <Input
                                defaultValue={benefit.description}
                                onChange={(e) => {
                                  benefits[index].description = e.target.value;
                                  onUpdateComponent(selectedComponent.id, {
                                    benefits: [...benefits]
                                  });
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                });
              }}>编辑会员权益</Button>
            </Form.Item>
            <Form.Item label="按钮设置">
              <div className="mb-2">
                <div className="text-gray-500 mb-1">按钮文字</div>
                <Input
                  defaultValue={selectedComponent.props?.buttonText || '会员权益'}
                  onChange={(e) => onUpdateComponent(selectedComponent.id, {
                    buttonText: e.target.value
                  })}
                />
              </div>
              <div className="mb-2">
                <div className="text-gray-500 mb-1">会员价格</div>
                <InputNumber
                  min={0}
                  defaultValue={selectedComponent.props?.price || 30}
                  onChange={(value) => onUpdateComponent(selectedComponent.id, {
                    price: value
                  })}
                  addonAfter="元"
                  style={{ width: '100%' }}
                />
              </div>
              <div className="mb-2">
                <div className="text-gray-500 mb-1">时间单位</div>
                <Select
                  defaultValue={selectedComponent.props?.period || 'month'}
                  onChange={(value) => onUpdateComponent(selectedComponent.id, {
                    period: value
                  })}
                  style={{ width: '100%' }}
                >
                  <Select.Option value="day">天</Select.Option>
                  <Select.Option value="week">周</Select.Option>
                  <Select.Option value="month">月</Select.Option>
                  <Select.Option value="quarter">季度</Select.Option>
                  <Select.Option value="year">年</Select.Option>
                </Select>
              </div>
              <div className="mt-2">
                <div className="text-gray-500 mb-1">按钮颜色</div>
                <ColorPicker
                  defaultValue={selectedComponent.props?.buttonColor || '#8c54ff'}
                  onChange={(color) => onUpdateComponent(selectedComponent.id, {
                    buttonColor: color
                  })}
                />
              </div>
            </Form.Item>
            <Form.Item label="样式设置">
              <div className="mb-2">
                <div className="text-gray-500 mb-1">背景颜色</div>
                <ColorPicker
                  defaultValue={selectedComponent.props?.style?.backgroundColor || '#f9f0ff'}
                  onChange={(color) => onUpdateComponent(selectedComponent.id, {
                    style: { ...selectedComponent.props?.style, backgroundColor: color }
                  })}
                />
              </div>
              <div className="mb-2">
                <div className="text-gray-500 mb-1">圆角</div>
                <InputNumber
                  min={0}
                  max={50}
                  defaultValue={selectedComponent.props?.style?.borderRadius || 8}
                  onChange={(value) => onUpdateComponent(selectedComponent.id, {
                    style: { ...selectedComponent.props?.style, borderRadius: value }
                  })}
                  addonAfter="px"
                  style={{ width: '100%' }}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-gray-500 mb-1">上内边距</div>
                  <InputNumber
                    min={0}
                    max={50}
                    defaultValue={selectedComponent.props?.style?.paddingTop || 10}
                    onChange={(value) => onUpdateComponent(selectedComponent.id, {
                      style: { ...selectedComponent.props?.style, paddingTop: value }
                    })}
                    addonAfter="px"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <div className="text-gray-500 mb-1">下内边距</div>
                  <InputNumber
                    min={0}
                    max={50}
                    defaultValue={selectedComponent.props?.style?.paddingBottom || 10}
                    onChange={(value) => onUpdateComponent(selectedComponent.id, {
                      style: { ...selectedComponent.props?.style, paddingBottom: value }
                    })}
                    addonAfter="px"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </Form.Item>
          </Form>
        );
        
      case 'surveyForm':
        return (
          <Form layout="vertical">
            <Form.Item label="问卷标题">
              <Input
                defaultValue={selectedComponent.props?.title || ''}
                onChange={(e) => onUpdateComponent(selectedComponent.id, {
                  title: e.target.value
                })}
              />
            </Form.Item>
            <Form.Item label="问卷描述">
              <Input.TextArea
                rows={2}
                defaultValue={selectedComponent.props?.description || ''}
                onChange={(e) => onUpdateComponent(selectedComponent.id, {
                  description: e.target.value
                })}
              />
            </Form.Item>
            <Form.Item label="提交按钮文本">
              <Input
                defaultValue={selectedComponent.props?.buttonText || '提交'}
                onChange={(e) => onUpdateComponent(selectedComponent.id, {
                  buttonText: e.target.value
                })}
              />
            </Form.Item>
            <Form.Item label="奖励提示文本">
              <Input
                defaultValue={selectedComponent.props?.rewardText || '感谢您的参与！'}
                onChange={(e) => onUpdateComponent(selectedComponent.id, {
                  rewardText: e.target.value
                })}
              />
            </Form.Item>
            <Form.Item label="问题编辑">
              <Button onClick={() => {
                Modal.info({
                  title: '问卷问题编辑',
                  width: 600,
                  content: (
                    <div>
                      <p>问卷问题编辑将在高级编辑器中提供</p>
                    </div>
                  ),
                });
              }}>编辑问题</Button>
            </Form.Item>
          </Form>
        );

      case 'carousel':
        return (
          <Form layout="vertical">
            <Form.Item label="轮播图片设置">
              <Button onClick={() => {
                Modal.info({
                  title: '轮播图片设置',
                  width: 600,
                  content: (
                    <div>
                      <p>轮播图片编辑将在高级编辑器中提供</p>
                    </div>
                  ),
                });
              }}>编辑轮播图片</Button>
            </Form.Item>
            <Form.Item label="自动播放">
              <Switch
                defaultChecked={selectedComponent.props?.autoplay || false}
                onChange={(checked) => onUpdateComponent(selectedComponent.id, {
                  autoplay: checked
                })}
              />
            </Form.Item>
            <Form.Item label="轮播间隔(秒)">
              <InputNumber
                min={1}
                max={10}
                defaultValue={selectedComponent.props?.interval || 3}
                onChange={(value) => onUpdateComponent(selectedComponent.id, {
                  interval: value
                })}
              />
            </Form.Item>
          </Form>
        );
        
      case 'productList':
        return (
          <ProductListConfig 
            component={selectedComponent} 
            onChange={(updatedComponent) => {
              // 更新组件
              setComponents(prev => 
                prev.map(comp => 
                  comp.id === updatedComponent.id ? updatedComponent : comp
                )
              );
              
              // 更新选中的组件
              setSelectedComponent(updatedComponent);
              
              // 记录到历史
              setHistory(prev => ({
                past: [...prev.past, prev.present],
                present: prev.present.map(comp => 
                  comp.id === updatedComponent.id ? updatedComponent : comp
                ),
                future: [],
              }));
              setHistoryIndex(prev => prev + 1);
              setCanUndo(true);
              setCanRedo(false);
            }}
          />
        );
        
      case 'countdown':
        return (
          <Form layout="vertical">
            <Form.Item label="倒计时标题">
              <Input
                defaultValue={selectedComponent.props?.title || ''}
                onChange={(e) => onUpdateComponent(selectedComponent.id, {
                  title: e.target.value
                })}
              />
            </Form.Item>
            
            <Form.Item label="倒计时方式">
              <Select
                defaultValue={selectedComponent.props?.timeMode || 'endTime'}
                onChange={(value) => onUpdateComponent(selectedComponent.id, {
                  timeMode: value
                })}
                style={{ width: '100%' }}
              >
                <Select.Option value="endTime">结束时间</Select.Option>
                <Select.Option value="duration">剩余时长</Select.Option>
              </Select>
            </Form.Item>
            
            {(!selectedComponent.props?.timeMode || selectedComponent.props?.timeMode === 'endTime') && (
              <Form.Item label="结束时间">
                <DatePicker
                  showTime
                  placeholder="选择结束时间"
                  defaultValue={selectedComponent.props?.endTime ? dayjs(selectedComponent.props.endTime) : null}
                  onChange={(date) => onUpdateComponent(selectedComponent.id, {
                    endTime: date ? date.toISOString() : null
                  })}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            )}
            
            {selectedComponent.props?.timeMode === 'duration' && (
              <Form.Item label="剩余时长设置">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {selectedComponent.props?.showDays && (
                    <div>
                      <div className="text-gray-500 mb-1">天数</div>
                      <InputNumber 
                        min={0}
                        max={999}
                        defaultValue={selectedComponent.props?.remainingDays || 0}
                        onChange={(value) => onUpdateComponent(selectedComponent.id, {
                          remainingDays: value
                        })}
                        style={{ width: '100%' }}
                      />
                    </div>
                  )}
                  {selectedComponent.props?.showHours && (
                    <div>
                      <div className="text-gray-500 mb-1">小时</div>
                      <InputNumber 
                        min={0}
                        max={23}
                        defaultValue={selectedComponent.props?.remainingHours || 0}
                        onChange={(value) => onUpdateComponent(selectedComponent.id, {
                          remainingHours: value
                        })}
                        style={{ width: '100%' }}
                      />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {selectedComponent.props?.showMinutes && (
                    <div>
                      <div className="text-gray-500 mb-1">分钟</div>
                      <InputNumber 
                        min={0}
                        max={59}
                        defaultValue={selectedComponent.props?.remainingMinutes || 0}
                        onChange={(value) => onUpdateComponent(selectedComponent.id, {
                          remainingMinutes: value
                        })}
                        style={{ width: '100%' }}
                      />
                    </div>
                  )}
                  {selectedComponent.props?.showSeconds && (
                    <div>
                      <div className="text-gray-500 mb-1">秒钟</div>
                      <InputNumber 
                        min={0}
                        max={59}
                        defaultValue={selectedComponent.props?.remainingSeconds || 0}
                        onChange={(value) => onUpdateComponent(selectedComponent.id, {
                          remainingSeconds: value
                        })}
                        style={{ width: '100%' }}
                      />
                    </div>
                  )}
                </div>
                
                <div className="mt-3 mb-1 text-gray-500">快速设置</div>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="small" 
                    onClick={() => {
                      const updates: any = { };
                      if (selectedComponent.props?.showDays) updates.remainingDays = 0;
                      if (selectedComponent.props?.showHours) updates.remainingHours = 0;
                      if (selectedComponent.props?.showMinutes) updates.remainingMinutes = 30;
                      if (selectedComponent.props?.showSeconds) updates.remainingSeconds = 0;
                      onUpdateComponent(selectedComponent.id, updates);
                    }}
                  >
                    30分钟
                  </Button>
                  <Button 
                    size="small" 
                    onClick={() => {
                      const updates: any = { };
                      if (selectedComponent.props?.showDays) updates.remainingDays = 0;
                      if (selectedComponent.props?.showHours) updates.remainingHours = 1;
                      if (selectedComponent.props?.showMinutes) updates.remainingMinutes = 0;
                      if (selectedComponent.props?.showSeconds) updates.remainingSeconds = 0;
                      onUpdateComponent(selectedComponent.id, updates);
                    }}
                  >
                    1小时
                  </Button>
                  <Button 
                    size="small" 
                    onClick={() => {
                      const updates: any = { };
                      if (selectedComponent.props?.showDays) updates.remainingDays = 0;
                      if (selectedComponent.props?.showHours) updates.remainingHours = 24;
                      if (selectedComponent.props?.showMinutes) updates.remainingMinutes = 0;
                      if (selectedComponent.props?.showSeconds) updates.remainingSeconds = 0;
                      onUpdateComponent(selectedComponent.id, updates);
                    }}
                  >
                    24小时
                  </Button>
                  <Button 
                    size="small" 
                    onClick={() => {
                      const updates: any = { };
                      if (selectedComponent.props?.showDays) updates.remainingDays = 3;
                      if (selectedComponent.props?.showHours) updates.remainingHours = 0;
                      if (selectedComponent.props?.showMinutes) updates.remainingMinutes = 0;
                      if (selectedComponent.props?.showSeconds) updates.remainingSeconds = 0;
                      onUpdateComponent(selectedComponent.id, updates);
                    }}
                  >
                    3天
                  </Button>
                  <Button 
                    size="small" 
                    onClick={() => {
                      const updates: any = { };
                      if (selectedComponent.props?.showDays) updates.remainingDays = 7;
                      if (selectedComponent.props?.showHours) updates.remainingHours = 0;
                      if (selectedComponent.props?.showMinutes) updates.remainingMinutes = 0;
                      if (selectedComponent.props?.showSeconds) updates.remainingSeconds = 0;
                      onUpdateComponent(selectedComponent.id, updates);
                    }}
                  >
                    1周
                  </Button>
                </div>
                
                {(!selectedComponent.props?.showDays && 
                  !selectedComponent.props?.showHours && 
                  !selectedComponent.props?.showMinutes && 
                  !selectedComponent.props?.showSeconds) && (
                  <div className="text-orange-500 mt-2">
                    请在下方"显示设置"中至少选择一个时间单位
                  </div>
                )}
              </Form.Item>
            )}
            
            <Form.Item label="UI 样式">
              <Select
                defaultValue={selectedComponent.props?.styleType || 'modern'}
                onChange={(value) => onUpdateComponent(selectedComponent.id, {
                  styleType: value
                })}
                style={{ width: '100%' }}
              >
                <Select.Option value="modern">现代风格</Select.Option>
                <Select.Option value="taobao">淘宝风格</Select.Option>
                <Select.Option value="pinduoduo">拼多多风格</Select.Option>
                <Select.Option value="elegant">优雅暗色风格</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="显示描述">
              <Input
                defaultValue={selectedComponent.props?.description || ''}
                placeholder="在倒计时下方显示的文本描述"
                onChange={(e) => onUpdateComponent(selectedComponent.id, {
                  description: e.target.value
                })}
              />
            </Form.Item>
            <Form.Item label="时间结束文本">
              <Input
                defaultValue={selectedComponent.props?.timeUpText || '活动已结束，请关注下一场活动'}
                placeholder="倒计时结束后显示的文本"
                onChange={(e) => onUpdateComponent(selectedComponent.id, {
                  timeUpText: e.target.value
                })}
              />
            </Form.Item>
            <Form.Item label="显示设置">
              <Checkbox.Group
                defaultValue={[
                  ...(selectedComponent.props?.showDays ? ['days'] : []),
                  ...(selectedComponent.props?.showHours ? ['hours'] : []),
                  ...(selectedComponent.props?.showMinutes ? ['minutes'] : []),
                  ...(selectedComponent.props?.showSeconds ? ['seconds'] : [])
                ]}
                onChange={(values) => {
                  onUpdateComponent(selectedComponent.id, {
                    showDays: values.includes('days'),
                    showHours: values.includes('hours'),
                    showMinutes: values.includes('minutes'),
                    showSeconds: values.includes('seconds')
                  });
                }}
              >
                <Checkbox value="days">天</Checkbox>
                <Checkbox value="hours">时</Checkbox>
                <Checkbox value="minutes">分</Checkbox>
                <Checkbox value="seconds">秒</Checkbox>
              </Checkbox.Group>
            </Form.Item>
          </Form>
        );
      
      case 'seckill':
        return (
          <Form layout="vertical">
            <Collapse defaultActiveKey={['1']} ghost>
              <Collapse.Panel header="基础设置" key="1">
                <Form.Item label="标题">
                  <Input
                    defaultValue={selectedComponent.props?.title || ''}
                    onChange={(e) => onUpdateComponent(selectedComponent.id, {
                      title: e.target.value
                    })}
                  />
                </Form.Item>
                <Form.Item label="商品描述">
                  <Input.TextArea
                    rows={2}
                    defaultValue={selectedComponent.props?.description || ''}
                    onChange={(e) => onUpdateComponent(selectedComponent.id, {
                      description: e.target.value
                    })}
                  />
                </Form.Item>
                <Form.Item label="UI风格">
                  <Select
                    defaultValue={selectedComponent.props?.uiStyle || 'jd'}
                    onChange={(value) => onUpdateComponent(selectedComponent.id, {
                      uiStyle: value
                    })}
                    style={{ width: '100%' }}
                  >
                    <Select.Option value="jd">京东风格</Select.Option>
                    <Select.Option value="taobao">淘宝风格</Select.Option>
                    <Select.Option value="pdd">拼多多风格</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="布局方式">
                  <Select
                    defaultValue={selectedComponent.props?.layoutType || 'horizontal'}
                    onChange={(value) => onUpdateComponent(selectedComponent.id, {
                      layoutType: value
                    })}
                    style={{ width: '100%' }}
                  >
                    <Select.Option value="horizontal">水平布局</Select.Option>
                    <Select.Option value="vertical">垂直布局</Select.Option>
                  </Select>
                </Form.Item>
              </Collapse.Panel>
              
              <Collapse.Panel header="商品价格" key="2">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <div className="text-gray-500 mb-1">促销价</div>
                    <Input
                      defaultValue={selectedComponent.props?.salePrice || '9.9'}
                      onChange={(e) => onUpdateComponent(selectedComponent.id, {
                        salePrice: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">原价</div>
                    <Input
                      defaultValue={selectedComponent.props?.originalPrice || '99'}
                      onChange={(e) => onUpdateComponent(selectedComponent.id, {
                        originalPrice: e.target.value
                      })}
                    />
                  </div>
                </div>
                <Form.Item label="显示折扣率">
                  <Switch
                    defaultChecked={selectedComponent.props?.showDiscountPercent !== false}
                    onChange={(checked) => onUpdateComponent(selectedComponent.id, {
                      showDiscountPercent: checked
                    })}
                  />
                </Form.Item>
                <Form.Item label="显示优惠金额">
                  <Switch
                    defaultChecked={selectedComponent.props?.showSavedAmount !== false}
                    onChange={(checked) => onUpdateComponent(selectedComponent.id, {
                      showSavedAmount: checked
                    })}
                  />
                </Form.Item>
              </Collapse.Panel>
              
              <Collapse.Panel header="倒计时设置" key="3">
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <div className="text-gray-500 mb-1">小时</div>
                    <Input
                      defaultValue={selectedComponent.props?.hours || '01'}
                      onChange={(e) => onUpdateComponent(selectedComponent.id, {
                        hours: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">分钟</div>
                    <Input
                      defaultValue={selectedComponent.props?.minutes || '45'}
                      onChange={(e) => onUpdateComponent(selectedComponent.id, {
                        minutes: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">秒数</div>
                    <Input
                      defaultValue={selectedComponent.props?.seconds || '37'}
                      onChange={(e) => onUpdateComponent(selectedComponent.id, {
                        seconds: e.target.value
                      })}
                    />
                  </div>
                </div>
                
                <div className="mt-3 mb-1 text-gray-500">快速设置</div>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="small" 
                    onClick={() => {
                      onUpdateComponent(selectedComponent.id, {
                        hours: '00',
                        minutes: '15',
                        seconds: '00'
                      });
                    }}
                  >
                    15分钟
                  </Button>
                  <Button 
                    size="small" 
                    onClick={() => {
                      onUpdateComponent(selectedComponent.id, {
                        hours: '00',
                        minutes: '30',
                        seconds: '00'
                      });
                    }}
                  >
                    30分钟
                  </Button>
                  <Button 
                    size="small" 
                    onClick={() => {
                      onUpdateComponent(selectedComponent.id, {
                        hours: '01',
                        minutes: '00',
                        seconds: '00'
                      });
                    }}
                  >
                    1小时
                  </Button>
                  <Button 
                    size="small" 
                    onClick={() => {
                      onUpdateComponent(selectedComponent.id, {
                        hours: '24',
                        minutes: '00',
                        seconds: '00'
                      });
                    }}
                  >
                    24小时
                  </Button>
                </div>
              </Collapse.Panel>
              
              <Collapse.Panel header="按钮设置" key="4">
                <Form.Item label="按钮文字">
                  <Input
                    defaultValue={selectedComponent.props?.buttonText || '立即抢购'}
                    onChange={(e) => onUpdateComponent(selectedComponent.id, {
                      buttonText: e.target.value
                    })}
                  />
                </Form.Item>
                <Form.Item label="按钮大小">
                  <Select
                    defaultValue={selectedComponent.props?.signButtonSize || 'middle'}
                    onChange={(value) => onUpdateComponent(selectedComponent.id, {
                      signButtonSize: value
                    })}
                  >
                    <Select.Option value="large">大</Select.Option>
                    <Select.Option value="middle">中</Select.Option>
                    <Select.Option value="small">小</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="自定义按钮颜色">
                  <Switch
                    defaultChecked={selectedComponent.props?.customButtonColor === true}
                    onChange={(checked) => onUpdateComponent(selectedComponent.id, {
                      customButtonColor: checked
                    })}
                  />
                </Form.Item>
                {selectedComponent.props?.customButtonColor && (
                  <Form.Item label="按钮颜色">
                    <ColorPicker
                      defaultValue={selectedComponent.props?.buttonColorHex || '#ff4d4f'}
                      onChange={(color) => onUpdateComponent(selectedComponent.id, {
                        buttonColorHex: color.toHexString()
                      })}
                    />
                  </Form.Item>
                )}
              </Collapse.Panel>
              
              <Collapse.Panel header="高级设置" key="5">
                <Form.Item label="显示角标">
                  <Switch
                    defaultChecked={selectedComponent.props?.showBadges !== false}
                    onChange={(checked) => onUpdateComponent(selectedComponent.id, {
                      showBadges: checked
                    })}
                  />
                </Form.Item>
                {selectedComponent.props?.showBadges !== false && (
                  <>
                    <Form.Item label="角标文本">
                      <Input
                        defaultValue={selectedComponent.props?.badgeText || '秒杀'}
                        onChange={(e) => onUpdateComponent(selectedComponent.id, {
                          badgeText: e.target.value
                        })}
                      />
                    </Form.Item>
                  </>
                )}
                <Form.Item label="显示库存信息">
                  <Switch
                    defaultChecked={selectedComponent.props?.showStockInfo === true}
                    onChange={(checked) => onUpdateComponent(selectedComponent.id, {
                      showStockInfo: checked
                    })}
                  />
                </Form.Item>
                {selectedComponent.props?.showStockInfo && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-gray-500 mb-1">库存量</div>
                      <Input
                        defaultValue={selectedComponent.props?.stockInfo || '100'}
                        onChange={(e) => onUpdateComponent(selectedComponent.id, {
                          stockInfo: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">已售量</div>
                      <Input
                        defaultValue={selectedComponent.props?.soldCount || '45'}
                        onChange={(e) => onUpdateComponent(selectedComponent.id, {
                          soldCount: e.target.value
                        })}
                      />
                    </div>
                  </div>
                )}
              </Collapse.Panel>
            </Collapse>
          </Form>
        );
      
      case 'workoutResult':
        return (
          <Form layout="vertical">
            <Collapse defaultActiveKey={['basic', 'map', 'data', 'badge', 'workout_stats']} className="mb-3">
              <Collapse.Panel header="基础信息" key="basic">
                <Form.Item label="状态栏时间">
                  <Input
                    value={selectedComponent.props?.statusBarTime || '15:33'}
                    onChange={(e) => onUpdateComponent(selectedComponent.id, {
                      statusBarTime: e.target.value
                    })}
                    placeholder="格式: HH:MM"
                  />
                </Form.Item>

                <Form.Item label="标题">
                  <Input
                    defaultValue={selectedComponent.props.title || ''}
                    onChange={(e) => onUpdateComponent(selectedComponent.id, { title: e.target.value })}
                    placeholder="例如：户外跑步"
                  />
                </Form.Item>
                <Form.Item label="区域名称">
                  <Input
                    defaultValue={selectedComponent.props.areaName || ''}
                    onChange={(e) => onUpdateComponent(selectedComponent.id, { areaName: e.target.value })}
                    placeholder="例如：松江区"
                  />
                </Form.Item>
                <Form.Item label="附加文本">
                  <Input
                    defaultValue={selectedComponent.props.extraText || ''}
                    onChange={(e) => onUpdateComponent(selectedComponent.id, { extraText: e.target.value })}
                    placeholder="例如：最长跑步时间"
                  />
                </Form.Item>
                <Form.Item label="分享按钮文本">
                  <Input
                    defaultValue={selectedComponent.props.shareButtonText || '分享'}
                    onChange={(e) => onUpdateComponent(selectedComponent.id, { shareButtonText: e.target.value })}
                    placeholder="例如：发布动态到社区"
                  />
                </Form.Item>
                <Form.Item label="用户名">
                  <Input
                    defaultValue={selectedComponent.props.username || ''}
                    onChange={(e) => onUpdateComponent(selectedComponent.id, { username: e.target.value })}
                    placeholder="例如：来自未来的哦哟"
                  />
                </Form.Item>
                <Form.Item label="头像URL">
                  <Input
                    defaultValue={selectedComponent.props.avatar || ''}
                    onChange={(e) => onUpdateComponent(selectedComponent.id, { avatar: e.target.value })}
                    placeholder="输入头像图片URL"
                  />
                </Form.Item>
                <Form.Item label="显示隐私标志">
                  <Switch
                    checked={selectedComponent.props.isPrivate || false}
                    onChange={(checked) => onUpdateComponent(selectedComponent.id, { isPrivate: checked })}
                  />
                </Form.Item>
              </Collapse.Panel>
              
              <Collapse.Panel header="地图设置" key="map">
                <Form.Item label="使用真实地图">
                  <Switch
                    checked={(selectedComponent.props as any).useRealMap || false}
                    onChange={(checked) => onUpdateComponent(selectedComponent.id, { useRealMap: checked })}
                  />
                </Form.Item>
                
                {(selectedComponent.props as any).useRealMap ? (
                  <>
                    <Form.Item label="地图缩放级别">
                      <InputNumber
                        min={1}
                        max={20}
                        value={(selectedComponent.props as any).mapZoom || 14}
                        onChange={(value) => onUpdateComponent(selectedComponent.id, { mapZoom: value })}
                      />
                    </Form.Item>
                    
                    <Form.Item label="地图中心点">
                      <div className="flex space-x-2">
                        <InputNumber
                          min={-180}
                          max={180}
                          value={(selectedComponent.props as any).mapCenter?.lng || 113.23587}
                          onChange={(value) => {
                            const current = (selectedComponent.props as any).mapCenter || { lng: 113.23587, lat: 23.09857 };
                            onUpdateComponent(selectedComponent.id, { 
                              mapCenter: { ...current, lng: value } 
                            });
                          }}
                          addonBefore="经度"
                          style={{ width: '50%' }}
                        />
                        <InputNumber
                          min={-90}
                          max={90}
                          value={(selectedComponent.props as any).mapCenter?.lat || 23.09857}
                          onChange={(value) => {
                            const current = (selectedComponent.props as any).mapCenter || { lng: 113.23587, lat: 23.09857 };
                            onUpdateComponent(selectedComponent.id, { 
                              mapCenter: { ...current, lat: value } 
                            });
                          }}
                          addonBefore="纬度"
                          style={{ width: '50%' }}
                        />
                      </div>
                    </Form.Item>
                    
                    <Form.Item label="轨迹颜色">
                      <ColorPicker
                        value={(selectedComponent.props as any).mapTrackColor || '#000000'}
                        onChange={(color) => onUpdateComponent(selectedComponent.id, { mapTrackColor: color.toHexString() })}
                      />
                    </Form.Item>
                    
                    <Form.Item label="轨迹线宽">
                      <InputNumber
                        min={1}
                        max={10}
                        value={(selectedComponent.props as any).mapTrackWidth || 2}
                        onChange={(value) => onUpdateComponent(selectedComponent.id, { mapTrackWidth: value })}
                      />
                    </Form.Item>
                    
                    <Form.Item label="显示地图装饰">
                      <Switch
                        checked={(selectedComponent.props as any).showDecoration || false}
                        onChange={(checked) => onUpdateComponent(selectedComponent.id, { showDecoration: checked })}
                      />
                    </Form.Item>
                    
                    {(selectedComponent.props as any).showDecoration && (
                      <Form.Item label="装饰类型">
                        <Select
                          value={(selectedComponent.props as any).decorationType || 'christmas'}
                          onChange={(value) => onUpdateComponent(selectedComponent.id, { decorationType: value })}
                        >
                          <Select.Option value="christmas">圣诞节(圣诞树+雪人)</Select.Option>
                          <Select.Option value="newyear">新年(礼品)</Select.Option>
                        </Select>
                      </Form.Item>
                    )}
                    
                    <Form.Item label="轨迹点">
                      <div className="border rounded p-2 bg-gray-50">
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <div className="text-xs text-gray-500">
                            设置路线上的各个点，格式为"纬度,经度"，以分号分隔。
                          </div>
                          <Input.TextArea
                            value={(selectedComponent.props as any).routePoints || ''}
                            onChange={(e) => onUpdateComponent(selectedComponent.id, { routePoints: e.target.value })}
                            placeholder="31.033,121.211;31.036,121.214;..."
                            autoSize={{ minRows: 3, maxRows: 6 }}
                          />
                          <Button 
                            size="small" 
                            type="primary"
                            onClick={() => {
                              // 打开路线编辑模态窗口的逻辑
                              Modal.info({
                                title: '轨迹点编辑',
                                content: (
                                  <div style={{ maxHeight: '70vh', overflow: 'auto' }}>
                                    <RouteEditor
                                      routePoints={(selectedComponent.props as any).routePoints || ''}
                                      trackColor={(selectedComponent.props as any).mapTrackColor || '#000000'}
                                      trackWidth={(selectedComponent.props as any).mapTrackWidth || 2}
                                      onChange={(routePoints) => onUpdateComponent(selectedComponent.id, { routePoints })}
                                      onDistanceChange={(distance) => onUpdateComponent(selectedComponent.id, { distance })}
                                    />
                                  </div>
                                ),
                                width: 800,
                                maskClosable: true,
                                okText: '关闭',
                                onOk() {}
                              });
                            }}
                          >
                            可视化编辑轨迹点
                          </Button>
                        </Space>
                      </div>
                    </Form.Item>
                  </>
                ) : (
                  <>
                    <Form.Item label="地图图片URL">
                      <Input
                        defaultValue={(selectedComponent.props as any).mapImage || ''}
                        onChange={(e) => onUpdateComponent(selectedComponent.id, { mapImage: e.target.value })}
                        placeholder="输入地图图片URL"
                      />
                    </Form.Item>
                    <Form.Item label="轨迹颜色">
                      <ColorPicker
                        value={(selectedComponent.props as any).mapTrackColor || '#000000'}
                        onChange={(color) => onUpdateComponent(selectedComponent.id, { mapTrackColor: color.toHexString() })}
                      />
                    </Form.Item>
                    <Form.Item label="轨迹线宽">
                      <InputNumber
                        min={1}
                        max={10}
                        value={selectedComponent.props.mapTrackWidth || 2}
                        onChange={(value) => onUpdateComponent(selectedComponent.id, { mapTrackWidth: value })}
                      />
                    </Form.Item>
                  </>
                )}
              </Collapse.Panel>
              
              <Collapse.Panel header="徽章设置" key="badge">
                <Form.Item label="显示徽章">
                  <Switch 
                    checked={selectedComponent.props.showBadge} 
                    onChange={value => onUpdateComponent(selectedComponent.id, { showBadge: value })} 
                  />
                </Form.Item>
                {selectedComponent.props.showBadge && (
                  <>
                    <Form.Item label="徽章数字">
                      <InputNumber 
                        min={0} 
                        max={99} 
                        value={selectedComponent.props.badgeNumber} 
                        onChange={value => onUpdateComponent(selectedComponent.id, { badgeNumber: value })} 
                      />
                    </Form.Item>
                    <Form.Item label="徽章样式">
                      <Radio.Group 
                        value={selectedComponent.props.badgeStyle || 'gold'} 
                        onChange={e => onUpdateComponent(selectedComponent.id, { badgeStyle: e.target.value })}
                      >
                        <Radio.Button value="gold">金牌</Radio.Button>
                        <Radio.Button value="silver">银牌</Radio.Button>
                        <Radio.Button value="bronze">铜牌</Radio.Button>
                      </Radio.Group>
                    </Form.Item>
                  </>
                )}
              </Collapse.Panel>
              
              <Collapse.Panel header="运动数据统计" key="workout_stats">
                <Form.Item label="运动距离">
                  <InputNumber
                    value={selectedComponent.props?.distance || 5.00}
                    onChange={(value) => onUpdateComponent(selectedComponent.id, {
                      distance: value
                    })}
                    min={0}
                    max={1000}
                    step={0.01}
                    addonAfter="公里"
                    style={{ width: '100%' }}
                  />
                </Form.Item>

                <Form.Item label="训练时长">
                  <Input
                    value={selectedComponent.props?.trainingTime || '01:37:18'}
                    onChange={(e) => onUpdateComponent(selectedComponent.id, {
                      trainingTime: e.target.value
                    })}
                    placeholder="格式: HH:MM:SS"
                  />
                </Form.Item>
                
                <Form.Item label="总时长">
                  <Input
                    value={selectedComponent.props?.totalTime || '01:37:28'}
                    onChange={(e) => onUpdateComponent(selectedComponent.id, {
                      totalTime: e.target.value
                    })}
                    placeholder="格式: HH:MM:SS"
                  />
                </Form.Item>
                
                <Form.Item label="平均配速">
                  <Input
                    value={selectedComponent.props?.avgPace || "06'20\""}
                    onChange={(e) => onUpdateComponent(selectedComponent.id, {
                      avgPace: e.target.value
                    })}
                    placeholder={'格式: MM\'SS"'}
                  />
                </Form.Item>
                
                <Form.Item label="平均心率">
                  <InputNumber
                    value={selectedComponent.props?.avgHeartRate || 162}
                    onChange={(value) => onUpdateComponent(selectedComponent.id, {
                      avgHeartRate: value
                    })}
                    min={0}
                    max={250}
                    addonAfter="次/分"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                
                <Form.Item label="运动消耗">
                  <InputNumber
                    value={selectedComponent.props?.calories || 1535}
                    onChange={(value) => onUpdateComponent(selectedComponent.id, {
                      calories: value
                    })}
                    min={0}
                    addonAfter="千卡"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                
                <Form.Item label="爬升高度">
                  <InputNumber
                    value={selectedComponent.props?.elevationGain || 40}
                    onChange={(value) => onUpdateComponent(selectedComponent.id, {
                      elevationGain: value
                    })}
                    min={0}
                    addonAfter="米"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                
                <Form.Item label="平均步频">
                  <InputNumber
                    value={selectedComponent.props?.avgStepFrequency || 168}
                    onChange={(value) => onUpdateComponent(selectedComponent.id, {
                      avgStepFrequency: value
                    })}
                    min={0}
                    max={300}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                
                <Form.Item label="平均步幅">
                  <InputNumber
                    value={selectedComponent.props?.avgStepLength || 0.93}
                    onChange={(value) => onUpdateComponent(selectedComponent.id, {
                      avgStepLength: value
                    })}
                    min={0}
                    max={3}
                    step={0.01}
                    addonAfter="米"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                
                <Form.Item label="显示运动数据">
                  <Switch
                    checked={selectedComponent.props?.showStats !== false}
                    onChange={(checked) => onUpdateComponent(selectedComponent.id, {
                      showStats: checked
                    })}
                  />
                </Form.Item>
              </Collapse.Panel>
            </Collapse>
          </Form>
        );
      
      default:
        return <div>暂不支持该组件类型的内容设置</div>;
    }
  }
} 