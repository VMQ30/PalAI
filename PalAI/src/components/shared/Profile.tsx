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
import { useAppStore } from "@/store/useAppStore";
import { MapPin, Leaf, Pencil, RotateCcwIcon } from "lucide-react";
import { toast } from "sonner";

interface ProfileViewProps {
  name: string;
  region: string;
  hectares: string;
  soilType: string;
  setName?: (v: string) => void;
  setRegion?: (v: string) => void;
  setHectares?: (v: string) => void;
  setSoilType?: (v: string) => void;
  soilScore?: number;
  weatherScore?: number;
  userRole: string;
}

export function ProfileView({
  name,
  region,
  hectares,
  soilType,
  setName = () => {},
  setRegion = () => {},
  setHectares = () => {},
  setSoilType = () => {},
  soilScore,
  weatherScore,
  userRole,
}: ProfileViewProps) {
  const [profileEdit, setProfileEdit] = useState(false);

  const handleSaveProfile = () => {
    if (!name || !region || !hectares || !soilType) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Profile saved successfully");
    setProfileEdit(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">
          Farm Profile & Land Registry
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage your farm information and land details.
        </p>
      </div>

      {/* Profile Info */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-4 w-4 text-terracotta" />
              {userRole} Details
            </CardTitle>
            <button
              onClick={() => setProfileEdit(!profileEdit)}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent transition-colors"
            >
              <Pencil className="h-3 w-3" />
              {profileEdit ? "Cancel" : "Edit"}
            </button>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-[11px]">
                Cooperative Name
              </Label>
              {profileEdit ? (
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your Cooperative Group name"
                />
              ) : (
                <div>{name}</div>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-[11px]">
                Region / Location
              </Label>
              {profileEdit ? (
                <Input
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                />
              ) : (
                <div>{region}</div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 mb-4">
                <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-[11px]">
                  Total Hectares
                </Label>
                {profileEdit ? (
                  <Input
                    type="number"
                    value={hectares}
                    onChange={(e) => setHectares(e.target.value)}
                  />
                ) : (
                  <div>{hectares}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-[11px]">
                  Primary Soil Type
                </Label>
                {profileEdit ? (
                  <Input
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                  />
                ) : (
                  <div>{soilType}</div>
                )}
              </div>
            </div>
            {profileEdit && (
              <Button
                onClick={handleSaveProfile}
                className="w-full mt-20 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Save Changes
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Leaf className="h-4 w-4 text-primary" />
              Land Quality Scores
            </CardTitle>
            <CardDescription>
              Based on simulated satellite & weather data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Soil Quality</span>
                <span className="font-semibold text-foreground">
                  {soilScore}/100
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${soilScore}%` }}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Weather Suitability
                </span>
                <span className="font-semibold text-foreground">
                  {weatherScore}/100
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-sand transition-all"
                  style={{ width: `${weatherScore}%` }}
                />
              </div>
            </div>
            <div className="rounded-lg border border-border bg-accent/50 p-4">
              <p className="text-sm font-medium text-foreground">
                Recommendation
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Excellent conditions for tomatoes, onions, and root crops this
                season.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <RotateCcwIcon className="h-4 w-4 text-primary" />
              Crop History
            </CardTitle>
            <CardDescription>
              All of your previously planted crops
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6"></CardContent>
        </Card>
      </div>
    </div>
  );
}
