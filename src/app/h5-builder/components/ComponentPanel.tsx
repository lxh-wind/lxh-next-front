'use client';

import { useState } from 'react';
import { Tabs, Card, Input, Tag } from 'antd';
import { SearchOutlined, AppstoreOutlined, ShoppingOutlined, FundViewOutlined, MobileOutlined } from '@ant-design/icons';
import { marketingComponents, getComponentsByCategory } from '../core/components';
import { ComponentPanelProps } from './types';

const { TabPane } = Tabs;

// 组件分类
const componentCategories = [
  { key: 'basic', name: '基础', icon: <AppstoreOutlined /> },
  { key: 'marketing', name: '营销', icon: <ShoppingOutlined /> },
  { key: 'advanced', name: '高级', icon: <FundViewOutlined /> },
];

export default function ComponentPanel({ onAddComponent }: ComponentPanelProps) {
  const [activeCategory, setActiveCategory] = useState('basic');
  const [searchText, setSearchText] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const filteredComponents = () => {
    let components = getComponentsByCategory(activeCategory);
    
    if (searchText) {
      components = components.filter(
        component => 
          component.name.toLowerCase().includes(searchText.toLowerCase()) ||
          component.type.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    return components;
  };

  const renderComponentItem = (component: any) => (
    <Card
      key={component.type}
      hoverable
      className="mb-2 cursor-pointer"
      onClick={() => handleAddComponent(component)}
      bodyStyle={{ padding: '12px', textAlign: 'center' }}
    >
      <div className="flex flex-col items-center">
        {component.icon && <component.icon className="text-xl mb-1" />}
        <div className="text-sm">{component.name}</div>
      </div>
    </Card>
  );

  const handleAddComponent = (componentType: any) => {
    const id = Date.now().toString();
    onAddComponent({
      id,
      ...componentType,
      props: { ...componentType.defaultProps }
    });
  };

  const handleChangeCategory = (key: string) => {
    setActiveCategory(key);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <Input
          prefix={<SearchOutlined />}
          placeholder="搜索组件..."
          value={searchText}
          onChange={handleSearch}
          allowClear
          className="mb-3"
        />
        <div className="flex flex-wrap gap-2 mb-3">
          {componentCategories.map(category => (
            <Tag
              key={category.key}
              icon={category.icon}
              color={activeCategory === category.key ? 'blue' : 'default'}
              className="cursor-pointer px-2 py-1"
              onClick={() => handleChangeCategory(category.key)}
            >
              {category.name}
            </Tag>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 pt-0">
        <div className="grid grid-cols-2 gap-3">
          {filteredComponents().map(component => renderComponentItem(component))}
          
          {filteredComponents().length === 0 && (
            <div className="col-span-2 text-center text-gray-400 py-8">
              {searchText ? '没有找到匹配的组件' : '该分类暂无组件'}
            </div>
          )}
        </div>
        
        <div className="mt-4 text-center">
          <button className="px-4 py-1 border border-dashed border-blue-400 text-blue-500 rounded-md text-sm hover:bg-blue-50 transition-colors">
            添加更多
          </button>
        </div>
      </div>
    </div>
  );
} 