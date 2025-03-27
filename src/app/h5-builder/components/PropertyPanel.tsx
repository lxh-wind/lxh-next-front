'use client';
import { useCallback } from 'react';
import { Form, Input, InputNumber, ColorPicker, Select, Tabs, Space, Tag } from 'antd';
import { useAtom, useSetAtom } from 'jotai';
import {
  componentsAtom,
  selectedComponentAtom,
  historyAtom,
  historyIndexAtom,
  canUndoAtom,
  canRedoAtom,
} from '@/src/app/h5-builder/store/atoms';

export default function PropertyPanel() {
  const setComponents = useSetAtom(componentsAtom);
  const [selectedComponent, setSelectedComponent] = useAtom(selectedComponentAtom);
  
  const setHistory = useSetAtom(historyAtom);
  const setHistoryIndex = useSetAtom(historyIndexAtom);
  const setCanUndo = useSetAtom(canUndoAtom);
  const setCanRedo = useSetAtom(canRedoAtom);

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
                      defaultValue={selectedComponent.props?.style?.backgroundColor || 'transparent'}
                      onChange={(color) => onUpdateComponent(selectedComponent.id, {
                        style: { ...selectedComponent.props?.style, backgroundColor: color.toRgbString() }
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
                  style: { ...selectedComponent.props?.style, color: color.toRgbString() }
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
      
      default:
        return <div>暂不支持该组件类型的内容设置</div>;
    }
  }
} 