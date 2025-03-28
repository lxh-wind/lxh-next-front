import React, { useEffect, useState } from 'react';
import { ComponentType } from '../../components/types';

interface ProductItem {
  id: string;
  name: string;
  price: string;
  originalPrice: string;
  sales: string;
  image: string;
  source: string;
  isExpress: boolean;
  isHot: boolean;
}

export function ProductListComponent({ component }: { component: ComponentType }) {
  const [displayProducts, setDisplayProducts] = useState<ProductItem[]>([]);
  
  // 强制组件重新渲染的key
  const [refreshKey, setRefreshKey] = useState(0);
  
  // 从component.props中提取有效数据
  const props = component.props as any;
  
  // 每当组件key变化时更新显示的商品
  useEffect(() => {    
    // 获取显示的商品数据
    const getProductsToDisplay = () => {
      const {
        dataSource = 'mock',
        limit = 4,
        mockProducts = []
      } = props;
      
      // 如果使用模拟数据
      if (dataSource === 'mock' && Array.isArray(mockProducts) && mockProducts.length > 0) {
        if (mockProducts.length <= limit) {
          return mockProducts;
        }
        
        // 如果商品足够，截取需要的数量
        return mockProducts.slice(0, limit);
      }
      
      // 如果没有数据，返回空数组
      return [];
    };
    
    setDisplayProducts(getProductsToDisplay());
  }, [component, props, refreshKey]);
  
  // 每次渲染后检查是否需要强制刷新
  useEffect(() => {
    // 组件更新后1秒后再次检查数据
    const timer = setTimeout(() => {
      setRefreshKey(prev => prev + 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [props.mockProducts]);
  
  // 商品图片加载错误时的处理
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://placeholder.com/150';
  };
  
  // 安全获取props值的辅助函数
  const getProp = (key: string, defaultValue: any) => {
    return props[key] !== undefined ? props[key] : defaultValue;
  };
  
  // 提取常用属性
  const viewMode = getProp('viewMode', 'grid');
  const columns = getProp('columns', 2);
  const showMore = getProp('showMore', true);
  const moreText = getProp('moreText', '查看更多 >');
  const showPrice = getProp('showPrice', true);
  const showSales = getProp('showSales', true);
  const showFavorite = getProp('showFavorite', true);
  const showBrand = getProp('showBrand', true);
  const priceColor = getProp('priceColor', '#f56c6c');
  const showPromotionTag = getProp('showPromotionTag', true);
  const showExpress = getProp('showExpress', true);
  
  return (
    <div className="w-full bg-white rounded-md overflow-hidden" style={{ 
      ...props.style,
      padding: `0`,
    }}>
      {props.title && (
        <div className="text-base font-medium mb-3 flex justify-between items-center px-3 pt-3">
          <div>{props.title}</div>
          {showMore && <div className="text-xs text-gray-500">{moreText}</div>}
        </div>
      )}
      
      {displayProducts.length === 0 ? (
        <div className="py-10 text-center text-gray-400">
          <div>请在右侧数据选项卡中添加商品</div>
        </div>
      ) : (
        <>
          {viewMode === 'grid' && (
            <div className={`grid grid-cols-${columns} gap-2 px-2 pb-2`}>
              {displayProducts.map((product, index) => (
                <div key={product.id || index} className="bg-white p-0 relative border border-gray-100">
                  <div className="aspect-square relative overflow-hidden">
                    {/* 商品图片 */}
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={handleImageError}
                        />
                      ) : (
                        <div className="text-xs text-gray-400">商品图片</div>
                      )}
                    </div>
                    
                    {/* 收藏按钮 */}
                    {showFavorite && (
                      <div className="absolute top-2 right-2 bg-gray-100 bg-opacity-60 rounded-full p-1.5">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="black" strokeWidth="1.5" />
                        </svg>
                      </div>
                    )}
                    
                    {/* 促销标签 */}
                    {showPromotionTag && product.isHot && (
                      <div className="absolute bottom-0 left-0 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-2 py-0.5">
                        人气现货
                      </div>
                    )}
                  </div>
                  
                  <div className="p-2">
                    {/* 商品名称 */}
                    <div className="text-sm font-medium truncate mb-1">{product.name}</div>
                    
                    {/* 商品价格与销量 */}
                    <div className="flex justify-between items-center mt-1">
                      {showPrice && (
                        <div className="text-xl font-semibold" style={{ color: priceColor }}>
                          <span className="text-sm">¥</span> {product.price}
                        </div>
                      )}
                      {showSales && (
                        <div className="text-xs text-gray-400">今日已拼{product.sales}件</div>
                      )}
                    </div>
                    
                    {/* 品牌信息 */}
                    {showBrand && (
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <span>{product.source}</span>
                        {showExpress && product.isExpress && (
                          <span className="ml-2 border border-amber-500 text-amber-500 px-1 rounded text-xs">已拿档口</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* 快速发货标签 */}
                  {showExpress && product.isExpress && (
                    <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-br">
                      24H发
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {viewMode === 'list' && (
            <div className="flex flex-col gap-0 p-2">
              {displayProducts.map((product, index) => (
                <div key={product.id || index} className="bg-white p-3 border-b border-gray-100 relative mb-2 rounded">
                  <div className="flex">
                    <div className="w-24 h-24 bg-gray-50 rounded-md relative flex-shrink-0">
                      {/* 商品图片 */}
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover rounded-md"
                          onError={handleImageError}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">商品图片</div>
                      )}
                      
                      {/* 收藏按钮 */}
                      {showFavorite && (
                        <div className="absolute top-1 right-1 bg-gray-100 bg-opacity-60 rounded-full p-1">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="black" strokeWidth="1.5" />
                          </svg>
                        </div>
                      )}
                      
                      {/* 快速发货标签 */}
                      {showExpress && product.isExpress && (
                        <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-1 py-0.5 rounded-br">
                          24H发
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-3 flex-grow">
                      {/* 商品名称 */}
                      <div className="text-sm font-medium line-clamp-2">{product.name}</div>
                      
                      {/* 品牌信息 */}
                      {showBrand && (
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <span>{product.source}</span>
                          {showExpress && product.isExpress && (
                            <span className="ml-2 border border-amber-500 text-amber-500 px-1 rounded text-xs">已拿档口</span>
                          )}
                        </div>
                      )}
                      
                      {/* 商品价格与销量 */}
                      <div className="flex justify-between items-center mt-2">
                        {showPrice && (
                          <div className="text-lg font-semibold" style={{ color: priceColor }}>
                            <span className="text-sm">¥</span> {product.price}
                          </div>
                        )}
                        {showSales && (
                          <div className="text-xs text-gray-400">今日已拼{product.sales}件</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {viewMode === 'card' && (
            <div className="overflow-x-auto px-3 py-3">
              <div className="flex gap-3 pb-2" style={{ minWidth: 'max-content' }}>
                {displayProducts.map((product, index) => (
                  <div key={product.id || index} className="bg-white border border-gray-100 rounded-lg w-36 flex-shrink-0 overflow-hidden relative">
                    <div className="aspect-square bg-gray-50 relative">
                      {/* 商品图片 */}
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={handleImageError}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">商品图片</div>
                      )}
                      
                      {/* 收藏按钮 */}
                      {showFavorite && (
                        <div className="absolute top-1 right-1 bg-gray-100 bg-opacity-60 rounded-full p-1">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="black" strokeWidth="1.5" />
                          </svg>
                        </div>
                      )}
                      
                      {/* 快速发货标签 */}
                      {showExpress && product.isExpress && (
                        <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-1 py-0.5 rounded-br">
                          24H发
                        </div>
                      )}
                    </div>
                    
                    <div className="p-2">
                      {/* 商品名称 */}
                      <div className="text-sm font-medium truncate">{product.name.split(' ')[0]} {product.name.split(' ')[1]}</div>
                      
                      {/* 商品价格 */}
                      {showPrice && (
                        <div className="text-base font-semibold mt-1" style={{ color: priceColor }}>
                          <span className="text-xs">¥</span> {product.price}
                        </div>
                      )}
                      
                      {/* 品牌信息 */}
                      {showBrand && (
                        <div className="text-xs text-gray-400 mt-1 truncate">{product.source}</div>
                      )}
                    </div>
                    
                    {/* 促销标签 */}
                    {showPromotionTag && product.isHot && (
                      <div className="absolute bottom-12 left-0 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-1 py-0.5">
                        人气现货
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 