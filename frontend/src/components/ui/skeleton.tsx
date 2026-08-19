import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-gradient-to-r from-primary/20 to-accent/10 backdrop-blur-sm", className)} {...props} />;
}

export { Skeleton };
