'use client';

import React from 'react';
import { Modal, Form, Input, Button, Select, message } from 'antd';
import { useAtom } from 'jotai';
import { pageInfoAtom } from '@/src/app/h5-builder/store/atoms';
import { savePage } from '../utils/store';

interface SaveModalProps {
  open: boolean;
  onClose: () => void;
}

const SaveModal: React.FC<SaveModalProps> = ({ 
  open, 
  onClose 
}) => {
  const [form] = Form.useForm();
  const [pageInfo, setPageInfo] = useAtom(pageInfoAtom);
  const [loading, setLoading] = React.useState(false);

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

  const handleSave = async (values: any) => {
    try {
      setLoading(true);
      
      // 更新页面信息
      const updatedPageInfo = {
        ...pageInfo,
        ...values
      };
      
      // 保存到服务器
      const savedPage = await savePage(updatedPageInfo);
      
      // 更新应用状态
      setPageInfo(savedPage);
      
      message.success('页面保存成功');
      onClose();
    } catch (error) {
      message.error('保存失败，请重试');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
        
        <Form.Item className="flex justify-end mb-0">
          <Button onClick={onClose} className="mr-2">
            取消
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            保存
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SaveModal; 