import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "sonner";
import { ProfileView } from "../shared/Profile";

export function FarmerProfileView() {
  const soloFarmers = useAppStore((s) => s.soloFarmers);
  const currentFarmer = soloFarmers[0];

  const [farmName, setFarmName] = useState(currentFarmer?.name || "");
  const [region, setRegion] = useState(currentFarmer?.region || "");
  const [hectares, setHectares] = useState(
    currentFarmer?.hectares.toString() || "",
  );
  const [soilType, setSoilType] = useState(currentFarmer?.soilType || "");
  const [profileEdit, setProfileEdit] = useState(false);

  return (
    <ProfileView
      name={farmName}
      region={region}
      hectares={hectares}
      soilType={soilType}
      setName={setFarmName}
      setRegion={setRegion}
      setHectares={setHectares}
      setSoilType={setSoilType}
      userRole="Farm"
      soilScore={85}
      weatherScore={76}
    />
  );
}
