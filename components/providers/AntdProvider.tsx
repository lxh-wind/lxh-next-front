"use client";

import React from "react";
import { ConfigProvider, theme } from "antd";
import { ThemeConfig } from "antd/es/config-provider/context";

// Define light theme
const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: "#1677ff", // Primary color for all components
    colorSuccess: "#52c41a", // Success state color
    colorWarning: "#faad14", // Warning state color
    colorError: "#ff4d4f", // Error state color
    colorInfo: "#1677ff", // Info state color
    borderRadius: 6, // Default border radius
  },
  algorithm: theme.defaultAlgorithm,
};

// Define dark theme
const darkTheme: ThemeConfig = {
  token: {
    colorPrimary: "#1668dc", // Primary color for dark mode
    colorSuccess: "#49aa19", // Success state color
    colorWarning: "#d89614", // Warning state color
    colorError: "#dc4446", // Error state color
    colorInfo: "#1668dc", // Info state color
    borderRadius: 6, // Default border radius
  },
  algorithm: theme.darkAlgorithm,
};

interface AntdProviderProps {
  children: React.ReactNode;
}

export default function AntdProvider({ children }: AntdProviderProps) {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  
  // 检测系统颜色模式
  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
      document.documentElement.classList.toggle('dark', e.matches);
    };

    // 初始设置
    setIsDarkMode(mediaQuery.matches);
    document.documentElement.classList.toggle('dark', mediaQuery.matches);

    // 监听变化
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <ConfigProvider 
      theme={isDarkMode ? darkTheme : lightTheme}
      // 配置全局组件默认属性
      componentSize="middle"
      // 国际化配置
      locale={undefined}
    >
      {children}
    </ConfigProvider>
  );
} 