import { Card } from "@/components/ui/card";
import { TrendingUp, CalendarDays, CloudSun } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const metrics = [
  {
    label: "Expected Yield",
    value: "500 kg",
    sub: "+0% Adjustments",
    icon: TrendingUp,
  },
  {
    label: "Estimated Delivery",
    value: "45 Days",
    sub: "Target: Dec 15, 2025",
    icon: CalendarDays,
  },
];

const MetricCards = () => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {metrics.map((m) => (
      <Card
        key={m.label}
        className="flex items-start gap-4 border border-border bg-card p-5 shadow-none transition-colors duration-150 hover:bg-muted/40"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <m.icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-body">
            {m.label}
          </p>
          <p className="mt-1 text-2xl font-semibold text-heading">{m.value}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{m.sub}</p>
        </div>
      </Card>
    ))}

    {/* Weather Risk card */}
    <Card className="flex items-start gap-4 border border-border bg-card p-5 shadow-none transition-colors duration-150 hover:bg-muted/40">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <CloudSun className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-body">
          Weather Risk
        </p>
        <Badge className="mt-1.5 bg-status-success/15 text-status-success shadow-none hover:bg-status-success/20">
          Low Risk
        </Badge>
        <p className="mt-1 text-xs text-muted-foreground">
          Optimal micro-climate reported.
        </p>
      </div>
    </Card>
  </div>
);

export default MetricCards;
