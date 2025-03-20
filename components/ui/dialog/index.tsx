"use client"

import * as React from "react"
import { cn } from "@/lib/cn"

const useIsomorphicLayoutEffect = typeof window !== 'undefined' 
  ? React.useLayoutEffect 
  : React.useEffect

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export function Dialog({ isOpen, onClose, children, className }: DialogProps) {
  const [mounted, setMounted] = React.useState(false)
  const dialogRef = React.useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useIsomorphicLayoutEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("mousedown", handleClickOutside)

    // 阻止body滚动
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  if (!mounted) return null

  return isOpen ? (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={dialogRef}
        className={cn(
          "w-full max-w-md rounded-lg bg-white p-6 shadow-xl",
          className
        )}
      >
        {children}
      </div>
    </div>
  ) : null
}

// DialogContext
const DialogContext = React.createContext<{ onClose: () => void } | undefined>(
  undefined
)

// 确保导出DialogContent组件
export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function DialogContent({ children, className, ...props }: DialogContentProps) {
  return (
    <div
      className={cn("relative", className)}
      {...props}
    >
      {children}
    </div>
  )
}

interface DialogCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
}

export function DialogClose({ className, onClick, ...props }: DialogCloseProps) {
  const dialogContext = React.useContext(DialogContext)

  if (!dialogContext) {
    throw new Error("DialogClose must be used within Dialog or with an onClose prop")
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e)
    dialogContext.onClose()
  }

  return (
    <button
      className={cn(
        "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
      <span className="sr-only">Close</span>
    </button>
  )
}

// Helper components
export function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-lg font-semibold text-foreground", className)}
      {...props}
    />
  )
}

export function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("mt-2 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-4 flex justify-end space-x-2", className)}
      {...props}
    />
  )
}

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mb-4 space-y-1.5 text-center", className)}
      {...props}
    />
  )
}

// 按钮触发器，打开对话框
export function DialogTrigger({
  children,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  onOpenDialog?: () => void
}) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e)
    props.onOpenDialog?.()
  }

  return (
    <button type="button" onClick={handleClick} {...props}>
      {children}
    </button>
  )
} 