"use client"

import * as React from "react"
import { cn } from "@/lib/cn"

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit?: (data: any) => void
  className?: string
}

export const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, children, onSubmit, ...props }, ref) => {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const formData = new FormData(event.currentTarget)
      const data = Object.fromEntries(formData)
      onSubmit?.(data)
    }

    return (
      <form
        ref={ref}
        className={cn("space-y-4", className)}
        onSubmit={handleSubmit}
        {...props}
      >
        {children}
      </form>
    )
  }
)
Form.displayName = "Form"

export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("space-y-2", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
FormItem.displayName = "FormItem"

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string
}

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          className
        )}
        {...props}
      >
        {children}
      </label>
    )
  }
)
FormLabel.displayName = "FormLabel"

export interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("mt-2", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
FormControl.displayName = "FormControl"

export interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string
}

export const FormDescription = React.forwardRef<HTMLParagraphElement, FormDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      >
        {children}
      </p>
    )
  }
)
FormDescription.displayName = "FormDescription"

export interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string
}

export const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-sm font-medium text-destructive", className)}
        {...props}
      >
        {children}
      </p>
    )
  }
)
FormMessage.displayName = "FormMessage" 