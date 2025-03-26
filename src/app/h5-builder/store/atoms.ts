import { atom } from 'jotai';
import { ComponentType, PageInfo } from '../components/types';
import { CANVAS_DEFAULTS } from '../utils/constants';

// 页面信息状态
export const pageInfoAtom = atom<PageInfo>({
  id: '',
  title: '未命名页面',
  description: '',
  components: [],
  bgMode: 'color',
  bgColor: '#FFFFFF',
  bgImage: '',
  bgRepeat: 'no-repeat',
  shareImage: '',
  layoutMode: 'auto',
  containerPadding: 0,
  componentGap: 0,
  containerWidth: 100,
  published: false,
  publishUrl: '',
  tags: [],
});

// 组件列表状态
export const componentsAtom = atom<ComponentType[]>([]);

// 选中的组件状态
export const selectedComponentAtom = atom<ComponentType | null>(null);

// 画布缩放状态
export const zoomAtom = atom<number>(100);

// 画布尺寸状态
export const canvasSizeAtom = atom<{ width: number; height: number }>({
  width: 375,
  height: 667,
});

// 撤销/重做历史状态
export const historyAtom = atom<{
  past: ComponentType[][];
  present: ComponentType[];
  future: ComponentType[][];
}>({
  past: [],
  present: [],
  future: [],
});

// 历史索引状态
export const historyIndexAtom = atom<number>(-1);

// 可撤销/重做状态
export const canUndoAtom = atom<boolean>(false);
export const canRedoAtom = atom<boolean>(false);

// 画布位置状态
export const canvasPositionAtom = atom(CANVAS_DEFAULTS.POSITION); 