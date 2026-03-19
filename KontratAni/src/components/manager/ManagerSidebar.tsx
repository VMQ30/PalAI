import { LayoutDashboard, Inbox, Users, Sprout } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ManagerSidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isSolo: boolean;
  farmerName: string;
  coop: string;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard',       icon: LayoutDashboard },
  { id: 'inbox',     label: 'Contract Inbox',  icon: Inbox, badge: 2  },
  { id: 'profile',   label: 'Profile & Land',  icon: Users            },
];

export function ManagerSidebar({
  activeView,
  setActiveView,
  isSolo,
  farmerName,
  coop,
}: ManagerSidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-accent">
          <Sprout className="h-5 w-5 text-sidebar-primary" />
        </div>
        <div>
          <h1 className="font-display text-lg font-bold tracking-tight text-sidebar-primary">
            KontratAni
          </h1>
          <p className="text-xs text-sidebar-muted">
            {isSolo ? 'Farmer Portal' : 'Manager Portal'}
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="mt-4 flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150',
                active
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="rounded-full bg-sidebar-primary/20 px-1.5 py-0.5 text-[10px] font-semibold text-sidebar-primary">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-6 py-4">
        <p className="text-xs text-sidebar-muted">{isSolo ? farmerName : coop}</p>
        <p className="text-xs text-sidebar-muted/60">
          {isSolo ? 'Solo Farmer' : 'Cooperative Manager'}
        </p>
      </div>
    </aside>
  );
}