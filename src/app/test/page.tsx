"use client"

import { Avatar, Button, Card, Checkbox, Modal, Input, Select, Switch, Table, Tabs, Typography, Space, Divider } from "antd"
import { UserOutlined } from "@ant-design/icons"
import { useState } from "react"
import type { ColumnsType } from 'antd/es/table';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { Meta } = Card;

interface DataItem {
  key: string;
  id: string;
  status: string;
  method: string;
  amount: string;
}

export default function TestPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [switchChecked, setSwitchChecked] = useState(false)
  const [selectedTab, setSelectedTab] = useState("profile")

  // 表格数据
  const columns: ColumnsType<DataItem> = [
    {
      title: '发票编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '方法',
      dataIndex: 'method',
      key: 'method',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right' as const,
    },
  ];

  const dataSource: DataItem[] = [
    {
      key: '1',
      id: 'INV001',
      status: '已付款',
      method: '信用卡',
      amount: '¥250.00',
    },
    {
      key: '2',
      id: 'INV002',
      status: '待付款',
      method: 'PayPal',
      amount: '¥150.00',
    },
    {
      key: '3',
      id: 'INV003',
      status: '已付款',
      method: '银行转账',
      amount: '¥350.00',
    },
  ];

  // 表格页脚
  const footer = () => (
    <tr>
      <td colSpan={3} style={{ textAlign: 'right' }}>总计</td>
      <td style={{ textAlign: 'right' }}>¥750.00</td>
    </tr>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <Title level={2} className="mb-8">UI 组件测试</Title>

      <div className="grid gap-8">
        <section>
          <Title level={3} className="mb-4">Button</Title>
          <Space wrap>
            <Button>默认按钮</Button>
            <Button danger>危险按钮</Button>
            <Button type="primary">主要按钮</Button>
            <Button type="dashed">虚线按钮</Button>
            <Button type="link">链接按钮</Button>
            <Button type="text">文本按钮</Button>
          </Space>
        </section>

        <Divider />

        <section>
          <Title level={3} className="mb-4">Avatar</Title>
          <Space wrap size="large" className="flex items-center">
            <Avatar size={64} src="https://github.com/shadcn.png" />
            <Avatar size={64} src="https://avatars.githubusercontent.com/u/124599" />
            <Avatar size={64} icon={<UserOutlined />} />
          </Space>
        </section>

        <Divider />

        <section>
          <Title level={3} className="mb-4">Card</Title>
          <Card title="标题" 
                extra={<a href="#">更多</a>} 
                style={{ maxWidth: 500 }}
                actions={[
                  <Button key="action">操作</Button>
                ]}
          >
            <Card.Meta
              title="卡片标题"
              description="这是一个卡片描述"
            />
            <div className="mt-4">
              <p>卡片内容可以包含任何内容，例如文本、图片或其他组件。</p>
            </div>
          </Card>
        </section>

        <Divider />

        <section>
          <Title level={3} className="mb-4">Checkbox & Switch</Title>
          <Space direction="vertical">
            <div className="flex items-center gap-2">
              <Checkbox>接受条款和条件</Checkbox>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={switchChecked} onChange={setSwitchChecked} />
              <Text>飞行模式 {switchChecked ? '开启' : '关闭'}</Text>
            </div>
          </Space>
        </section>

        <Divider />

        <section>
          <Title level={3} className="mb-4">Input & Select</Title>
          <div className="grid gap-4" style={{ maxWidth: 500 }}>
            <div className="space-y-2">
              <Text>姓名</Text>
              <Input placeholder="请输入姓名" />
            </div>
            <div className="space-y-2">
              <Text>国家</Text>
              <Select 
                placeholder="选择国家" 
                style={{ width: '100%' }}
                options={[
                  { value: 'china', label: '中国' },
                  { value: 'us', label: '美国' },
                  { value: 'uk', label: '英国' },
                  { value: 'japan', label: '日本' },
                ]}
              />
            </div>
          </div>
        </section>

        <Divider />

        <section>
          <Title level={3} className="mb-4">Dialog</Title>
          <Button type="primary" onClick={() => setIsDialogOpen(true)}>打开对话框</Button>
          <Modal
            title="确认操作"
            open={isDialogOpen}
            onOk={() => setIsDialogOpen(false)}
            onCancel={() => setIsDialogOpen(false)}
            okText="确认"
            cancelText="取消"
          >
            <p>您确定要执行此操作吗？此操作无法撤销。</p>
          </Modal>
        </section>

        <Divider />

        <section>
          <Title level={3} className="mb-4">Tabs</Title>
          <Tabs
            defaultActiveKey="profile"
            onChange={setSelectedTab}
            style={{ maxWidth: 500 }}
          >
            <Tabs.TabPane key="profile" tab="个人资料">
              <Card title="个人资料"
                    style={{ marginTop: 16 }}
              >
                <Paragraph>
                  管理您的个人资料信息和账户设置。
                </Paragraph>
                <div className="mt-4 space-y-4">
                  <div className="space-y-1">
                    <Text>姓名</Text>
                    <Input defaultValue="张三" />
                  </div>
                  <div className="space-y-1">
                    <Text>用户名</Text>
                    <Input defaultValue="zhangsan" />
                  </div>
                  <div className="mt-4">
                    <Button type="primary">保存更改</Button>
                  </div>
                </div>
              </Card>
            </Tabs.TabPane>
            <Tabs.TabPane key="settings" tab="设置">
              <Card title="设置"
                    style={{ marginTop: 16 }}
              >
                <Paragraph>
                  管理应用程序设置和偏好。
                </Paragraph>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <Text>启用通知</Text>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch />
                    <Text>订阅新闻通讯</Text>
                  </div>
                  <div className="mt-4">
                    <Button type="primary">保存偏好</Button>
                  </div>
                </div>
              </Card>
            </Tabs.TabPane>
          </Tabs>
        </section>

        <Divider />

        <section>
          <Title level={3} className="mb-4">Table</Title>
          <Table 
            dataSource={dataSource} 
            columns={columns} 
            pagination={false}
            footer={footer}
            caption="最近的发票记录"
          />
        </section>
      </div>
    </div>
  )
} 