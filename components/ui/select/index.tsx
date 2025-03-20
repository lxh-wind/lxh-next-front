"use client"

import * as React from "react"
import { cn } from "@/lib/cn"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

// 一个包装组件来确保每个 select 有标题
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ 
  className, 
  children, 
  label,
  id,
  "aria-label": ariaLabel,
  ...props 
}, ref) => {
  // 创建一个唯一 ID，如果没有提供的话
  const uniqueId = React.useId();
  const selectId = id || uniqueId;
  const labelId = `${selectId}-label`;
  
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label id={labelId} htmlFor={selectId} className="text-sm font-medium">
          {label}
        </label>
      )}
      <select
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        id={selectId}
        aria-labelledby={label ? labelId : undefined}
        aria-label={ariaLabel || (label ? undefined : "Select options")}
        {...props}
      >
        {children}
      </select>
    </div>
  )
})
Select.displayName = "Select"

const SelectItem = React.forwardRef<
  HTMLOptionElement,
  React.OptionHTMLAttributes<HTMLOptionElement>
>(({ className, ...props }, ref) => {
  return <option className={cn("focus:bg-accent", className)} ref={ref} {...props} />
})
SelectItem.displayName = "SelectItem"

export { Select, SelectItem } 