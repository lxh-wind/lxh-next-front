import React from 'react';
import { ComponentType } from '../../types';

export function TextComponent({ component }: { component: ComponentType }) {
  return (
    <div style={{ 
      ...component.props.style,
      textAlign: component.props.style?.textAlign || 'left'
    }}>
      {component.props.content}
    </div>
  );
} 