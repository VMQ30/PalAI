"use client";

import { AppSidebar, NavItem, UserProfileInfo } from "@/components/shared/AppSidebar";
import { User, Inbox, Sprout, Wallet, BarChart3, Brain } from "lucide-react";

const navItems: NavItem[] = [
  { id: "profile", label: "Profile & Land", icon: User },
  { id: "ai-reports", label: "AI Reports", icon: BarChart3 },
  { id: "inbox", label: "Contract Inbox", icon: Inbox },
  { id: "ai-tracker", label: "AI Contract Tracker", icon: Brain },
  { id: "contract progress", label: "Contract Progress", icon: Sprout },
  { id: "direct payout", label: "Direct Payout", icon: Wallet },
];

const userProfile: UserProfileInfo = {
  name: "Luzviminda Garcia",
  role: "Solo Farmer",
};

export function FarmerSidebar() {
  return (
    <AppSidebar
      portalName="Farmer Portal"
      navItems={navItems}
      userProfile={userProfile}
    />
  );
}
