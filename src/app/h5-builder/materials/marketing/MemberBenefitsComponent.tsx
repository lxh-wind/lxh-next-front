import React from 'react';
import { ComponentType } from '../../components/types';

export function MemberBenefitsComponent({ component }: { component: ComponentType }) {
  // Define icon mapping for benefit icons
  const iconMap: Record<string, string> = {
    'discount': '💰',
    'gift': '🎁',
    'priority': '⭐',
    'service': '👨‍💼',
    'delivery': '🚚',
    'return': '↩️',
    'points': '🏆',
    'vip': '👑',
  };

  // Get the correct columns value or default to 3
  const columns = component.props.columns || 3;
  
  return (
    <div style={{ ...component.props.style }} className="member-benefits-container">
      {/* Header Section */}
      <div className="text-center mb-4">
        <h3 className="font-medium text-xl">{component.props.title}</h3>
        {component.props.description && (
          <p className="text-gray-500 text-sm mt-2">{component.props.description}</p>
        )}
      </div>
      
      {/* Benefits Grid */}
      <div className="grid gap-3 mt-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {component.props.benefits?.map((benefit: any, i: number) => (
          <div 
            key={i} 
            className="bg-white p-3 rounded-lg text-center shadow-sm transition-all hover:shadow-md"
            style={{ 
              backgroundColor: benefit.bgColor || '#ffffff',
              borderRadius: (component.props.style?.borderRadius || 8) + 'px'
            }}
          >
            <div className="text-3xl mb-2" style={{ color: benefit.iconColor || '#f59e0b' }}>
              {benefit.icon && iconMap[benefit.icon] ? iconMap[benefit.icon] : '🎁'}
            </div>
            <div className="text-sm font-medium">{benefit.title}</div>
            <div className="text-xs text-gray-500 mt-1">{benefit.description}</div>
          </div>
        ))}
      </div>
      
      {/* Action Button */}
      {component.props.buttonText && (
        <div className="text-center mt-5">
          <button 
            className="px-6 py-2 rounded-full font-medium text-white transition-all hover:opacity-90"
            style={{ 
              backgroundColor: component.props.buttonColor || '#8c54ff',
              boxShadow: '0 4px 6px rgba(140, 84, 255, 0.25)'
            }}
          >
            {component.props.buttonText}
            {component.props.price && (
              <span className="ml-2">¥{component.props.price}/{component.props.period || '月'}</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
} 