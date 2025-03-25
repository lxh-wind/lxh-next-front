"use client";

import React from "react";
import {  Button, Card, Row, Col } from "antd";
import { MobileOutlined } from "@ant-design/icons";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">电商营销平台</h1>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            hoverable
            cover={
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white text-center">
                <MobileOutlined style={{ fontSize: 48 }} />
                <h3 className="mt-4 text-xl">H5 --- 营销活动</h3>
              </div>
            }
          >
            <Card.Meta
              title="H5营销活动构建器"
              description="可视化低代码构建平台，快速创建电商营销H5页面，无需代码"
            />
            <div className="mt-4">
              <Link href="/h5-builder/templates">
                <Button type="primary" block>
                  立即使用
                </Button>
              </Link>
            </div>
          </Card>
        </Col>
      </Row>
    </main>
  );
}
