"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectItem } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

export default function TestPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [switchChecked, setSwitchChecked] = useState(false)
  const [selectedTab, setSelectedTab] = useState("profile")

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">UI 组件测试</h1>

      <div className="grid gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Button</h2>
          <div className="flex flex-wrap gap-4">
            <Button>默认按钮</Button>
            <Button variant="destructive">危险按钮</Button>
            <Button variant="outline">轮廓按钮</Button>
            <Button variant="secondary">次要按钮</Button>
            <Button variant="ghost">幽灵按钮</Button>
            <Button variant="link">链接按钮</Button>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Avatar</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="https://avatars.githubusercontent.com/u/124599" alt="@vercel" />
              <AvatarFallback>VC</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>YZ</AvatarFallback>
            </Avatar>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Card</h2>
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>标题</CardTitle>
              <CardDescription>这是一个卡片描述</CardDescription>
            </CardHeader>
            <CardContent>
              <p>卡片内容可以包含任何内容，例如文本、图片或其他组件。</p>
            </CardContent>
            <CardFooter>
              <Button>操作</Button>
            </CardFooter>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Checkbox & Switch</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">接受条款和条件</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="airplane-mode" checked={switchChecked} onChange={(e) => setSwitchChecked(e.target.checked)} />
              <Label htmlFor="airplane-mode">飞行模式 {switchChecked ? '开启' : '关闭'}</Label>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Input & Select</h2>
          <div className="grid gap-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="name">姓名</Label>
              <Input id="name" placeholder="请输入姓名" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">国家</Label>
              <Select id="country" label="选择国家" title="选择国家">
                <SelectItem value="china">中国</SelectItem>
                <SelectItem value="us">美国</SelectItem>
                <SelectItem value="uk">英国</SelectItem>
                <SelectItem value="japan">日本</SelectItem>
              </Select>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Dialog</h2>
          <Button onClick={() => setIsDialogOpen(true)}>打开对话框</Button>
          <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
            <DialogHeader>
              <DialogTitle>确认操作</DialogTitle>
              <DialogDescription>
                您确定要执行此操作吗？此操作无法撤销。
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>取消</Button>
              <Button onClick={() => setIsDialogOpen(false)}>确认</Button>
            </DialogFooter>
          </Dialog>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Tabs</h2>
          <Tabs defaultValue="profile" className="max-w-md">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="profile" onClick={() => setSelectedTab("profile")}>个人资料</TabsTrigger>
              <TabsTrigger value="settings" onClick={() => setSelectedTab("settings")}>设置</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>个人资料</CardTitle>
                  <CardDescription>
                    管理您的个人资料信息和账户设置。
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="name">姓名</Label>
                    <Input id="name" defaultValue="张三" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="username">用户名</Label>
                    <Input id="username" defaultValue="zhangsan" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>保存更改</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>设置</CardTitle>
                  <CardDescription>
                    管理应用程序设置和偏好。
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="notifications" />
                    <Label htmlFor="notifications">启用通知</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="newsletter" />
                    <Label htmlFor="newsletter">订阅新闻通讯</Label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>保存偏好</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Table</h2>
          <Table>
            <TableCaption>最近的发票记录</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>发票编号</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>方法</TableHead>
                <TableHead className="text-right">金额</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>INV001</TableCell>
                <TableCell>已付款</TableCell>
                <TableCell>信用卡</TableCell>
                <TableCell className="text-right">¥250.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>INV002</TableCell>
                <TableCell>待付款</TableCell>
                <TableCell>PayPal</TableCell>
                <TableCell className="text-right">¥150.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>INV003</TableCell>
                <TableCell>已付款</TableCell>
                <TableCell>银行转账</TableCell>
                <TableCell className="text-right">¥350.00</TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>总计</TableCell>
                <TableCell className="text-right">¥750.00</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </section>
      </div>
    </div>
  )
} 