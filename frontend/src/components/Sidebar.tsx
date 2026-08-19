import { Link } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Crosshair,
  Download,
  Flame,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Radio,
  Settings,
  Upload,
} from "lucide-react";
import { StatusDot } from "./Panel";
import { useMission } from "@/hooks/useMission";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/upload", label: "Upload & Process", icon: Upload },
  { to: "/live", label: "Live Processing", icon: Radio },
  { to: "/tracks", label: "Tracks & Events", icon: Crosshair },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/heatmap", label: "Heatmap", icon: Flame },
  { to: "/exports", label: "Exports", icon: Download },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar({
  collapsed = false,
  onToggle,
}: {
  collapsed?: boolean;
  onToggle?: () => void;
}) {
  const { backendOnline } = useMission();

  const systemStatus = [
    { label: "Model", value: "YOLOv8n (Custom)", ok: true },
    { label: "Tracker", value: "ByteTrack", ok: true },
    { label: "API Server", value: backendOnline ? "Online" : "-", ok: backendOnline },
    { label: "Database", value: backendOnline ? "Connected" : "-", ok: backendOnline },
  ];

  return (
    <aside
      className={`flex h-full ${collapsed ? "w-20" : "w-64"} shrink-0 flex-col border-r border-border bg-surface/90 transition-all duration-200`}
    >
      <div
        className={`flex items-center ${collapsed ? "justify-center px-2" : "justify-between gap-3 px-4"} border-b border-border py-4`}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-md border border-primary/40 bg-primary/10">
          <Activity className="h-5 w-5 text-primary" aria-hidden />
        </div>

        {!collapsed && (
          <div className="min-w-0">
            <p className="font-display text-lg font-semibold leading-none tracking-[0.18em]">AEGIS</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Battlefield Intelligence</p>
          </div>
        )}

        <button
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={onToggle}
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Primary">
        {NAV.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            title={collapsed ? label : undefined}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${collapsed ? "justify-center px-2" : ""}`}
            activeProps={{
              className:
                "bg-primary/10 text-foreground border-l-2 border-primary font-medium",
            }}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      {!collapsed && (
        <>
          <div className="border-t border-border p-4">
            <p className="label-mono">System Status</p>
            <ul className="mt-3 space-y-2">
              {systemStatus.map((s) => (
                <li key={s.label} className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-[11px]">{s.value}</span>
                    <StatusDot tone={s.ok ? "ops" : "warn"} />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-border px-4 py-3">
            <p className="font-mono text-[11px] text-muted-foreground">AEGIS v1.0.0</p>
            <p className="text-[11px] text-primary/80">Secure. Accurate. Swift.</p>
          </div>
        </>
      )}
    </aside>
  );
}
