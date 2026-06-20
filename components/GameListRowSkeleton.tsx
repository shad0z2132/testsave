import { Skeleton } from "@/components/ui/skeleton";

export function GameListRowSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg px-3 py-2">
      <Skeleton className="h-4 w-6 shrink-0" />
      <Skeleton className="h-9 w-9 shrink-0 rounded-md" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="hidden h-8 w-20 shrink-0 rounded-md sm:block" />
      <Skeleton className="hidden h-8 w-20 shrink-0 rounded-md sm:block" />
      <Skeleton className="hidden h-8 w-24 shrink-0 rounded-md md:block" />
      <Skeleton className="hidden h-8 w-24 shrink-0 rounded-md lg:block" />
      <Skeleton className="hidden h-8 w-20 shrink-0 rounded-md lg:block" />
    </div>
  );
}
