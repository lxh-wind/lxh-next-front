'use client';

import { Form, Input, InputNumber, ColorPicker, Select, Switch, Tabs, Slider } from 'antd';
import { useEffect } from 'react';
import { PropertyPanelProps } from './types';
import dynamic from 'next/dynamic';

// 动态导入抽奖转盘属性面板
const LuckyWheelPropertyPanel = dynamic(() => import('./marketing/PropertyPanel'), { ssr: false });

export default function PropertyPanel({
  selectedComponent,
  onUpdateComponent
}: PropertyPanelProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedComponent) {
      form.setFieldsValue(selectedComponent.props);
    } else {
      form.resetFields();
    }
  }, [selectedComponent, form]);

  const handleValuesChange = (changedValues: any) => {
    if (selectedComponent) {
      onUpdateComponent(selectedComponent.id, changedValues);
    }
  };

  if (!selectedComponent) {
    return (
      <div className="p-4 text-center text-gray-400">
        <p>请选择一个组件来编辑属性</p>
      </div>
    );
  }

  // 根据组件类型获取不同的属性标签页
  const getTabs = () => {
    const basicTab = {
      key: 'basic',
      label: '属性',
      children: getBasicTabContent(),
    };

    const styleTab = {
      key: 'style',
      label: '样式',
      children: getStyleTabContent(),
    };

    const animationTab = {
      key: 'animation',
      label: '动画',
      children: getAnimationTabContent(),
    };

    return [basicTab, styleTab, animationTab];
  };

  // 基础属性标签页内容
  const getBasicTabContent = () => {
    return (
      <div className="px-4">
        <Form
          form={form}
          layout="vertical"
          onValuesChange={handleValuesChange}
          initialValues={selectedComponent.props}
          className="px-4"
        >
          {/* 文本组件属性 */}
          {selectedComponent.type === 'text' && (
            <>
              <Form.Item name="content" label="文本内容">
                <Input.TextArea rows={4} />
              </Form.Item>
            </>
          )}

          {/* 图片组件属性 */}
          {selectedComponent.type === 'image' && (
            <>
              <Form.Item name="src" label="图片链接">
                <Input />
              </Form.Item>
              <Form.Item name="alt" label="图片描述">
                <Input />
              </Form.Item>
            </>
          )}

          {/* 按钮组件属性 */}
          {selectedComponent.type === 'button' && (
            <>
              <Form.Item name="text" label="按钮文字">
                <Input />
              </Form.Item>
              <Form.Item name="type" label="按钮类型">
                <Select>
                  <Select.Option value="primary">主要按钮</Select.Option>
                  <Select.Option value="default">默认按钮</Select.Option>
                  <Select.Option value="dashed">虚线按钮</Select.Option>
                  <Select.Option value="link">链接按钮</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="link" label="跳转链接">
                <Input />
              </Form.Item>
            </>
          )}

          {/* 轮播图组件属性 */}
          {selectedComponent.type === 'carousel' && (
            <>
              <Form.Item name="autoplay" label="自动播放" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item name="interval" label="播放间隔">
                <InputNumber addonAfter="ms" style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="images" label="图片列表">
                <Input.TextArea
                  rows={4}
                  placeholder="每行一个图片URL"
                />
              </Form.Item>
            </>
          )}

          {/* 商品列表组件属性 */}
          {selectedComponent.type === 'productList' && (
            <>
              <Form.Item name="productIds" label="商品ID列表">
                <Input.TextArea
                  rows={4}
                  placeholder="每行一个商品ID"
                />
              </Form.Item>
              <Form.Item name="columns" label="列数">
                <Select>
                  <Select.Option value={1}>1列</Select.Option>
                  <Select.Option value={2}>2列</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="showPrice" label="显示价格" valuePropName="checked">
                <Switch />
              </Form.Item>
            </>
          )}

          {/* 抽奖转盘组件属性 */}
          {selectedComponent.type === 'luckyWheel' && (
            <LuckyWheelPropertyPanel
              value={selectedComponent.props}
              onChange={(values) => {
                onUpdateComponent(selectedComponent.id, values);
              }}
            />
          )}
        </Form>
      </div>
    )
  };

  // 样式标签页内容
  const getStyleTabContent = () => {
    return (
      <div className="px-4">
        <Form
          form={form}
          layout="vertical"
          onValuesChange={handleValuesChange}
          initialValues={selectedComponent.props}
          className="px-4"
        >
          <div className="border-b pb-2 mb-4">
            <h3 className="text-sm text-gray-500">组件名称</h3>
            <div className="font-medium">Title</div>
          </div>

          {selectedComponent.type === 'text' && (
            <>
              <Form.Item name={['style', 'color']} label="文字颜色">
                <ColorPicker />
              </Form.Item>
              <Form.Item name={['style', 'fontSize']} label="文字大小">
                <Slider min={12} max={40} step={1} />
              </Form.Item>
              <Form.Item name={['style', 'fontWeight']} label="文字粗细">
                <Select>
                  <Select.Option value="normal">正常</Select.Option>
                  <Select.Option value="bold">粗体</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name={['style', 'textAlign']} label="对齐方式">
                <Select>
                  <Select.Option value="left">左对齐</Select.Option>
                  <Select.Option value="center">居中</Select.Option>
                  <Select.Option value="right">右对齐</Select.Option>
                </Select>
              </Form.Item>
            </>
          )}

          {selectedComponent.type === 'image' && (
            <>
              <Form.Item name={['style', 'width']} label="宽度">
                <Slider min={10} max={100} step={1} tipFormatter={value => `${value}%`} />
              </Form.Item>
              <Form.Item name={['style', 'borderRadius']} label="圆角">
                <Slider min={0} max={50} step={1} />
              </Form.Item>
            </>
          )}

          {selectedComponent.type === 'button' && (
            <>
              <Form.Item name={['style', 'width']} label="宽度">
                <Slider min={10} max={100} step={1} tipFormatter={value => `${value}%`} />
              </Form.Item>
            </>
          )}

          <div className="border-t pt-2 mt-4">
            <h3 className="text-sm text-gray-500 mb-2">公共样式</h3>
            <Form.Item name={['style', 'marginTop']} label="上边距">
              <Slider min={0} max={100} step={1} />
            </Form.Item>
            <Form.Item name={['style', 'marginBottom']} label="下边距">
              <Slider min={0} max={100} step={1} />
            </Form.Item>
            <Form.Item name={['style', 'backgroundColor']} label="背景颜色">
              <ColorPicker />
            </Form.Item>
            <Form.Item name={['style', 'padding']} label="内边距">
              <Slider min={0} max={50} step={1} />
            </Form.Item>
          </div>
        </Form>
      </div>
    );
  };

  // 动画标签页内容
  const getAnimationTabContent = () => {
    return (
      <div className="px-4">
        <Form
          form={form}
          layout="vertical"
          onValuesChange={handleValuesChange}
          initialValues={selectedComponent.props}
          className="px-4"
        >
          <Form.Item name="animation" label="动画效果">
            <Select>
              <Select.Option value="">无</Select.Option>
              <Select.Option value="fade">淡入</Select.Option>
              <Select.Option value="slide">滑动</Select.Option>
              <Select.Option value="bounce">弹跳</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="animationDuration" label="动画时长">
            <Slider min={100} max={2000} step={100} tipFormatter={value => `${value}ms`} />
          </Form.Item>
        </Form>
      </div>
    );
  };

  return (
    <div>
      <Tabs
        defaultActiveKey="basic"
        items={getTabs()}
        className="px-0"
        centered
      />
    </div>
  );
} 