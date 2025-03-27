'use client';

import { useState } from 'react';
import { Card, Input, Tag } from 'antd';
import { SearchOutlined, AppstoreOutlined, ShoppingOutlined, FundViewOutlined, DragOutlined } from '@ant-design/icons';
import { getComponentsByCategory } from '../core/components';
import { useAtom } from 'jotai';
import { componentsAtom, historyAtom, canUndoAtom, canRedoAtom } from '../store/atoms';
import { generateComplexId } from '../utils/store';

// 组件分类
const componentCategories = [
  { key: 'basic', name: '基础', icon: <AppstoreOutlined /> },
  { key: 'marketing', name: '营销', icon: <ShoppingOutlined /> },
  { key: 'advanced', name: '高级', icon: <FundViewOutlined /> },
];

export default function ComponentPanel() {
  const [components, setComponents] = useAtom(componentsAtom);
  const [history, setHistory] = useAtom(historyAtom);
  const [canUndo, setCanUndo] = useAtom(canUndoAtom);
  const [canRedo, setCanRedo] = useAtom(canRedoAtom);
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

  const handleAddComponent = (componentType: any) => {
    const newComponent = {
      ...componentType,
      id: generateComplexId(componentType.type),
      props: { ...componentType.defaultProps }
    };
    
    // 更新历史状态
    const newComponents = [...components, newComponent];
    const newPast = [...history.past, components];
    
    setHistory({
      past: newPast,
      present: newComponents,
      future: [],
    });
    
    // 根据newPast的长度判断是否可以撤销
    setCanUndo(newPast.length > 0);
    setCanRedo(false);
    
    // 更新组件状态
    setComponents(newComponents);
  };

  const handleChangeCategory = (key: string) => {
    setActiveCategory(key);
  };

  const renderComponentItem = (component: any) => (
    <Card
      hoverable
      className="mb-2 cursor-grab relative"
      onClick={() => handleAddComponent(component)}
    >
      <div className="flex flex-col items-center">
        {component.icon && <component.icon className="text-xl mb-1" />}
        <div className="text-sm">{component.name}</div>
      </div>
      <div className="absolute top-0 right-0 text-blue-500 opacity-50 p-1">
        <DragOutlined className="text-xs" />
      </div>
    </Card>
  );

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
        <div className="text-xs text-gray-500 mb-2 flex items-center">
          <DragOutlined className="mr-1" /> 提示: 拖拽组件到画布或点击添加
        </div>
        <div className="grid grid-cols-2 gap-3">
          {filteredComponents().map((component, index) => (
            <div key={index}>
              {renderComponentItem(component)}
            </div>
          ))}
          
          {filteredComponents().length === 0 && (
            <div className="col-span-2 text-center text-gray-400 py-8">
              {searchText ? '没有找到匹配的组件' : '该分类暂无组件'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 