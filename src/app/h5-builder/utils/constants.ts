// 画布相关默认配置
export const CANVAS_DEFAULTS = {
  POSITION: { x: 350, y: 50 },
  SIZE: { width: 375, height: 667 },
  MIN_ZOOM: 30,
  MAX_ZOOM: 200,
  ZOOM_STEP: 20,
  DEFAULT_ZOOM: 100,
  CONTAINER_SIZE: { width: 2000, height: 2000 },
  PADDING: 24,
  BACKGROUND: {
    SIZE: '20px 20px',
    IMAGE: 'linear-gradient(to right, rgba(0,0,0,0.01) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.01) 1px, transparent 1px)',
    COLOR: '#f9fafc'
  }
};

// 面板相关配置
export const PANEL_CONFIG = {
  PROPERTY_PANEL: {
    WIDTH: 300,
    MARGIN: 24
  }
}; 