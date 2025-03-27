'use client';
import { useCallback, useEffect, useState } from 'react';
import { Form, Input, InputNumber, ColorPicker, Select, Tabs, Space, Tag, Button, Modal, Switch, Checkbox, DatePicker, Table, Alert, Divider } from 'antd';
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
                defaultValue={selectedComponent.props?.title}
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
          <Form layout="vertical">
            <Form.Item label="优惠券标题">
              <Input
                defaultValue={selectedComponent.props?.title}
                onChange={(e) => onUpdateComponent(selectedComponent.id, {
                  title: e.target.value
                })}
              />
            </Form.Item>
            <Form.Item label="优惠券设置">
              <Button onClick={() => {
                Modal.info({
                  title: '优惠券设置',
                  width: 600,
                  content: (
                    <div>
                      <p>优惠券编辑将在高级编辑器中提供</p>
                    </div>
                  ),
                });
              }}>打开优惠券编辑器</Button>
            </Form.Item>
          </Form>
        );
        
      case 'checkinCalendar':
        return (
          <Form layout="vertical">
            <Form.Item label="签到标题">
              <Input
                defaultValue={selectedComponent.props?.title}
                onChange={(e) => onUpdateComponent(selectedComponent.id, {
                  title: e.target.value
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
          </Form>
        );
        
      case 'teamBuying':
        return (
          <Form layout="vertical">
            <Form.Item label="拼团标题">
              <Input
                defaultValue={selectedComponent.props?.title}
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
                defaultValue={selectedComponent.props?.buttonText}
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
                defaultValue={selectedComponent.props?.title}
                onChange={(e) => onUpdateComponent(selectedComponent.id, {
                  title: e.target.value
                })}
              />
            </Form.Item>
            <Form.Item label="权益设置">
              <Button onClick={() => {
                Modal.info({
                  title: '会员权益设置',
                  width: 600,
                  content: (
                    <div>
                      <p>会员权益编辑将在高级编辑器中提供</p>
                    </div>
                  ),
                });
              }}>编辑会员权益</Button>
            </Form.Item>
          </Form>
        );
        
      case 'surveyForm':
        return (
          <Form layout="vertical">
            <Form.Item label="问卷标题">
              <Input
                defaultValue={selectedComponent.props?.title}
                onChange={(e) => onUpdateComponent(selectedComponent.id, {
                  title: e.target.value
                })}
              />
            </Form.Item>
            <Form.Item label="问卷描述">
              <Input.TextArea
                rows={2}
                defaultValue={selectedComponent.props?.description}
                onChange={(e) => onUpdateComponent(selectedComponent.id, {
                  description: e.target.value
                })}
              />
            </Form.Item>
            <Form.Item label="提交按钮文本">
              <Input
                defaultValue={selectedComponent.props?.buttonText}
                onChange={(e) => onUpdateComponent(selectedComponent.id, {
                  buttonText: e.target.value
                })}
              />
            </Form.Item>
            <Form.Item label="奖励提示文本">
              <Input
                defaultValue={selectedComponent.props?.rewardText}
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
          <Form layout="vertical">
            <Form.Item label="商品列表标题">
              <Input
                defaultValue={selectedComponent.props?.title}
                onChange={(e) => onUpdateComponent(selectedComponent.id, {
                  title: e.target.value
                })}
              />
            </Form.Item>
            <Form.Item label="列表类型">
              <Select
                defaultValue={selectedComponent.props?.viewMode || 'grid'}
                onChange={(value) => onUpdateComponent(selectedComponent.id, {
                  viewMode: value
                })}
              >
                <Select.Option value="grid">网格视图</Select.Option>
                <Select.Option value="list">列表视图</Select.Option>
                <Select.Option value="card">卡片视图</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="商品列数">
              <InputNumber
                min={1}
                max={4}
                defaultValue={selectedComponent.props?.columns || 2}
                onChange={(value) => onUpdateComponent(selectedComponent.id, {
                  columns: value
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
              }}>选择商品</Button>
            </Form.Item>
          </Form>
        );
        
      case 'countdown':
        return (
          <Form layout="vertical">
            <Form.Item label="倒计时标题">
              <Input
                defaultValue={selectedComponent.props?.title}
                onChange={(e) => onUpdateComponent(selectedComponent.id, {
                  title: e.target.value
                })}
              />
            </Form.Item>
            <Form.Item label="结束时间">
              <DatePicker
                showTime
                placeholder="选择结束时间"
                defaultValue={selectedComponent.props?.endTime ? dayjs(selectedComponent.props.endTime) : null}
                onChange={(date) => onUpdateComponent(selectedComponent.id, {
                  endTime: date ? date.toISOString() : null
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
      
      default:
        return <div>暂不支持该组件类型的内容设置</div>;
    }
  }
} 