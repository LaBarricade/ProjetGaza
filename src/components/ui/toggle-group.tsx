"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"

import { cn } from "@/lib/utils"

function ToggleGroup({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      className={cn("inline-flex items-center justify-center gap-1", className)}
      {...props}
    />
  )
}

function ToggleGroupItem({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> & {
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg"
}) {
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={variant}
      data-size={size}
      
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-slate-600/30 data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "data-[variant=default]:bg-transparent",
        "data-[variant=outline]:border data-[variant=outline]:border-input data-[variant=outline]:bg-transparent data-[variant=outline]:hover:bg-accent data-[variant=outline]:hover:text-accent-foreground",
        "data-[size=default]:h-10 data-[size=default]:px-3",
        "data-[size=sm]:h-9 data-[size=sm]:px-2.5",
        "data-[size=lg]:h-11 data-[size=lg]:px-5",
        "data-[state=on]:*:[div]:text-slate-900",
        className
      )}
      {...props}
    />
  )
}

export { ToggleGroup, ToggleGroupItem }