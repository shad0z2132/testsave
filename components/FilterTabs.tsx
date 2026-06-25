import { cn } from "@/lib/utils";

interface FilterTabsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = [
  "All",
  "RPG",
  "Strategy",
  "Action",
  "Arcade",
  "Simulation",
  "Idle",
  "Live",
  "Beta",
  "Upcoming",
];

export function FilterTabs({ activeFilter, onFilterChange }: FilterTabsProps) {
  return (
    <div className="border-b border-border/60 bg-background/50 backdrop-blur-sm lg:hidden">
      <div className="py-3">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={cn(
                "relative shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
                activeFilter === filter
                  ? "bg-primary text-primary-foreground shadow-[0_0_16px_rgba(204, 255, 0, 0.35)]"
                  : "border border-border/60 bg-white/[0.03] text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-white/[0.06]"
              )}
            >
              {filter}
              {activeFilter === filter && (
                <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/20" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
