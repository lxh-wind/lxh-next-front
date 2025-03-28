'use client';

import React, { useState } from 'react';
import { Row, Col, Card, Tabs, Checkbox, Input, InputNumber, ColorPicker, Radio } from 'antd';
import WorkoutResultStandalone from '../h5-builder/materials/marketing/WorkoutResultStandalone';

const TestWorkoutPage = () => {
  // State for map settings
  const [useRealMap, setUseRealMap] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [securityJsCode, setSecurityJsCode] = useState('');
  const [trackColor, setTrackColor] = useState('#2aab58');
  const [trackWidth, setTrackWidth] = useState(4);
  const [routePoints, setRoutePoints] = useState('31.203405,121.465353;31.205673,121.463164;31.207240,121.466168;31.209082,121.468271;31.206602,121.469816');
  const [distance, setDistance] = useState(5.12);
  const [time, setTime] = useState(34);
  const [badgeType, setBadgeType] = useState<'medal' | 'christmas' | 'newyear' | 'custom'>('medal');

  return (
    <div className="p-4">
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="设置">
            <Tabs>
              <Tabs.TabPane tab="地图设置" key="map">
                <div className="space-y-4">
                  <div>
                    <Checkbox 
                      checked={useRealMap} 
                      onChange={(e) => setUseRealMap(e.target.checked)}
                    >
                      使用高德地图
                    </Checkbox>
                  </div>
                  
                  {useRealMap && (
                    <>
                      <div>
                        <div className="mb-1">API Key</div>
                        <Input 
                          value={apiKey} 
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="请输入高德地图 API Key"
                        />
                      </div>
                      <div>
                        <div className="mb-1">安全密钥</div>
                        <Input 
                          value={securityJsCode} 
                          onChange={(e) => setSecurityJsCode(e.target.value)}
                          placeholder="请输入高德地图安全密钥"
                        />
                      </div>
                    </>
                  )}
                  
                  <div>
                    <div className="mb-1">轨迹颜色</div>
                    <ColorPicker 
                      value={trackColor}
                      onChange={(color) => setTrackColor(color.toHexString())}
                    />
                  </div>
                  
                  <div>
                    <div className="mb-1">轨迹宽度</div>
                    <InputNumber 
                      value={trackWidth}
                      onChange={(value) => setTrackWidth(value || 4)}
                      min={1}
                      max={10}
                    />
                  </div>
                  
                  <div>
                    <div className="mb-1">路线点</div>
                    <Input.TextArea 
                      value={routePoints}
                      onChange={(e) => setRoutePoints(e.target.value)}
                      placeholder="格式：纬度,经度;纬度,经度..."
                      rows={4}
                    />
                  </div>
                </div>
              </Tabs.TabPane>
              
              <Tabs.TabPane tab="运动数据" key="workout">
                <div className="space-y-4">
                  <div>
                    <div className="mb-1">距离 (公里)</div>
                    <InputNumber 
                      value={distance}
                      onChange={(value) => setDistance(value || 0)}
                      min={0}
                      step={0.01}
                    />
                  </div>
                  
                  <div>
                    <div className="mb-1">时间 (分钟)</div>
                    <InputNumber 
                      value={time}
                      onChange={(value) => setTime(value || 0)}
                      min={0}
                    />
                  </div>
                </div>
              </Tabs.TabPane>
              
              <Tabs.TabPane tab="徽章设置" key="badge">
                <div className="space-y-4">
                  <div>
                    <div className="mb-1">徽章类型</div>
                    <Radio.Group 
                      value={badgeType}
                      onChange={(e) => setBadgeType(e.target.value as 'medal' | 'christmas' | 'newyear' | 'custom')}
                    >
                      <Radio value="medal">奖牌</Radio>
                      <Radio value="christmas">圣诞</Radio>
                      <Radio value="newyear">新年</Radio>
                      <Radio value="custom">自定义</Radio>
                    </Radio.Group>
                  </div>
                </div>
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </Col>
        
        <Col span={12}>
          <Card title="预览">
            <div className="border rounded overflow-hidden">
              <WorkoutResultStandalone
                useRealMap={useRealMap}
                mapApiKey={apiKey}
                mapSecurityJsCode={securityJsCode}
                mapTrackColor={trackColor}
                mapTrackWidth={trackWidth}
                routePoints={routePoints}
                distance={distance}
                time={time}
                badgeType={badgeType}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TestWorkoutPage; 