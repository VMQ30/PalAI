import { Badge } from "@/components/ui/badge";

const Header = () => {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-heading md:text-3xl">
          Contract Tracker: Order #KA-8892
        </h1>
        <p className="mt-1 text-sm text-body md:text-base">
          500kg Roma Tomatoes — Benguet Farmers Cooperative
        </p>
      </div>
      <Badge
        variant="outline"
        className="mt-2 w-fit gap-2 border-primary/30 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary sm:mt-0"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-status-success opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-status-success" />
        </span>
        Active: Vegetative Stage
      </Badge>
    </div>
  );
};

export default Header;
