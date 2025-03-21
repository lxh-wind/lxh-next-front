"use client";

import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import AntdProvider from '@/components/providers/AntdProvider';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <AntdRegistry>
      <AntdProvider>
        {children}
      </AntdProvider>
    </AntdRegistry>
  );
} 