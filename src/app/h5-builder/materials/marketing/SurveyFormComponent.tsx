import React from 'react';
import { Button } from 'antd-mobile';
import { ComponentType } from '../../components/types';

export function SurveyFormComponent({ component }: { component: ComponentType }) {
  return (
    <div style={{ ...component.props.style }}>
      <h3 className="font-medium">{component.props.title}</h3>
      <p className="text-xs text-gray-500 mb-3">{component.props.description}</p>
      {component.props.questions?.map((question: any, i: number) => (
        <div key={i} className="mb-3">
          <div className="text-sm font-medium mb-1">{i+1}. {question.title}</div>
          {question.type === 'radio' && (
            <div className="flex flex-col gap-1">
              {question.options.map((option: string, j: number) => (
                <div key={j} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                  <div className="text-sm">{option}</div>
                </div>
              ))}
            </div>
          )}
          {question.type === 'checkbox' && (
            <div className="flex flex-col gap-1">
              {question.options.map((option: string, j: number) => (
                <div key={j} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border border-gray-300"></div>
                  <div className="text-sm">{option}</div>
                </div>
              ))}
            </div>
          )}
          {question.type === 'text' && (
            <div className="border border-gray-300 rounded p-2 h-20 bg-white"></div>
          )}
        </div>
      ))}
      <div className="text-center mt-3">
        <Button color='primary'>{component.props.buttonText}</Button>
        <div className="text-xs text-gray-500 mt-1">{component.props.rewardText}</div>
      </div>
    </div>
  );
} 