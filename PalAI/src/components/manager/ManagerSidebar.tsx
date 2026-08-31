"use client";

import { AppSidebar, NavItem, UserProfileInfo } from "@/components/shared/AppSidebar";
import {
  User,
  Inbox,
  Sliders,
  MessageSquare,
  Wallet,
  Sprout,
  BarChart3,
  Brain,
} from "lucide-react";

const navItems: NavItem[] = [
  { id: "profile", label: "Profile & Land", icon: User },
  { id: "ai-reports", label: "AI Reports", icon: BarChart3 },
  { id: "inbox", label: "Contract Inbox", icon: Inbox },
  { id: "ai-tracker", label: "AI Contract Tracker", icon: Brain },
  { id: "allocation", label: "Quota Allocation", icon: Sliders },
  { id: "contract progress", label: "Contract Progress", icon: Sprout },
  { id: "sms-hub", label: "SMS & Monitoring", icon: MessageSquare },
  { id: "payouts", label: "Payouts", icon: Wallet },
];

const userProfile: UserProfileInfo = {
  name: "Quezon Farmers Cooperative",
  role: "Cooperative Manager",
};

export function ManagerSidebar() {
  return (
    <AppSidebar
      portalName="Manager Portal"
      navItems={navItems}
      userProfile={userProfile}
    />
  );
}
