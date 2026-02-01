"use client"
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

function AnimatedTabs({
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
    return <TabsPrimitive.Root data-slot="tabs" {...props} />
}

function AnimatedTabsList({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
    return (
        <TabsPrimitive.List
            data-slot="tabs-list"
            className={cn(
                "bg-muted text-muted-foreground relative inline-flex h-10 items-center justify-center rounded-md p-1",
                className
            )}
            {...props}
        />
    )
}

function AnimatedTabsTrigger({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
    const ref = React.useRef<HTMLButtonElement>(null)
    const [isActive, setIsActive] = React.useState(false)

    React.useEffect(() => {
        const trigger = ref.current
        if (!trigger) return

        const updateIndicator = () => {
            const active = trigger.getAttribute("data-state") === "active"
            setIsActive(active)
            
            if (active) {
                const list = trigger.parentElement
                if (!list) return

                let indicator = list.querySelector('[data-slot="tabs-indicator"]') as HTMLElement
                
                if (!indicator) {
                    indicator = document.createElement("div")
                    indicator.setAttribute("data-slot", "tabs-indicator")
                    indicator.className = "absolute bg-background rounded-sm shadow-sm transition-all duration-200 ease-in-out pointer-events-none"
                    indicator.style.zIndex = "0"
                    list.appendChild(indicator)
                }

                const rect = trigger.getBoundingClientRect()
                const listRect = list.getBoundingClientRect()
                
                indicator.style.left = `${rect.left - listRect.left}px`
                indicator.style.top = `${rect.top - listRect.top}px`
                indicator.style.width = `${rect.width}px`
                indicator.style.height = `${rect.height}px`
            }
        }

        const observer = new MutationObserver(updateIndicator)

        observer.observe(trigger, {
            attributes: true,
            attributeFilter: ["data-state"]
        })

        // Trigger initial check
        if (trigger.getAttribute("data-state") === "active") {
            setTimeout(updateIndicator, 0)
        }

        return () => observer.disconnect()
    }, [])

    return (
        <TabsPrimitive.Trigger
            ref={ref}
            data-slot="tabs-trigger"
            className={cn(
                "ring-offset-background focus-visible:ring-ring relative inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium outline-hidden transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground",
                "z-10",
                className
            )}
            {...props}
        />
    )
}

function AnimatedTabsContent({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
    return (
        <TabsPrimitive.Content
            data-slot="tabs-content"
            className={cn(
                "ring-offset-background focus-visible:ring-ring mt-2 outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2",
                className
            )}
            {...props}
        />
    )
}

export { AnimatedTabs, AnimatedTabsList, AnimatedTabsTrigger, AnimatedTabsContent }