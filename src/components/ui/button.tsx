import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex select-none items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
    {
        variants: {
            variant: {
                default:
                    "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-sm hover:brightness-110 hover:shadow-md hover:-translate-y-0.5",
                secondary:
                    "bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground shadow-sm hover:brightness-110 hover:shadow-md hover:-translate-y-0.5",
                destructive:
                    "bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground shadow-sm hover:brightness-110 hover:shadow-md hover:-translate-y-0.5",
                success:
                    "bg-gradient-to-r from-success to-success/80 text-success-foreground shadow-sm hover:brightness-110 hover:shadow-md hover:-translate-y-0.5",
                outline:
                    "border border-border bg-background hover:bg-muted hover:border-primary/40 hover:text-primary",
                ghost: "hover:bg-muted hover:text-primary",
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-10 rounded-md px-8",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: { variant: "default", size: "default" },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => (
        <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
);
Button.displayName = "Button";

export { Button, buttonVariants };