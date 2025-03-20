import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">LXH Admin</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-4">
              <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                首页
              </Link>
              <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
                特性
              </Link>
              <Link href="#testimonials" className="text-sm font-medium transition-colors hover:text-primary">
                客户评价
              </Link>
              <Link href="/dashboard">
                <Button>进入管理系统</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl">
                    现代化的企业管理系统
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    基于 Next.js 和 Tailwind CSS 构建的高效管理平台，为您的企业提供全方位的数据管理和分析能力。
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button size="lg" className="w-full min-[400px]:w-auto">立即体验</Button>
                  </Link>
                  <Link href="#features">
                    <Button size="lg" variant="outline" className="w-full min-[400px]:w-auto">
                      了解更多
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-[350px] md:h-[400px] md:w-[400px] lg:h-[450px] lg:w-[450px]">
                  <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl"></div>
                  <div className="absolute left-0 bottom-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl"></div>
                  <div className="absolute inset-0 rounded-xl border border-border bg-background/50 p-4 backdrop-blur-xl">
                    <div className="h-full w-full rounded-lg bg-background p-6 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-full bg-primary"></div>
                          <span className="text-sm font-medium">仪表盘</span>
                        </div>
                        <div className="flex space-x-2">
                          <div className="h-4 w-4 rounded bg-muted"></div>
                          <div className="h-4 w-4 rounded bg-muted"></div>
                          <div className="h-4 w-4 rounded bg-muted"></div>
                        </div>
                      </div>
                      <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg border border-border bg-card p-4">
                          <div className="flex justify-between">
                            <span className="text-sm">用户</span>
                            <span className="text-sm">+12%</span>
                          </div>
                          <div className="mt-2 text-xl font-bold">12,345</div>
                          <div className="mt-2 h-2 w-full rounded-full bg-muted">
                            <div className="h-full w-[70%] rounded-full bg-primary"></div>
                          </div>
                        </div>
                        <div className="rounded-lg border border-border bg-card p-4">
                          <div className="flex justify-between">
                            <span className="text-sm">订单</span>
                            <span className="text-sm">+24%</span>
                          </div>
                          <div className="mt-2 text-xl font-bold">1,234</div>
                          <div className="mt-2 h-2 w-full rounded-full bg-muted">
                            <div className="h-full w-[60%] rounded-full bg-primary"></div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6">
                        <div className="rounded-lg border border-border bg-card p-4">
                          <span className="text-sm">最近活动</span>
                          <div className="mt-4 space-y-4">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="flex items-center space-x-3">
                                <div className="h-6 w-6 rounded-full bg-muted"></div>
                                <div className="space-y-1">
                                  <div className="h-2 w-32 rounded bg-muted"></div>
                                  <div className="h-2 w-24 rounded bg-muted"></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">系统特性</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  我们的系统提供全面的管理功能，满足您的各种业务需求
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
              {[
                {
                  title: "用户管理",
                  description: "轻松管理用户账号，设置权限和角色，保障系统安全"
                },
                {
                  title: "内容管理",
                  description: "高效管理网站内容，支持多种内容类型和状态"
                },
                {
                  title: "数据分析",
                  description: "实时监控系统数据，生成可视化报表，辅助决策"
                },
                {
                  title: "系统设置",
                  description: "灵活配置系统参数，满足个性化需求"
                },
                {
                  title: "响应式设计",
                  description: "完美适配各种设备，提供一致的用户体验"
                },
                {
                  title: "主题定制",
                  description: "支持明暗主题切换，个性化视觉体验"
                }
              ].map((feature, index) => (
                <Card key={index} className="flex flex-col items-center text-center">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <div className="h-6 w-6 text-primary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">客户评价</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  听听我们的客户怎么说
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
              {[
                {
                  name: "张小明",
                  role: "产品经理",
                  company: "科技有限公司",
                  testimonial: "这是我用过的最好的管理系统，界面简洁，功能强大，极大提高了我们团队的工作效率。"
                },
                {
                  name: "李华",
                  role: "CEO",
                  company: "创新科技",
                  testimonial: "经过多方比较，我们最终选择了这个系统。它的可扩展性和稳定性是其他系统无法比拟的。"
                },
                {
                  name: "王芳",
                  role: "运营总监",
                  company: "电商平台",
                  testimonial: "系统的数据分析功能非常强大，帮助我们发现了许多业务中的问题和机会，提升了决策效率。"
                },
              ].map((testimonial, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>{testimonial.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                        <CardDescription>
                          {testimonial.role}，{testimonial.company}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">"{testimonial.testimonial}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">准备好开始了吗？</h2>
                <p className="max-w-[900px] md:text-xl">
                  立即体验我们的系统，提升您的业务管理效率
                </p>
              </div>
              <div className="mx-auto max-w-sm space-y-2">
                <Link href="/dashboard">
                  <Button size="lg" className="w-full bg-background text-primary hover:bg-background/90">
                    免费试用
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="w-full border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 text-center md:flex-row md:gap-8 md:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} LXH Admin. 保留所有权利。
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              隐私政策
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              服务条款
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              联系我们
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
