import { Skeleton } from "@/components/ui/skeleton";

export function GameCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.12] bg-[#0a0a0a] p-2">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="mt-2 space-y-2 p-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}
