"use client"

import * as React from "react"
import { cn } from "@/lib/cn"
import { useState, createContext, useContext } from "react"

// 创建一个 context 来管理下拉菜单的状态
const DropdownMenuContext = createContext<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  align: "left" | "right" | "end";
}>({
  isOpen: false,
  setIsOpen: () => {},
  align: "left"
})

interface DropdownMenuProps {
  children?: React.ReactNode
  trigger?: React.ReactNode
  align?: "left" | "right" | "end"
}

export function DropdownMenu({
  children,
  trigger,
  align = "left",
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen, align }}>
      <div className="relative inline-block text-left">
        {trigger ? (
          // 如果提供了 trigger，使用它来触发下拉菜单
          <div onClick={() => setIsOpen(!isOpen)}>
            {trigger}
          </div>
        ) : (
          // 否则，假设 children 中有 DropdownMenuTrigger
          children
        )}
      </div>
    </DropdownMenuContext.Provider>
  )
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

export function DropdownMenuTrigger({ 
  children,
  asChild = false 
}: DropdownMenuTriggerProps) {
  const { setIsOpen, isOpen } = useContext(DropdownMenuContext);
  
  return (
    <div onClick={() => setIsOpen(!isOpen)}>
      {children}
    </div>
  )
}

interface DropdownMenuContentProps {
  children: React.ReactNode
  className?: string
  align?: "left" | "right" | "end"
}

export function DropdownMenuContent({ 
  children,
  className,
  align: contentAlign,
}: DropdownMenuContentProps) {
  const { isOpen, align: contextAlign } = useContext(DropdownMenuContext);
  const finalAlign = contentAlign || contextAlign;
  
  if (!isOpen) return null;
  
  return (
    <div
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        finalAlign === "left" && "left-0",
        finalAlign === "right" && "right-0",
        finalAlign === "end" && "right-0",
        className
      )}
    >
      {children}
    </div>
  )
}

interface DropdownMenuItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

export function DropdownMenuItem({
  children,
  className,
  ...props
}: DropdownMenuItemProps) {
  return (
    <button
      className={cn(
        "block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

interface DropdownMenuSeparatorProps {
  className?: string
}

export function DropdownMenuSeparator({ className }: DropdownMenuSeparatorProps) {
  return <div className={cn("my-1 h-px bg-gray-200", className)} />
}

export function DropdownMenuLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-3 py-2 text-sm font-semibold text-gray-900", className)}
      {...props}
    />
  )
} 