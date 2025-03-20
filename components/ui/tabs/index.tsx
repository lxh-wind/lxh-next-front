"use client"

import * as React from "react"
import { cn } from "@/lib/cn"

// 使用这个代替useLayoutEffect，避免SSR警告
const useIsomorphicLayoutEffect = typeof window !== 'undefined' 
  ? React.useLayoutEffect 
  : React.useEffect

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, defaultValue, value, onValueChange, ...props }, ref) => {
    const [activeTab, setActiveTab] = React.useState(value || defaultValue || "")
    
    React.useEffect(() => {
      if (value !== undefined) {
        setActiveTab(value)
      }
    }, [value])

    const handleValueChange = (newValue: string) => {
      setActiveTab(newValue)
      onValueChange?.(newValue)
    }

    // 通过 context 传递 activeTab 和 handleValueChange
    const context = React.useMemo(() => ({
      activeTab,
      handleValueChange,
    }), [activeTab, handleValueChange])

    return (
      <TabsContext.Provider value={context}>
        <div
          ref={ref}
          className={cn("w-full", className)}
          {...props}
        />
      </TabsContext.Provider>
    )
  }
)
Tabs.displayName = "Tabs"

// 创建 context
type TabsContextType = {
  activeTab: string
  handleValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined)

// 使用 hook 获取 context
const useTabsContext = () => {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider")
  }
  return context
}

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, onClick, ...props }, ref) => {
    const { activeTab, handleValueChange } = useTabsContext()
    const isActive = activeTab === value

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e)
      handleValueChange(value)
    }

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          isActive && "bg-background text-foreground shadow-sm",
          className
        )}
        onClick={handleClick}
        data-state={isActive ? "active" : "inactive"}
        {...props}
      />
    )
  }
)
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const { activeTab } = useTabsContext()
    const isActive = activeTab === value

    if (!isActive) return null

    return (
      <div
        ref={ref}
        className={cn(
          "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
        data-state={isActive ? "active" : "inactive"}
        {...props}
      />
    )
  }
)
TabsContent.displayName = "TabsContent"

// 使用 useSyncExternalStore 替代 useLayoutEffect
const useClientOnlyValue = <T,>(value: T): T => {
  const [clientValue, setClientValue] = React.useState<T | undefined>(undefined);
  
  useIsomorphicLayoutEffect(() => {
    setClientValue(value);
  }, [value]);
  
  return clientValue !== undefined ? clientValue : value;
}

export { Tabs, TabsList, TabsTrigger, TabsContent } 