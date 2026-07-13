import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
    {
        variants: {
            variant: {
                default:
                    "bg-accent text-accent-foreground shadow-sm hover:bg-accent/90 hover:shadow-md hover:scale-[1.02]",
                destructive:
                    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-md",
                success:
                    "bg-success text-success-foreground shadow-sm hover:bg-success/90 hover:shadow-md",
                warning:
                    "bg-warning text-warning-foreground shadow-sm hover:bg-warning/90 hover:shadow-md",
                outline:
                    "bg-transparent text-foreground hover:bg-accent/10 hover:text-accent",
                ghost: "hover:bg-muted hover:text-accent",
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 rounded-lg px-3 text-xs",
                lg: "h-10 rounded-lg px-8",
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