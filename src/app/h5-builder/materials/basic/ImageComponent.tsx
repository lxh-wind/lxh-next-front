import React from 'react';
import Image from 'next/image';
import { ComponentType } from '../../components/types';

export function ImageComponent({ component }: { component: ComponentType }) {
  return (
    <Image 
      src={component.props.src || ''} 
      alt={component.props.alt || ''} 
      width={component.props.width}
      height={component.props.height}
      style={{ 
        ...component.props.style,
        maxWidth: '100%'
      }}
    />
  );
} 