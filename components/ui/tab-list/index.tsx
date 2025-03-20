"use client"

import * as React from "react"
import { cn } from "@/lib/cn"

interface TabsProps {
  defaultValue: string
  children: React.ReactNode
  className?: string
  onChange?: (value: string) => void
}

interface TabsContext {
  value: string
  onChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContext | undefined>(undefined)

function useTabs() {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error("Tabs compound components must be used within Tabs")
  }
  return context
}

export function Tabs({
  defaultValue,
  children,
  className,
  onChange,
}: TabsProps) {
  const [value, setValue] = React.useState(defaultValue)

  const handleChange = React.useCallback(
    (newValue: string) => {
      setValue(newValue)
      onChange?.(newValue)
    },
    [onChange]
  )

  return (
    <TabsContext.Provider value={{ value, onChange: handleChange }}>
      <div className={cn("space-y-4", className)} data-tabs-root>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

interface TabsListProps {
  className?: string
  children: React.ReactNode
}

export function TabsList({ className, children }: TabsListProps) {
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className
      )}
    >
      {children}
    </div>
  )
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  className?: string
}

export function TabsTrigger({
  value,
  className,
  children,
  ...props
}: TabsTriggerProps) {
  const { value: selectedValue, onChange } = useTabs()
  const isSelected = selectedValue === value

  return (
    <button
      type="button"
      data-state={isSelected ? "active" : "inactive"}
      onClick={() => onChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isSelected
          ? "bg-background text-foreground shadow-sm"
          : "hover:bg-background/50 hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  className?: string
}

export function TabsContent({
  value,
  className,
  children,
  ...props
}: TabsContentProps) {
  const { value: selectedValue } = useTabs()
  const isSelected = selectedValue === value

  if (!isSelected) return null

  return (
    <div
      tabIndex={0}
      data-state={isSelected ? "active" : "inactive"}
      className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}
      {...props}
    >
      {children}
    </div>
  )
} 