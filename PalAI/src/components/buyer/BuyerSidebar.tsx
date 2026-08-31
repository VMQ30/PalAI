"use client";

import { AppSidebar, NavItem, UserProfileInfo } from "@/components/shared/AppSidebar";
import { LayoutDashboard, FileText, TrendingUp, CreditCard } from "lucide-react";

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "demand", label: "Market Demand", icon: TrendingUp },
  { id: "contracts", label: "My Contracts", icon: FileText },
  { id: "payments", label: "Payments", icon: CreditCard },
];

const userProfile: UserProfileInfo = {
  name: "Metro Fresh Foods",
  role: "Institutional Buyer",
};

export function BuyerSidebar() {
  return (
    <AppSidebar
      portalName="Buyer Portal"
      navItems={navItems}
      userProfile={userProfile}
    />
  );
}
