"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

export default function Login() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // 模拟登录请求
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // 登录成功后跳转到仪表盘
      router.push('/dashboard')
    } catch (error) {
      console.error('登录失败', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <h2 className="text-3xl font-bold text-center">LXH Admin</h2>
          </div>
          <CardTitle className="text-2xl text-center">登录</CardTitle>
          <CardDescription className="text-center">
            输入您的账号和密码登录系统
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormItem>
                <FormLabel>账号</FormLabel>
                <FormControl>
                  <Input
                    name="username"
                    placeholder="请输入账号"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </FormControl>
                <FormDescription>
                  请输入管理员账号
                </FormDescription>
              </FormItem>
              <FormItem>
                <FormLabel>密码</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    name="password"
                    placeholder="请输入密码"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </FormControl>
              </FormItem>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="remember" className="h-4 w-4 rounded border-gray-300" />
                  <label htmlFor="remember" className="text-sm font-medium leading-none">
                    记住我
                  </label>
                </div>
                <Link href="#" className="text-sm font-medium text-primary hover:underline">
                  忘记密码？
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? '登录中...' : '登录'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="mt-2 text-center text-sm">
            还没有账号？
            <Link href="/auth/register" className="font-medium text-primary hover:underline">
              {' '}请联系管理员
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
} 