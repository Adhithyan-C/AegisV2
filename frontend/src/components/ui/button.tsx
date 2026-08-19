import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "glass-sm bg-gradient-to-br from-primary/40 to-primary/20 text-primary-foreground border-primary/40 hover:from-primary/50 hover:to-primary/30 hover:shadow-lg hover:shadow-primary/30 hover:scale-105 hover:rounded-lg",
        destructive: "glass-sm bg-gradient-to-br from-destructive/40 to-destructive/20 text-destructive-foreground border-destructive/40 hover:from-destructive/50 hover:to-destructive/30 hover:shadow-md hover:shadow-destructive/40 hover:scale-105 hover:rounded-lg",
        outline:
          "border border-accent/50 bg-gradient-to-br from-accent/10 to-transparent backdrop-blur-md hover:from-accent/20 hover:to-accent/5 hover:text-accent-foreground hover:shadow-md hover:shadow-accent/30 hover:scale-105 hover:rounded-lg",
        secondary: "glass-sm bg-gradient-to-br from-secondary/40 to-secondary/20 text-secondary-foreground border-secondary/40 hover:from-secondary/50 hover:to-secondary/30 hover:shadow-md hover:shadow-secondary/30 hover:scale-105 hover:rounded-lg",
        ghost: "hover:bg-gradient-to-br hover:from-accent/30 hover:to-accent/10 hover:text-accent-foreground hover:backdrop-blur-md hover:shadow-sm hover:shadow-accent/20 hover:scale-105 hover:rounded-lg hover:border hover:border-accent/30",
        link: "text-primary underline-offset-4 hover:underline hover:shadow-sm hover:shadow-primary/30 hover:scale-105 hover:rounded-lg",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
