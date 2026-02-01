"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"

import { cn } from "@/lib/utils"

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & {
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg"
}) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      data-variant={variant}
      data-size={size}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "data-[variant=default]:bg-transparent",
        "data-[variant=outline]:border data-[variant=outline]:border-input data-[variant=outline]:bg-transparent data-[variant=outline]:hover:bg-accent data-[variant=outline]:hover:text-accent-foreground",
        "data-[size=default]:h-10 data-[size=default]:px-3",
        "data-[size=sm]:h-9 data-[size=sm]:px-2.5",
        "data-[size=lg]:h-11 data-[size=lg]:px-5",
        className
      )}
      {...props}
    />
  )
}

export { Toggle }