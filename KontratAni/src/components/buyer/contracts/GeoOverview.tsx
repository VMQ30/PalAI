import { Card } from "@/components/ui/card";
import { MapPin, Leaf } from "lucide-react";

const plots = [
  { name: "Plot A", yield: "200kg", status: "Healthy" },
  { name: "Plot B", yield: "300kg", status: "Healthy" },
];

const GeoOverview = () => (
  <Card className="flex flex-col border border-border bg-card shadow-none">
    <div className="relative flex h-52 items-center justify-center rounded-t-lg bg-muted lg:h-64">
      <MapPin className="h-12 w-12 text-muted-foreground/40" />
      <span className="absolute bottom-3 left-3 rounded-md bg-card/80 px-2 py-1 text-xs font-medium text-heading backdrop-blur">
        Cooperative Zone: Region 1 (Anonymized)
      </span>
    </div>
    <div className="divide-y divide-border p-4">
      {plots.map((p) => (
        <div key={p.name} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-heading">{p.name}</span>
            <span className="text-sm text-body">{p.yield}</span>
          </div>
          <span className="rounded-full bg-status-success/15 px-2 py-0.5 text-xs font-medium text-status-success">
            {p.status}
          </span>
        </div>
      ))}
    </div>
  </Card>
);

export default GeoOverview;
