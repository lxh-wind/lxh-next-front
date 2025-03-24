"use client";

import React from "react";
import { Typography, Space, Button, Divider, Card, Form, Input, Select, Switch, DatePicker, Table, Tag } from "antd";
import { SearchOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

interface DataItem {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const dataSource: DataItem[] = [
  {
    key: '1',
    name: '张三2',
    age: 32,
    address: '北京市朝阳区',
    tags: ['开发', '前端'],
  },
  {
    key: '2',
    name: '李四',
    age: 42,
    address: '上海市浦东新区',
    tags: ['设计', 'UI'],
  },
  {
    key: '3',
    name: '王五',
    age: 28,
    address: '广州市天河区',
    tags: ['后端', '架构'],
  },
];

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '标签',
    key: 'tags',
    dataIndex: 'tags',
    render: (_: any, { tags }: DataItem) => (
      <>
        {tags.map(tag => (
          <Tag color={tag === '前端' ? 'blue' : tag === '设计' ? 'green' : 'volcano'} key={tag}>
            {tag}
          </Tag>
        ))}
      </>
    ),
  },
];

export default function Home() {
  return (
    <main className="p-8">
      <Card className="mb-8">
        <Title level={2}>Ant Design 组件示例</Title>
        <Paragraph>
          这是一个使用 Ant Design v5 构建的 Next.js 应用示例。
        </Paragraph>
        
        <Divider orientation="left">按钮组件</Divider>
        <Space>
          <Button type="primary">主要按钮</Button>
          <Button>默认按钮</Button>
          <Button type="dashed">虚线按钮</Button>
          <Button danger>危险按钮</Button>
          <Button type="primary" icon={<SearchOutlined />}>
            搜索
          </Button>
        </Space>
        
        <Divider orientation="left">表单组件</Divider>
        <Form layout="vertical" style={{ maxWidth: 500 }}>
          <Form.Item label="用户名" required>
            <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item label="密码" required>
            <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
          </Form.Item>
          <Form.Item label="角色">
            <Select defaultValue="user" style={{ width: '100%' }}>
              <Option value="admin">管理员</Option>
              <Option value="user">普通用户</Option>
              <Option value="guest">访客</Option>
            </Select>
          </Form.Item>
          <Form.Item label="生日">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="启用状态">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item>
            <Button type="primary">提交</Button>
          </Form.Item>
        </Form>
        
        <Divider orientation="left">表格组件</Divider>
        <Table dataSource={dataSource} columns={columns} />
      </Card>
    </main>
  );
}
