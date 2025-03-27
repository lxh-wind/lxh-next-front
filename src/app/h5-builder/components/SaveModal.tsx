'use client';

import React from 'react';
import { Modal, Form, Input, Button, Select } from 'antd';
import type { PageInfo } from './types';

interface SaveModalProps {
  open: boolean;
  onClose: () => void;
  pageInfo: PageInfo;
  onSave: (values: any) => Promise<void>;
}

const SaveModal: React.FC<SaveModalProps> = ({ 
  open, 
  onClose, 
  pageInfo, 
  onSave 
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    // 每次打开模态框时重置表单
    if (open) {
      form.setFieldsValue({
        title: pageInfo.title,
        description: pageInfo.description,
        tags: pageInfo.tags,
      });
    }
  }, [open, pageInfo, form]);

  return (
    <Modal
      title="保存页面"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        name="saveForm"
        onFinish={onSave}
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
        
        <Form.Item className="flex justify-end mb-0">
          <Button onClick={onClose} className="mr-2">
            取消
          </Button>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SaveModal; 