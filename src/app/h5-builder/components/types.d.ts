// 组件类型接口
export interface ComponentType {
  id: string;
  type: string;
  props: any;
  icon?: React.ElementType;
  name?: string;
  defaultProps?: any;
}

// 组件定义接口（不含id，用于组件库中）
export interface ComponentDefinition {
  type: string;
  name: string;
  icon: React.ElementType;
  defaultProps: any;
}

// 组件面板属性接口
export interface ComponentPanelProps {
  onAddComponent: (component: any) => void;
}

// 画布属性接口
export interface CanvasProps {
  components: ComponentType[];
  selectedComponentId?: string;
  onSelectComponent?: (component: ComponentType) => void;
  onRemoveComponent?: (id: string) => void;
  onUpdateComponentPosition?: (id: string, position: { top: number; left: number }) => void;
  onDeleteComponent?: (id: string) => void;
  onDuplicateComponent?: (id: string) => void;
  onUpdateComponentsOrder?: (startIndex: number, endIndex: number) => void;
  zoom: number;
}

// 属性面板接口
export interface PropertyPanelProps {
  selectedComponent: ComponentType | null;
  onUpdateComponent: (id: string, props: any) => void;
}

// 页面数据接口
export interface PageInfo {
  id?: string;
  title: string;
  description?: string;
  tags?: string[];
  components: ComponentType[];
  published?: boolean;
  publishUrl?: string;
  
  // 外观设置
  bgMode?: 'color' | 'image' | 'gradient';
  bgColor?: string;
  bgImage?: string | null;
  bgRepeat?: string;
  shareImage?: string | null;
  
  // 布局设置
  layoutMode?: 'auto' | 'free';
  containerPadding?: number;
  componentGap?: number;
} 