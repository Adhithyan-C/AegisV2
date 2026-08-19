import { useMemo, useState } from "react";
import { ArrowUpDown, Crosshair, Search } from "lucide-react";
import { EmptyState, Panel } from "./Panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMission } from "@/hooks/useMission";
import { cn } from "@/lib/utils";
import type { Track } from "@/types/mission";

const PAGE_SIZE = 8;
type SortKey = "id" | "class" | "confidence" | "first_seen" | "last_seen" | "status" | "zone";

export function classTone(cls: Track["class"]) {
  return cls === "Vehicle"
    ? "border-ops/40 bg-ops/10 text-ops"
    : cls === "Personnel"
      ? "border-warn/40 bg-warn/10 text-warn"
      : "border-critical/40 bg-critical/10 text-critical";
}

function statusTone(status: Track["status"]) {
  return status === "Active"
    ? "border-info/40 bg-info/10 text-info"
    : status === "Flagged"
      ? "border-critical/40 bg-critical/10 text-critical"
      : "border-border bg-muted/50 text-muted-foreground";
}

export function TracksTable({ onSelect }: { onSelect?: (id: string) => void }) {
  const { tracks } = useMission();
  const [q, setQ] = useState("");
  const [cls, setCls] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "id",
    dir: "asc",
  });
  const [page, setPage] = useState(0);

  const isMock = tracks.data?.source === "mock";
  const rows = tracks.data?.data ?? [];

  const filtered = useMemo(() => {
    const out = rows.filter(
      (t) =>
        (cls === "all" || t.class === cls) &&
        (status === "all" || t.status === status) &&
        (q === "" ||
          t.id.toLowerCase().includes(q.toLowerCase()) ||
          (t.zone ?? "").toLowerCase().includes(q.toLowerCase())),
    );
    return [...out].sort((a, b) => {
      const av = a[sort.key] ?? "";
      const bv = b[sort.key] ?? "";
      const cmp = typeof av === "number" && typeof bv === "number"
        ? av - bv
        : String(av).localeCompare(String(bv));
      return sort.dir === "asc" ? cmp : -cmp;
    });
  }, [rows, q, cls, status, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages - 1);
  const slice = filtered.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE);

  const toggleSort = (key: SortKey) =>
    setSort((s) => ({ key, dir: s.key === key && s.dir === "asc" ? "desc" : "asc" }));

  const columns: { key: SortKey; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "class", label: "Class" },
    { key: "confidence", label: "Confidence" },
    { key: "first_seen", label: "First Seen" },
    { key: "last_seen", label: "Last Seen" },
    { key: "status", label: "Status" },
    { key: "zone", label: "Zone" },
  ];

  return (
    <Panel
      title="Recent Tracks"
      icon={<Crosshair className="h-4 w-4" />}
      actions={
        <span className="font-mono text-[11px] text-muted-foreground">
          {isMock ? "-" : `${filtered.length} tracks`}
        </span>
      }
    >
      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-48 flex-1">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(0);
            }}
            placeholder={isMock ? "-" : "Search track ID or zone…"}
            aria-label="Search tracks"
            className="h-9 pl-8"
          />
        </div>
        <Select
          value={cls}
          onValueChange={(v) => {
            setCls(v);
            setPage(0);
          }}
        >
          <SelectTrigger className="h-9 w-36" aria-label="Filter by class">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All classes</SelectItem>
            <SelectItem value="Vehicle">Vehicle</SelectItem>
            <SelectItem value="Personnel">Personnel</SelectItem>
            <SelectItem value="Unknown">Unknown</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v);
            setPage(0);
          }}
        >
          <SelectTrigger className="h-9 w-36" aria-label="Filter by status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Flagged">Flagged</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-3 overflow-x-auto">
        {tracks.isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        ) : slice.length === 0 ? (
          <EmptyState
            title={isMock ? "-" : "No tracks detected."}
            description={isMock ? "-" : "Adjust filters or process new mission footage."}
          />
        ) : (
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead>
              <tr className="border-b border-border">
                {columns.map((c) => (
                  <th key={c.key} className="px-2 py-2">
                    <button
                      onClick={() => toggleSort(c.key)}
                      className="flex items-center gap-1 label-mono hover:text-foreground"
                    >
                      {c.label}
                      <ArrowUpDown className="h-3 w-3" aria-hidden />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slice.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => onSelect?.(t.id)}
                  className={cn(
                    "border-b border-border/60 transition-colors hover:bg-accent/40",
                    onSelect && "cursor-pointer",
                  )}
                >
                  <td className="px-2 py-2 font-mono">{t.id}</td>
                  <td className="px-2 py-2">
                    <span className={cn("rounded-sm border px-1.5 py-0.5 text-[10px] uppercase", classTone(t.class))}>
                      {t.class}
                    </span>
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-14 rounded-full bg-muted">
                        <div
                          className="h-1 rounded-full bg-primary"
                          style={{ width: `${Math.round(t.confidence * 100)}%` }}
                        />
                      </div>
                      <span className="font-mono">{Math.round(t.confidence * 100)}%</span>
                    </div>
                  </td>
                  <td className="px-2 py-2 font-mono text-muted-foreground">{t.first_seen}</td>
                  <td className="px-2 py-2 font-mono text-muted-foreground">{t.last_seen}</td>
                  <td className="px-2 py-2">
                    <span className={cn("rounded-sm border px-1.5 py-0.5 text-[10px] uppercase", statusTone(t.status))}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-2 py-2 font-mono text-muted-foreground">{t.zone ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pages > 1 && (
        <div className="mt-3 flex items-center justify-between">
          <span className="font-mono text-[11px] text-muted-foreground">
            Page {current + 1} / {pages}
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={current === 0} onClick={() => setPage(current - 1)}>
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={current >= pages - 1}
              onClick={() => setPage(current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Panel>
  );
}
