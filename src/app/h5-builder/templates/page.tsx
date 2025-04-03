'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  List, 
  Button, 
  Typography, 
  Space, 
  Input, 
  Select, 
  Divider,
  Tag, 
  Spin, 
  Empty,
  message,
  Tooltip,
  Modal
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  AppstoreOutlined, 
  UnorderedListOutlined,
  ArrowLeftOutlined,
  EyeOutlined,
  CopyOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getPageList, duplicatePage, deletePage } from '../utils/store';

const { Title } = Typography;
const { Option } = Select;

// 模板数据
const templates = [
  {
    id: 'template-1',
    title: '优惠券模板',
    description: '展示优惠券信息，适合促销活动',
    coverImage: 'https://placeholder.pics/svg/300x600/DEDEDE/555555/优惠券模板',
    category: '促销',
    tags: ['优惠券', '促销'],
    createdAt: '2023-12-01',
  },
  {
    id: 'template-2',
    title: '新品首发模板',
    description: '展示新品信息，适合商品首发',
    coverImage: 'https://placeholder.pics/svg/300x600/DEDEDE/555555/新品首发模板',
    category: '商品',
    tags: ['新品', '首发'],
    createdAt: '2023-12-05',
  },
  {
    id: 'template-3',
    title: '秒杀活动模板',
    description: '展示秒杀活动信息，适合限时抢购',
    coverImage: 'https://placeholder.pics/svg/300x600/DEDEDE/555555/秒杀活动模板',
    category: '促销',
    tags: ['秒杀', '限时', '抢购'],
    createdAt: '2023-12-10',
  },
  {
    id: 'template-4',
    title: '品牌故事模板',
    description: '展示品牌故事信息，适合品牌介绍',
    coverImage: 'https://placeholder.pics/svg/300x600/DEDEDE/555555/品牌故事模板',
    category: '品牌',
    tags: ['品牌', '故事'],
    createdAt: '2023-12-15',
  },
];

export default function TemplatesPage() {
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [myPages, setMyPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const [duplicateModalVisible, setDuplicateModalVisible] = useState(false);
  const [duplicatePageTitle, setDuplicatePageTitle] = useState('');
  const [currentPageId, setCurrentPageId] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // 刷新页面列表的函数
  const fetchPages = async () => {
    setLoading(true);
    try {
      const pages = await getPageList();
      setMyPages(pages as any[]);
    } catch (error) {
      console.error('加载页面失败', error);
    } finally {
      setLoading(false);
    }
  };

  // 加载我的页面
  useEffect(() => {
    fetchPages();
  }, []);

  // 过滤模板
  const filteredTemplates = templates.filter(template => {
    // 搜索文本过滤
    const matchesSearch = 
      template.title.toLowerCase().includes(searchText.toLowerCase()) ||
      template.description.toLowerCase().includes(searchText.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()));
    
    // 分类过滤
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // 使用模板
  const handleUseTemplate = (templateId: string) => {
    // 实际应该加载模板数据并跳转到编辑器
    messageApi.success('已选择模板，即将跳转到编辑器');
    router.push('/h5-builder');
  };

  // 编辑页面
  const handleEditPage = (pageId: string) => {
    // 实际应该加载页面数据并跳转到编辑器
    router.push(`/h5-builder?id=${pageId}`);
  };

  // 复制页面
  const handleDuplicatePage = async (pageId: string) => {
    // 找到当前页面数据
    const currentPage = myPages.find(page => page.id === pageId);
    if (currentPage) {
      setDuplicatePageTitle(`${currentPage.title} 的副本`);
      setCurrentPageId(pageId);
      setDuplicateModalVisible(true);
    }
  };

  // 确认复制页面
  const confirmDuplicatePage = async () => {
    try {
      // 显示加载状态
      const loadingMessage = messageApi.loading('正在复制页面...', 0);
      
      // 调用复制页面API
      const duplicatedPage = await duplicatePage(currentPageId, duplicatePageTitle);
      
      // 关闭加载提示
      loadingMessage();
      
      if (duplicatedPage) {
        messageApi.success('复制成功，即将跳转到编辑器');
        
        // 刷新页面列表
        fetchPages();
        
        // 关闭弹窗
        setDuplicateModalVisible(false);
        
        // 跳转到复制后的页面进行编辑
        router.push(`/h5-builder?id=${duplicatedPage.id}`);
      } else {
        messageApi.error('复制失败');
      }
    } catch (error) {
      messageApi.error('复制失败，请重试');
      console.error('复制页面出错:', error);
    }
  };

  const handleDeletePage = async (pageId: string) => {
    setCurrentPageId(pageId);
    setDeleteModalVisible(true);
  };

  const confirmDeletePage = async () => {
    try {
      await deletePage(currentPageId);
      messageApi.success('删除成功');
      fetchPages();
      setDeleteModalVisible(false);
    } catch (error) {
      messageApi.error('删除失败，请重试');
      console.error('删除页面出错:', error);
    }
  };

  // 预览页面
  const handlePreviewPage = (pageId: string) => {
    // 实际应该加载页面数据并打开预览
    window.open(`/h5-builder/preview?id=${pageId}`, '_blank');
  };

  return (
    <>
      {contextHolder}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <Link href="/" className="mr-4">
            <Button type="text" icon={<ArrowLeftOutlined />} />
          </Link>
          <Title level={3} className="m-0">H5页面管理</Title>
        </div>

        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <Space size="middle" className="flex-wrap">
            <Input
              placeholder="搜索模板"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Select
              defaultValue="all"
              style={{ width: 120 }}
              onChange={value => setCategoryFilter(value)}
            >
              <Option value="all">全部分类</Option>
              <Option value="促销">促销</Option>
              <Option value="商品">商品</Option>
              <Option value="品牌">品牌</Option>
            </Select>
          </Space>
          <Space>
            <Button
              icon={<AppstoreOutlined />}
              onClick={() => setDisplayMode('grid')}
              type={displayMode === 'grid' ? 'primary' : 'default'}
            />
            <Button
              icon={<UnorderedListOutlined />}
              onClick={() => setDisplayMode('list')}
              type={displayMode === 'list' ? 'primary' : 'default'}
            />
            <Link href="/h5-builder">
              <Button type="primary" icon={<PlusOutlined />}>
                新建页面
              </Button>
            </Link>
          </Space>
        </div>

        <Divider orientation="left">我的页面</Divider>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <Spin size="large" />
          </div>
        ) : myPages.length > 0 ? (
          <List
            grid={displayMode === 'grid' ? { gutter: 24, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 3.5 } : undefined}
            dataSource={myPages}
            renderItem={page => (
              <List.Item>
                <Card
                  hoverable
                  className="w-full"
                  cover={displayMode === 'grid' ? 
                    <div className="h-80 bg-gray-100 flex items-center justify-center">
                      <span>预览图</span>
                    </div> : undefined
                  }
                >
                  <Card.Meta
                    title={page.title}
                    description={
                      <div>
                        <p className="text-gray-500 text-sm">{page.description || '无描述'}</p>
                        <div className="mt-2">
                          {page.published && <Tag color="green">已发布</Tag>}
                          <Tag color="blue">更新于: {new Date(page.updatedAt).toLocaleDateString()}</Tag>
                        </div>
                        <Divider className="my-2" />
                        <div className="flex justify-between mt-3">
                          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEditPage(page.id)}>编辑</Button>
                          <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => handlePreviewPage(page.id)}>预览</Button>
                          <Button type="text" size="small" icon={<CopyOutlined />} onClick={() => handleDuplicatePage(page.id)}>复制</Button>
                          <Button type="text" size="small" icon={<DeleteOutlined />} onClick={() => handleDeletePage(page.id)}>删除</Button>
                        </div>
                      </div>
                    }
                  />
                </Card>
              </List.Item>
            )}
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无页面，点击右上角新建按钮创建"
          />
        )}

        {/* <Divider orientation="left">模板</Divider>
        
        <List
          grid={displayMode === 'grid' ? { gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 5 } : undefined}
          dataSource={filteredTemplates}
          renderItem={template => (
            <List.Item>
              <Card
                hoverable
                cover={displayMode === 'grid' ? 
                  <div className="h-80 bg-gray-100 overflow-hidden">
                    <img 
                      src={template.coverImage} 
                      alt={template.title} 
                      className="w-full h-full object-cover"
                    />
                  </div> : undefined
                }
                actions={[
                  <Button key="use" type="primary" onClick={() => handleUseTemplate(template.id)}>
                    使用此模板
                  </Button>,
                ]}
              >
                <Card.Meta
                  title={template.title}
                  description={
                    <div>
                      <p className="text-gray-500 text-sm">{template.description}</p>
                      <div className="mt-2">
                        <Tag color="blue">{template.category}</Tag>
                        {template.tags.map(tag => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </div>
                    </div>
                  }
                />
              </Card>
            </List.Item>
          )}
        /> */}

        {/* 复制页面的弹窗 */}
        <Modal
          title="复制页面"
          open={duplicateModalVisible}
          onOk={confirmDuplicatePage}
          onCancel={() => setDuplicateModalVisible(false)}
          okText="确认"
          cancelText="取消"
        >
          <div className="py-4">
            <p className="mb-2">请输入复制后的页面名称：</p>
            <Input 
              value={duplicatePageTitle} 
              onChange={(e) => setDuplicatePageTitle(e.target.value)}
              placeholder="请输入页面名称"
            />
          </div>
        </Modal>

        {/* 删除页面的弹窗 */}
        <Modal
          title="删除页面"
          open={deleteModalVisible}
          onOk={confirmDeletePage}
          onCancel={() => setDeleteModalVisible(false)}
          okText="确认"
          cancelText="取消"
          okButtonProps={{ danger: true }}
        >
          <div className="py-4">
            <p>确定要删除此页面吗？删除后无法恢复。</p>
          </div>
        </Modal>
      </div>
    </>
  );
} 