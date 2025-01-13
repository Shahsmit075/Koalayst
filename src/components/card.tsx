import { HTMLAttributes } from "react"
import { cn } from "@/utils"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  contentClassName?: string
}

export const Card = ({
  className,
  contentClassName,
  children,
  ...props
}: CardProps) => {
  return (
    <div
      className={cn(
        "relative rounded-lg bg-gray text-card-foreground",
        className
      )}
      {...props}
    >
        <div className={cn("relative z-10 p-6", contentClassName)}>
            {children}
        </div>
        
        <div className="absolute z-0 inset-px rounded-lg bg-white" />
        <div className="pointer-events-none z-0 absolute inset-px rounded-lg shadow-sm ring-1 ring-black/5" />

    </div>
  )
}
