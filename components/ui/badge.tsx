import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        ws_none: "bg-[hsl(0,72%,95%)] text-[hsl(0,72%,40%)] border-transparent",
        ws_sns: "bg-[hsl(38,92%,95%)] text-[hsl(38,92%,35%)] border-transparent",
        ws_external: "bg-[hsl(215,80%,95%)] text-[hsl(215,80%,40%)] border-transparent",
        ws_own: "bg-[hsl(142,71%,95%)] text-[hsl(142,71%,35%)] border-transparent",
        crm_untouched: "bg-[hsl(220,14%,96%)] text-[hsl(220,14%,40%)] border-transparent",
        crm_contacted: "bg-[hsl(215,80%,95%)] text-[hsl(215,80%,40%)] border-transparent",
        crm_replied: "bg-[hsl(142,71%,95%)] text-[hsl(142,71%,35%)] border-transparent",
        crm_excluded: "bg-[hsl(0,72%,95%)] text-[hsl(0,72%,40%)] border-transparent",
        crm_contracted: "bg-[hsl(262,83%,95%)] text-[hsl(262,83%,40%)] border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
