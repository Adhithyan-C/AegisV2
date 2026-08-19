import { BarChart3 } from "lucide-react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Panel } from "./Panel";
import { Skeleton } from "@/components/ui/skeleton";
import { useMission } from "@/hooks/useMission";

const CONF_COLORS = ["var(--color-ops)", "var(--color-info)", "var(--color-warn)", "var(--color-critical)"];

export function Analytics() {
  const { summary } = useMission();
  const data = summary.data?.data;

  if (summary.isLoading || !data) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  const distribution = [
    { label: "Vehicles", value: data.vehicles, color: "var(--color-ops)" },
    { label: "Personnel", value: data.personnel, color: "var(--color-warn)" },
    { label: "Unknown", value: data.unknown, color: "var(--color-critical)" },
  ];
  const total = distribution.reduce((s, d) => s + d.value, 0) || 1;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Detection Distribution" icon={<BarChart3 className="h-4 w-4" />}>
        <ul className="space-y-4">
          {distribution.map((d) => (
            <li key={d.label}>
              <div className="flex items-center justify-between text-xs">
                <span>{d.label}</span>
                <span className="font-mono text-muted-foreground">
                  {d.value.toLocaleString()} · {Math.round((d.value / total) * 100)}%
                </span>
              </div>
              <div className="mt-1.5 h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${(d.value / total) * 100}%`, backgroundColor: d.color }}
                />
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Confidence Distribution">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.confidence_distribution}
                dataKey="count"
                nameKey="label"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                stroke="var(--color-background)"
              >
                {data.confidence_distribution.map((_, i) => (
                  <Cell key={i} fill={CONF_COLORS[i % CONF_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 6,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="mt-2 grid grid-cols-2 gap-1 label-mono">
          {data.confidence_distribution.map((b) => (
            <li key={b.label}>
              {b.label}: {b.range[0].toFixed(2)}–{b.range[1].toFixed(2)}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Activity Over Time" className="lg:col-span-2">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.activity_over_time}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 6,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="vehicles" stroke="var(--color-ops)" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="personnel" stroke="var(--color-warn)" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="unknown" stroke="var(--color-critical)" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}
