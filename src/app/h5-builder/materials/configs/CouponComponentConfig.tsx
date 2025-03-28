import React from 'react';
import { Form, Input, InputNumber, Button, Space, Switch, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { ComponentType, Coupon } from '../../components/types';

const { Option } = Select;

interface ComponentConfigProps {
  component: ComponentType;
  onChange: (component: ComponentType) => void;
}

export function CouponComponentConfig({ component, onChange }: ComponentConfigProps) {
  const handleChange = (key: string, value: any) => {
    onChange({ ...component, props: { ...component.props, [key]: value } });
  };

  const handleCouponChange = (coupons: Coupon[]) => {
    handleChange('coupons', coupons);
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

  return (
    <div className="p-4">
      <Form layout="vertical">
        <Form.Item label="标题">
          <Input 
            value={component.props.title} 
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="优惠券标题" 
          />
        </Form.Item>
        
        <Form.Item label="背景颜色">
          <Input 
            type="color"
            value={component.props.style?.backgroundColor || '#f5f5f5'}
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
            style={{ width: '100%' }}
          />
        </Form.Item>
        
        <Form.Item label="内边距">
          <InputNumber
            value={component.props.style?.padding || 8}
            onChange={(value) => handleStyleChange('padding', value)}
            min={0}
            max={40}
            style={{ width: '100%' }}
          />
        </Form.Item>
        
        <Form.Item label="圆角大小">
          <InputNumber
            value={component.props.style?.borderRadius || 12}
            onChange={(value) => handleStyleChange('borderRadius', value)}
            min={0}
            max={24}
            style={{ width: '100%' }}
          />
        </Form.Item>
        
        <h3 className="font-medium mt-4 mb-2">优惠券设置</h3>
        
        <Form.List name="coupons" initialValue={component.props.coupons || []}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => {
                const coupon = (component.props.coupons?.[name] || {}) as Coupon;
                return (
                  <div key={key} className="p-3 border border-gray-200 rounded mb-3">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Form.Item label="金额">
                        <InputNumber 
                          value={coupon.amount}
                          onChange={(value) => {
                            const newCoupons = [...(component.props.coupons || [])] as Coupon[];
                            newCoupons[name] = { ...newCoupons[name], amount: value as number };
                            handleCouponChange(newCoupons);
                          }}
                          min={0}
                          precision={1}
                          placeholder="5" 
                          addonBefore="¥"
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                      
                      <Form.Item label="最低消费">
                        <InputNumber 
                          value={coupon.minSpend}
                          onChange={(value) => {
                            const newCoupons = [...(component.props.coupons || [])] as Coupon[];
                            newCoupons[name] = { ...newCoupons[name], minSpend: value as number };
                            handleCouponChange(newCoupons);
                          }}
                          min={0}
                          precision={0}
                          placeholder="88" 
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                      
                      <Form.Item label="商家名称">
                        <Input 
                          value={coupon.shopName}
                          onChange={(e) => {
                            const newCoupons = [...(component.props.coupons || [])] as Coupon[];
                            newCoupons[name] = { ...newCoupons[name], shopName: e.target.value };
                            handleCouponChange(newCoupons);
                          }}
                          placeholder="商家 | 档口红包" 
                        />
                      </Form.Item>
                      
                      <Form.Item label="使用条件">
                        <Input 
                          value={coupon.condition}
                          onChange={(e) => {
                            const newCoupons = [...(component.props.coupons || [])] as Coupon[];
                            newCoupons[name] = { ...newCoupons[name], condition: e.target.value };
                            handleCouponChange(newCoupons);
                          }}
                          placeholder="适用于[MSTUDIO 漫莎]档口内的所有商品" 
                        />
                      </Form.Item>
                      
                      <Form.Item label="有效期">
                        <Input 
                          value={coupon.validPeriod}
                          onChange={(e) => {
                            const newCoupons = [...(component.props.coupons || [])] as Coupon[];
                            newCoupons[name] = { ...newCoupons[name], validPeriod: e.target.value };
                            handleCouponChange(newCoupons);
                          }}
                          placeholder="03.28 00:53 ~ 03.31 00:53" 
                        />
                      </Form.Item>
                      
                      <Form.Item label="按钮文本">
                        <Input 
                          value={coupon.buttonText}
                          onChange={(e) => {
                            const newCoupons = [...(component.props.coupons || [])] as Coupon[];
                            newCoupons[name] = { ...newCoupons[name], buttonText: e.target.value };
                            handleCouponChange(newCoupons);
                          }}
                          placeholder="去使用" 
                        />
                      </Form.Item>
                      
                      <Form.Item label="新人专享" valuePropName="checked">
                        <Switch
                          checked={coupon.isNew}
                          onChange={(checked) => {
                            const newCoupons = [...(component.props.coupons || [])] as Coupon[];
                            newCoupons[name] = { ...newCoupons[name], isNew: checked };
                            handleCouponChange(newCoupons);
                          }}
                        />
                      </Form.Item>
                      
                      <Form.Item label="按钮颜色">
                        <Input 
                          type="color"
                          value={coupon.buttonColor || '#ff6cab'}
                          onChange={(e) => {
                            const newCoupons = [...(component.props.coupons || [])] as Coupon[];
                            newCoupons[name] = { ...newCoupons[name], buttonColor: e.target.value };
                            handleCouponChange(newCoupons);
                          }}
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                      
                      <Button 
                        type="text" 
                        danger 
                        icon={<MinusCircleOutlined />}
                        onClick={() => {
                          const newCoupons = [...(component.props.coupons || [])] as Coupon[];
                          newCoupons.splice(name, 1);
                          handleCouponChange(newCoupons);
                          remove(name);
                        }}
                      >
                        删除优惠券
                      </Button>
                    </Space>
                  </div>
                );
              })}
              
              <Form.Item>
                <Button 
                  type="dashed" 
                  onClick={() => {
                    const newCoupon: Coupon = {
                      amount: 5,
                      minSpend: 88,
                      shopName: '商家 | 档口红包',
                      condition: '适用于[MSTUDIO 漫莎]档口内的所有商品',
                      validPeriod: '03.28 00:53 ~ 03.31 00:53',
                      buttonText: '去使用',
                      buttonColor: '#ff6cab',
                      isNew: false
                    };
                    const newCoupons = [...(component.props.coupons || []), newCoupon];
                    handleCouponChange(newCoupons);
                    add();
                  }} 
                  block 
                  icon={<PlusOutlined />}
                >
                  添加优惠券
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </div>
  );
} 