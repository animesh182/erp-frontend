import { Skeleton } from "@/components/ui/skeleton";

export function KpiSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-full rounded-xl" />
    </div>
  );
}

export function RectangleSkeleton() {
  return (
    <div className="flex flex-col ">
      <Skeleton className="h-full w-full rounded-xl" />
    </div>
  );
}
