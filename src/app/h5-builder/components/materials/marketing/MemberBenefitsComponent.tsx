import React from 'react';
import { ComponentType } from '../../types';

export function MemberBenefitsComponent({ component }: { component: ComponentType }) {
  return (
    <div style={{ ...component.props.style }}>
      <h3 className="font-medium text-center">{component.props.title}</h3>
      <div className="grid grid-cols-3 gap-3 mt-4">
        {component.props.benefits?.map((benefit: any, i: number) => (
          <div key={i} className="bg-white p-3 rounded-lg text-center shadow-sm">
            <div className="text-2xl text-yellow-500 mb-2">{benefit.icon || '🎁'}</div>
            <div className="text-sm font-medium">{benefit.title}</div>
            <div className="text-xs text-gray-500 mt-1">{benefit.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 