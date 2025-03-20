'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

type ContentItem = {
  id: string;
  title: string;
  type: 'article' | 'page' | 'product';
  status: 'draft' | 'published' | 'archived';
  author: string;
  createdAt: string;
  updatedAt: string;
};

export default function ContentPage() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([
    {
      id: '1',
      title: '关于我们',
      type: 'page',
      status: 'published',
      author: '张三',
      createdAt: '2023-03-15',
      updatedAt: '2023-04-01'
    },
    {
      id: '2',
      title: '产品介绍：智能家居系统',
      type: 'article',
      status: 'published',
      author: '李四',
      createdAt: '2023-03-20',
      updatedAt: '2023-03-25'
    },
    {
      id: '3',
      title: '最新促销活动',
      type: 'article',
      status: 'draft',
      author: '王五',
      createdAt: '2023-04-01',
      updatedAt: '2023-04-02'
    },
    {
      id: '4',
      title: '智能音箱 XB-100',
      type: 'product',
      status: 'published',
      author: '李四',
      createdAt: '2023-02-10',
      updatedAt: '2023-03-05'
    },
    {
      id: '5',
      title: '隐私政策',
      type: 'page',
      status: 'archived',
      author: '张三',
      createdAt: '2022-12-01',
      updatedAt: '2023-01-15'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isAddContentOpen, setIsAddContentOpen] = useState(false);
  const [contentTypeFilter, setContentTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = contentTypeFilter ? item.type === contentTypeFilter : true;
    const matchesStatus = statusFilter ? item.status === statusFilter : true;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDeleteSelected = () => {
    setContentItems(current => current.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(current => 
      current.includes(itemId) 
        ? current.filter(id => id !== itemId) 
        : [...current, itemId]
    );
  };

  const selectAllItems = () => {
    if (selectedItems.length === filteredContent.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredContent.map(item => item.id));
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-50 text-green-700';
      case 'draft':
        return 'bg-blue-50 text-blue-700';
      case 'archived':
        return 'bg-gray-50 text-gray-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published':
        return '已发布';
      case 'draft':
        return '草稿';
      case 'archived':
        return '已归档';
      default:
        return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'article':
        return '文章';
      case 'page':
        return '页面';
      case 'product':
        return '产品';
      default:
        return type;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">内容管理</h1>
          <Dialog isOpen={isAddContentOpen} onClose={() => setIsAddContentOpen(false)}>
            <DialogTrigger onClick={() => setIsAddContentOpen(true)}>
              <Button>创建内容</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>添加新内容</DialogTitle>
                <DialogDescription>
                  填写以下信息创建新的内容项
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    标题
                  </Label>
                  <Input id="title" className="col-span-3" placeholder="输入内容标题" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    类型
                  </Label>
                  <div className="col-span-3">
                    <Select id="type" defaultValue="article" label="选择内容类型">
                      <SelectItem value="article">文章</SelectItem>
                      <SelectItem value="page">页面</SelectItem>
                      <SelectItem value="product">产品</SelectItem>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="content" className="text-right">
                    内容
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="输入内容详情"
                    className="col-span-3 min-h-[120px]"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    状态
                  </Label>
                  <div className="col-span-3">
                    <Select id="status" defaultValue="draft" label="选择内容状态">
                      <SelectItem value="draft">草稿</SelectItem>
                      <SelectItem value="published">发布</SelectItem>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddContentOpen(false)}>
                  取消
                </Button>
                <Button>创建</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">全部内容</TabsTrigger>
              <TabsTrigger value="articles">文章</TabsTrigger>
              <TabsTrigger value="pages">页面</TabsTrigger>
              <TabsTrigger value="products">产品</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center space-x-2">
              <Input
                placeholder="搜索内容..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <div className="w-36">
                <Select 
                  value={statusFilter || ""} 
                  onChange={(e) => setStatusFilter(e.target.value || null)}
                  label="状态筛选"
                >
                  <SelectItem value="">全部状态</SelectItem>
                  <SelectItem value="published">已发布</SelectItem>
                  <SelectItem value="draft">草稿</SelectItem>
                  <SelectItem value="archived">已归档</SelectItem>
                </Select>
              </div>
            </div>
          </div>
          
          <TabsContent value="all">
            <ContentList 
              items={filteredContent}
              selectedItems={selectedItems}
              toggleItemSelection={toggleItemSelection}
              selectAllItems={selectAllItems}
              handleDeleteSelected={handleDeleteSelected}
              getStatusBadgeClass={getStatusBadgeClass}
              getStatusLabel={getStatusLabel}
              getTypeLabel={getTypeLabel}
            />
          </TabsContent>
          
          <TabsContent value="articles">
            <ContentList 
              items={filteredContent.filter(item => item.type === 'article')}
              selectedItems={selectedItems}
              toggleItemSelection={toggleItemSelection}
              selectAllItems={selectAllItems}
              handleDeleteSelected={handleDeleteSelected}
              getStatusBadgeClass={getStatusBadgeClass}
              getStatusLabel={getStatusLabel}
              getTypeLabel={getTypeLabel}
            />
          </TabsContent>
          
          <TabsContent value="pages">
            <ContentList 
              items={filteredContent.filter(item => item.type === 'page')}
              selectedItems={selectedItems}
              toggleItemSelection={toggleItemSelection}
              selectAllItems={selectAllItems}
              handleDeleteSelected={handleDeleteSelected}
              getStatusBadgeClass={getStatusBadgeClass}
              getStatusLabel={getStatusLabel}
              getTypeLabel={getTypeLabel}
            />
          </TabsContent>
          
          <TabsContent value="products">
            <ContentList 
              items={filteredContent.filter(item => item.type === 'product')}
              selectedItems={selectedItems}
              toggleItemSelection={toggleItemSelection}
              selectAllItems={selectAllItems}
              handleDeleteSelected={handleDeleteSelected}
              getStatusBadgeClass={getStatusBadgeClass}
              getStatusLabel={getStatusLabel}
              getTypeLabel={getTypeLabel}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

type ContentListProps = {
  items: ContentItem[];
  selectedItems: string[];
  toggleItemSelection: (id: string) => void;
  selectAllItems: () => void;
  handleDeleteSelected: () => void;
  getStatusBadgeClass: (status: string) => string;
  getStatusLabel: (status: string) => string;
  getTypeLabel: (type: string) => string;
};

function ContentList({ 
  items, 
  selectedItems, 
  toggleItemSelection, 
  selectAllItems, 
  handleDeleteSelected,
  getStatusBadgeClass,
  getStatusLabel,
  getTypeLabel
}: ContentListProps) {
  return (
    <Card>
      <CardHeader className="px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>内容列表</CardTitle>
            <CardDescription>管理网站的所有内容</CardDescription>
          </div>
          {selectedItems.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">已选择 {selectedItems.length} 项</span>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDeleteSelected}
              >
                删除所选
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedItems.length === items.length && items.length > 0}
                  onChange={selectAllItems}
                />
              </TableHead>
              <TableHead>标题</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>作者</TableHead>
              <TableHead>创建日期</TableHead>
              <TableHead>更新日期</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  没有找到符合条件的内容
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleItemSelection(item.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{getTypeLabel(item.type)}</TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      getStatusBadgeClass(item.status)
                    }`}>
                      {getStatusLabel(item.status)}
                    </div>
                  </TableCell>
                  <TableCell>{item.author}</TableCell>
                  <TableCell>{item.createdAt}</TableCell>
                  <TableCell>{item.updatedAt}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">编辑</Button>
                    <Button variant="ghost" size="sm">查看</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      {items.length > 0 && (
        <CardFooter className="flex justify-between px-6 py-4 border-t">
          <div className="text-sm text-muted-foreground">
            显示 {items.length} 条内容中的 {Math.min(items.length, 10)} 条
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>上一页</Button>
            <Button variant="outline" size="sm">1</Button>
            <Button variant="outline" size="sm" disabled>下一页</Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
} 