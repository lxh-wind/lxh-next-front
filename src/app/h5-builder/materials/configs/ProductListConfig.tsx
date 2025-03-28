import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, Space, Switch, Select, Radio, Divider, ColorPicker, Tabs, Table, Modal, Alert, Image, Upload, message } from 'antd';
import { PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { ComponentType } from '../../components/types';

const { Option } = Select;
const { TabPane } = Tabs;

interface ProductItem {
  id: string;
  name: string;
  price: string;
  originalPrice: string;
  sales: string;
  image: string;
  source: string;
  isExpress: boolean;
  isHot: boolean;
}

interface ProductListConfigProps {
  component: ComponentType;
  onChange: (component: ComponentType) => void;
}

export function ProductListConfig({ component, onChange }: ProductListConfigProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [form] = useForm();

  const handleChange = (key: string, value: any) => {
    onChange({ ...component, props: { ...component.props, [key]: value } });
  };

  const handleStyleChange = (key: string, value: any) => {
    onChange({
      ...component,
      props: {
        ...component.props,
        style: {
          ...(component.props.style || {}),
          [key]: value,
        },
      },
    });
  };

  // 安全获取props值
  const getPropsValue = (key: string, defaultValue: any = undefined) => {
    return (component.props as any)[key] !== undefined 
      ? (component.props as any)[key] 
      : defaultValue;
  };
  
  // 获取模拟商品数据
  const mockProducts = getPropsValue('mockProducts', [
    {
      id: '1',
      name: 'IN SEASON 设季 版型超好！爆款瘦瘦T夏季显瘦百搭',
      price: '31.80',
      originalPrice: '158.00',
      sales: '36',
      image: 'https://placeholder.com/150',
      source: '品牌代工13厂源',
      isExpress: true,
      isHot: true
    },
    {
      id: '2',
      name: 'IN SEASON 设季 净版磨毛叠穿百搭圆领休闲短袖T恤',
      price: '43.75',
      originalPrice: '175.00',
      sales: '32',
      image: 'https://placeholder.com/150',
      source: '品牌代工13厂源',
      isExpress: true,
      isHot: true
    }
  ]);
  
  const showModal = (product?: ProductItem) => {
    if (product) {
      setEditingProduct(product);
      form.setFieldsValue(product);
    } else {
      setEditingProduct(null);
      form.resetFields();
      form.setFieldsValue({
        name: '',
        price: '',
        originalPrice: '',
        sales: '0',
        image: 'https://placeholder.com/150',
        source: '品牌代工13厂源',
        isExpress: true,
        isHot: true
      });
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleProductSave = () => {
    form.validateFields().then(values => {
      const updatedProducts = [...mockProducts];
      if (editingProduct) {
        // 编辑现有商品
        const index = updatedProducts.findIndex((p: ProductItem) => p.id === editingProduct.id);
        if (index !== -1) {
          updatedProducts[index] = { ...values, id: editingProduct.id };
        }
      } else {
        // 添加新商品
        const newId = String(Date.now());
        updatedProducts.push({ ...values, id: newId });
      }
      
      // 确保同时更新组件的props和selectedComponent
      handleChange('mockProducts', updatedProducts);
      handleChange('dataSource', 'mock'); // 强制使用mock数据
      
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleProductDelete = (productId: string) => {
    const updatedProducts = mockProducts.filter((p: ProductItem) => p.id !== productId);
    handleChange('mockProducts', updatedProducts);
  };

  const uploadProps: UploadProps = {
    name: 'file',
    action: '/api/upload',
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('只能上传 JPG/PNG 格式的图片!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片大小不能超过 2MB!');
      }
      return isJpgOrPng && isLt2M;
    },
    onChange: (info) => {
      if (info.file.status === 'done') {
        form.setFieldsValue({ image: info.file.response.url });
        message.success(`${info.file.name} 上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };

  // 添加图片预览功能
  const ImagePreview = ({ src }: { src: string }) => {
    if (!src || src === 'https://placeholder.com/150') {
      return (
        <div className="w-12 h-12 bg-gray-100 flex items-center justify-center">
          <div className="text-xs text-gray-400">商品图</div>
        </div>
      );
    }
    
    return (
      <div className="w-12 h-12 overflow-hidden">
        <img src={src} alt="商品图片" className="w-full h-full object-cover" />
      </div>
    );
  };

  const columns = [
    {
      title: '图片',
      dataIndex: 'image',
      key: 'image',
      render: (text: string) => <ImagePreview src={text} />
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: '40%',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: string) => `¥${price}`,
    },
    {
      title: '销量',
      dataIndex: 'sales',
      key: 'sales',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ProductItem) => (
        <Space size="small">
          <Button 
            type="text" 
            size="small"
            onClick={() => showModal(record)}
          >
            编辑
          </Button>
          <Button 
            type="text" 
            danger 
            size="small"
            onClick={() => handleProductDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="基本设置" key="basic">
          <Form layout="vertical">
            <h3 className="font-medium mb-2">基本设置</h3>
            
            <Form.Item label="组件标题">
              <Input 
                value={component.props.title} 
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="请输入组件标题" 
              />
            </Form.Item>
            
            <Form.Item label="显示更多链接">
              <Switch 
                checked={getPropsValue('showMore', true)}
                onChange={(checked) => handleChange('showMore', checked)}
              />
            </Form.Item>
            
            <Form.Item label="更多链接文字">
              <Input 
                value={getPropsValue('moreText', '查看更多 >')}
                onChange={(e) => handleChange('moreText', e.target.value)}
                placeholder="查看更多"
                disabled={!getPropsValue('showMore', true)}
              />
            </Form.Item>
            
            <Divider />
            <h3 className="font-medium mb-2">布局设置</h3>
            
            <Form.Item label="视图模式">
              <Radio.Group 
                value={getPropsValue('viewMode', 'grid')}
                onChange={(e) => handleChange('viewMode', e.target.value)}
              >
                <Radio.Button value="grid">网格</Radio.Button>
                <Radio.Button value="list">列表</Radio.Button>
                <Radio.Button value="card">卡片</Radio.Button>
              </Radio.Group>
            </Form.Item>
            
            {getPropsValue('viewMode') === 'grid' && (
              <Form.Item label="列数">
                <Radio.Group
                  value={getPropsValue('columns', 2)}
                  onChange={(e) => handleChange('columns', e.target.value)}
                >
                  <Radio.Button value={1}>1列</Radio.Button>
                  <Radio.Button value={2}>2列</Radio.Button>
                  <Radio.Button value={3}>3列</Radio.Button>
                </Radio.Group>
              </Form.Item>
            )}
            
            <Form.Item label="背景颜色">
              <Input 
                type="color"
                value={component.props.style?.backgroundColor || '#ffffff'}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                style={{ width: '100%' }}
              />
            </Form.Item>
            
            <Form.Item label="内边距">
              <InputNumber
                value={getPropsValue('padding', 12)}
                onChange={(value) => handleChange('padding', value)}
                min={0}
                max={50}
                addonAfter="px"
                style={{ width: '100%' }}
              />
            </Form.Item>
            
            <Divider />
            <h3 className="font-medium mb-2">样式设置</h3>
            
            <Form.Item label="显示价格">
              <Switch
                checked={getPropsValue('showPrice', true)}
                onChange={(checked) => handleChange('showPrice', checked)}
              />
            </Form.Item>
            
            <Form.Item label="显示销量">
              <Switch
                checked={getPropsValue('showSales', true)}
                onChange={(checked) => handleChange('showSales', checked)}
              />
            </Form.Item>
            
            <Form.Item label="显示收藏按钮">
              <Switch
                checked={getPropsValue('showFavorite', true)}
                onChange={(checked) => handleChange('showFavorite', checked)}
              />
            </Form.Item>
            
            <Form.Item label="显示品牌信息">
              <Switch
                checked={getPropsValue('showBrand', true)}
                onChange={(checked) => handleChange('showBrand', checked)}
              />
            </Form.Item>
            
            <Form.Item label="显示促销标签">
              <Switch
                checked={getPropsValue('showPromotionTag', true)}
                onChange={(checked) => handleChange('showPromotionTag', checked)}
              />
            </Form.Item>
            
            <Form.Item label="显示快速发货">
              <Switch
                checked={getPropsValue('showExpress', true)}
                onChange={(checked) => handleChange('showExpress', checked)}
              />
            </Form.Item>
            
            <Form.Item label="价格颜色">
              <Input
                type="color"
                value={getPropsValue('priceColor', '#f56c6c')}
                onChange={(e) => handleChange('priceColor', e.target.value)}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Form>
        </TabPane>
        
        <TabPane tab="数据" key="data">
          <div className="mb-4">
            <Button 
              type="primary"
              onClick={() => showModal()}
              className="mb-3"
            >
              添加商品
            </Button>
            
            <Table
              dataSource={mockProducts}
              rowKey="id"
              size="small"
              pagination={false}
              className="mt-3"
              columns={columns}
            />
          </div>
          
          <Divider />
          <h3 className="font-medium mb-2">数据源设置</h3>
          
          <Form layout="vertical">
            <Form.Item label="数据源">
              <Select
                value={getPropsValue('dataSource', 'mock')}
                onChange={(value) => handleChange('dataSource', value)}
                placeholder="选择数据源"
                style={{ width: '100%' }}
              >
                <Option value="mock">模拟数据</Option>
                <Option value="manual">手动添加</Option>
                <Option value="category">分类数据</Option>
                <Option value="recommend">推荐商品</Option>
                <Option value="newest">最新商品</Option>
              </Select>
            </Form.Item>
            
            <Form.Item label="显示数量">
              <InputNumber
                value={getPropsValue('limit', 4)}
                onChange={(value) => handleChange('limit', value)}
                min={1}
                max={20}
                style={{ width: '100%' }}
              />
            </Form.Item>
            
            {getPropsValue('dataSource') !== 'mock' && getPropsValue('dataSource') !== 'manual' && (
              <div className="pt-2">
                <Alert
                  type="info"
                  message="此数据源需要API支持，目前显示模拟数据"
                  showIcon
                />
              </div>
            )}
          </Form>
        </TabPane>
      </Tabs>
      
      <Modal
        title={editingProduct ? "编辑商品" : "添加商品"}
        open={isModalVisible}
        onOk={handleProductSave}
        onCancel={handleCancel}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name="name" 
            label="商品名称" 
            rules={[{ required: true, message: '请输入商品名称' }]}
          >
            <Input placeholder="请输入商品名称" />
          </Form.Item>
          
          <div className="grid grid-cols-2 gap-3">
            <Form.Item 
              name="price" 
              label="价格" 
              rules={[{ required: true, message: '请输入价格' }]}
            >
              <Input prefix="¥" placeholder="例如：99.00" />
            </Form.Item>
            
            <Form.Item name="originalPrice" label="原价">
              <Input prefix="¥" placeholder="例如：158.00" />
            </Form.Item>
          </div>
          
          <Form.Item name="sales" label="销量">
            <Input suffix="件" placeholder="例如：36" />
          </Form.Item>
          
          <Form.Item name="source" label="来源">
            <Input placeholder="例如：品牌代工13厂源" />
          </Form.Item>
          
          <Form.Item name="image" label="商品图片">
            <Input placeholder="输入图片URL" />
          </Form.Item>
          
          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="isExpress" label="快速发货" valuePropName="checked">
              <Switch />
            </Form.Item>
            
            <Form.Item name="isHot" label="热门标签" valuePropName="checked">
              <Switch />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
} 