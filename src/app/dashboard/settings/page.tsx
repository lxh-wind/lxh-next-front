'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function SettingsPage() {
  const [notificationsEmail, setNotificationsEmail] = useState(true);
  const [notificationsSMS, setNotificationsSMS] = useState(false);
  const [notificationsSystem, setNotificationsSystem] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState('zh');

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">系统设置</h1>
        
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">通用设置</TabsTrigger>
            <TabsTrigger value="notifications">通知设置</TabsTrigger>
            <TabsTrigger value="appearance">外观设置</TabsTrigger>
            <TabsTrigger value="security">安全设置</TabsTrigger>
          </TabsList>
          
          {/* 通用设置 */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>个人信息</CardTitle>
                <CardDescription>更新您的个人资料信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">姓名</Label>
                    <Input id="name" defaultValue="管理员用户" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">电子邮箱</Label>
                    <Input id="email" type="email" defaultValue="admin@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">个人简介</Label>
                  <Textarea
                    id="bio"
                    placeholder="请输入您的个人简介"
                    className="min-h-[100px]"
                    defaultValue="系统管理员，负责系统维护和用户管理。"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>保存更改</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>系统设置</CardTitle>
                <CardDescription>配置系统基本参数</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">时区</Label>
                    <Select defaultValue="Asia/Shanghai">
                      <SelectItem value="Asia/Shanghai">中国标准时间 (GMT+8)</SelectItem>
                      <SelectItem value="America/New_York">美国东部时间 (GMT-5)</SelectItem>
                      <SelectItem value="Europe/London">英国标准时间 (GMT+0)</SelectItem>
                      <SelectItem value="Europe/Paris">中欧标准时间 (GMT+1)</SelectItem>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">语言</Label>
                    <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
                      <SelectItem value="zh">简体中文</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pageSize">每页显示条数</Label>
                  <Select defaultValue="20">
                    <SelectItem value="10">10 条/页</SelectItem>
                    <SelectItem value="20">20 条/页</SelectItem>
                    <SelectItem value="50">50 条/页</SelectItem>
                    <SelectItem value="100">100 条/页</SelectItem>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>保存更改</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* 通知设置 */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>通知偏好</CardTitle>
                <CardDescription>设置您希望接收的通知方式</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">通知渠道</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notifications-email">电子邮件通知</Label>
                        <p className="text-sm text-muted-foreground">
                          接收重要系统通知到您的邮箱
                        </p>
                      </div>
                      <Switch
                        id="notifications-email"
                        checked={notificationsEmail}
                        onCheckedChange={setNotificationsEmail}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notifications-sms">短信通知</Label>
                        <p className="text-sm text-muted-foreground">
                          接收紧急通知到您的手机
                        </p>
                      </div>
                      <Switch
                        id="notifications-sms"
                        checked={notificationsSMS}
                        onCheckedChange={setNotificationsSMS}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notifications-system">系统内通知</Label>
                        <p className="text-sm text-muted-foreground">
                          在系统内接收通知
                        </p>
                      </div>
                      <Switch
                        id="notifications-system"
                        checked={notificationsSystem}
                        onCheckedChange={setNotificationsSystem}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">通知类型</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="security" defaultChecked />
                      <label
                        htmlFor="security"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        安全通知
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="updates" defaultChecked />
                      <label
                        htmlFor="updates"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        系统更新
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="user-activity" defaultChecked />
                      <label
                        htmlFor="user-activity"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        用户活动
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="marketing" 
                        checked={marketingEmails} 
                        onChange={(e) => setMarketingEmails(e.target.checked)} 
                      />
                      <label
                        htmlFor="marketing"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        营销信息
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>保存设置</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* 外观设置 */}
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>外观偏好</CardTitle>
                <CardDescription>自定义系统的外观设置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="theme">主题模式</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div
                      className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:border-accent ${
                        theme === 'light' ? 'border-primary' : ''
                      }`}
                      onClick={() => setTheme('light')}
                    >
                      <div className="rounded-md border border-muted bg-[#fff] p-2">
                        <div className="space-y-2">
                          <div className="h-2 w-8 rounded-lg bg-[#eaeaea]" />
                          <div className="h-2 w-6 rounded-lg bg-[#eaeaea]" />
                          <div className="h-2 w-9 rounded-lg bg-[#eaeaea]" />
                        </div>
                      </div>
                      <p className="text-xs font-medium mt-2">浅色</p>
                    </div>
                    <div
                      className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:border-accent ${
                        theme === 'dark' ? 'border-primary' : ''
                      }`}
                      onClick={() => setTheme('dark')}
                    >
                      <div className="rounded-md border border-muted bg-[#1e1e1e] p-2">
                        <div className="space-y-2">
                          <div className="h-2 w-8 rounded-lg bg-[#444]" />
                          <div className="h-2 w-6 rounded-lg bg-[#444]" />
                          <div className="h-2 w-9 rounded-lg bg-[#444]" />
                        </div>
                      </div>
                      <p className="text-xs font-medium mt-2">深色</p>
                    </div>
                    <div
                      className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:border-accent ${
                        theme === 'system' ? 'border-primary' : ''
                      }`}
                      onClick={() => setTheme('system')}
                    >
                      <div className="rounded-md border border-muted bg-gradient-to-r from-[#fff] to-[#1e1e1e] p-2">
                        <div className="space-y-2">
                          <div className="h-2 w-8 rounded-lg bg-gradient-to-r from-[#eaeaea] to-[#444]" />
                          <div className="h-2 w-6 rounded-lg bg-gradient-to-r from-[#eaeaea] to-[#444]" />
                          <div className="h-2 w-9 rounded-lg bg-gradient-to-r from-[#eaeaea] to-[#444]" />
                        </div>
                      </div>
                      <p className="text-xs font-medium mt-2">跟随系统</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="font-size">字体大小</Label>
                  <Select defaultValue="medium">
                    <SelectItem value="small">小</SelectItem>
                    <SelectItem value="medium">中</SelectItem>
                    <SelectItem value="large">大</SelectItem>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>应用设置</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* 安全设置 */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>密码设置</CardTitle>
                <CardDescription>更改您的账户密码</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">当前密码</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">新密码</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">确认新密码</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>更改密码</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>两步验证</CardTitle>
                <CardDescription>增强您账户的安全性</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="2fa">两步验证</Label>
                    <p className="text-sm text-muted-foreground">
                      启用两步验证以提高账户安全性
                    </p>
                  </div>
                  <Switch id="2fa" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" className="mr-2">
                  了解更多
                </Button>
                <Button>设置两步验证</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>登录历史</CardTitle>
                <CardDescription>查看您的账户登录历史</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Chrome 浏览器 - Windows</p>
                        <p className="text-sm text-muted-foreground">IP: 192.168.1.{i}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(Date.now() - i * 86400000).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline">查看全部历史</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
} 