"use client"

import * as React from "react"
import { cn } from "@/lib/cn"
import { useState } from "react"

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
  const toggleDropdown = () => setIsOpen(!isOpen);

  // 如果提供了trigger，就使用这种模式
  if (trigger) {
    return (
      <div className="relative inline-block text-left">
        <div onClick={toggleDropdown}>
          {trigger}
        </div>
        {isOpen && (
          <DropdownMenuContent align={align}>
            {children}
          </DropdownMenuContent>
        )}
      </div>
    )
  }

  // 否则使用之前的模式
  return (
    <div className="relative inline-block text-left">
      {children}
    </div>
  )
}

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "left" | "right" | "end"
  className?: string
}

export function DropdownMenuContent({
  children,
  align = "left",
  className,
  ...props
}: DropdownMenuContentProps) {
  return (
    <div
      className={cn(
        "absolute z-10 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
        (align === "right" || align === "end") ? "right-0" : "left-0",
        className
      )}
      {...props}
    >
      <div className="py-1">{children}</div>
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

interface DropdownMenuTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function DropdownMenuTrigger({
  asChild = false,
  children,
  className,
  ...props
}: DropdownMenuTriggerProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    >
      {children}
    </button>
  )
} 