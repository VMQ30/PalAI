import { Card } from "@/components/ui/card";
import { CheckCircle2, Leaf } from "lucide-react";

const entries = [
  {
    icon: CheckCircle2,
    text: "Farmer 04 confirmed fertilizer application via SMS.",
    time: "2 hours ago",
  },
  {
    icon: CheckCircle2,
    text: "Farmer 02 confirmed daily watering via SMS.",
    time: "1 day ago",
  },
  {
    icon: Leaf,
    text: "Coop Manager triggered 'Planted' milestone.",
    time: "12 days ago",
    isLeaf: true,
  },
];

const AuditLog = () => (
  <Card className="border border-border bg-card p-5 shadow-none">
    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-body">
      Real-Time Farmer SMS Updates
    </h2>
    <div className="relative pl-6">
      {/* Vertical line */}
      <div className="absolute left-[9px] top-1 h-[calc(100%-8px)] w-px bg-border" />
      <div className="flex flex-col gap-5">
        {entries.map((e, i) => (
          <div key={i} className="relative flex gap-3">
            <div className="absolute -left-6 top-0.5 z-10 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-card">
              <e.icon
                className={`h-[18px] w-[18px] ${
                  e.isLeaf ? "text-primary" : "text-status-success"
                }`}
              />
            </div>
            <div>
              <p className="text-sm leading-snug text-heading">{e.text}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{e.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Card>
);

export default AuditLog;
