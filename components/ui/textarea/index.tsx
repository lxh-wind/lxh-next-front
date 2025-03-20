"use client"

import * as React from "react"
import { cn } from "@/lib/cn"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, id, ...props }, ref) => {
    const uniqueId = React.useId();
    const textareaId = id || uniqueId;
    const labelId = `${textareaId}-label`;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label id={labelId} htmlFor={textareaId} className="text-sm font-medium">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            "flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          id={textareaId}
          aria-labelledby={label ? labelId : undefined}
          {...props}
        />
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea } 