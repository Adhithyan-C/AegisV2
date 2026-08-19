import { Bell, ChevronDown, Menu, ShieldCheck } from "lucide-react";
import { StatusDot } from "./Panel";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMission } from "@/hooks/useMission";

export function Header({
  title,
  subtitle,
  onToggleSidebar,
}: {
  title: string;
  subtitle: string;
  onToggleSidebar?: () => void;
}) {
  const { backendOnline, jobId } = useMission();

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-surface/70 px-6 py-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle sidebar"
          className="shrink-0"
          onClick={onToggleSidebar}
        >
          <Menu className="h-4 w-4" aria-hidden />
        </Button>

        <div>
          <h1 className="text-2xl font-semibold uppercase tracking-[0.12em]">{title}</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-md border border-border bg-panel/60 px-3 py-1.5 md:flex">
          <ShieldCheck className="h-4 w-4 text-primary" aria-hidden />
          <span className="text-xs">Secure Connection</span>
          <StatusDot tone={backendOnline ? "ops" : "warn"} />
        </div>

        <span className="hidden font-mono text-[11px] text-muted-foreground lg:inline">
          JOB {jobId}
        </span>

        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell className="h-4 w-4" aria-hidden />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-critical" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-primary/15 font-mono text-[10px] text-primary">
                OP
              </span>
              <span className="hidden sm:inline">Cmd. Operator</span>
              <ChevronDown className="h-3.5 w-3.5" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Operator Profile</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Clearance: LEVEL 3</DropdownMenuItem>
            <DropdownMenuItem>Session Log</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
