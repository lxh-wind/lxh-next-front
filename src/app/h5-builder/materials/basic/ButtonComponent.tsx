import React from 'react';
import { Button } from 'antd-mobile';
import { ComponentType } from '../../components/types';

export function ButtonComponent({ component }: { component: ComponentType }) {
  // 处理按钮链接功能
  const handleButtonClick = () => {
    if (component.props.link) {
      window.open(component.props.link, '_blank');
    }
  };
  
  // 映射按钮类型到antd-mobile的props
  const getButtonProps = () => {
    const buttonType = component.props.buttonType || 'default';
    
    switch(buttonType) {
      case 'primary':
        return { color: 'primary' as const, fill: 'solid' as const };
      case 'dashed':
        return { color: 'default' as const, fill: 'outline' as const };
      case 'link':
        return { color: 'default' as const, fill: 'none' as const };
      case 'text':
        return { color: 'default' as const, fill: 'none' as const };
      default:
        return { color: 'default' as const, fill: 'solid' as const };
    }
  };
  
  const buttonProps = getButtonProps();
  
  return (
    <Button 
      color={buttonProps.color} 
      fill={buttonProps.fill}
      style={{ ...component.props.style }}
      onClick={handleButtonClick}
    >
      {component.props.text}
    </Button>
  );
} 