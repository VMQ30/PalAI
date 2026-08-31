import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppStore } from "@/store/useAppStore";
import { Users, Plus, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { ProfileView } from "../shared/Profile";

export function CoopProfile() {
  const cooperatives = useAppStore((s) => s.cooperatives);
  const coop = cooperatives[0];
  const [coopName, setCoopName] = useState(coop.name);
  const [region, setRegion] = useState(coop.region);
  const [totalHectares, setTotalHectares] = useState(
    coop.totalHectares.toString(),
  );
  const [soilType, setSoilType] = useState("Loam / Clay Loam");
  const cropHistory = useAppStore((s) => s.cropHistory);

  return (
    <>
      <ProfileView
        name={coopName}
        region={region}
        hectares={totalHectares}
        soilType={soilType}
        setName={setCoopName}
        setRegion={setRegion}
        setHectares={setTotalHectares}
        setSoilType={setSoilType}
        userRole="Cooperative"
        soilScore={coop.soilScore}
        weatherScore={coop.weatherScore}
        cropHistory={cropHistory}
      />
      <FarmRegistry coop={coop} />
    </>
  );
}

function FarmRegistry({ coop }) {
  const [newFarmer, setNewFarmer] = useState({
    name: "",
    phone: "",
    wallet: "",
    hectares: "",
  });
  const [members, setMembers] = useState(
    coop.members.map((m) => ({
      id: m.id,
      name: m.name,
      phone: "09" + Math.floor(Math.random() * 900000000 + 100000000),
      wallet:
        m.payoutMethod === "cash"
          ? "—"
          : "09" + Math.floor(Math.random() * 900000000 + 100000000),
      hectares: m.hectares,
      payoutMethod: m.payoutMethod,
    })),
  );

  const handleAddFarmer = () => {
    if (!newFarmer.name || !newFarmer.phone) return;
    setMembers((prev) => [
      ...prev,
      {
        id: `f-${Date.now()}`,
        name: newFarmer.name,
        phone: newFarmer.phone,
        wallet: newFarmer.wallet || "—",
        hectares: parseFloat(newFarmer.hectares) || 1,
        payoutMethod: "gcash" as const,
      },
    ]);
    setNewFarmer({ name: "", phone: "", wallet: "", hectares: "" });
    toast.success("Farmer added to registry");
  };

  const handleRemoveFarmer = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    toast.info("Farmer removed");
  };
  return (
    <div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-4 w-4 text-forest" />
            Member Farmers
          </CardTitle>
          <CardDescription>{members.length} registered farmers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Wallet (GCash/Maya)</TableHead>
                <TableHead>Hectares</TableHead>
                <TableHead>Payout</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {m.phone}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {m.wallet}
                  </TableCell>
                  <TableCell>{m.hectares} ha</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {m.payoutMethod}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFarmer(m.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Add Farmer */}
          <div className="mt-4 flex items-end gap-3 rounded-lg border border-dashed border-border bg-muted/50 p-4">
            <div className="flex-1 space-y-1">
              <Label className="text-xs">Name</Label>
              <Input
                placeholder="Farmer name"
                value={newFarmer.name}
                onChange={(e) =>
                  setNewFarmer((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>
            <div className="w-36 space-y-1">
              <Label className="text-xs">Phone</Label>
              <Input
                placeholder="09xxxxxxxxx"
                value={newFarmer.phone}
                onChange={(e) =>
                  setNewFarmer((p) => ({ ...p, phone: e.target.value }))
                }
              />
            </div>
            <div className="w-36 space-y-1">
              <Label className="text-xs">Wallet #</Label>
              <Input
                placeholder="GCash/Maya"
                value={newFarmer.wallet}
                onChange={(e) =>
                  setNewFarmer((p) => ({ ...p, wallet: e.target.value }))
                }
              />
            </div>
            <div className="w-20 space-y-1">
              <Label className="text-xs">Hectares</Label>
              <Input
                type="number"
                placeholder="0"
                value={newFarmer.hectares}
                onChange={(e) =>
                  setNewFarmer((p) => ({ ...p, hectares: e.target.value }))
                }
              />
            </div>
            <Button onClick={handleAddFarmer} className="gap-1">
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export { CoopProfile as ProfileView };
