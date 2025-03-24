'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, ColorPicker, Button, Space, InputNumber, Table, Row, Col, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd/es/form';

const { Title } = Typography;

interface LuckyWheelPropertyPanelProps {
  value: any;
  onChange: (values: any) => void;
}

interface Prize {
  id: string;
  name: string;
  probability: number;
  bgColor?: string;
  fontColor?: string;
}

const LuckyWheelPropertyPanel: React.FC<LuckyWheelPropertyPanelProps> = ({ value, onChange }) => {
  const [form] = Form.useForm();
  const [prizes, setPrizes] = useState<Prize[]>(value.prizes || []);
  const [totalProbability, setTotalProbability] = useState<number>(0);

  // 初始化表单
  useEffect(() => {
    form.setFieldsValue({
      title: value.title || '幸运大转盘',
      buttonText: value.buttonText || '开始抽奖',
      rotationTime: value.rotationTime || 5000,
      ...value
    });
    
    setPrizes(value.prizes || []);
    calculateTotalProbability(value.prizes || []);
  }, [value, form]);

  // 计算概率总和
  const calculateTotalProbability = (items: Prize[]) => {
    const total = items.reduce((sum, prize) => sum + (prize.probability || 0), 0);
    setTotalProbability(parseFloat(total.toFixed(2)));
  };

  // 表单值变更处理
  const handleValuesChange = (changedValues: any, allValues: any) => {
    onChange({
      ...value,
      ...changedValues
    });
  };

  // 处理奖品变更
  const handlePrizeChange = (newPrizes: Prize[]) => {
    setPrizes(newPrizes);
    calculateTotalProbability(newPrizes);
    onChange({
      ...value,
      prizes: newPrizes
    });
  };

  // 添加奖品
  const handleAddPrize = () => {
    const newPrize: Prize = {
      id: `prize_${Date.now()}`,
      name: `奖品${prizes.length + 1}`,
      probability: 0.1,
      bgColor: prizes.length % 2 === 0 ? '#FFEECC' : '#FFF4D6',
      fontColor: '#FF5C5C'
    };
    
    handlePrizeChange([...prizes, newPrize]);
  };

  // 删除奖品
  const handleRemovePrize = (id: string) => {
    const newPrizes = prizes.filter(prize => prize.id !== id);
    handlePrizeChange(newPrizes);
  };

  // 更新奖品
  const handlePrizeFieldChange = (id: string, field: string, value: any) => {
    const newPrizes = prizes.map(prize => {
      if (prize.id === id) {
        return { ...prize, [field]: value };
      }
      return prize;
    });
    
    handlePrizeChange(newPrizes);
  };

  const prizeColumns = [
    {
      title: '奖品名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Prize) => (
        <Input
          value={text}
          onChange={(e) => handlePrizeFieldChange(record.id, 'name', e.target.value)}
          placeholder="奖品名称"
        />
      ),
    },
    {
      title: '概率',
      dataIndex: 'probability',
      key: 'probability',
      render: (value: number, record: Prize) => (
        <InputNumber
          value={value}
          onChange={(val) => handlePrizeFieldChange(record.id, 'probability', val)}
          min={0}
          max={1}
          step={0.01}
          precision={2}
          style={{ width: '80px' }}
        />
      ),
    },
    {
      title: '背景色',
      dataIndex: 'bgColor',
      key: 'bgColor',
      render: (color: string, record: Prize) => (
        <ColorPicker
          value={color}
          onChange={(color) => handlePrizeFieldChange(record.id, 'bgColor', color.toHexString())}
        />
      ),
    },
    {
      title: '文字色',
      dataIndex: 'fontColor',
      key: 'fontColor',
      render: (color: string, record: Prize) => (
        <ColorPicker
          value={color}
          onChange={(color) => handlePrizeFieldChange(record.id, 'fontColor', color.toHexString())}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Prize) => (
        <Button
          icon={<DeleteOutlined />}
          onClick={() => handleRemovePrize(record.id)}
          danger
          type="text"
          disabled={prizes.length <= 2}
        />
      ),
    },
  ];

  return (
    <div className="lucky-wheel-property-panel">
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        initialValues={{
          title: value.title || '幸运大转盘',
          buttonText: value.buttonText || '开始抽奖',
          rotationTime: value.rotationTime || 5000,
        }}
      >
        <Form.Item label="转盘标题" name="title">
          <Input placeholder="幸运大转盘" />
        </Form.Item>
        
        <Form.Item label="按钮文字" name="buttonText">
          <Input placeholder="开始抽奖" />
        </Form.Item>
        
        <Form.Item label="旋转时间 (ms)" name="rotationTime">
          <InputNumber min={1000} max={10000} step={500} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
      
      <div className="prize-settings mt-4">
        <Title level={5}>奖项设置</Title>
        
        <Row className="mb-2">
          <Col span={24}>
            <div style={{ color: totalProbability === 1 ? 'green' : 'red' }}>
              概率总和: {totalProbability} {totalProbability === 1 ? '✓' : '(建议总和为1)'}
            </div>
          </Col>
        </Row>
        
        <Table
          columns={prizeColumns}
          dataSource={prizes}
          rowKey="id"
          size="small"
          pagination={false}
          scroll={{ y: 300 }}
          footer={() => (
            <Button 
              type="dashed" 
              onClick={handleAddPrize} 
              style={{ width: '100%' }}
              icon={<PlusOutlined />}
              disabled={prizes.length >= 12}
            >
              添加奖项
            </Button>
          )}
        />
        
        <div className="tips mt-3">
          <p style={{ fontSize: '12px', color: '#888' }}>
            提示: 概率总和建议为1，否则可能导致抽奖结果不准确。
          </p>
        </div>
      </div>
    </div>
  );
};

export default LuckyWheelPropertyPanel; 