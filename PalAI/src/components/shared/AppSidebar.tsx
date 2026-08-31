"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { Sprout, LogOut, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface UserProfileInfo {
  name: string;
  role: string;
}

export interface AppSidebarProps {
  portalName: string;
  navItems: NavItem[];
  userProfile: UserProfileInfo;
}

export function AppSidebar({
  portalName,
  navItems,
  userProfile,
}: AppSidebarProps) {
  const activeView = useAppStore((s) => s.activeView);
  const setActiveView = useAppStore((s) => s.setActiveView);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("palai_user_role");
    router.push("/");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
      {/* Brand & Portal Name */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-accent">
          <Sprout className="h-5 w-5 text-sidebar-foreground" />
        </div>
        <div>
          <h1 className="font-display text-lg font-bold tracking-tight text-sidebar-foreground">
            PalAI
          </h1>
          <p className="text-xs text-sidebar-foreground/70">{portalName}</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="mt-4 flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="px-3 pb-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors duration-150"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>

      {/* User Info Footer */}
      <div className="border-t border-sidebar-border px-6 py-4">
        <p className="text-xs font-medium text-sidebar-foreground">
          {userProfile.name}
        </p>
        <p className="text-xs text-sidebar-foreground/70">
          {userProfile.role}
        </p>
      </div>
    </aside>
  );
}
