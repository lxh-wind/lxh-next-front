'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Layout, message, Modal, Input, Button, Tooltip, Form, Card, Row, Col, Divider, Select } from 'antd';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  EyeOutlined,
  SaveOutlined,
  SendOutlined,
  FolderOutlined,
  MobileOutlined,
  ArrowLeftOutlined,
  UndoOutlined,
  RedoOutlined,
  TabletOutlined,
  LaptopOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { savePage, publishPage, previewPage, previewLuckyWheel } from './utils/store';
import { ComponentType, PageInfo } from './components/types';

// 使用动态导入避免SSR问题
const ComponentPanel = dynamic(() => import('./components/ComponentPanel'), { ssr: false });
const Canvas = dynamic(() => import('./components/Canvas'), { ssr: false });
const PropertyPanel = dynamic(() => import('./components/PropertyPanel'), { ssr: false });
const ZoomablePaneWithRulers = dynamic(() => import('./components/ZoomablePaneWithRulers'), {
  ssr: false,
});

// 预设画布尺寸
const DEVICE_SIZES = [
  { name: 'iphone6/7/8', width: 375, height: 667, icon: <MobileOutlined /> },
  { name: 'iphoneXR', width: 414, height: 896, icon: <MobileOutlined /> },
  { name: 'android', width: 360, height: 780, icon: <MobileOutlined /> },
  { name: 'ipad', width: 768, height: 1024, icon: <TabletOutlined /> },
  { name: 'PC', width: 1200, height: 764, icon: <LaptopOutlined /> },
  { name: 'A4', width: 595, height: 842, icon: <FileTextOutlined /> },
];

export default function H5Builder() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const { Content, Sider } = Layout;
  
  // 页面状态
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    title: '未命名页面',
    description: '',
    components: [],
  });
  
  // 画布状态
  const [components, setComponents] = useState<ComponentType[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<ComponentType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(100);
  const [canvasSize, setCanvasSize] = useState({ width: 375, height: 667 });
  const [showCanvasSizeModal, setShowCanvasSizeModal] = useState(false);
  const [customWidth, setCustomWidth] = useState('375');
  const [customHeight, setCustomHeight] = useState('667');
  
  // 模态框状态
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [showRulers, setShowRulers] = useState<boolean>(true);
  
  // 撤销重做历史记录
  const historyRef = useRef<ComponentType[][]>([]);
  const historyIndexRef = useRef<number>(-1);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);
  
  // 添加组件
  const handleAddComponent = useCallback((component: any) => {
    const newComponent = {
      id: `component-${Date.now()}`,
      ...component
    };
    
    // 记录历史状态
    const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    newHistory.push([...components]);
    historyRef.current = newHistory;
    historyIndexRef.current = newHistory.length - 1;
    
    setComponents(prev => [...prev, newComponent]);
    setCanUndo(true);
    setCanRedo(false);
  }, [components]);
  
  // 选择组件
  const handleSelectComponent = useCallback((component: any) => {
    setSelectedComponent(component);
  }, []);
  
  // 删除组件
  const handleDeleteComponent = useCallback((id: string) => {
    // 记录历史状态
    const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    newHistory.push([...components]);
    historyRef.current = newHistory;
    historyIndexRef.current = newHistory.length - 1;
    
    setComponents(prev => prev.filter(comp => comp.id !== id));
    if (selectedComponent && selectedComponent.id === id) {
      setSelectedComponent(null);
    }
    setCanUndo(true);
    setCanRedo(false);
  }, [components, selectedComponent]);
  
  // 复制组件
  const handleDuplicateComponent = useCallback((id: string) => {
    const component = components.find(comp => comp.id === id);
    if (component) {
      const newComponent = {
        ...component,
        id: `component-${Date.now()}`,
      };
      
      // 记录历史状态
      const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
      newHistory.push([...components]);
      historyRef.current = newHistory;
      historyIndexRef.current = newHistory.length - 1;
      
      setComponents(prev => [...prev, newComponent]);
      setCanUndo(true);
      setCanRedo(false);
    }
  }, [components]);
  
  // 更新组件属性
  const handleUpdateComponent = useCallback((id: string, props: any) => {
    // 记录历史状态（仅在不频繁更新的属性变更时）
    if (Object.keys(props).some(key => !['style.marginTop', 'style.marginBottom'].includes(key))) {
      const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
      newHistory.push([...components]);
      historyRef.current = newHistory;
      historyIndexRef.current = newHistory.length - 1;
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
    
    // 同步更新选中的组件
    if (selectedComponent && selectedComponent.id === id) {
      setSelectedComponent(prev => 
        prev ? { ...prev, props: { ...prev.props, ...props } } : null
      );
    }
  }, [components, selectedComponent]);

  // 更新组件顺序
  const handleUpdateComponentsOrder = useCallback((startIndex: number, endIndex: number) => {
    // 记录历史状态
    const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    newHistory.push([...components]);
    historyRef.current = newHistory;
    historyIndexRef.current = newHistory.length - 1;
    
    const result = Array.from(components);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    
    setComponents(result);
    setCanUndo(true);
    setCanRedo(false);
  }, [components]);
  
  // 撤销操作
  const handleUndo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      setComponents(historyRef.current[historyIndexRef.current]);
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(true);
    }
  }, []);
  
  // 重做操作
  const handleRedo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      setComponents(historyRef.current[historyIndexRef.current]);
      setCanUndo(true);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    }
  }, []);
  
  // 同步组件到页面信息
  useEffect(() => {
    setPageInfo(prev => ({
      ...prev,
      components,
    }));
  }, [components]);
  
  // 保存页面
  const handleSave = async (values: any) => {
    setLoading(true);
    
    try {
      const pageToSave = {
        ...pageInfo,
        ...values,
        components,
      };
      
      const savedData = await savePage(pageToSave);
      setPageInfo(savedData);
      messageApi.success('保存成功');
      setIsSaveModalOpen(false);
    } catch (error) {
      messageApi.error('保存失败');
    } finally {
      setLoading(false);
    }
  };
  
  // 发布页面
  const handlePublish = async () => {
    if (!pageInfo.id) {
      messageApi.warning('请先保存页面');
      setIsSaveModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      const publishedData = await publishPage(pageInfo.id);
      setPageInfo({
        ...pageInfo,
        published: true,
        publishUrl: publishedData.publishedUrl,
      });
      messageApi.success('发布成功');
      Modal.success({
        title: '页面发布成功',
        content: (
          <div>
            <p>您的H5页面已成功发布，可通过以下链接访问：</p>
            <a href={publishedData.publishedUrl} target="_blank" rel="noreferrer">
              {publishedData.publishedUrl}
            </a>
          </div>
        ),
      });
    } catch (error) {
      messageApi.error('发布失败');
    } finally {
      setLoading(false);
    }
  };
  
  // 预览页面
  const handlePreview = () => {
    const previewUrl = previewPage(pageInfo);
    window.open(previewUrl, '_blank');
  };
  
  // 预览选中组件（如果是抽奖转盘）
  const handlePreviewComponent = () => {
    if (selectedComponent && selectedComponent.type === 'luckyWheel') {
      // 直接预览抽奖转盘组件
      const previewUrl = previewLuckyWheel(selectedComponent.props);
      window.open(previewUrl, '_blank');
    }
  };
  
  // 保存模态框
  const showSaveModal = () => {
    setIsSaveModalOpen(true);
  };
  
  // 关闭保存模态框
  const handleCancelSave = () => {
    setIsSaveModalOpen(false);
  };

  // 在组件面板中添加预览按钮
  const renderComponentActions = () => {
    if (!selectedComponent) return null;

    const actions = [];

    // 对于抽奖转盘组件，添加单独预览按钮
    if (selectedComponent.type === 'luckyWheel') {
      actions.push(
        <Button 
          key="preview-component" 
          icon={<EyeOutlined />} 
          onClick={handlePreviewComponent}
          size="small"
        >
          预览转盘
        </Button>
      );
    }

    return actions.length > 0 ? (
      <div className="flex justify-end mb-4 px-4">
        {actions}
      </div>
    ) : null;
  };

  // 处理画布尺寸修改
  const handleCanvasSizeChange = (width: number, height: number) => {
    setCanvasSize({ width, height });
    setShowCanvasSizeModal(false);
  };

  // 应用自定义尺寸
  const applyCustomSize = () => {
    const width = parseInt(customWidth, 10);
    const height = parseInt(customHeight, 10);
    if (width > 0 && height > 0) {
      setCanvasSize({ width, height });
      setShowCanvasSizeModal(false);
    } else {
      messageApi.error('请输入有效的宽度和高度');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {contextHolder}
      
      {/* 顶部导航栏 */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="mr-4">
            <Button icon={<ArrowLeftOutlined />}>返回</Button>
          </Link>
          <span className="text-xl font-medium">H5营销页面制作</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button icon={<UndoOutlined />} disabled={!canUndo} onClick={handleUndo}>撤销</Button>
          <Button icon={<RedoOutlined />} disabled={!canRedo} onClick={handleRedo}>重做</Button>
          <Divider type="vertical" />
          
          <Button 
            icon={<MobileOutlined />}
            onClick={() => setShowCanvasSizeModal(true)}
          >
            画布尺寸
          </Button>
          
          <Link href="/h5-builder/templates">
            <Button icon={<FolderOutlined />}>模板</Button>
          </Link>
          
          <Tooltip title="预览">
            <Button icon={<EyeOutlined />} onClick={handlePreview}>预览</Button>
          </Tooltip>
          
          <Tooltip title="保存">
            <Button icon={<SaveOutlined />} onClick={showSaveModal}>保存</Button>
          </Tooltip>
          
          <Tooltip title="发布">
            <Button type="primary" icon={<SendOutlined />} onClick={handlePublish}>
              发布
            </Button>
          </Tooltip>
        </div>
      </div>
      
      {/* 主要内容区域 */}
      <Layout className="flex-1">
        {/* 左侧组件面板 */}
        <Sider width={300} theme="light" className="border-r border-gray-200">
          <ComponentPanel onAddComponent={handleAddComponent} />
        </Sider>
        
        {/* 中间画布区域 */}
        <Content className="bg-gray-100 overflow-auto p-0 relative">
          <ZoomablePaneWithRulers 
            zoom={zoom} 
            onZoomChange={setZoom}
            isPropertyPanelOpen={!!selectedComponent}
          >
            <Canvas
              components={components}
              selectedComponentId={selectedComponent?.id}
              onSelectComponent={handleSelectComponent}
              onDeleteComponent={handleDeleteComponent}
              onDuplicateComponent={handleDuplicateComponent}
              onUpdateComponentsOrder={handleUpdateComponentsOrder}
              zoom={zoom}
              canvasSize={canvasSize}
            />
          </ZoomablePaneWithRulers>
        </Content>
        
        {/* 右侧属性面板 - 根据是否选中组件决定宽度 */}
        <Sider 
          width={selectedComponent ? 300 : 0} 
          theme="light" 
          className="border-l border-gray-200 overflow-auto transition-all duration-300"
          style={{ 
            minWidth: selectedComponent ? '300px' : '0px',
            maxWidth: selectedComponent ? '300px' : '0px',
          }}
        >
          {selectedComponent && (
            <>
              {renderComponentActions()}
              <PropertyPanel
                selectedComponent={selectedComponent}
                onUpdateComponent={handleUpdateComponent}
              />
            </>
          )}
        </Sider>
      </Layout>
      
      {/* 画布尺寸设置模态框 */}
      <Modal
        title="设置画布尺寸"
        open={showCanvasSizeModal}
        onCancel={() => setShowCanvasSizeModal(false)}
        footer={null}
        width={700}
      >
        <div className="mb-8">
          <Row gutter={[16, 16]} className="mb-4">
            {DEVICE_SIZES.map((device) => (
              <Col span={8} key={device.name}>
                <Card 
                  hoverable
                  className={canvasSize.width === device.width && canvasSize.height === device.height ? 'border-blue-500 bg-blue-50' : ''}
                  onClick={() => handleCanvasSizeChange(device.width, device.height)}
                >
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">{device.icon}</div>
                    <div>
                      <div className="font-medium">{device.name}</div>
                      <div className="text-gray-500">{device.width} × {device.height}</div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="mt-8">
            <h3 className="mb-4">自定义尺寸</h3>
            <div className="flex items-center gap-2">
              <span>宽:</span>
              <Input 
                type="number" 
                value={customWidth}
                onChange={(e) => setCustomWidth(e.target.value)}
                style={{ width: 120 }}
                addonAfter="px"
              />
              <span>高:</span>
              <Input 
                type="number" 
                value={customHeight}
                onChange={(e) => setCustomHeight(e.target.value)}
                style={{ width: 120 }}
                addonAfter="px"
              />
              <Button type="primary" onClick={applyCustomSize}>更新画布尺寸</Button>
            </div>
          </div>
        </div>
      </Modal>
      
      {/* 保存模态框 */}
      <Modal
        title="保存页面"
        open={isSaveModalOpen}
        onCancel={handleCancelSave}
        footer={null}
      >
        <Form
          name="saveForm"
          onFinish={handleSave}
          initialValues={{
            title: pageInfo.title,
            description: pageInfo.description,
            tags: pageInfo.tags,
          }}
        >
          <Form.Item
            name="title"
            label="页面标题"
            rules={[{ required: true, message: '请输入页面标题' }]}
          >
            <Input placeholder="给页面起个名字" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="页面描述"
          >
            <Input.TextArea placeholder="简单描述一下页面内容" rows={4} />
          </Form.Item>
          
          <Form.Item
            name="tags"
            label="标签"
          >
            <Select
              mode="tags"
              placeholder="添加标签"
              style={{ width: '100%' }}
            />
          </Form.Item>
          
          <Form.Item>
            <div className="flex justify-end gap-2">
              <Button onClick={handleCancelSave}>取消</Button>
              <Button type="primary" htmlType="submit" loading={loading}>保存</Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 