/**
 * H5页面构建器数据存储工具
 * 
 * 提供页面数据的保存、加载、发布、历史版本管理等功能
 * 目前使用localStorage实现，实际项目中应连接后端API
 */

// 类型定义
export interface PageData {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  components: any[];
  thumbnail?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  published?: boolean;
  publishedAt?: string;
  publishedUrl?: string;
  version?: number;
}

export interface PageListItem {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  updatedAt: string;
  createdAt: string;
  published: boolean;
  publishedUrl?: string;
}

export interface VersionInfo {
  id: string;
  pageId: string;
  version: number;
  createdAt: string;
  description: string;
  components: any[];
}

// API 响应类型
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// 存储键前缀
const PAGE_KEY_PREFIX = 'h5_page_';
const VERSION_KEY_PREFIX = 'h5_version_';
const PAGE_LIST_KEY = 'h5_page_list';

// 用于ID生成的计数器
let idCounter = 0;

// 页面列表管理
export const getPageList = (): PageListItem[] => {
  try {
    const listStr = localStorage.getItem(PAGE_LIST_KEY);
    return listStr ? JSON.parse(listStr) : [];
  } catch (error) {
    console.error('获取页面列表失败', error);
    return [];
  }
};

// 更新页面列表
const updatePageList = (page: PageData) => {
  try {
    const list = getPageList();
    
    // 检查是否已存在
    const existingIndex = list.findIndex(item => item.id === page.id);
    const listItem: PageListItem = {
      id: page.id,
      title: page.title,
      description: page.description,
      thumbnail: page.thumbnail,
      updatedAt: page.updatedAt || new Date().toISOString(),
      createdAt: page.createdAt || new Date().toISOString(),
      published: !!page.published,
      publishedUrl: page.publishedUrl
    };
    
    if (existingIndex >= 0) {
      // 更新现有页面
      list[existingIndex] = {
        ...list[existingIndex],
        ...listItem
      };
    } else {
      // 添加新页面
      list.push(listItem);
    }
    
    localStorage.setItem(PAGE_LIST_KEY, JSON.stringify(list));
  } catch (error) {
    console.error('更新页面列表失败', error);
  }
};

// 生成唯一ID
const generateId = () => {
  // 创建基于时间的部分
  const timestamp = Date.now().toString(36);
  
  // 创建随机部分 (使用多个随机源结合)
  const randomA = Math.random().toString(36).substring(2, 10);
  const randomB = Math.random().toString(36).substring(2, 10);
  
  // 使用递增计数器
  idCounter = (idCounter + 1) % 1000000;
  const counterStr = idCounter.toString(36).padStart(4, '0');
  
  // 添加加密安全的随机部分 (如果可用)
  let cryptoRandom = '';
  if (typeof window !== 'undefined' && window.crypto) {
    // 创建8字节的随机值
    const array = new Uint8Array(8);
    window.crypto.getRandomValues(array);
    // 转换为16进制字符串
    cryptoRandom = Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
  
  // 组合所有部分形成唯一ID
  return `page_${timestamp}_${randomA}_${randomB}_${counterStr}${cryptoRandom ? `_${cryptoRandom}` : ''}`;
};

// 生成复杂ID的函数
export const generateComplexId = (componentType: string) => {
  // 生成UUID v4
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
  
  // 生成时间戳
  const timestamp = new Date().getTime();
  
  // 生成格式化的时间字符串
  const date = new Date();
  const formattedDate = date.toISOString().replace(/[:\-\.]/g, '');
  
  return `${componentType}-${uuid}-${timestamp}-${formattedDate}`;
};

// 保存页面
export const savePage = async (pageData: Partial<PageData>): Promise<PageData> => {
  try {
    // 模拟 API 调用
    const savedData: PageData = {
      id: pageData.id || generateId(),
      title: pageData.title || '未命名页面',
      description: pageData.description || '',
      components: pageData.components || [],
      published: pageData.published || false,
      publishedUrl: pageData.publishedUrl || '',
      tags: pageData.tags || [],
      createdAt: pageData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: (pageData.version || 0) + 1,
    };

    // 保存到 localStorage
    localStorage.setItem(PAGE_KEY_PREFIX + savedData.id, JSON.stringify(savedData));
    updatePageList(savedData);

    return savedData;
  } catch (error) {
    throw new Error('保存失败');
  }
};

// 加载页面
export const loadPage = (pageId: string): PageData | null => {
  try {
    const pageStr = localStorage.getItem(`${PAGE_KEY_PREFIX}${pageId}`);
    return pageStr ? JSON.parse(pageStr) : null;
  } catch (error) {
    console.error('加载页面失败', error);
    return null;
  }
};

// 删除页面
export const deletePage = (pageId: string): boolean => {
  try {
    // 从列表中删除
    const list = getPageList().filter(page => page.id !== pageId);
    localStorage.setItem(PAGE_LIST_KEY, JSON.stringify(list));
    
    // 删除页面数据
    localStorage.removeItem(`${PAGE_KEY_PREFIX}${pageId}`);
    
    // 注意：不删除历史版本，以便可能的恢复
    return true;
  } catch (error) {
    console.error('删除页面失败', error);
    return false;
  }
};

// 发布页面
export const publishPage = async (pageId: string): Promise<PageData> => {
  try {
    const pageData = loadPage(pageId);
    if (!pageData) {
      throw new Error('页面不存在');
    }

    // 模拟发布过程
    const publishedData: PageData = {
      ...pageData,
      published: true,
      publishedAt: new Date().toISOString(),
      publishedUrl: `https://example.com/h5/${pageId}`,
    };

    // 保存发布状态
    localStorage.setItem(PAGE_KEY_PREFIX + pageId, JSON.stringify(publishedData));
    updatePageList(publishedData);

    return publishedData;
  } catch (error) {
    throw new Error('发布失败');
  }
};

// 保存版本
const saveVersion = (page: PageData): VersionInfo => {
  const version: VersionInfo = {
    id: `version_${Date.now()}`,
    pageId: page.id,
    version: page.version || 1,
    createdAt: new Date().toISOString(),
    description: `版本 ${page.version || 1}`,
    components: page.components
  };
  
  // 保存版本数据
  localStorage.setItem(`${VERSION_KEY_PREFIX}${version.id}`, JSON.stringify(version));
  
  // 更新版本列表
  const versions = getPageVersions(page.id);
  versions.push(version);
  localStorage.setItem(`${VERSION_KEY_PREFIX}${page.id}_list`, JSON.stringify(versions));
  
  return version;
};

// 获取页面版本列表
export const getPageVersions = (pageId: string): VersionInfo[] => {
  try {
    const versionsStr = localStorage.getItem(`${VERSION_KEY_PREFIX}${pageId}_list`);
    return versionsStr ? JSON.parse(versionsStr) : [];
  } catch (error) {
    console.error('获取页面版本列表失败', error);
    return [];
  }
};

// 加载特定版本
export const loadPageVersion = (versionId: string): VersionInfo | null => {
  try {
    const versionStr = localStorage.getItem(`${VERSION_KEY_PREFIX}${versionId}`);
    return versionStr ? JSON.parse(versionStr) : null;
  } catch (error) {
    console.error('加载页面版本失败', error);
    return null;
  }
};

// 恢复到特定版本
export const restoreVersion = async (versionId: string): Promise<PageData | null> => {
  try {
    const version = loadPageVersion(versionId);
    if (!version) {
      throw new Error('版本不存在');
    }
    
    const page = loadPage(version.pageId);
    if (!page) {
      throw new Error('页面不存在');
    }
    
    // 更新页面数据到特定版本
    const restoredPage: PageData = {
      ...page,
      components: version.components,
      updatedAt: new Date().toISOString(),
      version: (page.version || 0) + 1
    };
    
    // 保存更新后的页面
    return savePage(restoredPage);
  } catch (error) {
    console.error('恢复版本失败', error);
    return null;
  }
};

// 复制页面
export const duplicatePage = async (pageId: string): Promise<PageData | null> => {
  try {
    const page = loadPage(pageId);
    if (!page) {
      throw new Error('页面不存在');
    }
    
    // 创建副本
    const duplicatedPage: PageData = {
      ...page,
      id: `page_${Date.now()}`,
      title: `${page.title} (副本)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published: false,
      publishedAt: undefined,
      publishedUrl: undefined,
      version: 1
    };
    
    // 保存副本
    return savePage(duplicatedPage);
  } catch (error) {
    console.error('复制页面失败', error);
    return null;
  }
};

// 预览页面
export const previewPage = (pageData: any) => {
  // 保存页面数据到sessionStorage用于预览
  sessionStorage.setItem('h5_preview_data', JSON.stringify(pageData));
  
  // 返回预览URL
  return `/h5-builder/preview`;
};

// 预览抽奖转盘
export const previewLuckyWheel = (componentData: any) => {
  // 将转盘组件数据保存到会话存储中
  sessionStorage.setItem('h5_preview_luckywheel', JSON.stringify(componentData));
  
  // 返回转盘预览URL
  return `/h5-builder/preview/luckywheel`;
};

// 导出HTML
export const exportHTML = (pageData: any) => {
  // 这里简化处理，实际可能需要后端支持
  // 在前端拼装一个简单的HTML结构
  const { title, components } = pageData;
  
  // 基础HTML模板
  const htmlTemplate = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || 'H5营销页面'}</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .h5-container { max-width: 750px; margin: 0 auto; min-height: 100vh; }
    /* 可以添加更多样式 */
  </style>
</head>
<body>
  <div class="h5-container">
    ${
      components.map((comp: any) => {
        // 根据组件类型生成HTML
        switch(comp.type) {
          case 'text':
            return `<div style="${styleToString(comp.props.style)}">${comp.props.content}</div>`;
          case 'image':
            return `<img src="${comp.props.src}" alt="${comp.props.alt}" style="${styleToString(comp.props.style)}" />`;
          case 'button':
            return `<button type="button" style="${styleToString(comp.props.style)}">${comp.props.text}</button>`;
          // 可以添加更多组件的HTML生成逻辑
          default:
            return '';
        }
      }).join('\n    ')
    }
  </div>
</body>
</html>
  `;
  
  return htmlTemplate;
};

// 辅助函数：将样式对象转换为内联样式字符串
function styleToString(styleObj: any) {
  return Object.entries(styleObj)
    .map(([key, value]) => {
      // 将驼峰式属性名转换为连字符格式
      const cssProperty = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${cssProperty}: ${value}`;
    })
    .join('; ');
} 